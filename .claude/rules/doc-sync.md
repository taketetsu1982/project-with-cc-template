---
paths:
  - "docs/**"
  - "backend/**"
  - "frontend/**"
---

# ドキュメント同期ルール

## 基本方針

- CCが変更を検知し、影響範囲を報告する。人間が同期マップを暗記する必要はない
- 自動導出specはCCが再生成する。人間の意思決定部分（`<!-- human-decision -->` マーカー）は保護する
- 不整合を発見したら、人間に報告してから修正する（勝手に直さない）

## CCによる自動検知

ドキュメントまたはコードが変更されたとき、CCは以下を自動でチェックする。

### reqs が変更されたとき
- `product-model.json` の entities/actors/screens に影響するか確認
- 既存のspecsとの整合性を確認し、差分を報告
- 自動導出specの再生成を提案

### specs が変更されたとき
- reqs との整合性を確認（specsの制約がreqsに反映されているか）
- 他のspecsへの影響を確認（例: db-schema変更 → api-spec, test-spec）
- 実装との差分を確認

### 実装が変更されたとき
- specsとの差分を確認
- specsにない機能が追加されていないか確認
- 必要に応じてreqs/specsの更新を提案

## 影響の参考マップ

CCが検知に使う参考情報。人間はこれを覚えなくてよい。

| 変更元 | 影響先 |
|---|---|
| `prd.md` | `pg{N}.md`, `product-model.json`, `user-stories.md` |
| `mrd.md` | `prd.md`（Buyer/User定義） |
| `product-model.json` entities | `db-schema.md`, `api-spec.md`, `conceptual-model.md` |
| `product-model.json` actors | `auth-spec.md`, `ui-spec.md` |
| `product-model.json` screens | `ui-spec.md`, `user-stories.md` |
| `design-details.md` | `api-spec.md`, `ui-spec.md`, `test-spec.md` |
| `db-schema.md` | `api-spec.md`, `test-spec.md` |
| `api-spec.md` | `auth-spec.md`, `ui-spec.md`, `test-spec.md` |
| `auth-spec.md` | `db-schema.md`（認証カラム）, `test-spec.md` |
| `user-stories.md` | `test-spec.md` |

## フィールド照合チェック

Specsレビューゲート前にCCが自動実行する整合性検証。

1. PRD機能概要のデータ項目 → DB Schemaのカラムとして存在するか
2. DB Schemaのカラム → API Specのレスポンスフィールドとして存在するか
3. API Specのエンドポイント → Test Specのテスト項目として存在するか
4. Auth Specの認証要件 → DB Schemaのテーブル・カラムに反映されているか
5. User Storiesの「〜を表示する」 → APIがそのデータを返却できるか
6. `design-details.md` のエッジケース → API/UIで考慮されているか

## 共通ルール

- 現在のフェーズで不要なドキュメント（`product-goals.md` のドキュメントマップで「—」）はチェック対象外
- 自動導出specがテンプレート状態（未記述）の場合、specs影響チェックはスキップ
- 不整合発見時は下流ドキュメントを修正してから次のステップに進む
