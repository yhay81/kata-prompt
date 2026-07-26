(() => {
  "use strict";

  const storageKey = "kata-prompt:v1";
  const today = new Date().toISOString().slice(0, 10);
  const workbench = document.querySelector(".prompt-workbench");

  function makeId() {
    if (typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (digit) =>
      (
        Number(digit) ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(digit) / 4)))
      ).toString(16),
    );
  }

  function readState() {
    const initial = {
      activeRecipe: "",
      favorites: [],
      firstSeen: today,
      lastSeen: "",
      outputs: {},
      saved: [],
      sessionId: makeId(),
      values: {},
    };
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (!stored || typeof stored !== "object") {
        return initial;
      }
      return {
        ...initial,
        ...stored,
        favorites: Array.isArray(stored.favorites) ? stored.favorites : [],
        outputs: stored.outputs && typeof stored.outputs === "object" ? stored.outputs : {},
        saved: Array.isArray(stored.saved) ? stored.saved.slice(0, 20) : [],
        values: stored.values && typeof stored.values === "object" ? stored.values : {},
      };
    } catch {
      return initial;
    }
  }

  let state = readState();

  function writeState() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // The tool remains usable when storage is blocked or full.
    }
  }

  function track(name) {
    if (!state.sessionId) {
      return;
    }
    fetch("/api/telemetry", {
      body: JSON.stringify({ name, sessionId: state.sessionId }),
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      method: "POST",
    }).catch(() => undefined);
  }

  if (state.lastSeen && state.lastSeen !== today) {
    track("returned");
  }
  state.lastSeen = today;
  writeState();
  track("visited");

  if (!workbench) {
    return;
  }

  const categoryLabels = {
    build: "作る",
    learn: "学ぶ",
    research: "調べる",
    think: "考える",
    write: "書く",
  };
  const elements = {
    categoryLabel: document.querySelector("#recipe-category-label"),
    categoryButtons: [...document.querySelectorAll("[data-category]")],
    characterCount: document.querySelector("#character-count"),
    checks: document.querySelector("#quality-checks"),
    copy: document.querySelector("#copy-prompt"),
    description: document.querySelector("#recipe-description"),
    download: document.querySelector("#download-prompt"),
    editorTitle: document.querySelector("#editor-title"),
    emptyRecipes: document.querySelector("#empty-recipes"),
    emptySaved: document.querySelector("#empty-saved"),
    exportLibrary: document.querySelector("#export-library"),
    favorite: document.querySelector("#favorite-recipe"),
    fields: document.querySelector("#variable-fields"),
    form: document.querySelector("#prompt-form"),
    output: document.querySelector("#prompt-output"),
    recipeCards: [...document.querySelectorAll("[data-recipe]")],
    recipeCount: document.querySelector("#recipe-count"),
    reset: document.querySelector("#reset-fields"),
    save: document.querySelector("#save-prompt"),
    savedList: document.querySelector("#saved-list"),
    search: document.querySelector("#recipe-search"),
  };

  let recipes = [];
  let recipeMap = new Map();
  let activeRecipe = null;
  let activeCategory = "all";
  let filledTracked = false;

  function replaceVariables(template, values) {
    return template.replace(/\{\{([a-z_]+)\}\}/g, (_match, id) => values[id] ?? "");
  }

  function currentValues(recipe) {
    const savedValues = state.values[recipe.id];
    return Object.fromEntries(
      recipe.variables.map((variable) => [
        variable.id,
        typeof savedValues?.[variable.id] === "string"
          ? savedValues[variable.id]
          : variable.defaultValue,
      ]),
    );
  }

  function updateCharacterCount() {
    elements.characterCount.textContent = `${elements.output.value.length}文字`;
  }

  function updateFavoriteButton() {
    const active = activeRecipe && state.favorites.includes(activeRecipe.id);
    elements.favorite.textContent = active ? "★" : "☆";
    elements.favorite.setAttribute("aria-pressed", active ? "true" : "false");
    elements.favorite.setAttribute(
      "aria-label",
      active ? "お気に入りから外す" : "お気に入りに追加",
    );
  }

  function createField(variable, value) {
    const label = document.createElement("label");
    label.className = "field";

    const title = document.createElement("span");
    title.textContent = variable.label;
    label.append(title);

    const control = variable.rows
      ? document.createElement("textarea")
      : document.createElement("input");
    control.dataset.variable = variable.id;
    control.placeholder = variable.placeholder;
    control.value = value;
    if (variable.rows) {
      control.rows = variable.rows;
    }
    control.addEventListener("input", () => {
      const values = currentValues(activeRecipe);
      for (const input of elements.fields.querySelectorAll("[data-variable]")) {
        values[input.dataset.variable] = input.value;
      }
      state.values[activeRecipe.id] = values;
      const output = replaceVariables(activeRecipe.template, values);
      state.outputs[activeRecipe.id] = output;
      elements.output.value = output;
      updateCharacterCount();
      writeState();
      if (!filledTracked) {
        filledTracked = true;
        track("filled");
      }
    });
    label.append(control);
    return label;
  }

  function renderChecks(recipe) {
    const nodes = recipe.checks.map((check) => {
      const item = document.createElement("span");
      const icon = document.createElement("i");
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = "✓";
      item.append(icon, document.createTextNode(check));
      return item;
    });
    elements.checks.replaceChildren(...nodes);
  }

  function selectRecipe(id, options = {}) {
    const recipe = recipeMap.get(id) || recipes[0];
    if (!recipe) {
      return;
    }
    activeRecipe = recipe;
    filledTracked = false;
    state.activeRecipe = recipe.id;
    const values = currentValues(recipe);
    state.values[recipe.id] = values;

    elements.categoryLabel.textContent = categoryLabels[recipe.category] || recipe.category;
    elements.editorTitle.textContent = recipe.title;
    elements.description.textContent = recipe.description;
    elements.fields.replaceChildren(
      ...recipe.variables.map((variable) => createField(variable, values[variable.id] ?? "")),
    );
    renderChecks(recipe);

    const generated = replaceVariables(recipe.template, values);
    elements.output.value =
      typeof state.outputs[recipe.id] === "string" ? state.outputs[recipe.id] : generated;
    state.outputs[recipe.id] = elements.output.value;
    updateCharacterCount();
    updateFavoriteButton();

    for (const card of elements.recipeCards) {
      card.setAttribute("aria-pressed", card.dataset.recipe === recipe.id ? "true" : "false");
    }

    const url = new URL(location.href);
    url.searchParams.set("recipe", recipe.id);
    history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    writeState();
    if (!options.silent) {
      track("selected");
    }
  }

  function filterRecipes() {
    const query = elements.search.value.trim().toLocaleLowerCase("ja");
    let visible = 0;
    for (const card of elements.recipeCards) {
      const categoryMatches = activeCategory === "all" || card.dataset.category === activeCategory;
      const textMatches =
        !query || (card.dataset.search || "").toLocaleLowerCase("ja").includes(query);
      const show = categoryMatches && textMatches;
      card.hidden = !show;
      if (show) {
        visible += 1;
      }
    }
    elements.recipeCount.textContent = `${visible}件`;
    elements.emptyRecipes.hidden = visible !== 0;
  }

  function flash(button, message) {
    const original = button.textContent;
    button.textContent = message;
    button.disabled = true;
    window.setTimeout(() => {
      button.textContent = original;
      button.disabled = false;
    }, 1200);
  }

  async function copyOutput() {
    const text = elements.output.value;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      elements.output.focus();
      elements.output.select();
      document.execCommand("copy");
      elements.output.setSelectionRange(0, 0);
    }
    flash(elements.copy, "コピーしました");
    track("copied");
  }

  function download(filename, content, type) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  function renderSaved() {
    const nodes = state.saved.map((snapshot) => {
      const item = document.createElement("article");
      item.className = "saved-item";

      const copy = document.createElement("button");
      copy.className = "saved-restore";
      copy.type = "button";
      const title = document.createElement("strong");
      title.textContent = snapshot.title;
      const preview = document.createElement("span");
      preview.textContent = snapshot.output.replace(/\s+/g, " ").slice(0, 76);
      const time = document.createElement("small");
      time.textContent = new Intl.DateTimeFormat("ja-JP", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(snapshot.createdAt));
      copy.append(title, preview, time);
      copy.addEventListener("click", () => {
        selectRecipe(snapshot.recipeId, { silent: true });
        elements.output.value = snapshot.output;
        state.outputs[snapshot.recipeId] = snapshot.output;
        updateCharacterCount();
        writeState();
        elements.output.focus();
      });

      const remove = document.createElement("button");
      remove.className = "saved-delete";
      remove.type = "button";
      remove.setAttribute("aria-label", `${snapshot.title}を削除`);
      remove.textContent = "×";
      remove.addEventListener("click", () => {
        state.saved = state.saved.filter((candidate) => candidate.id !== snapshot.id);
        writeState();
        renderSaved();
      });
      item.append(copy, remove);
      return item;
    });
    elements.savedList.replaceChildren(...nodes);
    if (state.saved.length === 0) {
      elements.savedList.append(elements.emptySaved);
      elements.emptySaved.hidden = false;
    }
  }

  elements.form.addEventListener("submit", (event) => event.preventDefault());
  elements.search.addEventListener("input", filterRecipes);
  for (const button of elements.categoryButtons) {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      for (const candidate of elements.categoryButtons) {
        candidate.setAttribute("aria-pressed", candidate === button ? "true" : "false");
      }
      filterRecipes();
    });
  }
  for (const card of elements.recipeCards) {
    card.addEventListener("click", () => selectRecipe(card.dataset.recipe));
  }

  elements.output.addEventListener("input", () => {
    if (!activeRecipe) {
      return;
    }
    state.outputs[activeRecipe.id] = elements.output.value;
    updateCharacterCount();
    writeState();
  });
  elements.favorite.addEventListener("click", () => {
    if (!activeRecipe) {
      return;
    }
    state.favorites = state.favorites.includes(activeRecipe.id)
      ? state.favorites.filter((id) => id !== activeRecipe.id)
      : [...state.favorites, activeRecipe.id];
    updateFavoriteButton();
    writeState();
  });
  elements.reset.addEventListener("click", () => {
    if (!activeRecipe) {
      return;
    }
    delete state.values[activeRecipe.id];
    delete state.outputs[activeRecipe.id];
    writeState();
    selectRecipe(activeRecipe.id, { silent: true });
  });
  elements.copy.addEventListener("click", copyOutput);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      void copyOutput();
    }
  });
  elements.save.addEventListener("click", () => {
    if (!activeRecipe || !elements.output.value.trim()) {
      return;
    }
    state.saved = [
      {
        createdAt: new Date().toISOString(),
        id: makeId(),
        output: elements.output.value,
        recipeId: activeRecipe.id,
        title: activeRecipe.title,
      },
      ...state.saved,
    ].slice(0, 20);
    writeState();
    renderSaved();
    flash(elements.save, "保存しました");
    track("saved");
  });
  elements.download.addEventListener("click", () => {
    if (!activeRecipe) {
      return;
    }
    download(
      `kata-prompt-${activeRecipe.id}.md`,
      `# ${activeRecipe.title}\n\n${elements.output.value}\n`,
      "text/markdown;charset=utf-8",
    );
    track("exported");
  });
  elements.exportLibrary.addEventListener("click", () => {
    download(
      `kata-prompt-library-${today}.json`,
      JSON.stringify(
        { exportedAt: new Date().toISOString(), saved: state.saved, version: 1 },
        null,
        2,
      ),
      "application/json;charset=utf-8",
    );
    track("exported");
  });

  fetch("/api/recipes?v=20260726")
    .then((response) => {
      if (!response.ok) {
        throw new Error("recipe_fetch_failed");
      }
      return response.json();
    })
    .then((data) => {
      recipes = Array.isArray(data.recipes) ? data.recipes : [];
      recipeMap = new Map(recipes.map((recipe) => [recipe.id, recipe]));
      const requested = new URL(location.href).searchParams.get("recipe");
      const initial =
        (requested && recipeMap.has(requested) && requested) ||
        (state.activeRecipe && recipeMap.has(state.activeRecipe) && state.activeRecipe) ||
        recipes[0]?.id;
      selectRecipe(initial, { silent: true });
      renderSaved();
      filterRecipes();
    })
    .catch(() => {
      elements.recipeCount.textContent = "再読込してください";
    });
})();
