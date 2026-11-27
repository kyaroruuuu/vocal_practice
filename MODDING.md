# 製作模組

卡羅＠寫作系統的網站本體只有外框和版面，所有功能都是模組。你也可以做自己的模組，打包成 `.zip`，讓別人在「模組」頁安裝。

範例：[`modding/example-hello`](modding/example-hello)（可直接下載 [`example-hello.zip`](modding/example-hello.zip) 試裝）。

## 模組的檔案

一個 `.zip`，裏面放：

| 檔案 | 必要 | 說明 |
|---|---|---|
| `module.json` | ✓ | 模組資料 |
| `main.js` | ✓ | 程式，一般的 JavaScript（不是 ES module） |
| `style.css` |  | 樣式，安裝後自動加到頁面 |

可以直接放在 zip 最外層，也可以放在 zip 裏的一個資料夾內。

### module.json

```json
{
  "id": "hello",
  "name": "你好",
  "desc": "一句話說明這個模組做甚麼。",
  "v": "1.0.0",
  "author": "你的名字",
  "page": { "key": "hello", "label": "你好", "icon": "package", "order": 50 },
  "parent": "write",
  "requires": ["write"]
}
```

| 欄位 | 說明 |
|---|---|
| `id` | 小寫英文、數字和 `-`，2–41 個字。不能用官方模組的 id（`vault`、`practice`、`gallery`、`room`、`write`、`mdx`、`opencc`） |
| `name`、`desc` | 顯示在「模組」頁 |
| `v` | 版本號，例如 `1.0.0` |
| `author` | 作者名稱，安裝前會顯示給使用者 |
| `page` | 想在側欄加一頁時才需要：`key` 是網址（`#hello`），`label` 是側欄文字，`order` 是次序（官方頁面是 1–4），`icon` 可用 `practice`、`gallery`、`room`、`write`、`book`、`package` |
| `parent` | 上層模組：在「模組」頁會排在它下面，並且要先安裝它 |
| `requires` | 其他前置模組：要先安裝，載入時也會先載入它們 |

以「詞庫」（`vault`）為前置的模組，只有在使用者輸入詞庫密鑰後才會出現在側欄。

## 程式：KV 介面

網站在 `window.KV` 提供這些東西，模組不用自己打包 React：

| 名稱 | 內容 |
|---|---|
| `KV.React`、`KV.ReactDOM`、`KV.jsx` | 網站用的 React 19（`KV.jsx` 是 `react/jsx-runtime`） |
| `KV.lib.ui` | 共用元件：`PageHeader`、`Empty`、`Help`、`ArmButton`（按兩次確認）、`Pager`、`SearchBox`、`CopyBox`、`Speak`（朗讀）、`useApp`（`go(頁面)`、`openWord(詞)` 等） |
| `KV.lib.store` | 資料：`db`（`db.words` 詞語）、`useStore()`（資料改變時重新顯示）、`save()`、`bump()`、`esc()`、`uid()`、`dlBlob(檔名, Blob)` |
| `KV.lib.motion`、`KV.lib.fuzzy` | 動畫與模糊搜尋小工具 |
| `KV.vault()` | 已安裝並解鎖「詞庫」時回傳詞庫介面，否則是 `null` |
| `KV.version` | 網站版本 |
| `KV.define(id, exports)` | **必須呼叫**：登記你的模組。有 `page` 的模組要提供 `default`（一個 React 元件） |

最簡單的寫法（不用任何建置工具）：

```js
(() => {
  const { React, lib } = window.KV;
  const h = React.createElement;

  function Hello() {
    const [n, setN] = React.useState(0);
    return h('section', null,
      h(lib.ui.PageHeader, { title: '你好' }),
      h('div', { className: 'card' },
        h('button', { className: 'b', onClick: () => setN(n + 1) }, `按了 ${n} 次`)));
  }

  KV.define('hello', { default: Hello });
})();
```

想用 JSX 的話，可以用 esbuild 之類的工具打包成一個 IIFE 檔，把 `react` 對應到 `window.KV.React`。

## 樣式

模組要跟網站的排版一致，盡量用網站現有的 class 和變數，深色模式會自動跟隨：

- **卡片**：`card`
- **按鈕**：`b`（主要）、`b g`（次要）、`b sm`（中號）、`b icon`（圖示）
- **文字**：`mu`（次要文字）
- **標籤**：`chip`
- **提示**：`alert`
- **分段選擇**：`seg`
- **尺寸變數**：`--h-l`、`--h-m`、`--h-s`（大／中／小控制項高度）
- **間距變數**：`--spacing-1` … `--spacing-8`
- **顏色變數**：`--color-text-primary`、`--color-text-secondary`、`--color-accent`、`--color-border`、`--color-background-surface` 等

## 安裝與安全

- 使用者在「模組」頁選擇或拖放 `.zip` 安裝。
- 卡羅的官方模組有簽署；你的模組沒有簽署也可以安裝，但安裝前網站會提醒使用者這是第三方模組，要對方確認。
- 模組跟網站在同一個環境執行，可以讀取網站上的資料（包括解鎖後的文章和詞庫）。請不要收集或傳送使用者的資料。網站的內容安全政策也會阻止模組連線到其他網站。
- 新版本用同一個 `id` 安裝，就會覆蓋舊版；已打開的頁面要重新整理才會換成新版。
