import{_ as n,b as s}from"./app.28445bf9.js";const a={},p=s(`<h1 id="build-api-\u9879\u76EE\u6253\u5305" tabindex="-1"><a class="header-anchor" href="#build-api-\u9879\u76EE\u6253\u5305" aria-hidden="true">#</a> Build API \u9879\u76EE\u6253\u5305</h1><p>Esbuild \u5BF9\u5916\u66B4\u9732\u4E86\u4E00\u7CFB\u5217 api, \u4E3B\u8981\u5305\u62EC\u4E24\u7C7B: <code>Build API</code> \u548C <code>Transform API</code>, \u53EF\u4EE5\u5728 nodejs \u4EE3\u7801\u4E2D \u901A\u8FC7\u8C03\u7528 \u8FD9\u4E9B api \u6765\u4F7F\u7528 Esbuild \u7684\u5404\u79CD\u529F\u80FD</p><p><code>Build API</code> \u4E3B\u8981\u7528\u6765\u8FDB\u884C\u9879\u76EE\u6253\u5305, \u5305\u62EC <code>build</code>, <code>buildSync</code>, <code>serve</code> \u4E09\u4E2A\u65B9\u6CD5</p><h2 id="build" tabindex="-1"><a class="header-anchor" href="#build" aria-hidden="true">#</a> build</h2><p>\u6211\u4EEC\u5148\u8BD5\u8BD5 <code>build</code> \u65B9\u6CD5, \u4F60\u53EF\u4EE5\u5728\u9879\u76EE\u6839\u76EE\u5F55\u65B0\u5EFA <code>build.js</code> \u6587\u4EF6:</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">const</span> <span class="token punctuation">{</span> build<span class="token punctuation">,</span> buildSync<span class="token punctuation">,</span> serve <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token keyword">require</span><span class="token punctuation">(</span><span class="token string">&quot;esbuild&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">runBuild</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// \u5F02\u6B65\u65B9\u6CD5\uFF0C\u8FD4\u56DE\u4E00\u4E2A Promise</span>
  <span class="token keyword">const</span> result <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token comment">// ----  \u5982\u4E0B\u662F\u4E00\u4E9B\u5E38\u89C1\u7684\u914D\u7F6E  ---</span>
    <span class="token comment">// \u5F53\u524D\u9879\u76EE\u6839\u76EE\u5F55</span>
    absWorkingDir<span class="token operator">:</span> process<span class="token punctuation">.</span><span class="token function">cwd</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token comment">// \u5165\u53E3\u6587\u4EF6\u5217\u8868\uFF0C\u4E3A\u4E00\u4E2A\u6570\u7EC4</span>
    entryPoints<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;./src/index.jsx&quot;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token comment">// \u6253\u5305\u4EA7\u7269\u76EE\u5F55</span>
    outdir<span class="token operator">:</span> <span class="token string">&quot;dist&quot;</span><span class="token punctuation">,</span>
    <span class="token comment">// \u662F\u5426\u9700\u8981\u6253\u5305\uFF0C\u4E00\u822C\u8BBE\u4E3A true</span>
    bundle<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token comment">// \u6A21\u5757\u683C\u5F0F\uFF0C\u5305\u62EC\`esm\`\u3001\`commonjs\`\u548C\`iife\`</span>
    format<span class="token operator">:</span> <span class="token string">&quot;esm&quot;</span><span class="token punctuation">,</span>
    <span class="token comment">// \u9700\u8981\u6392\u9664\u6253\u5305\u7684\u4F9D\u8D56\u5217\u8868</span>
    external<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token comment">// \u662F\u5426\u5F00\u542F\u81EA\u52A8\u62C6\u5305</span>
    splitting<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token comment">// \u662F\u5426\u751F\u6210 SourceMap \u6587\u4EF6</span>
    sourcemap<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token comment">// \u662F\u5426\u751F\u6210\u6253\u5305\u7684\u5143\u4FE1\u606F\u6587\u4EF6</span>
    metafile<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token comment">// \u662F\u5426\u8FDB\u884C\u4EE3\u7801\u538B\u7F29</span>
    minify<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
    <span class="token comment">// \u662F\u5426\u5F00\u542F watch \u6A21\u5F0F\uFF0C\u5728 watch \u6A21\u5F0F\u4E0B\u4EE3\u7801\u53D8\u52A8\u5219\u4F1A\u89E6\u53D1\u91CD\u65B0\u6253\u5305</span>
    watch<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
    <span class="token comment">// \u662F\u5426\u5C06\u4EA7\u7269\u5199\u5165\u78C1\u76D8</span>
    write<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token comment">// Esbuild \u5185\u7F6E\u4E86\u4E00\u7CFB\u5217\u7684 loader\uFF0C\u5305\u62EC base64\u3001binary\u3001css\u3001dataurl\u3001file\u3001js(x)\u3001ts(x)\u3001text\u3001json</span>
    <span class="token comment">// \u9488\u5BF9\u4E00\u4E9B\u7279\u6B8A\u7684\u6587\u4EF6\uFF0C\u8C03\u7528\u4E0D\u540C\u7684 loader \u8FDB\u884C\u52A0\u8F7D</span>
    loader<span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token string-property property">&#39;.png&#39;</span><span class="token operator">:</span> <span class="token string">&#39;base64&#39;</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>result<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token function">runBuild</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br></div></div><p>\u7136\u540E\u547D\u4EE4\u884C\u6267\u884C <code>node build.js</code> (\u6700\u65B0\u7248\u672C esbuild \u53EF\u80FD\u6709\u6539\u52A8, \u5148\u6307\u5B9A esbuild@0.16.17)</p><p>\u7136\u540E\u4F60\u4F1A\u53D1\u73B0\u63A7\u5236\u53F0\u6253\u5370\u4E86\u5982\u4E0B\u4FE1\u606F</p><div class="language-m ext-m line-numbers-mode"><pre class="language-m"><code>chaoqincai@cqc vite-esbuild % node ./build.js
{
  errors: [],
  warnings: [],
  metafile: {
    inputs: {
      &#39;node_modules/.pnpm/react@18.2.0/node_modules/react/cjs/react.development.js&#39;: [Object],
      &#39;node_modules/.pnpm/react@18.2.0/node_modules/react/index.js&#39;: [Object],
      &#39;node_modules/.pnpm/react-dom@18.2.0_react@18.2.0/node_modules/react-dom/cjs/react-dom-server-legacy.browser.development.js&#39;: [Object],
      &#39;node_modules/.pnpm/react-dom@18.2.0_react@18.2.0/node_modules/react-dom/cjs/react-dom-server.browser.development.js&#39;: [Object],
      &#39;node_modules/.pnpm/react-dom@18.2.0_react@18.2.0/node_modules/react-dom/server.browser.js&#39;: [Object],
      &#39;src/index.jsx&#39;: [Object]
    },
    outputs: { &#39;dist/index.js.map&#39;: [Object], &#39;dist/index.js&#39;: [Object] }
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div><p>\u4EE5\u4E0A\u5C31\u662F Esbuild \u6253\u5305\u7684\u5143\u4FE1\u606F, \u8FD9\u5BF9\u6211\u4EEC\u7F16\u5199\u63D2\u4EF6\u6269\u5C55 Esbuild \u80FD\u529B\u975E\u5E38\u6709\u7528.</p><p>\u5728\u770B dist \u76EE\u5F55, \u53D1\u73B0\u6253\u5305\u4EA7\u7269\u548C\u76F8\u5E94\u7684 SourceMap \u6587\u4EF6\u4E5F\u5DF2\u7ECF\u6210\u529F\u5199\u5165\u78C1\u76D8</p><p><img src="https://phsdevoss.eheren.com/pcloud/phs3.0/test/Snipaste_2023-04-10_09-54-13.jpg" alt="dist"></p><p>\u5176\u5B9E <code>buildSync</code> \u65B9\u6CD5\u7684\u4F7F\u7528\u51E0\u4E4E\u76F8\u540C:</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">function</span> <span class="token function">runBuild</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// \u540C\u6B65\u65B9\u6CD5</span>
  <span class="token keyword">const</span> result <span class="token operator">=</span> <span class="token function">buildSync</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token comment">// \u7701\u7565\u4E00\u7CFB\u5217\u7684\u914D\u7F6E</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>result<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token function">runBuild</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><p>\u4F46\u662F\u4E0D\u592A\u63A8\u8350\u4F7F\u7528 <code>buildSync</code> \u8FD9\u4E2A\u540C\u6B65\u7684\u63A5\u53E3, \u5B83\u4F1A\u5BFC\u81F4\u4E24\u65B9\u9762\u4E0D\u826F\u540E\u679C:</p><ul><li><p>\u4E00\u65B9\u9762, \u5BB9\u6613\u4F7F Esbuild \u5728\u5F53\u524D\u7EBF\u7A0B\u963B\u585E, \u4E27\u5931 <code>\u5E76\u53D1\u4EFB\u52A1\u5904\u7406</code>\u7684\u4F18\u52BF.</p></li><li><p>\u53E6\u4E00\u65B9\u9762, Esbuild \u4E2D\u6240\u6709\u63D2\u4EF6\u90FD\u4E0D\u80FD\u4F7F\u7528\u5F02\u6B65\u64CD\u4F5C, \u8FD9\u7ED9 <code>\u63D2\u4EF6\u5F00\u53D1\u589E\u52A0\u4E86\u9650\u5236</code></p></li></ul><p>\u56E0\u6B64\u66F4\u63A8\u8350\u4F7F\u7528 <code>build</code> \u8FD9\u4E2A\u5F02\u6B65api, \u4ED6\u53EF\u4EE5\u5F88\u597D\u5730\u907F\u514D\u4E0A\u8FF0\u95EE\u9898.</p>`,17);function e(t,c){return p}var l=n(a,[["render",e],["__file","1.Build API.html.vue"]]);export{l as default};
