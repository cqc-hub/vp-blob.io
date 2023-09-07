import{_ as n,b as s}from"./app.28445bf9.js";const a={},e=s(`<h1 id="" tabindex="-1"><a class="header-anchor" href="#" aria-hidden="true">#</a></h1><h2 id="css-in-js" tabindex="-1"><a class="header-anchor" href="#css-in-js" aria-hidden="true">#</a> CSS In JS</h2><p>\u793E\u533A\u4E2D\u6709\u4E24\u6B3E\u4E3B\u6D41\u7684 <code>CSS In JS</code> \u65B9\u6848: <code>styled-components</code>, <code>emotion</code>.</p><p>\u5BF9\u4E8E CSS In JS \u65B9\u6848, \u5728\u6784\u5EFA\u4FA7\u6211\u4EEC\u9700\u8981\u8003\u8651 <code>\u9009\u62E9\u5668\u547D\u540D\u95EE\u9898</code>, <code>DCE</code>(Dead Code Elimination \u5373\u65E0\u7528\u4EE3\u7801\u5220\u9664), <code>\u4EE3\u7801\u538B\u7F29</code>, <code>\u751F\u6210 SourceMap</code>, <code>\u670D\u52A1\u7AEF\u6E32\u67D3(SSR)</code> \u7B49\u95EE\u9898, \u800C <code>styled-components</code> \u548C <code>emotion</code> \u5DF2\u7ECF\u63D0\u4F9B\u4E86\u5BF9\u4E8E\u7684babel \u63D2\u4EF6\u6765\u89E3\u51B3\u8FD9\u4E9B\u95EE\u9898. \u6211\u4EEC\u5728vite \u4E2D\u8981\u505A\u7684\u5C31\u662F\u96C6\u6210\u8FD9\u4E9B babel \u63D2\u4EF6</p><p>\u5177\u4F53\u6765\u8BF4, \u4E0A\u8FF0\u7684\u4E24\u79CD\u4E3B\u6D41 CSS In JS \u65B9\u6848\u5728 vite \u4E2D\u96C6\u6210\u65B9\u5F0F\u5982\u4E0B:</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token comment">// vite.config.ts</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> defineConfig <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vite&#39;</span>
<span class="token keyword">import</span> react <span class="token keyword">from</span> <span class="token string">&#39;@vitejs/plugin-react&#39;</span>

<span class="token comment">// https://vitejs.dev/config/</span>
<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineConfig</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  plugins<span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token function">react</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      babel<span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token comment">// \u52A0\u5165 babel \u63D2\u4EF6</span>
        <span class="token comment">// \u4EE5\u4E0B\u63D2\u4EF6\u5305\u90FD\u9700\u8981\u63D0\u524D\u5B89\u88C5</span>
        <span class="token comment">// \u5F53\u7136\uFF0C\u901A\u8FC7\u8FD9\u4E2A\u914D\u7F6E\u4F60\u4E5F\u53EF\u4EE5\u6DFB\u52A0\u5176\u5B83\u7684 Babel \u63D2\u4EF6</span>
        plugins<span class="token operator">:</span> <span class="token punctuation">[</span>
          <span class="token comment">// \u9002\u914D styled-component</span>
          <span class="token string">&quot;babel-plugin-styled-components&quot;</span>
          <span class="token comment">// \u9002\u914D emotion</span>
          <span class="token string">&quot;@emotion/babel-plugin&quot;</span>
        <span class="token punctuation">]</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token comment">// \u6CE8\u610F: \u5BF9\u4E8E emotion\uFF0C\u9700\u8981\u5355\u72EC\u52A0\u4E0A\u8FD9\u4E2A\u914D\u7F6E</span>
      <span class="token comment">// \u901A\u8FC7 \`@emotion/react\` \u5305\u7F16\u8BD1 emotion \u4E2D\u7684\u7279\u6B8A jsx \u8BED\u6CD5</span>
      jsxImportSource<span class="token operator">:</span> <span class="token string">&quot;@emotion/react&quot;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br></div></div>`,6);function p(t,o){return e}var l=n(a,[["render",p],["__file","4.CSS In JS.html.vue"]]);export{l as default};
