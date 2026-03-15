---
paths:
  - "docs/**"
---

# ドキュメントルール

- `docs/reqs/` が企画（canonical）。`docs/specs/` は `docs/reqs/` から導出する
- `docs/reqs/` と `docs/specs/` が矛盾したら `docs/reqs/` が正しい
- 実装は `docs/specs/` を参照する。`docs/reqs/` を直接パースして実装しない
- 不明な点は推測で実装せず TODO コメントを残す

# 開発ワークフロー（Spec駆動開発）
- 詳細は `.claude/rules/workflow.md` を参照する


## Conceptual Model（統合JSON + HTMLエディタ）

- `product-model.json` は統合JSON（entities/actors/screens/transitions）。screensはtype: screen|compositeで区別
- CMエディタ（`model-editor.html`）で entities/actors を編集
- Screensエディタ（`screen-editor.html`）で screens/transitions を編集
- 両エディタは同じJSONを共有し、担当外フィールドをパススルーで保持する
- ユーザーから設計指示があった場合、`product-model.json` の変更が `ui-spec.md` と `db-schema.md` に影響しないか確認する
- `product-model.json` が更新されたら、`conceptual-model.md` も整合するよう更新する

## Screens（統合JSON内）

- 画面定義は `product-model.json` の `screens` / `transitions` で管理する
- 画面を追加するときは `/screens` でScreensエディタを開いて編集する
- screens の objects.crud は actors の touches 権限の範囲内で設定する
- screens が更新されたら、`ui-spec.md` への影響を確認する
