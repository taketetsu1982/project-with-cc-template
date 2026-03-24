# 開発ワークフロー（Spec駆動開発）

## 原則
- **実装前に必ず reqs → specs の順で更新する。reqs 変更不要なら specs → 実装でOK。実装だけ先に進めるのは厳禁**
- チャットでの指示で仕様が変わるような大きな変更の場合も同様に reqs → specs → 実装の順で進める
- 非自明なタスクは計画を立ててからはじめる
- 迷ったら実装を止めて確認する

## レビューゲート

各フェーズの品質を担保するためのレビュー制度。

### 通過条件

| 判定 | 条件 | 対応 |
|---|---|---|
| **Pass** | Critical が0件 | 次フェーズに進む |
| **条件付き Pass** | Critical が0件、Warning 以下のみ | 次フェーズと並行して修正可。ただし次のゲート通過までに全Warningを解消すること |
| **Fail** | Critical が1件以上 | 修正完了後に再レビュー |

### ゲートの種類

| ゲート | タイミング | レビューチーム | 必須/推奨 |
|---|---|---|---|
| 企画レビュー | MRD完了後 | `review-mrd` | 推奨 |
| 企画レビュー | PRD完了後 | `review-prd` | 推奨 |
| モデルレビュー | Conceptual Model完了後 | `review-model` | 推奨 |
| **Specsレビュー** | **Track A + B 完了後** | **`review-specs`** | **必須** |
| **コードレビュー** | **ストーリー実装完了後** | **`review-code`** | **必須** |

### ドメイン専門家の定義

MRD/PRDが固まった時点で、プロダクトのドメイン領域に応じた専門家の観点を定義し、以降のレビューに組み込む。

- **トリガー**: MRD/PRDの初回完了後（Step 1に進む前）
- **アクション**:
  1. MRD/PRDからプロダクトのドメイン領域を特定する（例: ヘルスケア、金融、教育）
  2. そのドメインで重要なレビュー観点を定義する（例: 医療倫理、法規制、計算の妥当性）
  3. `review-prd`・`review-specs` のレビューアーにドメイン観点を追加する
- **スキップ条件**: 汎用的なプロダクト（特定ドメイン知識が不要）の場合はスキップ可

## ドキュメント遷移ルール

流れ図（CLAUDE.md）に沿って、各ステップ完了後に次のステップへ進む。

### 1. PG / PRD / MRD → Conceptual Model
- **トリガー**: PRD・MRDが固まり、概念モデルの作成・更新に入るとき
- **アクション**: `/conceptual-model` を実行
- **完了条件**: `product-model.json` に entities + actors が揃っている

### 1.1. PRD / MRD 変更後の同期
- **トリガー**: `prd.md` または `mrd.md` が変更されたとき
- **アクション**: 以下の影響マップに従い、下流ドキュメントを確認・更新する

| 更新したドキュメント | 確認が必要なドキュメント |
|---|---|
| `prd.md` | `pg{N}.md`, `conceptual-model.md`, `user-stories.md` |
| `mrd.md` | `prd.md`（Buyer/User定義の整合） |

- **スキップ条件**: 下流ドキュメントがテンプレート状態（未記述）の場合はスキップ

### 1.5. Conceptual Model 変更後の同期
- **トリガー**: `/conceptual-model` でエディタ編集後、または `product-model.json` の entities/actors が直接変更されたとき
- **アクション**:
  1. `conceptual-model.md` を `product-model.json` と照合し、差分があれば更新する
  2. 以下のSpecsが記述済みの場合、影響を確認してユーザーに報告する

| 変更内容 | 影響するSpec |
|---|---|
| entity 追加・削除・名前変更 | `db-schema.md`, `api-spec.md` |
| actor 追加・削除・名前変更 | `auth-spec.md` |
| entity/actor 変更 | `ui-spec.md` |

- **スキップ条件**: Specsがテンプレート状態（未記述）の場合、Specs影響チェックはスキップ

### 2. Conceptual Model → Screens
- **トリガー**: `product-model.json` に entities・actors が定義され、画面設計に入るとき
- **アクション**: `/screens` を実行
- **完了条件**: `product-model.json` の screens + transitions が定義されている

### 2.5. Screens 変更後の同期
- **トリガー**: `/screens` でエディタ編集後、または `product-model.json` の screens/transitions が直接変更されたとき
- **アクション**:
  1. `conceptual-model.md` の画面定義セクションと照合し、大きな差分があれば更新する
  2. `ui-spec.md` が記述済みの場合、画面・ルーティング定義への影響を確認する
- **スキップ条件**: Specsがテンプレート状態（未記述）の場合、Specs影響チェックはスキップ

### 3. Screens 完了後 → 並列で進める

Screens完了後、以下の2トラックを並列で進める。

#### Track A: Specs（設計仕様群）を順次導出

