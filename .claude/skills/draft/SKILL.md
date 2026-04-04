---
name: draft
description: 構成案とブランドボイスに基づいて記事を執筆する
---

# /draft

`/outline` で作成した構成案を入力に、brand-voice.md のペルソナ・トーン・文体に従って記事を執筆する。

## Input

- 構成案（`/outline` の成果物、またはユーザーが指定する構成）
- `.claude/rules/brand-voice.md` — ペルソナ、トーン、文体、プラットフォーム規定

## Output

`content/articles/{slug}.md` に記事を出力する。

## Execution Steps

### Step 1: 入力を確認する

- 構成案が存在するか確認する。なければユーザーに `/outline` の実行を提案して中断する
- `brand-voice.md` を読み込む。テンプレート状態の場合はユーザーに報告して中断する

### Step 2: 執筆する

構成案の各セクションに従って記事を執筆する。

**従うルール:**
- brand-voice.md のトーン・文体・人称に合わせる
- グローバルの文章品質ルール（60文字/文目安、語尾連続回避等）に従う
- 専門用語の初出時は括弧書きで補足する
- 統計データ・数値には出典を付ける。確信がない場合は `[要出典]` を残す
- プラットフォーム規定（title文字数、description等）があれば反映する

### Step 3: メタデータを付与する

記事の先頭に以下のメタデータを付与する。

```markdown
---
title: {記事タイトル}
description: {meta description}
slug: {URL用スラッグ}
tags: [{タグ}]
status: draft
created: {日付}
---
```

### Step 4: ユーザーに報告する

```
## /draft 結果

- 出力: content/articles/{slug}.md
- 文字数: {約N文字}
- [要出典] 箇所: {N件}

次のステップ: `/revise` で推敲 → `/fact-check` で事実検証
```

## 注意

- 初稿として出力する。完璧を目指さない
- [要出典] は `/fact-check` で検証するため、この段階では残してよい
- 画像・図表の挿入位置は `<!-- image: {説明} -->` プレースホルダーで示す
