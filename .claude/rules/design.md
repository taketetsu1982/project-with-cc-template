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

ダーク基調・ミニマル・高情報密度の開発者向けインターフェース。

### カラー

| 用途 | 値 | 使い方 |
|---|---|---|
| Primary | #2665fd | CTA、アクティブ状態、主要インタラクション要素 |
| Secondary | #475569 | 補助UI、チップ、セカンダリアクション |
| Surface | #0b1326 | ページ背景 |
| On-surface | #dae2fd | ダーク背景上のテキスト |
| Error | #ffb4ab | バリデーションエラー、破壊的操作 |

- Primary は控えめに使う。最も重要なアクションにのみ適用する
- テキストのコントラスト比 4:1 以上を維持する

### タイポグラフィ

- Headline: Inter, semi-bold
- Body: Inter, regular, 14–16px
- Label: Inter, medium, 12px、セクションヘッダーは大文字

### コンポーネント

- ボタン: 角丸 8px、Primary は brand blue 塗り
- 入力: 1px ボーダー、surface-variant 背景
- カード: エレベーションなし、ボーダーと背景のコントラストで区別
- 同一ビュー内で角丸とシャープコーナーを混在させない
