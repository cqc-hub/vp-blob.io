import{_ as n,b as s}from"./app.28445bf9.js";const a={},t=s(`<h1 id="transform" tabindex="-1"><a class="header-anchor" href="#transform" aria-hidden="true">#</a> Transform</h1><p>\u9664\u4E86\u9879\u76EE\u7684\u6253\u5305\u529F\u80FD\u4E4B\u540E\uFF0CEsbuild \u8FD8\u4E13\u95E8\u63D0\u4F9B\u4E86\u5355\u6587\u4EF6\u7F16\u8BD1\u7684\u80FD\u529B\uFF0C\u5373Transform API\uFF0C\u4E0E Build API \u7C7B\u4F3C\uFF0C\u5B83\u4E5F\u5305\u542B\u4E86\u540C\u6B65\u548C\u5F02\u6B65\u7684\u4E24\u4E2A\u65B9\u6CD5\uFF0C\u5206\u522B\u662FtransformSync\u548Ctransform\u3002\u4E0B\u9762\uFF0C\u6211\u4EEC\u5177\u4F53\u4F7F\u7528\u4E0B\u8FD9\u4E9B\u65B9\u6CD5\u3002</p><p>\u9996\u5148, \u5728\u9879\u76EE\u6839\u76EE\u5F55\u4E0B\u65B0\u5EFA <code>transform.js</code>:</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token comment">// transform.js</span>
<span class="token keyword">const</span> <span class="token punctuation">{</span> transform<span class="token punctuation">,</span> transformSync <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token keyword">require</span><span class="token punctuation">(</span><span class="token string">&quot;esbuild&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">runTransform</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// \u7B2C\u4E00\u4E2A\u53C2\u6570\u662F\u4EE3\u7801\u5B57\u7B26\u4E32\uFF0C\u7B2C\u4E8C\u4E2A\u53C2\u6570\u4E3A\u7F16\u8BD1\u914D\u7F6E</span>
  <span class="token keyword">const</span> content <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">transform</span><span class="token punctuation">(</span>
    <span class="token string">&quot;const isNull = (str: string): boolean =&gt; str.length &gt; 0;&quot;</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span>
      sourcemap<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
      loader<span class="token operator">:</span> <span class="token string">&quot;tsx&quot;</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>content<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token function">runTransform</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div><p>\u7ED3\u679C\u5982\u4E0B:</p><div class="language-m ext-m line-numbers-mode"><pre class="language-m"><code>{
  warnings: [],
  code: &#39;const isNull = (str) =&gt; str.length &gt; 0;\\n&#39;,
  map: &#39;{\\n&#39; +
    &#39;  &quot;version&quot;: 3,\\n&#39; +
    &#39;  &quot;sources&quot;: [&quot;&lt;stdin&gt;&quot;],\\n&#39; +
    &#39;  &quot;sourcesContent&quot;: [&quot;const isNull = (str: string): boolean =&gt; str.length &gt; 0;&quot;],\\n&#39; +
    &#39;  &quot;mappings&quot;: &quot;AAAA,MAAM,SAAS,CAAC,QAAyB,IAAI,SAAS;&quot;,\\n&#39; +
    &#39;  &quot;names&quot;: []\\n&#39; +
    &#39;}\\n&#39;
}
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><p>transformSync \u7684\u7528\u6CD5\u7C7B\u4F3C\uFF0C\u6362\u6210\u540C\u6B65\u7684\u8C03\u7528\u65B9\u5F0F\u5373\u53EF\u3002\u4E0D\u8FC7\u540C\u6B65\u63A5\u53E3\u4F1A\u4F7F Esbuild \u4E27\u5931 <code>\u5E76\u53D1\u4EFB\u52A1\u5904\u7406</code>\u7684\u4F18\u52BF, \u8FD9\u91CC\u540C\u6837\u4E0D\u63A8\u8350\u4F7F\u7528</p>`,7);function p(e,o){return t}var c=n(a,[["render",p],["__file","3.Transform API.html.vue"]]);export{c as default};
