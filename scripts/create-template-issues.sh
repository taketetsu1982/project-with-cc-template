#!/bin/bash
# Run this locally with gh authenticated:
# gh auth login
# bash create-issues.sh

REPO="taketetsu1982/project-with-cc-template"

echo "Creating 6 template improvement issues..."

gh issue create --repo "$REPO" \
  --title "[テンプレート改善][Critical] 上流ドキュメント更新時の下流伝播チェックリストの追加" \
  --body "$(cat <<'EOF'
## 概要

ワークフロー（`workflow.md`）では「reqs → specs の順で更新する」と定めていますが、**上流ドキュメントを更新したとき、下流のどこを修正すべきか**を特定するチェックリストがありません。

## 実際に起きたこと

PRD（`prd.md`）のリサーチで、メンタルスコアの4軸が「ストレス・モチベーション・集中・不安」→「気分・エネルギー・ストレス・集中」に変更されました。PRDは正しく更新されましたが、**`pg1.md`（PGスコープ定義）は旧軸のまま取り残されました**。PRDを変更した時点で「pg1.mdも確認する」というルールがなかったため、整合性レビューを明示的に実行するまで誰も気づきませんでした。

## 改善案

`workflow.md` に**更新影響マップ**を追加する。

| 更新したドキュメント | 確認が必要なドキュメント |
|---|---|
| pg{N}.md | prd.md, conceptual-model.md |
| mrd.md | prd.md |
| prd.md | pg{N}.md, conceptual-model.md, user-stories.md |
| conceptual-model.md / product-model.json | db-schema.md, api-spec.md, ui-spec.md |
| user-stories.md | test-spec.md |

## 影響ファイル

- `.claude/rules/workflow.md`

## 関連

- 詳細: `docs/template-issues.md` (Issue 1)
EOF
)" --label "🤖 claude-code"

echo "✓ Issue 1 created"

gh issue create --repo "$REPO" \
  --title "[テンプレート改善][Critical] Specs導出時のフィールドレベル照合チェックの追加" \
  --body "$(cat <<'EOF'
## 概要

PRDの機能概要テーブルに列挙されたデータ項目が、DB Schema → API Spec → Test Spec に**漏れなく反映されたか確認するステップ**がワークフローにありません。

## 実際に起きたこと

PRDの機能概要に「**睡眠ステージ比率**を日次取得」と明記されていたにもかかわらず、DB Schema導出時に `physical_scores` テーブルに `sleep_stages` カラムが作成されませんでした。API Spec・Test Specにも連鎖的に欠落し、レビューまで発覚しませんでした。

## 改善案

`workflow.md` の Track A（Specs導出）完了後に照合チェックを追加する。

```
1. PRD機能概要テーブルの全データ項目 → db-schema.mdのカラムに存在するか
2. db-schema.mdの全カラム → api-spec.mdのレスポンスフィールドに存在するか
3. api-spec.mdの全エンドポイント → test-spec.mdのテスト項目に存在するか
```

## 影響ファイル

- `.claude/rules/workflow.md`

## 関連

- 詳細: `docs/template-issues.md` (Issue 2)
EOF
)" --label "🤖 claude-code"

echo "✓ Issue 2 created"

gh issue create --repo "$REPO" \
  --title "[テンプレート改善][Critical] PRD設計原則から操作的定義への導出ステップの追加" \
  --body "$(cat <<'EOF'
## 概要

PRDの「設計原則」は抽象的な方針として書かれますが、それをSpecsに落とす際に**「具体的にどのメトリクスで・どう計算するか」を定義するステップ**がワークフローにありません。

## 実際に起きたこと

PRDの設計原則に「Strain（負荷）とRecovery（回復）は独立2軸で表示する」（RESTQ由来）と記載。しかし**どのメトリクスがStrainでどれがRecoveryか、どう計算するか**が定義されないまま、API Specにフィールドが作られませんでした。

「概念」は存在するが「計算式」がないため、Specs導出エージェントが具体化できなかったのが原因です。

## 改善案

1. PRDの設計原則テンプレートに「操作的定義」列を追加

| 原則 | 内容 | 根拠 | **操作的定義** |
|---|---|---|---|
| Strain/Recovery分離 | 負荷と回復は独立2軸 | RESTQ | Strain = stress + activity_score のZ-score平均。Recovery = mood + energy + sleep_score + readiness_score + hrv_rmssd のZ-score平均 |

2. PRD用語集にも「操作的定義」（計算式・構成要素）を必須化

## 影響ファイル

- `.claude/rules/workflow.md`
- `docs/reqs/prd.md`（テンプレート構造）

## 関連

- 詳細: `docs/template-issues.md` (Issue 3)
EOF
)" --label "🤖 claude-code"

echo "✓ Issue 3 created"

gh issue create --repo "$REPO" \
  --title "[テンプレート改善][High] 並列トラック間の依存関係の明示" \
  --body "$(cat <<'EOF'
