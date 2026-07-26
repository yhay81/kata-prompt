# Decisions

## 2026-07-26 — ローカルファーストの作業台として公開

- Status: active pilot
- Evidence: 公開プロンプト集には日本語の閲覧需要がある一方、近いプロンプトを探して自分の前提へ書き換える工程が残る。大規模なプロンプト管理拡張も既に存在する。
- Decision: UGC一覧やAI呼び出しを作らず、独自の日本語18型を入力フォームと完成文の三面UIで提供する。
- Privacy boundary: 本文はlocalStorageだけ。サーバーは匿名イベント名と日付だけ。
- Authentication: 所有者データや複数端末同期がないためBetter Authは使わない。
- Next review: 2026-08-25
