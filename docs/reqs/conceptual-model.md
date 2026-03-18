# 概念モデル (Conceptual Model)

**最終更新**: 2026-03-18

> Ouraのフィジカルデータと主観的メンタルスコアを「日次レコード」で統合し、長期推移を可視化する。PG1では1ユーザー（自分自身）のみ。

---

## このファイルについて

このファイルは**人間が読むための設計意図・背景・関係性の説明**を記述する。
構造定義は `product-model.json` が正であり、HTMLエディタで操作する。

| ファイル | 役割 |
|---------|------|
| `conceptual-model.md`（このファイル） | 設計意図・関係の意味・背景（人間用） |
| `product-model.json` | entities・actors・screens(type: screen\|composite)・transitions（機械用・正） |
| `model-editor.html` | CMエディタ（Entity / Actor を編集） |
| `screen-editor.html` | Screensエディタ（Screens / Transitions を編集） |

**1つのJSONファイルを2つのエディタが共有する。各エディタは担当外フィールドをパススルーで保持する。**

---

## エンティティ一覧

| エンティティ | 定義 | 別名 |
|---|---|---|
| ユーザー | Oura Ring所有者。本システムの利用者 | User |
| Oura接続 | Oura APIとのOAuth認証・トークン情報 | OuraConnection |
| 日次レコード | 特定日のフィジカル+メンタルを束ねる親レコード | DailyRecord |
| フィジカルスコア | Oura APIから取得した日次の身体データ | PhysicalScore |
| メンタルエントリ | ユーザーが自己入力した日次のメンタルスコア（4軸） | MentalEntry |

---

## エンティティ詳細

### ユーザー (User)

**定義:** Oura Ringを所有し、本システムでメンタルスコアを記録する人
**責務:** Oura接続の管理、日次レコードの所有
**境界:** PG1では自分自身のみ。マルチユーザー対応はPG1スコープ外

### Oura接続 (OuraConnection)

**定義:** Oura Cloud APIとのOAuth2接続情報（アクセストークン・リフレッシュトークン）
**責務:** APIアクセスの認証情報を保持し、トークンリフレッシュを管理する
**境界:** Oura APIの呼び出しロジック自体は含まない（それはアプリケーション層の責務）

### 日次レコード (DailyRecord)

**定義:** 特定の日付に対するフィジカルスコアとメンタルエントリを束ねる統合レコード
**責務:** 日付をキーにフィジカルとメンタルを1:1で紐づける。ダッシュボードの基本単位
**境界:** 集計・分析ロジックは含まない。あくまでデータの入れ物

### フィジカルスコア (PhysicalScore)

**定義:** Oura APIから日次取得する身体コンディションデータ
**責務:** Sleep Score・Readiness Score・Activity Score・HRV・安静時心拍数を保持する
**境界:** ユーザーが手動編集することはない。Oura APIからの取得データのみ

### メンタルエントリ (MentalEntry)

**定義:** ユーザーが日次で自己入力するメンタルコンディションスコア
**責務:** 気分・エネルギー・ストレス・集中の4軸（各1〜7のLikert尺度）を保持する。軸選定はRussellのCircumplex Model（気分=Valence、エネルギー=Arousal）とEMA研究に基づく
**境界:** フィジカルデータとの相関分析ロジックは含まない

---

## エンティティ間の関係

エンティティ間の関係は `product-model.json` の `entities[].relations` で表現。

主要な関係:
- **User → OuraConnection** (has-one): 1ユーザーに1つのOura API接続
- **User → DailyRecord** (has-many): 1ユーザーが複数日のレコードを持つ
- **DailyRecord → PhysicalScore** (has-one): 1日に1つのフィジカルスコア
- **DailyRecord → MentalEntry** (has-one): 1日に1つのメンタルエントリ

---

## アクター定義

アクター（操作者ロール）は `product-model.json` の `actors` で定義。
各アクターがどのエンティティにどの権限（CRUD + scope）でアクセスするかを管理する。

PG1では **SelfTracker**（自分自身）のみ:
- PhysicalScoreはOura APIから自動取得されるためRのみ
- MentalEntryはCRUD可能（入力・修正・削除）
- DailyRecordは自動生成されるためCR（作成・参照）のみ

---

## 画面定義

画面定義は `product-model.json` の `screens` / `transitions` で管理。
`/screens` を実行してScreensエディタで編集する。

---

## 境界と制約

### ビジネスルール

- 1日1レコード: 同一日付に複数のDailyRecordは作れない
- メンタルスコアは1〜5の整数値（4軸とも同一スケール）
- PhysicalScoreはOura APIのデータ更新タイミングに依存する（通常は朝）
- MentalEntryは当日分のみ入力可能（過去の修正は許可するが、未来の入力は不可）

### スコープ外

- AI改善提案・アクション推薦（PG1では含まない）
- 他ユーザーへの共有・公開
- 目標設定・習慣トラッキング
- Oura以外のデバイス連携

---

## PRDとの対応

| PRD 機能カテゴリ | 主要エンティティ |
|---|---|
| Ouraデータ連携 | OuraConnection, PhysicalScore |
| メンタルスコア入力 | MentalEntry |
| 日次サマリー | DailyRecord (PhysicalScore + MentalEntry) |
| トレンドダッシュボード | DailyRecord（集約ビュー） |
