# テンプレート改善イシュー

> このファイルは、テンプレートを使ったPG1企画・設計セッションで実際に発生した問題をもとに、テンプレート自体の改善点をまとめたものです。

**作成日**: 2026-03-19
**更新日**: 2026-03-21
**コンテキスト**: PG1（メンタル拡張Ouraダッシュボード）の企画→設計フェーズを一通り実施し、整合性レビューで12件の不具合が発見された。そのうちテンプレートの構造的な問題に起因するものを抽出。2026-03-21の4観点レビュー（エンジニア・デザイナー・API・メンタルヘルス）でCritical 9件を追加発見し、Issue 7を追加。

---

## Issue 1: 上流ドキュメント更新時の下流伝播チェックリストの追加

**深刻度:** Critical
**影響ファイル:** `.claude/rules/workflow.md`

### 何が問題か

このテンプレートでは `docs/reqs/`（企画）→ `docs/specs/`（設計）→ 実装 という情報の流れを定義しています。`workflow.md` は「reqs → specs の順で更新する」と定めていますが、**上流ドキュメントを更新したとき、下流のどこを修正すべきか**を特定するチェックリストがありません。

つまり、「PRDを変更したら、他にどのファイルを確認・修正すべきか？」に対する答えがワークフローに書かれていません。

### 実際に起きたこと

PRD（`prd.md`）のリサーチで、メンタルスコアの4軸が「ストレス・モチベーション・集中・不安」から「気分・エネルギー・ストレス・集中」に変更されました。PRDは正しく更新されましたが、**`pg1.md`（PGスコープ定義）は旧軸のまま取り残されました**。PRDを変更した時点で「pg1.mdも確認する」というルールがなかったため、整合性レビューを明示的に実行するまで誰も気づきませんでした。

### 改善案

`workflow.md` に**更新影響マップ**を追加する。

```markdown
## 更新影響マップ

| 更新したドキュメント | 確認が必要なドキュメント |
|---|---|
| pg{N}.md | prd.md（スコープ）, conceptual-model.md |
| mrd.md | prd.md（市場前提）|
| prd.md | pg{N}.md（スコープ記述との整合）, conceptual-model.md, user-stories.md |
| conceptual-model.md / product-model.json | db-schema.md, api-spec.md, ui-spec.md |
| user-stories.md | test-spec.md |
```

---

## Issue 2: Specs導出時のフィールドレベル照合チェックの追加

**深刻度:** Critical
**影響ファイル:** `.claude/rules/workflow.md`

### 何が問題か

PRDの機能概要テーブルに列挙されたデータ項目が、DB Schema → API Spec → Test Spec に**漏れなく反映されたか確認するステップ**がワークフローにありません。Specs導出はPRDを読んで行いますが、「PRDの項目をすべてカバーしたか」の照合は行われません。

### 実際に起きたこと

PRDの機能概要テーブルに「Oura APIからSleep Score・Readiness Score・Activity Score・HRV（RMSSD）・安静時心拍数・**睡眠ステージ比率**を日次取得」と記載されていました。しかし、DB Schema導出時にエージェントが `physical_scores` テーブルに **`sleep_stages` カラムを作成し忘れました**。結果として、API SpecとTest Specにも連鎖的に欠落しました。

PRDのテーブルに明記されていたにもかかわらず漏れた理由は、「PRD機能概要の全項目がDB/APIに反映されているか」を突合するステップがなかったためです。

**2026-03-21追記**: 同様のパターンが `auth-spec.md` と `db-schema.md` の間でも再発した。auth-specは「メール+パスワード認証」を前提としていたが、db-schema.mdのusersテーブルには `email` / `password_hash` カラムがなかった。Spec間の照合チェック（Issue 2の改善案）が実装されていれば防げた問題。

### 改善案

`workflow.md` の Track A（Specs導出）完了後に、照合チェックステップを追加する。

```markdown
## Specs導出後の照合チェック

Specs導出完了後、以下の突合を実施する:

1. PRD機能概要テーブルの全データ項目 → db-schema.mdのカラムに存在するか
2. db-schema.mdの全カラム → api-spec.mdのレスポンスフィールドに存在するか
3. api-spec.mdの全エンドポイント → test-spec.mdのテスト項目に存在するか
```

---

## Issue 3: PRD設計原則から操作的定義への導出ステップの追加

**深刻度:** Critical
**影響ファイル:** `.claude/rules/workflow.md`, `docs/reqs/prd.md`（テンプレート構造）

### 何が問題か

PRDの「設計原則」セクションは抽象的な方針として書かれます（例: 「Strain/Recoveryは独立2軸で表示する」）。しかし、この方針をSpecsに落とす際に**「具体的にどのメトリクスで・どう計算するか」を定義するステップ**がワークフローにありません。

抽象的な方針だけが書かれていると、Specs導出エージェントはそれを実装可能なレベルに分解できず、API Specにフィールドが作られないまま進んでしまいます。

### 実際に起きたこと

