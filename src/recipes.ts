export const recipeCategories = [
  { id: "write", label: "書く" },
  { id: "think", label: "考える" },
  { id: "research", label: "調べる" },
  { id: "learn", label: "学ぶ" },
  { id: "build", label: "作る" },
] as const;

export type RecipeCategory = (typeof recipeCategories)[number]["id"];

export type RecipeVariable = {
  defaultValue: string;
  id: string;
  label: string;
  placeholder: string;
  rows?: number;
};

export type Recipe = {
  category: RecipeCategory;
  checks: string[];
  description: string;
  id: string;
  tags: string[];
  template: string;
  title: string;
  variables: RecipeVariable[];
};

export const recipes: Recipe[] = [
  {
    category: "write",
    checks: ["読み手", "目的", "次の行動"],
    description: "要点と依頼を崩さず、相手が判断しやすい短いメールへ整えます。",
    id: "clear-email",
    tags: ["メール", "仕事", "推敲"],
    title: "伝わるメール",
    variables: [
      {
        defaultValue: "取引先の担当者",
        id: "audience",
        label: "相手",
        placeholder: "例: 初めて連絡する取引先",
      },
      {
        defaultValue: "日程変更をお願いし、代替候補から選んでもらう",
        id: "goal",
        label: "目的",
        placeholder: "相手に理解・判断・実行してほしいこと",
      },
      {
        defaultValue: "当初は8月5日。8月7日午後または8月8日午前へ変更したい。",
        id: "facts",
        label: "入れる事実",
        placeholder: "確定事項、候補、期限など",
        rows: 3,
      },
      {
        defaultValue: "丁寧、簡潔、過度にへりくだらない",
        id: "tone",
        label: "文体",
        placeholder: "例: 親しみのある敬語",
      },
    ],
    template: `あなたは日本語のビジネス編集者です。

次の情報だけを使い、{{audience}}が短時間で内容を理解して判断できるメールを書いてください。

目的:
{{goal}}

確定している事実:
{{facts}}

文体:
{{tone}}

要件:
- 件名を1案つける
- 冒頭で連絡理由を明示する
- 事実と依頼を分ける
- 相手に求める次の行動と期限を具体的にする
- 不明な情報を補わない
- 本文は350字以内を目安にする

出力:
件名:
本文:`,
  },
  {
    category: "write",
    checks: ["主張", "根拠", "反論"],
    description: "材料を主張・根拠・留保へ分け、読み手が検討できる提案文にします。",
    id: "proposal-brief",
    tags: ["提案", "企画", "仕事"],
    title: "1ページ提案",
    variables: [
      {
        defaultValue: "チームの週次会議を45分から25分へ短縮する",
        id: "proposal",
        label: "提案",
        placeholder: "採用してほしい変更",
      },
      {
        defaultValue: "参加者8名。報告が中心で議論時間が不足。事前共有資料は既にある。",
        id: "evidence",
        label: "根拠",
        placeholder: "観察、数値、制約",
        rows: 3,
      },
      {
        defaultValue: "情報共有が減る、準備負担が増える",
        id: "objections",
        label: "想定反論",
        placeholder: "懸念や反対意見",
      },
      {
        defaultValue: "2週間だけ試し、終了後に継続判断する",
        id: "ask",
        label: "求める判断",
        placeholder: "承認、試行、予算など",
      },
    ],
    template: `{{proposal}}について、意思決定者向けの1ページ提案を書いてください。

根拠:
{{evidence}}

想定される反論:
{{objections}}

今回求める判断:
{{ask}}

構成:
1. 結論 — 何を変えたいかを2文以内
2. 現状 — 観察できている事実
3. 提案 — 実施方法と範囲
4. 効果 — 誰に何が改善するか
5. 懸念 — 反論を強い形で示し、対処を書く
6. 判断 — 次の行動、担当、期限

事実と推測を明確に分け、与えられていない数字は作らないでください。`,
  },
  {
    category: "write",
    checks: ["日時", "対象", "行動"],
    description: "イベントや募集の情報を、見落としにくい告知文へ並べ直します。",
    id: "event-notice",
    tags: ["告知", "SNS", "イベント"],
    title: "イベント告知",
    variables: [
      {
        defaultValue: "8月9日 13:00から、ひかり市民ホール",
        id: "when_where",
        label: "日時・場所",
        placeholder: "開催日時と場所",
      },
      {
        defaultValue: "創作物を持ち寄る小さな交流会。途中参加・退出可。",
        id: "content",
        label: "内容",
        placeholder: "何をするイベントか",
        rows: 3,
      },
      {
        defaultValue: "創作に興味がある人。初参加歓迎。",
        id: "audience",
        label: "対象",
        placeholder: "来てほしい人",
      },
      {
        defaultValue: "参加URLから8月7日までに回答",
        id: "action",
        label: "申込方法",
        placeholder: "URL、締切、費用など",
      },
    ],
    template: `次のイベント情報から、日本語の告知文を3種類作ってください。

日時・場所:
{{when_where}}

内容:
{{content}}

対象:
{{audience}}

申込方法:
{{action}}

出力する種類:
A. Xなど短文SNS向け: 140字前後、最初の1文で内容が分かる
B. Discord/Slack向け: 見出しと箇条書きで判断しやすい
C. 詳細ページ冒頭向け: 350字以内、初参加者の不安を減らす

共通要件:
- 日時、場所、対象、費用、締切を勝手に補わない
- 大げさな表現や過度な絵文字を避ける
- 最後に次の行動を明示する`,
  },
  {
    category: "write",
    checks: ["論点", "順序", "読後価値"],
    description: "書きたい材料から、重複のない記事構成と各節の役割を作ります。",
    id: "article-outline",
    tags: ["記事", "構成", "ブログ"],
    title: "記事の骨組み",
    variables: [
      {
        defaultValue: "個人開発で最初の利用者を見つける方法",
        id: "topic",
        label: "テーマ",
        placeholder: "記事で扱うテーマ",
      },
      {
        defaultValue: "公開したがアクセスがなく、何から始めるべきか迷っている人",
        id: "reader",
        label: "読者",
        placeholder: "知識、状況、困りごと",
      },
      {
        defaultValue: "配布先を先に決める、実利用を測る、反応ゼロを品質不足と混同しない",
        id: "materials",
        label: "入れたい材料",
        placeholder: "事例、主張、データ",
        rows: 4,
      },
      {
        defaultValue: "読者が今日1つ配布行動を決められる",
        id: "outcome",
        label: "読後の変化",
        placeholder: "理解や行動",
      },
    ],
    template: `{{topic}}についての記事構成を作ってください。

想定読者:
{{reader}}

入れたい材料:
{{materials}}

読後に起きてほしい変化:
{{outcome}}

要件:
- 読者の疑問が自然に解ける順序にする
- 見出し同士の重複をなくす
- 各見出しに「この節で答える問い」と「使う材料」を1行ずつ添える
- 導入で煽らず、対象読者と得られるものを示す
- 結論は要約だけでなく、次の小さな行動で終える
- 根拠が不足する主張には「要確認」と印をつける

H2を4〜6個、必要な場合だけH3を使ってください。`,
  },
  {
    category: "think",
    checks: ["選択肢", "評価軸", "感度"],
    description: "候補を同じ評価軸で比べ、結論が変わる条件まで明示します。",
    id: "decision-matrix",
    tags: ["比較", "判断", "意思決定"],
    title: "選択肢を比べる",
    variables: [
      {
        defaultValue: "Cloudflare Workers / Vercel / 自前VPS",
        id: "options",
        label: "選択肢",
        placeholder: "比較する候補を / で区切る",
      },
      {
        defaultValue: "小さな日本語Webツールを1人で運用する。月間1万利用未満。",
        id: "context",
        label: "状況",
        placeholder: "用途、規模、前提",
        rows: 3,
      },
      {
        defaultValue: "運用負荷 35%、初期費用 20%、性能 15%、移植性 15%、観測性 15%",
        id: "criteria",
        label: "評価軸",
        placeholder: "重みを含めてもよい",
        rows: 3,
      },
      {
        defaultValue: "月額10 USD以内。平日1時間以内で復旧できること。",
        id: "constraints",
        label: "制約",
        placeholder: "予算、期限、必須条件",
      },
    ],
    template: `次の意思決定を、結論ありきにせず比較してください。

選択肢:
{{options}}

状況:
{{context}}

評価軸:
{{criteria}}

制約:
{{constraints}}

手順:
1. 制約を満たさず除外すべき候補があれば先に示す
2. 各候補を同じ評価軸で5段階評価する
3. 評価ごとの根拠と、情報不足を分ける
4. 重み付きの暫定順位を出す
5. どの前提が変わると順位が逆転するか示す
6. 判断前に最小コストで確認すべき事実を3つ出す

表の後に、推奨候補、選ばない理由、撤回条件を簡潔にまとめてください。`,
  },
  {
    category: "think",
    checks: ["失敗経路", "兆候", "対策"],
    description: "計画が失敗した未来から逆算し、早期兆候と小さい対策を出します。",
    id: "premortem",
    tags: ["リスク", "計画", "レビュー"],
    title: "失敗を先に探す",
    variables: [
      {
        defaultValue: "新しいWebサービスを3週間で公開し、30人に使ってもらう",
        id: "plan",
        label: "計画",
        placeholder: "実施することと目標",
        rows: 3,
      },
      {
        defaultValue: "開発者1人、予算5,000円、既存のSNSフォロワーは少ない",
        id: "context",
        label: "前提",
        placeholder: "人、費用、期限、依存先",
        rows: 3,
      },
      {
        defaultValue: "個人情報を増やさない。外部アカウント投稿は承認後。",
        id: "guardrails",
        label: "守る条件",
        placeholder: "安全・品質・法務の境界",
      },
    ],
    template: `次の計画が3か月後に失敗したと仮定し、プレモーテムを行ってください。

計画:
{{plan}}

前提:
{{context}}

守る条件:
{{guardrails}}

最低8つの失敗経路を、需要、配布、体験、技術、運用、安全、費用、意思決定の観点から挙げてください。

各失敗経路について:
- 起きた失敗
- 原因
- 2週間以内に見える早期兆候
- 今できる低コストの予防
- 起きた後の復旧策

最後に、発生確率×影響で上位3つを選び、今週実行する対策へ変換してください。一般論ではなく、この計画の前提に結び付けてください。`,
  },
  {
    category: "think",
    checks: ["反対意見", "反証", "撤回条件"],
    description: "自分の案に都合の悪い証拠を集め、弱点を修正可能な形にします。",
    id: "red-team",
    tags: ["反証", "レビュー", "品質"],
    title: "案を反証する",
    variables: [
      {
        defaultValue: "登録不要ならイベント参加受付サービスは使われる",
        id: "claim",
        label: "検証したい主張",
        placeholder: "仮説や方針",
      },
      {
        defaultValue: "既存サービスはSNSログインが必要。利用者は小規模イベント主催者。",
        id: "evidence",
        label: "現在の根拠",
        placeholder: "観察やデータ",
        rows: 3,
      },
      {
        defaultValue: "3週間で第三者回答のあるイベントが3件",
        id: "success",
        label: "成功条件",
        placeholder: "測定可能な条件",
      },
    ],
    template: `次の主張を、最も強い反対側の立場から検討してください。

主張:
{{claim}}

現在の根拠:
{{evidence}}

成功条件:
{{success}}

出力:
1. 主張に含まれる検証可能な前提
2. 最も強い反対意見を5つ
3. 現在の根拠で説明できない点
4. 主張が正しくても成功しないケース
5. 反証にならない見かけ上の失敗
6. 1週間でできる反証テスト
7. 継続、修正、撤回を分ける判断表

単なる否定ではなく、主張を改善できる具体的な観察やテストへ落としてください。`,
  },
  {
    category: "research",
    checks: ["問い", "一次資料", "欠測"],
    description: "調査の問いを分解し、使う資料と終了条件を先に決めます。",
    id: "research-plan",
    tags: ["調査", "情報収集", "計画"],
    title: "調査を設計する",
    variables: [
      {
        defaultValue: "地域の読書会がオンライン申込で困っていることは何か",
        id: "question",
        label: "調べたい問い",
        placeholder: "判断につながる問い",
      },
      {
        defaultValue: "現在も使われているか、具体的な不満、代替行動、支払意思",
        id: "dimensions",
        label: "必要な観点",
        placeholder: "需要、比較、安全など",
        rows: 3,
      },
      {
        defaultValue: "現行サービス公式、直近1年の利用者発言、料金・利用規約",
        id: "sources",
        label: "優先資料",
        placeholder: "一次資料を優先",
        rows: 3,
      },
      {
        defaultValue: "需要・痛み・切替を各2件以上確認、または有力な反証を得た時点",
        id: "stop",
        label: "終了条件",
        placeholder: "十分と判断する条件",
      },
    ],
    template: `次の問いに答えるための調査計画を作ってください。

問い:
{{question}}

必要な観点:
{{dimensions}}

優先する資料:
{{sources}}

終了条件:
{{stop}}

要件:
- 問いを5〜8個の検証可能な小問へ分解する
- 各小問に最適な一次資料と、代替資料を割り当てる
- 事実、利用者の発言、推測を混同しない記録形式にする
- 情報の鮮度が必要な項目を明示する
- 検索量ではなく判断に効く証拠を優先する
- 見つからない場合に「証拠なし」と結論する条件を決める

最後に、調査結果を入れる表の列と、判断者が確認すべき3つの反証を示してください。`,
  },
  {
    category: "research",
    checks: ["一致点", "矛盾", "信頼度"],
    description: "複数資料の主張を同じ粒度で並べ、矛盾と不足を見つけます。",
    id: "source-compare",
    tags: ["資料", "比較", "要約"],
    title: "資料を突き合わせる",
    variables: [
      {
        defaultValue:
          "資料A: 公式は登録不要と説明。資料B: 利用者は一部操作でログインを求められたと報告。",
        id: "materials",
        label: "資料の内容",
        placeholder: "資料名と要点を並べる",
        rows: 6,
      },
      {
        defaultValue: "実際に登録なしで中核作業を完了できるか",
        id: "question",
        label: "判断したいこと",
        placeholder: "比較の目的",
      },
      {
        defaultValue: "一次資料と直近情報を優先。断定できない場合は不明とする。",
        id: "rules",
        label: "評価ルール",
        placeholder: "鮮度や信頼度の扱い",
      },
    ],
    template: `次の資料を、{{question}}という問いに沿って突き合わせてください。

資料:
{{materials}}

評価ルール:
{{rules}}

表にする項目:
- 主張
- 支持する資料
- 反する資料
- 資料の種類（一次/二次/利用者発言）
- 情報の日付
- 信頼度（高/中/低）
- 未確認点

その後に、一致している事実、重要な矛盾、判断に影響する欠測を分けて書いてください。資料にない因果関係を補わず、引用が必要な主張には出典を対応させてください。`,
  },
  {
    category: "research",
    checks: ["事実", "解釈", "出典"],
    description: "長いメモから、判断に必要な事実と不確実性だけを残します。",
    id: "evidence-brief",
    tags: ["要約", "証拠", "判断"],
    title: "証拠を1枚にする",
    variables: [
      {
        defaultValue: "ここに調査メモ、会議メモ、資料の要点を貼り付けます。",
        id: "notes",
        label: "元のメモ",
        placeholder: "長いメモを貼り付け",
        rows: 7,
      },
      {
        defaultValue: "この案件を次の検証へ進めるか",
        id: "decision",
        label: "判断",
        placeholder: "誰が何を決めるか",
      },
      {
        defaultValue: "需要、問題の深さ、代替、実行難度、反証",
        id: "lens",
        label: "見る観点",
        placeholder: "判断軸",
      },
    ],
    template: `次のメモから、{{decision}}ための証拠ブリーフを作ってください。

見る観点:
{{lens}}

元のメモ:
{{notes}}

出力:
1. 結論 — 現時点で言えることを3文以内
2. 確認できた事実 — 出典またはメモ位置つき
3. 解釈 — 事実からの推論であると明示
4. 反する証拠
5. 不明点
6. 次に確認する1つの行動

重複を削り、形容詞より観察可能な情報を残してください。元メモにない数字、日付、引用は作らないでください。`,
  },
  {
    category: "learn",
    checks: ["前提知識", "例", "理解確認"],
    description: "難しい概念を、既知のものから例と確認問題つきで説明します。",
    id: "explain-step",
    tags: ["解説", "学習", "初学者"],
    title: "段階的に理解する",
    variables: [
      {
        defaultValue: "公開鍵暗号",
        id: "topic",
        label: "学ぶこと",
        placeholder: "概念や仕組み",
      },
      {
        defaultValue: "Web開発の基礎は分かるが、暗号は初めて",
        id: "level",
        label: "現在の理解",
        placeholder: "知っていること、苦手なこと",
      },
      {
        defaultValue: "HTTPSで何が守られるか説明できる",
        id: "goal",
        label: "到達点",
        placeholder: "学習後にできること",
      },
    ],
    template: `{{topic}}を、{{level}}の学習者へ説明してください。

到達点:
{{goal}}

順序:
1. まず必要性を日常的な例で示す
2. 前提になる用語を3つ以内で定義する
3. 仕組みを小さな段階に分ける
4. 正確さを損なわない比喩を1つ使う
5. 比喩が当てはまらない範囲も示す
6. 具体例を1つ追う
7. よくある誤解を2つ訂正する
8. 理解確認の質問を3問出す

専門用語は初出で説明し、分からない事実を推測で補わないでください。`,
  },
  {
    category: "learn",
    checks: ["難易度", "解答", "誤答理由"],
    description: "目標と理解度に合う練習問題を、段階と解説つきで作ります。",
    id: "practice-set",
    tags: ["練習", "問題", "学習"],
    title: "練習問題を作る",
    variables: [
      {
        defaultValue: "TypeScriptの型ガード",
        id: "topic",
        label: "テーマ",
        placeholder: "練習したい内容",
      },
      {
        defaultValue: "基本的な型注釈とunion型は使える",
        id: "level",
        label: "現在の理解",
        placeholder: "既にできること",
      },
      {
        defaultValue: "実コードで安全な絞り込みを書ける",
        id: "goal",
        label: "目標",
        placeholder: "身につけたい能力",
      },
      {
        defaultValue: "15分で5問",
        id: "volume",
        label: "量",
        placeholder: "時間、問題数",
      },
    ],
    template: `{{topic}}について、{{level}}の学習者向け練習セットを作ってください。

目標:
{{goal}}

量:
{{volume}}

要件:
- 思い出す問題、適用する問題、誤りを直す問題を含める
- 徐々に難しくする
- 各問に「この問題で確かめること」を付ける
- 解答と、正解になる理由を書く
- ありがちな誤答と、その考え方のどこが違うかを書く
- 最後に理解不足なら戻る学習項目を示す

問題文だけで解けるようにし、未提示の環境や教材を前提にしないでください。`,
  },
  {
    category: "learn",
    checks: ["良い点", "改善点", "次の試行"],
    description: "成果物への感想を、優先順位のある改善行動へ変換します。",
    id: "feedback-coach",
    tags: ["フィードバック", "改善", "レビュー"],
    title: "改善点をもらう",
    variables: [
      {
        defaultValue: "文章、デザイン、コードなどの成果物をここに貼ります。",
        id: "work",
        label: "見てほしいもの",
        placeholder: "成果物または要約",
        rows: 7,
      },
      {
        defaultValue: "初見の読者が迷わず要点を理解できる",
        id: "goal",
        label: "目標",
        placeholder: "良い状態の定義",
      },
      {
        defaultValue: "構成、具体性、読みやすさ",
        id: "criteria",
        label: "評価軸",
        placeholder: "品質基準",
      },
    ],
    template: `次の成果物を、{{goal}}という目標に照らしてレビューしてください。

評価軸:
{{criteria}}

成果物:
{{work}}

出力:
1. 目標に効いている良い点を具体的に3つ
2. 最も影響が大きい改善点を優先順に3つ
3. 各改善点について、問題箇所、なぜ問題か、修正例
4. 今は直さなくてよい点
5. 30分でできる次の試行

好みだけで評価せず、成果物の具体的な箇所と目標を結び付けてください。全体を書き直す前に、最小の有効な修正を優先してください。`,
  },
  {
    category: "build",
    checks: ["利用者", "完了条件", "対象外"],
    description: "曖昧なアイデアを、利用者が完了できる小さい要件へ変えます。",
    id: "product-requirements",
    tags: ["要件", "プロダクト", "仕様"],
    title: "小さい要件定義",
    variables: [
      {
        defaultValue: "イベントの参加受付を1つのURLで作れるサービス",
        id: "idea",
        label: "アイデア",
        placeholder: "作りたいもの",
      },
      {
        defaultValue: "小規模イベント主催者と参加者",
        id: "users",
        label: "利用者",
        placeholder: "誰が使うか",
      },
      {
        defaultValue: "主催者が参加ページを共有し、参加者が回答し、当日名簿を印刷できる",
        id: "outcome",
        label: "完了状態",
        placeholder: "利用者のjobが終わる状態",
      },
      {
        defaultValue: "決済、本人確認、画像投稿、大規模イベント",
        id: "out",
        label: "対象外",
        placeholder: "今回は作らないもの",
      },
    ],
    template: `次のアイデアを、最小でも利用者の作業が完了する要件へ整理してください。

アイデア:
{{idea}}

利用者:
{{users}}

完了状態:
{{outcome}}

対象外:
{{out}}

出力:
- 問題と現状の代替
- 利用者ごとのjob
- 主要フロー
- 必須機能（各項目に受け入れ条件）
- 失敗時の挙動
- 保存するデータと削除経路
- 安全・プライバシー境界
- 対象外
- 成功を測る業務状態
- 公開前に確認するテスト

機能の数を増やさず、完了状態に不要なものは対象外へ移してください。`,
  },
  {
    category: "build",
    checks: ["状態", "操作", "エラー"],
    description: "機能説明を、画面で見える短いラベルと案内へ落とします。",
    id: "ui-copy",
    tags: ["UI", "文章", "デザイン"],
    title: "UI文言を整える",
    variables: [
      {
        defaultValue: "イベント参加受付の作成画面",
        id: "screen",
        label: "画面",
        placeholder: "どの画面か",
      },
      {
        defaultValue: "イベント名、日付、場所を入力し、共有URLを発行する",
        id: "task",
        label: "操作",
        placeholder: "利用者がすること",
      },
      {
        defaultValue: "作成成功、入力不足、通信失敗、削除確認",
        id: "states",
        label: "必要な状態",
        placeholder: "通常・空・失敗など",
        rows: 3,
      },
      {
        defaultValue: "簡潔、落ち着いた日本語。メタな検証説明は載せない。",
        id: "voice",
        label: "文体",
        placeholder: "ブランドの声",
      },
    ],
    template: `{{screen}}のUI文言を作ってください。

利用者の操作:
{{task}}

必要な状態:
{{states}}

文体:
{{voice}}

表にする項目:
- 場所または状態
- 見出し
- ラベル
- 補助文
- ボタン
- エラー文

要件:
- ボタンは操作結果が分かる動詞にする
- 補助文は利用者の判断に必要な情報だけにする
- エラーは起きたことと次の行動を書く
- 内部実装、検証条件、成功指標を画面に出さない
- 「簡単」「革新的」など根拠のない形容を避ける
- 1つの状態に複数案を出さず、推奨案を1つ示す`,
  },
  {
    category: "build",
    checks: ["正常", "境界", "失敗"],
    description: "仕様から、正常系・境界値・権限・復旧を含むテストを作ります。",
    id: "test-cases",
    tags: ["テスト", "品質", "開発"],
    title: "テスト観点を出す",
    variables: [
      {
        defaultValue: "イベント作成、回答、定員、受付終了、削除",
        id: "features",
        label: "対象機能",
        placeholder: "テストする機能",
        rows: 3,
      },
      {
        defaultValue: "定員1〜500、表示名40文字、イベントは開催35日後に削除",
        id: "rules",
        label: "ルール",
        placeholder: "制約、権限、期限",
        rows: 3,
      },
      {
        defaultValue: "Cloudflare Workers、Hono、D1、ブラウザJavaScript",
        id: "environment",
        label: "環境",
        placeholder: "技術や対応端末",
      },
    ],
    template: `次の機能のテスト設計を作ってください。

対象機能:
{{features}}

ルール:
{{rules}}

環境:
{{environment}}

分類:
1. 中核フロー
2. 入力境界
3. 権限と秘密情報
4. 同時操作と競合
5. 期限と削除
6. 通信失敗と再試行
7. モバイル・キーボード・印刷
8. 観測と個人情報

各テストに、前提、操作、期待結果、優先度を付けてください。実装詳細ではなく利用者に見える契約を中心にし、最も壊れると困る5件を先に示してください。`,
  },
  {
    category: "build",
    checks: ["不具合", "安全", "修正案"],
    description: "コードの問題を重要度順に絞り、再現条件と小さい修正へつなげます。",
    id: "code-review",
    tags: ["コード", "レビュー", "不具合"],
    title: "コードをレビュー",
    variables: [
      {
        defaultValue: "レビュー対象のコードまたは差分をここに貼ります。",
        id: "code",
        label: "コード",
        placeholder: "差分と関連する前提",
        rows: 8,
      },
      {
        defaultValue: "Cloudflare Workers上の公開Web API。匿名利用者の入力を受ける。",
        id: "context",
        label: "実行条件",
        placeholder: "環境、利用者、重要な制約",
        rows: 3,
      },
      {
        defaultValue: "正しさ、セキュリティ、データ損失、回帰",
        id: "focus",
        label: "重視する点",
        placeholder: "性能、保守性など",
      },
    ],
    template: `次のコードを、{{focus}}を中心にレビューしてください。

実行条件:
{{context}}

コード:
{{code}}

ルール:
- 実際に動作や安全性へ影響する指摘を優先する
- 各指摘に、問題箇所、発生条件、影響、最小修正を付ける
- 根拠のないスタイル指摘や将来の仮定だけの指摘は除く
- 秘密情報や個人データが出力・ログ・キャッシュへ漏れないか確認する
- 指摘がなければ、ないと明言し残るテスト不足だけを書く

重要度を高・中・低に分け、まず重大な指摘を最大5件示してください。`,
  },
  {
    category: "build",
    checks: ["被写体", "構図", "禁止事項"],
    description: "曖昧な画像アイデアを、構図・素材・光・除外条件へ分解します。",
    id: "visual-brief",
    tags: ["画像", "クリエイティブ", "生成AI"],
    title: "画像の指示書",
    variables: [
      {
        defaultValue: "陶器の展示会を知らせる正方形の画像",
        id: "subject",
        label: "作るもの",
        placeholder: "画像の目的と被写体",
      },
      {
        defaultValue: "白い展示台の器を中央に置き、奥に小さな器の輪郭と会場の余白を見せる",
        id: "composition",
        label: "構図",
        placeholder: "配置と主役",
        rows: 3,
      },
      {
        defaultValue: "温かい白、コーラル、青緑、細い罫線、柔らかな影",
        id: "style",
        label: "見た目",
        placeholder: "色、質感、光、画風",
      },
      {
        defaultValue: "人物、透かし、読めない飾り文字、過度な光沢、器の変形",
        id: "avoid",
        label: "避けるもの",
        placeholder: "禁止事項",
        rows: 3,
      },
    ],
    template: `次の画像を生成するための、具体的で矛盾のない指示文を書いてください。

作るもの:
{{subject}}

構図:
{{composition}}

見た目:
{{style}}

避けるもの:
{{avoid}}

指示文に含める項目:
- 用途とアスペクト比
- 主役と視線の順序
- 前景・中景・背景
- 形、素材、色、光、余白
- 読める文字が必要なら正確な文字列と大きさ
- 品質条件
- 除外条件

画像そのものが用途を伝えるようにし、大きな見出しや説明文へ依存しないでください。最後に、生成後に確認する5項目を添えてください。`,
  },
];

export const firstRecipe = recipes[0]!;

export function fillRecipe(recipe: Recipe, values: Record<string, string>) {
  return recipe.template.replaceAll(/\{\{([a-z_]+)\}\}/g, (_match, id: string) => {
    const fallback = recipe.variables.find((variable) => variable.id === id)?.defaultValue ?? "";
    return values[id]?.trim() || fallback;
  });
}
