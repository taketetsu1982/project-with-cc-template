---
paths:
  - "docs/**"
---

# ドキュメントルール

- `docs/reqs/` が企画（canonical）。`docs/specs/` は `docs/reqs/` から導出する
- `docs/reqs/` と `docs/specs/` が矛盾したら `docs/reqs/` が正しい
- 実装は `docs/specs/` を参照する。`docs/reqs/` を直接パースして実装しない
- 不明な点は推測で実装せず TODO コメントを残す

## LLM生成の文献引用に関するルール

LLM（Claude）がドキュメント内で文献・論文・統計データを引用する場合、以下のルールに従う。

- 引用する論文・出典が実在することを確認できない場合は「未確認」と明記する。もっともらしい引用を捏造しない
- 効果量・サンプルサイズ等の具体的な数値を記述する場合は、出典を明記する
- 因果関係と相関関係を区別する。相関を因果として記述しない
- 設計仮説（実証研究に基づかない判断）は「設計仮説」と明記し、実証済みの知見と区別する
- 文献引用の検証状態は `docs/reqs/design-details.md` で管理する（ファイルが存在する場合）

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
