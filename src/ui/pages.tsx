import { product } from "../config/product";
import { fillRecipe, firstRecipe, recipeCategories, recipes } from "../recipes";
import { Layout } from "./layout";

function VariableFields() {
  return (
    <div class="variable-fields" id="variable-fields">
      {firstRecipe.variables.map((variable) => (
        <label class="field">
          <span>{variable.label}</span>
          {variable.rows ? (
            <textarea
              data-variable={variable.id}
              placeholder={variable.placeholder}
              rows={variable.rows}
            >
              {variable.defaultValue}
            </textarea>
          ) : (
            <input
              data-variable={variable.id}
              placeholder={variable.placeholder}
              value={variable.defaultValue}
            />
          )}
        </label>
      ))}
    </div>
  );
}

export function HomePage() {
  const defaultOutput = fillRecipe(firstRecipe, {});
  return (
    <Layout>
      <section class="workbench-intro">
        <span class="app-icon" aria-hidden="true">
          <i></i>
          <i></i>
          <i></i>
        </span>
        <div>
          <h1>型からプロンプトを組み立てる</h1>
          <p>用途を選び、必要な情報を埋めると、右側に完成文ができます。</p>
        </div>
        <span class="local-badge">入力は端末内だけ</span>
      </section>

      <div class="prompt-workbench">
        <aside class="recipe-panel" aria-label="プロンプトの型">
          <header class="panel-header">
            <div>
              <span>LIBRARY</span>
              <h2>型を選ぶ</h2>
            </div>
            <output id="recipe-count">{recipes.length}件</output>
          </header>
          <label class="search-field">
            <span aria-hidden="true">⌕</span>
            <span class="visually-hidden">型を検索</span>
            <input
              autocomplete="off"
              id="recipe-search"
              placeholder="用途や言葉で検索"
              type="search"
            />
          </label>
          <div class="category-row" aria-label="分類で絞り込む">
            <button aria-pressed="true" data-category="all" type="button">
              すべて
            </button>
            {recipeCategories.map((category) => (
              <button aria-pressed="false" data-category={category.id} type="button">
                {category.label}
              </button>
            ))}
          </div>
          <div class="recipe-list" id="recipe-list">
            {recipes.map((recipe, index) => (
              <button
                aria-pressed={index === 0 ? "true" : "false"}
                class="recipe-card"
                data-category={recipe.category}
                data-recipe={recipe.id}
                data-search={`${recipe.title} ${recipe.description} ${recipe.tags.join(" ")}`}
                type="button"
              >
                <span class={`recipe-kind kind-${recipe.category}`}></span>
                <span>
                  <strong>{recipe.title}</strong>
                  <small>{recipe.description}</small>
                  <span class="tag-row">
                    {recipe.tags.slice(0, 2).map((tag) => (
                      <i>{tag}</i>
                    ))}
                  </span>
                </span>
                <span aria-hidden="true">›</span>
              </button>
            ))}
          </div>
          <p class="empty-recipes" hidden id="empty-recipes">
            該当する型はありません。
          </p>
        </aside>

        <section class="editor-panel" aria-labelledby="editor-title">
          <header class="panel-header editor-heading">
            <div>
              <span id="recipe-category-label">書く</span>
              <h2 id="editor-title">{firstRecipe.title}</h2>
            </div>
            <button
              aria-label="お気に入りに追加"
              aria-pressed="false"
              id="favorite-recipe"
              type="button"
            >
              ☆
            </button>
          </header>
          <p class="recipe-description" id="recipe-description">
            {firstRecipe.description}
          </p>
          <form id="prompt-form">
            <VariableFields />
          </form>
          <section class="quality-checks" aria-labelledby="quality-title">
            <header>
              <span id="quality-title">この型に含まれるもの</span>
              <span>自動反映</span>
            </header>
            <div id="quality-checks">
              {firstRecipe.checks.map((check) => (
                <span>
                  <i aria-hidden="true">✓</i>
                  {check}
                </span>
              ))}
            </div>
          </section>
          <div class="editor-actions">
            <button class="secondary-button" id="reset-fields" type="button">
              入力を戻す
            </button>
            <span>
              <kbd>Ctrl</kbd> + <kbd>Enter</kbd> でコピー
            </span>
          </div>
        </section>

        <section class="output-panel" aria-labelledby="output-title">
          <header class="panel-header output-heading">
            <div>
              <span>READY TO USE</span>
              <h2 id="output-title">完成文</h2>
            </div>
            <output id="character-count">{defaultOutput.length}文字</output>
          </header>
          <textarea aria-label="完成したプロンプト" id="prompt-output" spellcheck={false}>
            {defaultOutput}
          </textarea>
          <div class="output-actions">
            <button class="copy-button" id="copy-prompt" type="button">
              <span aria-hidden="true">▣</span>
              コピー
            </button>
            <button class="output-button" id="save-prompt" type="button">
              保存
            </button>
            <button class="output-button" id="download-prompt" type="button">
              .md
            </button>
          </div>
          <section class="saved-panel" aria-labelledby="saved-title">
            <header>
              <div>
                <span>SAVED</span>
                <h3 id="saved-title">端末に保存した完成文</h3>
              </div>
              <button id="export-library" type="button">
                JSONを書き出す
              </button>
            </header>
            <div class="saved-list" id="saved-list">
              <div class="empty-saved" id="empty-saved">
                <span aria-hidden="true">◇</span>
                <p>完成文を保存すると、ここからもう一度使えます。</p>
              </div>
            </div>
          </section>
          <p class="output-note">
            完成文は編集できます。AIへ送信する前に、事実・機密情報・利用条件を確認してください。
          </p>
        </section>
      </div>
    </Layout>
  );
}

export function PrivacyPage() {
  return (
    <Layout page="privacy" title={`プライバシー | ${product.name}`}>
      <article class="prose">
        <p class="prose-kicker">PRIVACY</p>
        <h1>入力した内容は、この端末の中で扱います</h1>
        <h2>サーバーへ送らないもの</h2>
        <p>
          型へ入力した内容、完成したプロンプト、編集内容、保存した完成文、お気に入りはサーバーへ送信しません。ブラウザのlocalStorageへ保存し、サイトデータを消すと削除できます。
        </p>
        <h2>匿名で集計するもの</h2>
        <p>
          閲覧、型の選択、入力、コピー、端末保存、JSON書き出し、別日の再訪を、匿名識別子を一方向変換して日単位で記録します。入力文、完成文、検索語、IPアドレスはD1へ保存しません。
        </p>
        <h2>保持期間</h2>
        <p>
          匿名集計は35日後に自動削除します。外部解析SDK、広告Cookie、AI
          APIは使用しません。完成文を貼り付けた先では、そのAIサービスの利用条件とプライバシー方針が適用されます。
        </p>
      </article>
    </Layout>
  );
}

export function NotFoundPage() {
  return (
    <Layout page="not-found" title={`見つかりません | ${product.name}`}>
      <section class="not-found">
        <span aria-hidden="true">◇</span>
        <h1>ページが見つかりません</h1>
        <p>型の一覧へ戻って、用途から選び直せます。</p>
        <a href="/">作業台へ戻る</a>
      </section>
    </Layout>
  );
}
