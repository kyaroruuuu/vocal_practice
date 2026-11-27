/* 範例模組：不用建置工具，直接用網站提供的 KV 介面 */
(() => {
  const { React, lib } = window.KV;
  const { useState } = React;
  const h = React.createElement;
  const { PageHeader } = lib.ui;

  function Hello() {
    const [n, setN] = useState(0);
    return h('section', null,
      h(PageHeader, { title: '你好', desc: '這是一個範例模組。' }),
      h('div', { className: 'card hello-card' },
        h('p', null, '按了 ', h('b', null, n), ' 次'),
        h('button', { className: 'b', onClick: () => setN(n + 1) }, '再按一次'),
      ),
    );
  }

  KV.define('hello', { default: Hello });
})();
