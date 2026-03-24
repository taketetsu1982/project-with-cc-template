# 開発ワークフロー（Spec駆動開発）

## 原則
- **実装前に必ず reqs → specs の順で更新する。reqs 変更不要なら specs → 実装でOK。実装だけ先に進めるのは厳禁**
- チャットでの指示で仕様が変わるような大きな変更の場合も同様に reqs → specs → 実装の順で進める
- 非自明なタスクは計画を立ててからはじめる
- 迷ったら実装を止めて確認する
- レビューゲートの詳細は `review-gate.md` を参照
- ドキュメント同期ルールの詳細は `doc-sync.md` を参照

## ドキュメント遷移ルール

流れ図（CLAUDE.md）に沿って、各ステップ完了後に次のステップへ進む。

### 1. PG / PRD / MRD → Conceptual Model
- **トリガー**: PRD・MRDが固まり、概念モデルの作成・更新に入るとき
- **アクション**: `/conceptual-model` を実行
- **完了条件**: `product-model.json` に entities + actors が揃っている
- **同期**: PRD/MRD変更時は `doc-sync.md` の企画ドキュメント影響マップに従う

### 1.5. Conceptual Model 変更後の同期
- **トリガー**: `/conceptual-model` でエディタ編集後、または `product-model.json` の entities/actors が直接変更されたとき
- **アクション**: `doc-sync.md` のConceptual Model変更時の影響マップに従い、下流を確認・更新する

### 2. Conceptual Model → Screens
- **トリガー**: `product-model.json` に entities・actors が定義され、画面設計に入るとき
- **アクション**: `/screens` を実行
- **完了条件**: `product-model.json` の screens + transitions が定義されている

### 2.5. Screens 変更後の同期
- **トリガー**: `/screens` でエディタ編集後、または `product-model.json` の screens/transitions が直接変更されたとき
- **アクション**: `doc-sync.md` のScreens変更時のルールに従い、下流を確認・更新する

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

導出中にSpecを変更した場合は `doc-sync.md` のSpecs間影響マップに従う。

#### Track B: User Stories → Test Spec

1. **User Stories**: screens定義と概念モデルを参照して `docs/reqs/user-stories.md` を更新。各ストーリーに受け入れ条件とシナリオ（Gherkin）を定義
2. **Test Spec**: ユーザーストーリーの受け入れ条件から `docs/specs/test-spec.md` を導出

### 3.5a. フィールド照合チェック
- **トリガー**: Track AとTrack Bの両方が完了したとき（Specsレビューゲートの前）
- **アクション**: `doc-sync.md` のフィールド照合チェックを実施し、不整合があれば修正する

### 3.5. Specsレビューゲート（必須）
- **トリガー**: フィールド照合チェック（Step 3.5a）が完了したとき
- **アクション**: `review-specs` チームでレビューを実行する（詳細は `review-gate.md`）
- **通過条件**: Critical が0件であること。Failの場合は修正後に再レビュー
- **次のステップ**: Pass後にImpl Plan（Step 4）へ進む

### 4. Impl Plan
- **トリガー**: Specsレビューゲート（Step 3.5）を通過したとき
- **アクション**: impl-planning.md のワークフローを実行して `docs/specs/impl-plan.md` を生成する

### 5. Specs → 実装
- **トリガー**: 必要なspecsが揃ったとき
- **アクション**: specsを参照し `docs/specs/impl-plan.md` に沿って実装する（reqsを直接パースしない）
- Spec変更が必要になったら、実装前にSpec文書を更新する（`doc-sync.md` に従い下流も更新）
- **チーム実装**: 複数レイヤーにまたがるストーリーでは `.claude/teams/impl.md` のimplチームを使用できる。実装Mode（Lead+FE+BE）とテストMode（Lead+QA）を行き来しながらストーリー単位で完了させる。軽微な変更・バグ修正にはチームは不要（agent-teams.md参照）

### 5.5. コードレビューゲート（必須）
- **トリガー**: ストーリーの実装が完了したとき（implチームのテストMode完了後、またはテスト通過後）
- **アクション**: `review-code` チームでレビューを実行する（詳細は `review-gate.md`）
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
