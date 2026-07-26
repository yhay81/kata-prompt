# Experiment

## User and job

- Target user: 日本語で生成AIを使うが、プロンプトを毎回ゼロから考えることに負担を感じる人
- Job to be done: 用途に必要な前提を漏らさず、編集可能な完成プロンプトを短時間で作る
- Current workaround: 過去のチャットを探す、汎用テンプレートをコピーする、公開プロンプト集から近い例を探す

## Hypothesis

公開プロンプトを読むだけでなく、用途別の型へ材料を入れる作業台があれば、利用者は本文を外部へ預けずに、実際にAIへ渡せる完成文まで到達する。

## Method

- Recruitment channel: Tool Shelf、GitHub、検索流入
- Duration: 公開から30日
- Comparison: 訪問、型選択、入力、コピー、端末保存、別日再訪の匿名集計
- Scope: 日本語の18種類。AI API、アカウント、UGC公開機能は追加しない

## Decision

- Success signal: 30日以内に20人以上が訪問し、8人以上がコピー、3人以上が端末保存、2人以上が別日に再訪
- Improve signal: 型選択はあるがコピー率が20%未満なら、型の内容または入力負荷を見直す
- Failure signal: 運営者以外とみなせるコピーが30日で3件未満
- Deadline: 2026-08-25
- Maximum monthly infrastructure cost: Cloudflare無料枠内

## Guardrails

- 入力文、完成文、検索語をサーバーへ送信しない。
- 公開プロンプトの転載ではなく、用途から設計した独自の型だけを収録する。
- 利用数のために匿名性、35日削除、CSP、rate limitを弱めない。
- 判断条件をサービス画面へ表示しない。
