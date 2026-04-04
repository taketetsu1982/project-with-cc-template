---
name: impl-plan
description: ユーザーストーリーとSpecsからストーリー単位の実装計画を生成する
---

# /impl-plan

ユーザーストーリーとSpecsを読み、ストーリー単位のタスクカードと実装順序を生成する。
成果物は `docs/specs/impl-plan.md` に出力する。

## 前提確認

1つでもNoならユーザーに報告して中断する。

- `docs/reqs/user-stories.md` が記述されているか
- `docs/specs/` 配下に少なくとも db-schema, api-spec, ui-spec が記述されているか

## Execution Steps

### Step 1: ストーリー単位のタスク分解

`docs/reqs/user-stories.md` の各ストーリーについて:

1. シナリオを読む
2. 必要なエンティティを `docs/reqs/product-model.json` から特定する
3. 対応するSpecs の該当箇所を特定する
4. 実装対象ファイルとその内容を一覧にする

### Step 2: タスクカード生成

各ストーリーについてタスクカードを作成する。

```
### US-[ID]: [ストーリー名]（[優先度]）
**ゴール:** このタスクが完了すると何が動くか（1文）
**実装対象:**
- DB / API / Auth / UI / Analytics / Test: [新規 or 変更]
**前のストーリーとの差分:**
- [既存への変更がある場合のみ記載]
```

### Step 3: 実装順序の提示

タスクカードを優先度順（Must → Should → Could）に並べる。

### Step 4: 出力

`docs/specs/impl-plan.md` に書き出す。既存ファイルは上書きする。
ユーザーに実装順序を提示し、ストーリー選択の指示を待つ。

## 注意

- ストーリー間で先読みしない
- 次のストーリー着手前にタスクカードの差分を再確認する
