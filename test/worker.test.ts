import { describe, expect, it } from "vitest";

import { fillRecipe, recipes } from "../src/recipes";
import { app, type Bindings } from "../src/worker";

const sessionId = "313c096a-2ab6-4bda-a6bc-21361e522e99";

type RecordedStatement = {
  bindings: unknown[];
  sql: string;
};

function environment(options: { limit?: boolean } = {}) {
  const recorded: RecordedStatement[] = [];
  const db = {
    prepare(sql: string) {
      let bindings: unknown[] = [];
      const statement = {
        bind(...values: unknown[]) {
          bindings = values;
          return statement;
        },
        run: async () => {
          recorded.push({ bindings, sql });
          return { meta: { changes: 1 }, success: true };
        },
      };
      return statement;
    },
  };
  const bindings: Bindings = {
    ASSETS: {
      fetch: () => Promise.resolve(new Response("not used")),
    } as unknown as Fetcher,
    DB: db as unknown as D1Database,
    WRITE_LIMITER: {
      limit: () => Promise.resolve({ success: options.limit !== false }),
    },
  };
  return { bindings, recorded };
}

async function hash(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

describe("worker", () => {
  it("renders the compact three-panel Japanese workbench without experiment copy", async () => {
    const { bindings } = environment();
    const response = await app.request("/", undefined, bindings);
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-security-policy")).toContain("default-src 'self'");
    expect(html).toContain('lang="ja"');
    expect(html).toContain('class="prompt-workbench"');
    expect(html).toContain('id="recipe-list"');
    expect(html).toContain('id="variable-fields"');
    expect(html).toContain('id="prompt-output"');
    expect(html).toContain("型からプロンプトを組み立てる");
    expect(html).not.toContain('class="hero"');
    expect(html).not.toContain("仮説");
    expect(html).not.toContain("成功条件");
  });

  it("returns all original recipes as structured JSON", async () => {
    const { bindings } = environment();
    const response = await app.request("/api/recipes", undefined, bindings);
    const body = await response.json<{ recipes: typeof recipes }>();

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("max-age=3600");
    expect(body.recipes).toHaveLength(18);
    expect(new Set(body.recipes.map((recipe) => recipe.id)).size).toBe(18);
    expect(body.recipes.every((recipe) => recipe.variables.length >= 3)).toBe(true);
  });

  it("fills every variable without leaving template markers", () => {
    for (const recipe of recipes) {
      const values = Object.fromEntries(
        recipe.variables.map((variable) => [variable.id, `値:${variable.id}`]),
      );
      const result = fillRecipe(recipe, values);
      expect(result).not.toMatch(/\{\{[a-z_]+\}\}/);
      expect(result).toContain(`値:${recipe.variables[0]?.id}`);
    }
  });

  it("stores only a hash and event name for valid anonymous telemetry", async () => {
    const { bindings, recorded } = environment();
    const response = await app.request(
      "/api/telemetry",
      {
        body: JSON.stringify({ name: "copied", sessionId }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      },
      bindings,
    );

    expect(response.status).toBe(204);
    expect(recorded).toHaveLength(1);
    expect(recorded[0]?.sql).toContain("INSERT OR IGNORE INTO product_events");
    expect(recorded[0]?.bindings).toEqual([await hash(sessionId), "copied"]);
    expect(recorded[0]?.bindings).not.toContain(sessionId);
  });

  it("rejects extra fields so prompt content cannot enter telemetry", async () => {
    const { bindings, recorded } = environment();
    const response = await app.request(
      "/api/telemetry",
      {
        body: JSON.stringify({ name: "filled", prompt: "private draft", sessionId }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      },
      bindings,
    );

    expect(response.status).toBe(400);
    expect(recorded).toHaveLength(0);
  });

  it("rejects cross-site, unknown, oversized, and rate-limited telemetry", async () => {
    const { bindings, recorded } = environment();
    const crossSite = await app.request(
      "/api/telemetry",
      {
        body: JSON.stringify({ name: "visited", sessionId }),
        headers: { "Content-Type": "application/json", "Sec-Fetch-Site": "cross-site" },
        method: "POST",
      },
      bindings,
    );
    const unknown = await app.request(
      "/api/telemetry",
      {
        body: JSON.stringify({ name: "typed_everything", sessionId }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      },
      bindings,
    );
    const tooLarge = await app.request(
      "/api/telemetry",
      {
        body: JSON.stringify({ name: "visited", padding: "x".repeat(600), sessionId }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      },
      bindings,
    );
    const limitedEnvironment = environment({ limit: false });
    const limited = await app.request(
      "/api/telemetry",
      {
        body: JSON.stringify({ name: "visited", sessionId }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      },
      limitedEnvironment.bindings,
    );

    expect(crossSite.status).toBe(403);
    expect(unknown.status).toBe(400);
    expect(tooLarge.status).toBe(400);
    expect(limited.status).toBe(429);
    expect(recorded).toHaveLength(0);
    expect(limitedEnvironment.recorded).toHaveLength(0);
  });

  it("serves privacy boundaries, a no-store health endpoint, and HTML not-found", async () => {
    const { bindings } = environment();
    const privacy = await app.request("/privacy", undefined, bindings);
    const privacyHtml = await privacy.text();
    const health = await app.request("/healthz", undefined, bindings);
    const missing = await app.request("/missing", undefined, bindings);

    expect(privacy.status).toBe(200);
    expect(privacyHtml).toContain("入力した内容は、この端末の中で扱います");
    expect(health.status).toBe(200);
    expect(health.headers.get("cache-control")).toBe("no-store");
    expect((await health.json<{ healthy: boolean }>()).healthy).toBe(true);
    expect(missing.status).toBe(404);
    expect(await missing.text()).toContain("ページが見つかりません");
  });
});
