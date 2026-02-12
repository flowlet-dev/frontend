---
apply: モデルの判断による
---

# React ルール

## ドキュメント概要

このドキュメントは、React（React 19 + TypeScript）に関する「AIアシスタントの判断基準」を定めます。  
目的は **UIの一貫性・保守性・性能・アクセシビリティ** を高い優先度で維持しつつ、変更の影響範囲を小さくすることです。

> 併読: `typescript.md` の型安全ルールを前提にする（特に公開APIの型明示・any禁止）。

---

## 最優先の原則（迷ったらここ）

1. **状態は最小化し、派生値は計算する**（stateに“真実”を一つだけ持つ）
2. **副作用は境界に寄せる**（描画は純粋に、I/Oは hooks/handlers に閉じる）
3. **コンポーネントの責務を狭く**（表示/制御/データ取得を分離）
4. **再レンダーの最適化は計測してから**（先に可読性、必要なら局所最適化）
5. **アクセシビリティは後回しにしない**（フォーム/ボタン/ラベル/フォーカス）

---

## コンポーネント設計

### 1) コンポーネントは「境界」で分割する

- **Presentational（表示）**: propsを受けて描画する。副作用やデータ取得はしない
- **Container（制御）**: state・副作用・データ取得・イベント処理を担当
- 目安:
    - UIが複雑なら「表示専用」を作る
    - 取得/保存/ナビゲーション等が絡むなら「制御」を分ける

### 2) Props設計

- propsは **最小限**（巨大なオブジェクト丸渡しを避ける）
- booleanは `is/has/can/should` で開始（`isOpen` など）
- コールバックは `onXxx`（`onSubmit`, `onChange`）
- 双方向データは基本避ける。必要なら **制御コンポーネント** として明示する（`value` + `onChange`）

### 3) key のルール

- リストの `key` は **安定ID** を使う（indexは並び替え/追加削除で壊れるため原則NG）
- 例外: 並びが固定で追加削除しない“静的リスト”のみ index 可

---

## State / Hooks のルール

### 1) State最小化（derived stateを持たない）

- `filteredItems` のように元データから導けるものは state にしない
- 代わりに `useMemo` か、単純ならレンダー内で直接計算する

### 2) useState の初期化

- 重い初期化は **lazy initializer** を使う
    - `useState(() => expensiveInit())`

### 3) useEffect は「最後の手段」

- まず検討する順:
    1. 描画ロジックで解決できないか
    2. event handlerで解決できないか
    3. `useMemo` / `useCallback` で十分ではないか
    4. それでも必要なら `useEffect`
- `useEffect` の依存配列は **正しく**（意図的に外す運用は原則しない）
- cleanup が必要な副作用（購読、タイマー、Abortなど）は必ず戻り値で解放

### 4) useMemo / useCallback の使いどころ

- 目的は **再計算/再生成の抑制** または **参照の安定化**
- 乱用しない（可読性が落ちる＆効果がないことが多い）
- 使うべき典型:
    - 子が `memo` されていて props参照が原因で無駄レンダーしている
    - 重い計算（ただしまずは計測）

### 5) useRef の使い分け

- DOM参照: `useRef<HTMLDivElement | null>(null)`
- 値の保持（再レンダー不要）: `useRef<T>(initial)`
- 「状態っぽい」用途で ref に逃がしすぎない（UIと整合が崩れる）

---

## データ取得・非同期・エラーハンドリング

### 1) 非同期は競合・中断を意識する

- 画面遷移や連打で **古いリクエスト結果が反映** されないようにする
- `AbortController` 等で中断できる設計を優先（可能な範囲で）

### 2) ローディング/エラー/空状態を明確に

- 画面は基本3状態を持つ:
    - loading
    - error（回復手段を提示できるなら提示）
    - success（データあり/空）
- エラーを握りつぶさない（ユーザーにとって意味がある表示にする）

---

## パフォーマンス指針（まず計測）

- 先にやること:
    - 不要な state を減らす（derived state排除）
    - コンポーネント分割で更新範囲を局所化
- `memo` は「propsが安定」して初めて効く（必要なら props設計も見直す）
- 大きいリストは仮想化を検討（ただし導入コストと相談）

---

## アクセシビリティ（a11y）最小要件

- ボタンは `button` を使う（`div onClick` は原則避ける）
- フォーム要素には `label` を関連付ける（`htmlFor` / `id`）
- クリック可能要素は **キーボード操作** 可能に（フォーカス/Enter/Space）
- 画像には適切な `alt`（装飾なら空文字）
- `aria-*` は「最後の手段」。まずは適切なHTML要素を選ぶ

---

## 命名・ファイル構成（推奨）

- コンポーネント: `PascalCase`（`UserCard.tsx`）
- hooks: `useXxx`（`useUser.ts`）
- props型: `XxxProps`
- 1ファイルの責務が増えたら分割:
    - `components/`（表示）
    - `features/<feature>/`（機能単位）
    - `hooks/`（共通hook）
    - `lib/`（純粋関数・ユーティリティ）

---

## 禁止/非推奨まとめ

- derived state（元データから導ける値）を `useState` に保存
- 依存配列を無視した `useEffect`（理由なき eslint-disable）
- index key の濫用
- `div`/`span` にクリックを押し付ける実装（a11y/操作性が落ちる）
- 目的のない `useMemo` / `useCallback` の乱用
- 表示とデータ取得・副作用が密結合した巨大コンポーネント

---

## 例（短い推奨パターン）

```tsx
import {useMemo, useState} from "react";

type Item = { id: string; name: string };

type ItemListProps = {
    items: Item[];
    query: string;
    onQueryChange: (next: string) => void;
};

export function ItemList({items, query, onQueryChange}: ItemListProps) {
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return items;
        return items.filter((x) => x.name.toLowerCase().includes(q));
    }, [items, query]);

    return (
        <section>
            <label htmlFor="q"> Search < /label>
            < input
                id="q"
                value={query}
                onChange={(e) => onQueryChange(e.currentTarget.value)}
            />

            < ul>
                {filtered.map((x) => (
                    <li key={x.id}> {x.name} < /li>
                ))}
            < /ul>
        < /section>
    );
}

export function ItemListContainer({items}: { items: Item[] }) {
    const [query, setQuery] = useState("");

    return <ItemList items={items}
                     query={query}
                     onQueryChange={setQuery}
    />;
}
```