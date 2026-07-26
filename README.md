# Kata Prompt

日本語の仕事に合わせた型を選び、必要な材料を埋めて、使えるプロンプトへ組み立てるローカルファーストの作業台です。

## できること

- 18種類の用途別プロンプトを、検索または分類から選択
- 目的や前提をフォームへ入れると完成文へ即時反映
- 完成文を編集、コピー、Markdown書き出し
- 20件まで端末内へ保存し、JSONで持ち出し
- お気に入り、入力、完成文をブラウザのlocalStorageへ保存

入力と完成文はAPIへ送信しません。サーバーへ届くのは、本文を含まない匿名の操作イベントだけです。

## 開発

Node.js 24 LTSとnpmを使用します。

```powershell
npm ci
npm run check
npm test
npm run build
```

ローカルD1を初期化して起動します。

```powershell
npx wrangler d1 migrations apply kata-prompt --local
npm run dev
```

## 運用

```powershell
npm run metrics
npm run deploy
npm run indexnow
```

技術構成は[STACK.md](./STACK.md)、検証判断は[EXPERIMENT.md](./EXPERIMENT.md)、データ境界は[PRIVACY.md](./PRIVACY.md)を参照してください。