PRDの設計原則に「Strain（負荷）とRecovery（回復）は独立2軸で表示する」（RESTQ由来）と記載されていました。しかし、**「Strainはstress + activity_scoreで構成」「Recoveryはmood + energy + sleep_score + readiness_score + hrv_rmssdで構成」**という操作的定義がPRDにも概念モデルにもなかったため、API Specに `strain_recovery` フィールドが作られませんでした。

設計原則が「概念」として存在するだけで、「計算式」として定義されなかったのが根本原因です。

**2026-03-21追記**: 操作的定義を追加した後も、API Specへの反映で再度問題が発生した。(1) Strain/Recovery合成値がAPIレスポンスで日次時系列データとして返されず単一集約値だったため、グラフ描画が不可能だった。(2) StrainにActivity Scoreを含めていたが、メンタルヘルス観点から「活動的な良い日=高負荷」と誤判定するリスクが指摘された。(3) 相関パターン（Pearson r≥0.5）を14日データで算出していたが、検出力50-60%では擬似相関リスクが高く、30日以上に引き上げが必要だった。操作的定義をPRDに書くだけでなく、**ドメイン専門家レビュー**を経てからSpecsに落とすステップが必要。

### 改善案

1. PRDの設計原則テンプレートに、UI/API実装に影響する原則には「操作的定義」欄を必須化する。

```markdown
| 原則 | 内容 | 根拠 | 操作的定義 |
|---|---|---|---|
| Strain/Recovery分離 | 負荷と回復は独立2軸 | RESTQ | Strain = stress + activity_score のZ-score平均。Recovery = mood + energy + sleep_score + readiness_score + hrv_rmssd のZ-score平均 |
```

2. PRD用語集にも「操作的定義」（計算式・構成要素）を必須化する。

---

## Issue 4: 並列トラック間の依存関係の明示

**深刻度:** High
**影響ファイル:** `.claude/rules/workflow.md`

### 何が問題か

`workflow.md` の Step 3 で「Track A（Specs）と Track B（User Stories → Test Spec）を**並列で進める**」と定めています。

しかし実際には、Track B の **Test Spec** は Track A の **API Spec** に強く依存しています（テスト項目がAPIエンドポイント名・レスポンス構造を参照するため）。ワークフローがこの依存関係を記載していないため、Test SpecがAPI Spec完成前に導出され、古い情報で書かれてしまうリスクがあります。

### 実際に起きたこと

Track A と Track B が並列で実行された結果:

1. Test Spec の API-09 テスト項目が「`GET daily_records`（期間指定）」と記述されましたが、実際のAPI Specでは **`GET /api/v1/trends`** という別名のエンドポイントが定義されていました。エンドポイント名が食い違いました。

2. Test Spec の認証セクションが「auth-spec.md 具体化後に更新する」という注記のまま残りました。auth-specがテンプレート状態のまま放置されていたことに、Test Spec側が依存していました。

### 改善案

`workflow.md` の Step 3 を修正し、並列化できる部分とできない部分を明確にする。

```markdown
## Step 3: 並列トラック

### Track A: Specs導出（順次）
DB Schema → API Spec → Auth Spec → UI Spec → Analytics Spec

### Track B: User Stories（Track Aと並列可）
User Stories の記述はTrack Aと並列で進められる。

### Track C: Test Spec（Track A 完了後）
Test SpecはAPI Spec・Auth Specを参照するため、Track AのAuth Spec完了後に導出する。
```

---

## Issue 5: API仕様とUser Storiesのエッジケース振る舞い照合の追加

**深刻度:** High
**影響ファイル:** `.claude/rules/workflow.md`

### 何が問題か

API SpecとUser Storiesは、テンプレートのワークフローでは別々のタイミングで・別々のインプットから導出されます。そのため、**同じ状況に対する振る舞いの定義が食い違う**ことがあります。

特に「データが存在しないとき」のような**エッジケースの振る舞い**は、USとAPIで異なる表現で書かれるため、矛盾が見えにくくなります。

### 実際に起きたこと

US-08（ダッシュボードから日次サマリーにドリルダウン）のエッジケースには、「データが存在しない日をタップした場合 → **空の日次サマリーを表示**する」と定義されていました。

一方、API Spec の `GET /api/v1/daily-records/{record_date}` は、daily_record が存在しない場合に **404を返す** と定義されていました。

フロントエンドが「空の日次サマリー」を表示するためにはAPIが200（中身null）を返す必要があり、404では空表示が実現できません。USとAPIの振る舞いが矛盾していました。

### 改善案

API Spec導出後のチェックとして以下を追加する。

```markdown
## API ↔ US 振る舞い照合

API Spec導出後、以下を確認する:

1. USの各エッジケースについて、対応するAPIエンドポイントのエラーケースを確認
2. USが「〜を表示する」と書いている場合、APIがそのデータを返せるか確認
3. 特に「データなし」「未入力」「未接続」等の空状態の振る舞いが一致しているか確認
```

---

## Issue 6: レビューステップのワークフローへの組み込み

**深刻度:** High
**影響ファイル:** `.claude/rules/workflow.md`

