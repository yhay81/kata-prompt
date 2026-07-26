# Privacy

## 端末内だけで扱うデータ

型へ入力した内容、完成文、編集内容、お気に入り、端末保存した完成文はブラウザのlocalStorageへ保存します。これらをKata PromptのAPIへ送信しません。ブラウザのサイトデータを消すと削除できます。

## サーバーで扱うデータ

閲覧、型選択、入力、コピー、端末保存、書き出し、別日再訪のイベント名を、匿名UUIDのSHA-256ハッシュと日付に結び付けてD1へ保存します。型ID、検索語、本文、IPアドレスはD1へ保存しません。イベントは35日後に日次処理で削除します。

Cloudflareは配信と濫用防止のためにリクエストを処理します。外部解析SDK、広告Cookie、AI API、認証サービスは使用しません。

## 管理

- Operator: `yhay81`
- Security reports: GitHubのPrivate vulnerability reporting
- Source: https://github.com/yhay81/kata-prompt
