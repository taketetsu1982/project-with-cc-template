---
paths:
  - "docs/**"
---

# ドキュメント同期ルール

上流ドキュメントを変更した際に、下流ドキュメントを確認・更新するためのルール。
ワークフロー（`workflow.md`）の各同期ステップで参照される。

## 企画ドキュメントの影響マップ

### PRD / MRD 変更時

| 更新したドキュメント | 確認が必要なドキュメント |
|---|---|
| `prd.md` | `pg{N}.md`, `conceptual-model.md`, `user-stories.md` |
| `mrd.md` | `prd.md`（Buyer/User定義の整合） |

### Conceptual Model 変更時

| 変更内容 | 影響するSpec |
|---|---|
| entity 追加・削除・名前変更 | `db-schema.md`, `api-spec.md` |
| actor 追加・削除・名前変更 | `auth-spec.md` |
| entity/actor 変更 | `ui-spec.md` |

### Screens 変更時

- `conceptual-model.md` の画面定義セクションと照合
- `ui-spec.md` の画面・ルーティング定義への影響を確認

## Specs間の影響マップ

Track A の導出中に上流Specを変更した場合、以下に従い下流Specを確認・更新する。

| 更新したSpec | 確認が必要なSpec |
|---|---|
| `db-schema.md` | `api-spec.md`, `test-spec.md` |
| `api-spec.md` | `auth-spec.md`, `ui-spec.md`, `test-spec.md`, `impl-plan.md` |
| `auth-spec.md` | `db-schema.md`（認証カラム）, `test-spec.md` |
| `user-stories.md` | `test-spec.md` |

## フィールド照合チェック

Specsレビューゲート（workflow.md Step 3.5）の前に実施する機械的な整合性検証。

1. PRD機能概要の全データ項目 → DB Schemaのカラムとして存在するか
2. DB Schemaの全カラム → API Specのレスポンスフィールドとして存在するか
3. API Specの全エンドポイント → Test Specのテスト項目として存在するか
4. Auth Specの認証要件 → DB Schemaのテーブル・カラムに反映されているか

## 共通ルール

- **スキップ条件**: 下流ドキュメントがテンプレート状態（未記述）の場合、影響チェックはスキップ
- 不整合を発見した場合は、下流ドキュメントを修正してから次のステップに進む
