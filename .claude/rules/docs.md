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
- `product-model.json` が更新されたら、関連ドキュメントを同期する（詳細は `workflow.md` Step 1.5 および各 SKILL.md の変更同期ステップを参照）

## Screens（統合JSON内）

- 画面定義は `product-model.json` の `screens` / `transitions` で管理する
- 画面を追加するときは `/screens` でScreensエディタを開いて編集する
- **screens の `actorIds`（配列）で複数actorに属する画面を定義できる。** 同じUIの画面をactor間で共有し、重複を避ける
- **`objects[].crudByActor` でactorごとのCRUD+Scopeを定義する。** 形式: `{ "actorId": [{op:"C",scope:"all"}, ...] }`。旧 `objects[].crud` 形式はエディタ読み込み時に自動マイグレーションされる
- screens が更新されたら、関連ドキュメントを同期する（詳細は `/screens` SKILL.md Step 6 を参照）
- **transitions は「進む」方向のみ定義する。「戻る」遷移は定義しない。** 戻る導線はブラウザバックやナビゲーションで暗黙的に表現される。一覧→詳細の行き来のような自明な戻り遷移は情報量ゼロのため不要
