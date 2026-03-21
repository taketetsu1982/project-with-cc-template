# Analytics Spec

> 計測設計の定義。何を・いつ・どう計測するか。
> product-goalsの達成基準を計測可能にするための仕様。

**バージョン:** 0.2
**ステータス:** Draft
**最終更新:** 2026-03-21
**導出元:** docs/reqs/product-goals.md, docs/reqs/pg1.md
**計測ツール:** アプリケーションログ（console + DBカウント）

---

## 計測の方針

PG1は個人利用（N=1）のCPF検証のため、外部アナリティクスツールは導入しない。出口条件の判定に必要な最小限の指標を、アプリケーションログとDB集計で計測する。

**出口条件 → 計測指標の対応:**

| 出口条件 | 計測指標 | 判定方法 |
|---------|---------|---------|
| 自分が2週間以上毎日記録を続けられる | メンタル入力の連続日数（ストリーク） | mental_entriesテーブルのrecord_date連続性をクエリ |
| ダッシュボードを見て改善の実感が得られる | 定性判断（本人の主観） | ダッシュボード閲覧頻度を補助指標として参照 |

---

## イベント定義

| イベント名 | トリガー | プロパティ | 対応するPG出口条件 |
|-----------|---------|----------|------------------|
| `mental_entry_created` | メンタルスコア保存（POST成功） | `record_date`, `is_streak_day` | 2週間連続記録 |
| `mental_entry_updated` | メンタルスコア更新（PATCH成功） | `record_date` | — |
| `dashboard_viewed` | トレンドダッシュボード表示 | `window` | 改善の実感（補助） |
| `daily_detail_viewed` | 日次サマリー表示 | `record_date` | 改善の実感（補助） |
| `oura_connected` | Oura OAuth2接続成功 | — | — |
| `oura_disconnected` | Oura接続切断 | — | — |

---

## 計測方法

### ストリーク（連続記録日数）

DB集計で算出。専用テーブルは作らない。

```sql
-- 現在のストリーク日数（直近の連続記録日数）
SELECT COUNT(*) FROM (
  SELECT record_date,
         record_date - ROW_NUMBER() OVER (ORDER BY record_date)::int AS grp
  FROM daily_records dr
  JOIN mental_entries me ON me.daily_record_id = dr.id
  WHERE dr.user_id = :user_id
    AND me.deleted_at IS NULL
) sub
WHERE grp = (
  SELECT record_date - ROW_NUMBER() OVER (ORDER BY record_date)::int
  FROM daily_records dr
  JOIN mental_entries me ON me.daily_record_id = dr.id
  WHERE dr.user_id = :user_id
    AND me.deleted_at IS NULL
  ORDER BY record_date DESC
  LIMIT 1
);
```

### 閲覧頻度

アプリケーションログ（`console.log`）で記録。PG1ではログを目視確認する。構造化ログ基盤の導入はPG1スコープ外。

---

## ユーザー識別

PG1は単一ユーザーのため、ユーザー識別の仕組みは不要。全イベントは認証済みユーザーに紐づく。