### 何が問題か

このテンプレートには8つの**レビュー用Agent Teams**が定義されています（review-mrd, review-prd, review-model, review-specs等）。しかし、`workflow.md` のどのステップでレビューを実行すべきかが**まったく記載されていません**。レビューの実行は完全に人間の判断に委ねられています。

レビューチームの定義は充実していますが、ワークフローに組み込まれていないため、「レビューを実行し忘れる」リスクがあります。

### 実際に起きたこと

PG1の企画→設計フェーズ（MRD → PRD → 概念モデル → Screens → DB Schema → API Spec → User Stories → Test Spec）を一通り完了した後、**ユーザーから「振り返ってレビューして」と明示的に指示されて初めて**整合性レビューを実施しました。

その結果、**Critical 5件・Warning 4件・Note 3件の計12件の不具合**が発見されました。もしレビュー指示がなければ、これらの問題を抱えたまま実装フェーズに進んでいた可能性があります。

発見された問題の例:
- pg1.mdの旧軸名（Issue 1に記載）
- sleep_stagesカラムの欠落（Issue 2に記載）
- Strain/Recoveryの操作的定義欠落（Issue 3に記載）
- API 404 vs US空表示の矛盾（Issue 5に記載）

### 改善案

`workflow.md` の各フェーズ完了後に、対応するレビューチームの実行を**マイルストーン**として組み込む。

```markdown
## ワークフロー（レビューゲート付き）

1. MRD完了 → **review-mrd** 実行 → Pass後にPRDへ
2. PRD完了 → **review-prd** 実行 → Pass後にConceptual Modelへ
3. Conceptual Model完了 → **review-model** 実行 → Pass後にScreensへ
4. Screens完了 → Track A（Specs）+ Track B（US）へ
5. Specs + Test Spec完了 → **review-specs** 実行 → Pass後にImpl Planへ
6. 実装完了 → **review-code** 実行 → Pass後にマージ

※ レビューPassはCritical 0件が条件。Warning以下は次フェーズと並行で修正可。
```

---

## Issue 7: UI Specテンプレートに外部ライブラリ依存の明記セクションがない

**深刻度:** Critical
**影響ファイル:** `docs/specs/ui-spec.md`（テンプレート構造）

### 何が問題か

UI Specテンプレートはデザインシステム（Material Web）を参照していますが、**デザインシステムが提供しないUI要素（グラフ、マップ、リッチエディタ等）に必要な外部ライブラリの選定セクション**がありません。

画面設計でグラフを要求していても、「何のライブラリでどう実装するか」が未定義のまま進んでしまいます。

### 実際に起きたこと

UI Specのトレンドダッシュボードで折れ線グラフ（Strain/Recoveryの2軸）とカラーゾーン帯を定義していましたが、Material Webにはグラフコンポーネントが存在しません。グラフライブラリの選定（Chart.js等）が未記載のまま設計が完了し、実装者が独断で選定する状態になっていました。

また、14日未満のZ-score未算出期間に「生値の折れ線グラフに切り替える」と定義していましたが、フィジカル（0-100スケール）とメンタル（1-7スケール）を同一Y軸に描画するとスケールが破綻する問題も、グラフの技術仕様を検討するセクションがなかったために見落とされました。

### 改善案

UI Specテンプレートに「外部ライブラリ依存」セクションを追加する。

```markdown
## 外部ライブラリ依存

デザインシステムが提供しないUI要素に使用する外部ライブラリを定義する。

| 用途 | ライブラリ | 選定理由 | バンドルサイズ |
|------|----------|---------|-------------|
| (例) グラフ | Chart.js | タップイベント対応、軽量 | ~65KB gzip |
```

ui-spec導出時に、product-model.jsonのscreensを走査し、デザインシステムにない要素（グラフ、地図、動画プレイヤー等）がある場合にライブラリ選定を必須とするチェックを追加する。

---

## 補足: Issue間の関係

```
Issue 6 (レビューをワークフローに組み込む)
  └── 根本対策: レビューが自動実行されれば Issue 1〜7 の問題も早期発見できる

Issue 1 (伝播漏れ) ←→ Issue 2 (フィールド照合)
  └── どちらも「上流→下流の整合性チェック」が不足している問題
  └── 2026-03-21: auth-spec ↔ db-schema 矛盾もこのパターン

Issue 3 (操作的定義) ← Issue 5 (API↔US矛盾)
  └── 抽象的な定義が具体化されないと、異なるドキュメントで異なる解釈が生まれる
  └── 2026-03-21: strain_recoveryの時系列化漏れ、Strain構成の妥当性、相関閾値もこのパターン
  └── 対策追加: ドメイン専門家レビューを操作的定義の確定前に実施する

Issue 4 (並列トラック依存)
  └── 独立した構造問題。ワークフローの並列化ルール自体の修正が必要

Issue 7 (外部ライブラリ依存)
  └── デザインシステムのカバー外要素に対するライブラリ選定がUI Specに欠落
  └── screens定義時にデザインシステム外の要素を検出するチェックが必要
```
