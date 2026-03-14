# 概念モデル (Conceptual Model)

**最終更新**: {日付}

> {設計思想を1-2文で}

---

## このファイルについて

このファイルは**人間が読むための設計意図・背景・関係性の説明**を記述する。
構造定義は `conceptual-model.json` が正であり、HTMLエディタで操作する。

| ファイル | 役割 |
|---------|------|
| `conceptual-model.md`（このファイル） | 設計意図・関係の意味・背景（人間用） |
| `conceptual-model.json` | entities・actors・composites・screens・navigation（機械用・正） |
| `conceptual-model.html` | CMエディタ（Entity / Actor / Composite を編集） |
| `screens.html` | Screensエディタ（Screens / Navigation を編集） |

**1つのJSONファイルを2つのエディタが共有する。各エディタは担当外フィールドをパススルーで保持する。**

---

## エンティティ一覧

| エンティティ | 定義 | 別名 |
|---|---|---|
| {エンティティ1} | {定義} | {別名} |

---

## エンティティ詳細

### {エンティティ名}

**定義:** {1文の定義}
**責務:** {このエンティティが担う責任}
**境界:** {このエンティティが担わないこと}

---

## エンティティ間の関係

エンティティ間の関係は `conceptual-model.json` の `entities[].relations` で表現。

---

## アクター定義

アクター（操作者ロール）は `conceptual-model.json` の `actors` で定義。
各アクターがどのエンティティにどの権限（CRUD + scope）でアクセスするかを管理する。

---

## 画面定義

画面定義は `conceptual-model.json` の `screens` / `navigation` で管理。
`/screens` を実行してScreensエディタで編集する。

---

## 境界と制約

### ビジネスルール

- {ルール1}

### スコープ外

- {除外項目1}

---

## PRDとの対応

| PRD 機能カテゴリ | 主要エンティティ |
|---|---|
| {機能} | {エンティティ} |
