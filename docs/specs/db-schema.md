# DB Schema Spec

> データベーススキーマ定義。conceptual-model の写像。

**バージョン:** 0.1
**ステータス:** Draft
**最終更新:** {日付}
**導出元:** docs/reqs/conceptual-model.json（entities）

---

## ER 図（概要）

```
{テキストベースのER図}
```

---

## ENUM 定義

### {enum名}

| 値 | 説明 |
|---|------|
| {値} | {説明} |

---

## 共通カラム規約

全テーブルに以下のカラムを持つ:

| カラム名 | 型 | 制約 | 説明 |
|---------|---|------|------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | 主キー |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 作成日時 |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 更新日時 |
| `deleted_at` | TIMESTAMPTZ | - | ソフトデリート |

---

## テーブル定義

### {テーブル名}
**概念モデルの対応エンティティ:** {エンティティ名と説明}

| カラム名 | 型 | 制約 | 説明 |
|---------|---|------|------|
| {カラム} | {型} | {制約} | {説明} |

**インデックス:** {インデックス定義}

---

## マイグレーション方針

{マイグレーションツールと運用ルール}

---

## 命名規約

- テーブル名: snake_case, 複数形
- カラム名: snake_case
- 外部キー: `{参照先テーブル単数形}_id`
- インデックス: `{テーブル名}_{カラム名}_idx`
- ユニーク制約: `{テーブル名}_{意味}_key`