| 順序 | Spec | 導出元 | ファイル |
|---|---|---|---|
| 1 | DB Schema | product-model.json（entities） | `docs/specs/db-schema.md` |
| 2 | API Spec | db-schema + conceptual-model + prd | `docs/specs/api-spec.md` |
| 3 | Auth Spec | api-spec + conceptual-model（actors） | `docs/specs/auth-spec.md` |
| 4 | UI Spec | conceptual-model（screens）+ api-spec | `docs/specs/ui-spec.md` |
| 5 | Analytics Spec | product-goals | `docs/specs/analytics-spec.md` |
| 5 | Infra Spec | 上記specsの要件 | `docs/specs/infra-spec.md` |

#### Specs間の同期ルール

Track A の導出中に上流Specを変更した場合、以下の影響マップに従い下流Specを確認・更新する。

| 更新したSpec | 確認が必要なSpec |
|---|---|
| `db-schema.md` | `api-spec.md`, `test-spec.md` |
| `api-spec.md` | `auth-spec.md`, `ui-spec.md`, `test-spec.md`, `impl-plan.md` |
| `auth-spec.md` | `db-schema.md`（認証カラム）, `test-spec.md` |
| `user-stories.md` | `test-spec.md` |

#### Track B: User Stories → Test Spec

1. **User Stories**: screens定義と概念モデルを参照して `docs/reqs/user-stories.md` を更新。各ストーリーに受け入れ条件とシナリオ（Gherkin）を定義
2. **Test Spec**: ユーザーストーリーの受け入れ条件から `docs/specs/test-spec.md` を導出

### 3.5a. フィールド照合チェック
- **トリガー**: Track AとTrack Bの両方が完了したとき（Specsレビューゲートの前）
- **アクション**: 以下の照合を実施し、不整合があれば修正する
  1. PRD機能概要の全データ項目 → DB Schemaのカラムとして存在するか
  2. DB Schemaの全カラム → API Specのレスポンスフィールドとして存在するか
  3. API Specの全エンドポイント → Test Specのテスト項目として存在するか
  4. Auth Specの認証要件 → DB Schemaのテーブル・カラムに反映されているか

### 3.5. Specsレビューゲート（必須）
- **トリガー**: フィールド照合チェック（Step 3.5a）が完了したとき
- **アクション**: `review-specs` チームでレビューを実行する
- **通過条件**: Critical が0件であること。Failの場合は修正後に再レビュー
- **次のステップ**: Pass後にImpl Plan（Step 4）へ進む

### 4. Impl Plan
- **トリガー**: Specsレビューゲート（Step 3.5）を通過したとき
- **アクション**: impl-planning.md のワークフローを実行して `docs/specs/impl-plan.md` を生成する

### 5. Specs → 実装
- **トリガー**: 必要なspecsが揃ったとき
- **アクション**: specsを参照し `docs/specs/impl-plan.md` に沿って実装する（reqsを直接パースしない）
- Spec変更が必要になったら、実装前にSpec文書を更新する
- **チーム実装**: 複数レイヤーにまたがるストーリーでは `.claude/teams/impl.md` のimplチームを使用できる。実装Mode（Lead+FE+BE）とテストMode（Lead+QA）を行き来しながらストーリー単位で完了させる。軽微な変更・バグ修正にはチームは不要（agent-teams.md参照）

### 5.5. コードレビューゲート（必須）
- **トリガー**: ストーリーの実装が完了したとき（implチームのテストMode完了後、またはテスト通過後）
- **アクション**: `review-code` チームでレビューを実行する
- **通過条件**: Critical が0件であること。Failの場合は修正後に再レビュー
- **次のステップ**: Pass後にマージ、次のストーリーへ

#### 実装時の制約
- DBを変更する前に `docs/reqs/conceptual-model.md` を確認する
- `product-model.json` にないエンティティをDBに追加しない。先にPRDに戻る
- APIを追加するときは `docs/specs/api-spec.md` の命名規則に従い、対応するPRD機能を明記する
- 画面を追加するときは product-model.json の screens を先に追加/更新する
- イベント計測を追加するときは `docs/specs/analytics-spec.md` のイベント命名規則に従う

## PG遷移（次のProduct Goalへ進む）

- **トリガー**: 現在のPGの出口条件をすべて満たしたとき
- **アクション**:
  1. 現在の `pg{N}.md` のステータスを `Done` に更新する
  2. `product-goals.md` のPG一覧で該当PGのステータスを `Done` に更新する
  3. `docs/reqs/pg{N+1}.md` を作成する（`pg{N}.md` の構造をコピーし、内容はテンプレートに戻す）
  4. `product-goals.md` のPG一覧に新しい行を追加する
  5. `product-goals.md` のドキュメント確信度セクションに、HTMLコメント内のテンプレートをコピーして新PGの確信度テーブルを追加する
  6. 新PGの企画（pg{N+1}.md → prd → mrd）からワークフローを再開する

## スキップのルール
- ドキュメントを書く前に `docs/reqs/product-goals.md` の確信度を確認する
- 確信度が「—」のセクションは記述しない。「仮説」のセクションは変わりうることを前提に書く
- 現在のPGに含まない機能は書かない・実装しない（`docs/reqs/product-goals.md` + 該当PGファイルを確認）
- 既にドキュメントが最新なら更新不要。次のステップに進んでよい

## セッション終了時
- Done / Next / Risks-TODO を記録する
