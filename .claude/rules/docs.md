---
paths:
  - "docs/**"
---

# ドキュメントルール

## 基本原則

- **必要なドキュメントだけ作る** — `product-goals.md` のドキュメントマップで管理。フェーズで不要なものは作成しない
- **CCが生成し、人間が微調整する** — 自動導出specはCCが生成。人間の意思決定は `<!-- human-decision -->` で保護
- **reqs ⇔ specs ⇔ 実装は三角形** — どの頂点からでも始められる。一方向の強制はない
- `docs/reqs/` と `docs/specs/` が矛盾したら、**最新の意思決定がある方**が正しい。判断基準: `<!-- human-decision -->` マーカーがある方を優先。それでも判断できない場合はユーザーに確認する
- 不明な点は推測で実装せず TODO コメントを残す

## ドキュメントの2分類

### 自動導出（CCが生成 → 人間レビュー）
`conceptual-model.md`（`product-model.json` の可読レンダリング）, `db-schema.md`, `api-spec.md`, `auth-spec.md`, `test-spec.md`

### 意思決定（人間が主 → CCが骨格生成）
`mrd.md`, `prd.md`, `pg{N}.md`, `user-stories.md`, `ui-spec.md`, `analytics-spec.md`, `infra-spec.md`

## 開発ワークフロー
- 詳細は `.claude/rules/workflow.md` を参照する

## LLM生成の文献引用に関するルール

LLM（Claude）がドキュメント内で文献・論文・統計データを引用する場合、以下のルールに従う。

- LLMの訓練データに基づく引用は原則「未確認」とする。ユーザーまたはWeb検索で実在を確認できた場合のみ「確認済み」とする
- もっともらしい引用を捏造しない。確信が持てない場合は引用せず、その旨を明記する
- 原典の主張を歪曲・誇張して引用しない。文脈を省略して結論だけを抜き出さない
- 効果量・サンプルサイズ等の具体的な数値を記述する場合は、出典を明記する
- 因果関係と相関関係を区別する。相関を因果として記述しない
- 設計仮説（実証研究に基づかない判断）は「設計仮説」と明記し、実証済みの知見と区別する
- 文献引用の検証状態は `docs/reqs/design-details.md` で管理する（ファイルが存在する場合）

## Conceptual Model（統合JSON + HTMLエディタ）

- `product-model.json` は統合JSON（entities/actors/screens/transitions）。screensはtype: screen|compositeで区別
- CMエディタ（`model-editor.html`）で entities/actors を編集
- Screensエディタ（`screen-editor.html`）で screens/transitions を編集
- 両エディタは同じJSONを共有し、担当外フィールドをパススルーで保持する
- `conceptual-model.md` は `product-model.json` からCCが自動生成する。JSONが正
- `product-model.json` が更新されたら、CCが関連ドキュメントへの影響を検知・報告する

## Screens（統合JSON内）

- 画面定義は `product-model.json` の `screens` / `transitions` で管理する
- 画面を追加するときは `/screens` でScreensエディタを開いて編集する
- **screens の `actorIds`（配列）で複数actorに属する画面を定義できる。** 同じUIの画面をactor間で共有し、重複を避ける
- **`objects[].crudByActor` でactorごとのCRUD+Scopeを定義する。** 形式: `{ "actorId": [{op:"C",scope:"all"}, ...] }`。旧 `objects[].crud` 形式はエディタ読み込み時に自動マイグレーションされる
- screens が更新されたら、CCが関連ドキュメントへの影響を検知・報告する
- **transitions は「進む」方向のみ定義する。「戻る」遷移は定義しない。** 戻る導線はブラウザバックやナビゲーションで暗黙的に表現される
