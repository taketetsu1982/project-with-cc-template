# content/ — ブログ・コンテンツ制作

## このディレクトリの責務

ブログ記事・コンテンツの企画から成果物までを管理する。

## 構造

| ディレクトリ | 責務 |
|---|---|
| `plans/` | 戦略・テーマ計画。記事群の方向性を定義する |
| `articles/` | 記事本体。`/draft` スキルが出力する |

## 制作フロー

```
/outline → /draft → /revise → /fact-check → /sns
```

## 編集ルール

- `.claude/rules/brand-voice.md` のペルソナ・トーン・文体に従う
- 記事ファイルは `articles/{slug}.md` に配置する
- メタデータ（title, description, tags, status）を先頭に付与する
- 統計データ・数値には出典を付ける。確信がない場合は `[要出典]` を残す
