---
paths:
  - "frontend/**"
  - "docs/reqs/conceptual-model.md"
  - "docs/reqs/product-model.json"
  - "docs/specs/ui-spec.md"
---

# デザイン

## UIポリシー: OOUI

- タスク（動詞）ではなくオブジェクト（名詞）を起点に設計する
- オブジェクトは product-model.json の entities から導出する
- product-model.json にないエンティティの画面を作らない

## ベース: Material Design

- Google Material Design 3 に準拠する
- カスタムコンポーネントを作る前に Material のコンポーネントで実現できないか確認する

## プロジェクト Design System

- 方向性: {例: ダーク基調・ミニマル・高情報密度}
- カラー・タイポグラフィ・コンポーネントの具体定義は `docs/specs/ui-spec.md` のデザイントークンセクションを参照する

## Do / Don't

- Primary カラーは控えめに。最も重要なアクションにのみ適用する
- テキストのコントラスト比 4:1 以上を維持する
- 同一ビュー内で角丸とシャープコーナーを混在させない