## 概要

`workflow.md` の Step 3 で「Track A（Specs）と Track B（User Stories → Test Spec）を並列で進める」と定めていますが、実際には Track B の **Test Spec** は Track A の **API Spec** に強く依存しています。この依存関係がワークフローに記載されていません。

## 実際に起きたこと

Track A と Track B が並列で実行された結果、2つの問題が発生しました。

1. **エンドポイント名の不一致**: Test Spec の API-09 が「`GET daily_records`（期間指定）」と記述されたが、実際のAPI Specでは `GET /api/v1/trends` という別名のエンドポイントが定義されていた
2. **Auth Specの未整備**: Test Specの認証セクションが「auth-spec.md 具体化後に更新する」という注記のまま残った。auth-specがテンプレート状態のまま放置されていた

## 改善案

並列化できる部分とできない部分を明確にする。

```
Track A: Specs導出（順次）
  DB Schema → API Spec → Auth Spec → UI Spec

Track B: User Stories（Track Aと並列可）
  User Stories の記述はTrack Aと並列で進められる

Track C: Test Spec（Track A 完了後）
  Test SpecはAPI Spec・Auth Specを参照するため、Track A完了後に導出する
```

## 影響ファイル

- `.claude/rules/workflow.md`

## 関連

- 詳細: `docs/template-issues.md` (Issue 4)
EOF
)" --label "🤖 claude-code"

echo "✓ Issue 4 created"

gh issue create --repo "$REPO" \
  --title "[テンプレート改善][High] API仕様とUser Storiesのエッジケース振る舞い照合の追加" \
  --body "$(cat <<'EOF'
## 概要

API SpecとUser Storiesは別々のタイミングで導出されるため、**同じ状況に対する振る舞いの定義が食い違う**ことがあります。特にエッジケース（データなし・未入力等）で矛盾が生じやすい構造です。

## 実際に起きたこと

- **US-08のエッジケース**: 「データが存在しない日をタップ → **空の日次サマリーを表示**する」
- **API Specの定義**: `GET /api/v1/daily-records/{record_date}` でdaily_record非存在時 → **404を返す**

フロントエンドが「空の日次サマリー」を表示するためにはAPIが200（中身null）を返す必要があり、404では空表示が実現できません。USが求める振る舞いとAPIの振る舞いが矛盾していました。

## 改善案

API Spec導出後のチェックとして以下を追加する。

```
## API ↔ US 振る舞い照合

1. USの各エッジケースについて、対応するAPIのエラーケースを確認
2. USが「〜を表示する」場合、APIがそのデータを返せるか確認
3. 特に「データなし」「未入力」「未接続」等の空状態の振る舞いが一致しているか確認
```

## 影響ファイル

- `.claude/rules/workflow.md`

## 関連

- 詳細: `docs/template-issues.md` (Issue 5)
EOF
)" --label "🤖 claude-code"

echo "✓ Issue 5 created"

gh issue create --repo "$REPO" \
  --title "[テンプレート改善][High] レビューステップのワークフローへの組み込み" \
  --body "$(cat <<'EOF'
## 概要

このテンプレートには8つのレビュー用Agent Teams（review-mrd, review-prd, review-model, review-specs等）が定義されています。しかし、`workflow.md` のどのステップでレビューを実行すべきかが**記載されていません**。レビュー実行は完全にユーザーの判断に委ねられています。

## 実際に起きたこと

PG1の企画→設計フェーズ（MRD → PRD → 概念モデル → Screens → DB Schema → API Spec → User Stories → Test Spec）を一通り完了した後、**ユーザーから「振り返ってレビューして」と明示的に指示されて初めて**整合性レビューを実施しました。

結果、**Critical 5件・Warning 4件・Note 3件の計12件の不具合**が発見されました。もしレビュー指示がなければ、これらの問題を抱えたまま実装フェーズに進んでいた可能性があります。

## 改善案

`workflow.md` の各フェーズ完了後に、対応するレビューチームの実行をマイルストーンとして組み込む。

```
1. MRD完了 → review-mrd 実行 → Pass後にPRDへ
2. PRD完了 → review-prd 実行 → Pass後にConceptual Modelへ
3. Conceptual Model完了 → review-model 実行 → Pass後にScreensへ
4. Screens完了 → Track A（Specs）+ Track B（US）へ
5. Specs + Test Spec完了 → review-specs 実行 → Pass後にImpl Planへ
6. 実装完了 → review-code 実行 → Pass後にマージ

※ レビューPassはCritical 0件が条件
```

## 影響ファイル

- `.claude/rules/workflow.md`

## 関連

- 詳細: `docs/template-issues.md` (Issue 6)
- 他の全イシュー（Issue 1〜5）の問題は、レビューが自動実行されていれば早期発見できた
EOF
)" --label "🤖 claude-code"

echo "✓ Issue 6 created"
echo ""
echo "All 6 issues created!"
