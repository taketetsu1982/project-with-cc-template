---
paths:
  - "backend/**"
  - "frontend/**"
---

# コードスタイル

## リンター・フォーマッター

- ツール: {Biome / ESLint+Prettier / Ruff 等}
- 実行: hooks（PostToolUse）で自動適用。手動実行は `{コマンド}`

## 型

- 厳密度: {strict / 標準}
- any: {禁止 / 最小限許容}

## 命名規則

- 変数・関数: {camelCase / snake_case}
- コンポーネント: {PascalCase}
- 定数: {UPPER_SNAKE_CASE}
- ファイル名: {kebab-case / camelCase}

## ログ

- ライブラリ: {ツール名}
- レベル使い分け: error=障害, warn=想定外だが継続可, info=主要操作, debug=開発時のみ

## 依存関係

- パッケージ追加時: {承認ルール。例: bundle sizeを確認}
- lockファイル: 手動編集禁止。パッケージマネージャ経由のみ
