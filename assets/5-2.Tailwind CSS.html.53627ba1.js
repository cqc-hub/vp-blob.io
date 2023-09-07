import{_ as s,b as n}from"./app.28445bf9.js";const a={},p=n(`<h1 id="tailwind-css" tabindex="-1"><a class="header-anchor" href="#tailwind-css" aria-hidden="true">#</a> Tailwind CSS</h1><p>\u4E3A\u4E86\u907F\u514D\u548C\u4E4B\u524D\u7684 Windi CSS \u6DF7\u6DC6\uFF0C\u8FD9\u91CC\u6700\u597D\u65B0\u8D77\u4E00\u4E2A Vite \u9879\u76EE\u3002</p><h2 id="\u5B89\u88C5" tabindex="-1"><a class="header-anchor" href="#\u5B89\u88C5" aria-hidden="true">#</a> \u5B89\u88C5</h2><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code>pnpm install <span class="token operator">-</span><span class="token constant">D</span> tailwindcss postcss autoprefixer
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>\u7136\u540E\u65B0\u5EFA\u4E24\u4E2A\u914D\u7F6E\u6587\u4EF6<code>tailwind.config.js</code>\u548C<code>postcss.config.js</code>:</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token comment">// tailwind.config.js</span>
module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  content<span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token string">&quot;./index.html&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;./src/**/*.{vue,js,ts,jsx,tsx}&quot;</span><span class="token punctuation">,</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
  theme<span class="token operator">:</span> <span class="token punctuation">{</span>
    extend<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  plugins<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>

<span class="token comment">// postcss.config.js</span>
<span class="token comment">// \u4ECE\u4E2D\u4F60\u53EF\u4EE5\u770B\u5230\uFF0CTailwind CSS \u7684\u7F16\u8BD1\u80FD\u529B\u662F\u901A\u8FC7 PostCSS \u63D2\u4EF6\u5B9E\u73B0\u7684</span>
<span class="token comment">// \u800C Vite \u672C\u8EAB\u5185\u7F6E\u4E86 PostCSS\uFF0C\u56E0\u6B64\u53EF\u4EE5\u901A\u8FC7 PostCSS \u914D\u7F6E\u63A5\u5165 Tailwind CSS</span>
<span class="token comment">// \u6CE8\u610F: Vite \u914D\u7F6E\u6587\u4EF6\u4E2D\u5982\u679C\u6709 PostCSS \u914D\u7F6E\u7684\u60C5\u51B5\u4E0B\u4F1A\u8986\u76D6\u6389 post.config.js \u7684\u5185\u5BB9!</span>
module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  plugins<span class="token operator">:</span> <span class="token punctuation">{</span>
    tailwindcss<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
    autoprefixer<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br></div></div><p>\u63A5\u7740\u5728\u9879\u76EE\u7684\u5165\u53E3 CSS \u4E2D\u5F15\u5165\u5FC5\u8981\u7684\u6837\u677F\u4EE3\u7801:</p><div class="language-css ext-css line-numbers-mode"><pre class="language-css"><code><span class="token atrule"><span class="token rule">@tailwind</span> base<span class="token punctuation">;</span></span>
<span class="token atrule"><span class="token rule">@tailwind</span> components<span class="token punctuation">;</span></span>
<span class="token atrule"><span class="token rule">@tailwind</span> utilities<span class="token punctuation">;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>\u73B0\u5728\uFF0C\u4F60\u5C31\u53EF\u4EE5\u5728\u9879\u76EE\u4E2D\u5B89\u5FC3\u5730\u4F7F\u7528 Tailwind \u6837\u5F0F\u4E86\uFF0C\u5982\u4E0B\u6240\u793A:</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token comment">// App.tsx</span>
<span class="token keyword">import</span> logo <span class="token keyword">from</span> <span class="token string">&quot;./logo.svg&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token string">&quot;./App.css&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">App</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token punctuation">(</span>
    <span class="token operator">&lt;</span>div<span class="token operator">&gt;</span>
      <span class="token operator">&lt;</span>header className<span class="token operator">=</span><span class="token string">&quot;App-header&quot;</span><span class="token operator">&gt;</span>
        <span class="token operator">&lt;</span>img src<span class="token operator">=</span><span class="token punctuation">{</span>logo<span class="token punctuation">}</span> className<span class="token operator">=</span><span class="token string">&quot;w-20&quot;</span> alt<span class="token operator">=</span><span class="token string">&quot;logo&quot;</span> <span class="token operator">/</span><span class="token operator">&gt;</span>
        <span class="token operator">&lt;</span>p className<span class="token operator">=</span><span class="token string">&quot;bg-red-400&quot;</span><span class="token operator">&gt;</span>Hello Vite <span class="token operator">+</span> React<span class="token operator">!</span><span class="token operator">&lt;</span><span class="token operator">/</span>p<span class="token operator">&gt;</span>
      <span class="token operator">&lt;</span><span class="token operator">/</span>header<span class="token operator">&gt;</span>
    <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> App<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div>`,10);function e(t,o){return p}var c=s(a,[["render",e],["__file","5-2.Tailwind CSS.html.vue"]]);export{c as default};
