import{_ as a,b as s}from"./app.28445bf9.js";const e={},n=s(`<h1 id="" tabindex="-1"><a class="header-anchor" href="#" aria-hidden="true">#</a></h1><p>\u4F5C\u4E3A\u524D\u7AEF\u5F00\u53D1, \u8C03\u8BD5\u662F\u6BCF\u5929\u90FD\u4F1A\u63A5\u89E6\u5230\u6982\u5FF5, \u90A3\u4E48\u4EC0\u4E48\u662F\u8C03\u8BD5\u5462?</p><p>\u4EE3\u7801\u5728\u67D0\u4E2A\u5E73\u53F0\u8FD0\u884C, \u628A\u8FD0\u884C\u65F6\u7684\u72B6\u6001\u901A\u8FC7\u67D0\u79CD\u65B9\u5F0F\u66B4\u9732\u51FA\u6765, \u4F20\u9012\u7ED9\u5F00\u53D1\u5DE5\u5177\u505A UI \u7684\u5C55\u793A\u548C\u4EA4\u4E92, \u8F85\u52A9\u5F00\u53D1\u8005\u6392\u67E5\u95EE\u9898, \u68B3\u7406\u6D41\u7A0B, \u4E86\u89E3\u4EE3\u7801\u8FD0\u884C\u72B6\u6001, \u8FD9\u4E2A\u5C31\u662F\u8C03\u8BD5</p><h2 id="\u8C03\u8BD5\u539F\u7406" tabindex="-1"><a class="header-anchor" href="#\u8C03\u8BD5\u539F\u7406" aria-hidden="true">#</a> \u8C03\u8BD5\u539F\u7406</h2><h3 id="chrome-devtools" tabindex="-1"><a class="header-anchor" href="#chrome-devtools" aria-hidden="true">#</a> chrome devtools</h3><p>chrome devtools \u5206\u4E3A\u4E24\u90E8\u5206, backend \u548C frontend:</p><ul><li>backend \u548C chrome \u96C6\u6210, \u8D1F\u8D23\u628A chrome \u7684\u7F51\u9875\u8FD0\u884C\u65F6\u72B6\u6001\u901A\u8FC7\u8C03\u8BD5\u534F\u8BAE\u66B4\u9732\u51FA\u6765.</li><li>frontend \u662F\u72EC\u7ACB\u7684, \u8D1F\u8D23\u5BF9\u63A5\u8C03\u8BD5\u534F\u8BAE, \u505A ui \u7684\u5C55\u793A\u548C\u4EA4\u4E92.</li></ul><p>\u4E24\u8005\u4E4B\u95F4\u7684\u8C03\u8BD5\u534F\u8BAE\u53EB\u505A Chrome DevTools Protocol, \u7B80\u79F0 CDP.</p><p>\u4F20\u8F93\u534F\u8BAE\u6570\u636E\u7684\u65B9\u5F0F\u53EB\u505A\u4FE1\u9053(message channel), \u6709\u5F88\u591A\u79CD, \u6BD4\u5982 Chrome DevTools \u5D4C\u5165\u5728 Chrome \u91CC\u65F6, \u4E24\u8005\u901A\u8FC7\u5168\u5C40\u7684\u51FD\u6570\u901A\u4FE1; \u5F53 Chrome DevTools \u8FDC\u7A0B\u8C03\u8BD5 \u67D0\u4E2A\u76EE\u6807\u7684\u4EE3\u7801\u65F6, \u4E24\u8005\u901A\u8FC7 WebSocket \u901A\u4FE1.</p><p>frontend, backend, \u8C03\u8BD5\u534F\u8BAE, \u4FE1\u9053, \u8FD9\u662F Chrome DevTools \u76844\u4E2A\u7EC4\u6210\u90E8\u5206.</p><h3 id="vscode-debugger" tabindex="-1"><a class="header-anchor" href="#vscode-debugger" aria-hidden="true">#</a> vscode debugger</h3><p>vscode debugger \u7684\u539F\u7406\u548C Chrome DevTools \u5DEE\u4E0D\u591A, \u4E5F\u662F\u5206\u4E3A frontend, backend, \u8C03\u8BD5\u534F\u8BAE\u8FD9\u51E0\u90E8\u5206, \u53EA\u4E0D\u8FC7\u4ED6\u591A\u4E86\u4E00\u5C42\u9002\u914D\u5668\u534F\u8BAE.</p><p>\u4E3A\u4E86\u80FD\u76F4\u63A5\u7528 chrome devtools \u8C03\u8BD5 node.js \u4EE3\u7801, node.js 6 \u4EE5\u4E0A\u5C31\u4F7F\u7528 Chrome DevTools Protocol \u4F5C\u4E3A\u8C03\u8BD5\u534F\u8BAE\u4E86, \u6240\u4EE5 vscode debugger \u8981\u8C03\u8BD5\u4E5F\u662F\u901A\u8FC7\u8FD9\u4E2A\u534F\u8BAE.</p><p>\u4F46\u662F\u4E2D\u95F4\u591A\u4E86\u4E00\u5C42\u9002\u914D\u5668\u534F\u8BAE Debug Adapter Protocol, \u8FD9\u662F\u4E3A\u4EC0\u4E48\u5462?</p><p>\u56E0\u4E3A vscode \u4E0D\u662F js \u4E13\u7528\u7F16\u8F91\u5668, \u4ED6\u53EF\u80FD\u7528\u6765\u8C03\u8BD5 python, rust \u7B49\u7B49, \u81EA\u7136\u4E0D\u80FD\u548C\u67D0\u4E00\u79CD\u8BED\u8A00\u7684\u8C03\u8BD5\u534F\u8BAE\u6DF1\u5EA6\u8026\u5408, \u6240\u4EE5\u591A\u4E86\u4E00\u5C42\u9002\u914D\u5668</p><h2 id="sourcemap" tabindex="-1"><a class="header-anchor" href="#sourcemap" aria-hidden="true">#</a> sourcemap</h2><p>\u5E73\u65F6\u6211\u4EEC\u81F3\u5C11\u5728\u4E24\u4E2A\u573A\u666F\uFF08\u5F00\u53D1\u65F6\u8C03\u8BD5\u6E90\u7801\uFF0C\u751F\u4EA7\u65F6\u5B9A\u4F4D\u9519\u8BEF\u7684\u6E90\u7801\u4F4D\u7F6E\uFF09\u4E0B\u4F1A\u7528\u5230 sourcemap\u3002</p><p>sourcemap \u53EA\u662F\u4F4D\u7F6E\u7684\u6620\u5C04, \u53EF\u4EE5\u7528\u5728\u4EFB\u4F55\u4EE3\u7801\u4E0A, \u6BD4\u5982 ts, js, css \u7B49. \u800C\u4E14 ts \u7684\u7C7B\u578B\u4E5F\u652F\u6301 sourcemap:</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code>  compilerOptions<span class="token punctuation">.</span>declaration<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
  compilerOptions<span class="token punctuation">.</span>declarationMap<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>\u6307\u5B9A\u4E86 declaration \u4F1A\u751F\u6210 d.ts \u7684\u58F0\u660E\u6587\u4EF6, \u8FD8\u53EF\u4EE5\u6307\u5B9A declarationMap \u6765\u751F\u6210 sourcemap</p><h3 id="webpack-\u7684-sourcemap" tabindex="-1"><a class="header-anchor" href="#webpack-\u7684-sourcemap" aria-hidden="true">#</a> webpack \u7684 sourcemap</h3><h4 id="eval" tabindex="-1"><a class="header-anchor" href="#eval" aria-hidden="true">#</a> eval</h4><p>eval \u7684 api \u662F\u52A8\u6001\u6267\u884C js \u4EE3\u7801\u7684 \u6BD4\u5982:</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token function">eval</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">
  function add(a, b) {
    return a + b;
  }

  console.log(add(1, 2))
</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p>\u4F46\u6709\u4E2A\u95EE\u9898, eval \u7684\u4EE3\u7801\u6253\u4E0D\u4E86\u65AD\u7535, \u600E\u4E48\u89E3\u51B3\u8FD9\u4E2A\u95EE\u9898\u5462?</p><p>\u6D4F\u89C8\u5668\u652F\u6301\u4E86\u8FD9\u6837\u4E00\u79CD\u7279\u6027, \u53EA\u8981\u5728 eval \u4EE3\u7801\u7684\u6700\u540E\u52A0\u4E0A <code>//# sourceURL=xxx</code>, \u90A3\u4E48\u5C31\u4F1A\u4EE5 xxx \u4E3A\u540D\u5B57\u628A\u8FD9\u6BB5\u4EE3\u7801\u52A0\u5230 sources \u91CC\u9762, \u8FD9\u6837\u5C31\u53EF\u4EE5\u8FDB\u884C\u65AD\u70B9\u4E86</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token function">eval</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">
  function add(a, b) {
    return a + b;
  }

  console.log(add(1, 2));
  //# sourceURL=cqc.js
</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p><img src="https://phsdevoss.eheren.com/pcloud/phs3.0/Snipaste_2023-02-17_13-28-41.jpg" alt="eval \u65AD\u70B9"></p>`,28);function p(r,o){return n}var t=a(e,[["render",p],["__file","index.html.vue"]]);export{t as default};