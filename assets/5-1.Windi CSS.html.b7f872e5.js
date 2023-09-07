import{_ as t,r as p,o as e,a as o,d as n,e as c,F as l,f as s,b as i}from"./app.28445bf9.js";const u={},r=n("h1",{id:"css-\u539F\u5B50\u5316\u6846\u67B6",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#css-\u539F\u5B50\u5316\u6846\u67B6","aria-hidden":"true"},"#"),s(" CSS \u539F\u5B50\u5316\u6846\u67B6")],-1),d=n("p",null,[s("CSS \u539F\u5B50\u5316\u6846\u67B6\u4E3B\u8981\u5305\u62EC"),n("code",null,"Tailwind CSS"),s(" \u548C "),n("code",null,"Windi CSS"),s("\u3002Windi CSS \u4F5C\u4E3A\u524D\u8005\u7684\u66FF\u6362\u65B9\u6848\uFF0C\u5B9E\u73B0\u4E86\u6309\u9700\u751F\u6210 CSS \u7C7B\u540D\u7684\u529F\u80FD\uFF0C\u5F00\u53D1\u73AF\u5883\u4E0B\u7684 CSS \u4EA7\u7269\u4F53\u79EF\u5927\u5927\u51CF\u5C11\uFF0C\u901F\u5EA6\u4E0A\u6BD4Tailwind CSS v2\u5FEB 20~100 \u500D\uFF01\u5F53\u7136\uFF0CTailwind CSS \u5728 v3 \u7248\u672C\u4E5F\u5F15\u5165 JIT(\u5373\u65F6\u7F16\u8BD1) \u7684\u529F\u80FD\uFF0C\u89E3\u51B3\u4E86\u5F00\u53D1\u73AF\u5883\u4E0B CSS \u4EA7\u7269\u4F53\u79EF\u5E9E\u5927\u7684\u95EE\u9898\u3002\u63A5\u4E0B\u6765\u6211\u4EEC\u5C06\u8FD9\u4E24\u4E2A\u65B9\u6848\u5206\u522B\u63A5\u5165\u5230 Vite \u4E2D\uFF0C\u5728\u5B9E\u9645\u7684\u9879\u76EE\u4E2D\u4F60\u53EA\u9700\u8981\u4F7F\u7528\u5176\u4E2D\u4E00\u79CD\u5C31\u53EF\u4EE5\u4E86\u3002\u6211\u4E2A\u4EBA\u6BD4\u8F83\u559C\u6B22 Windi CSS \u672C\u8EAB\u7684"),n("code",null,"attributify"),s(","),n("code",null,"shortcuts"),s("\u7B49\u72EC\u6709\u7684\u7279\u6027\uFF0C\u56E0\u6B64\u9996\u5148\u4ECE windicss \u5F00\u59CB\u8BF4\u8D77\u3002")],-1),k={id:"windi-css-\u63A5\u5165",tabindex:"-1"},b=n("a",{class:"header-anchor",href:"#windi-css-\u63A5\u5165","aria-hidden":"true"},"#",-1),m=s(),g={href:"https://windicss.org/utilities/general/colors.html",target:"_blank",rel:"noopener noreferrer"},h=s("Windi CSS"),v=s(" \u63A5\u5165"),f=i(`<p>\u9996\u5148\u5B89\u88C5 <code>windicss</code> \u5373\u5BF9\u5E94\u7684 vite \u63D2\u4EF6</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code>pnpm i windicss vite<span class="token operator">-</span>plugin<span class="token operator">-</span>windicss <span class="token operator">-</span><span class="token constant">D</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>\u7136\u540E\u6211\u4EEC\u5728\u914D\u7F6E\u6587\u4EF6\u4E2D\u6765\u4F7F\u7528\u5B83</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token comment">// vite.config.ts</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> defineConfig <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;vite&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> vue <span class="token keyword">from</span> <span class="token string">&quot;@vitejs/plugin-vue&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> windi <span class="token keyword">from</span> <span class="token string">&quot;vite-plugin-windicss&quot;</span><span class="token punctuation">;</span>


<span class="token comment">// https://vitejs.dev/config/</span>
<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineConfig</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  plugins<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token function">vue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token function">windi</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">,</span>

<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><p>\u63A5\u7740\u8981\u6CE8\u610F\u53BB <code>src/main.ts</code> \u4E2D\u5F15\u5165\u4E00\u4E2A\u5FC5\u9700\u7684 import \u8BED\u53E5</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token comment">// src/main.ts</span>

<span class="token comment">// \u7528\u6765\u6CE8\u5165 Windi CSS \u6240\u9700\u7684\u6837\u5F0F\uFF0C\u4E00\u5B9A\u8981\u52A0\u4E0A\uFF01</span>
<span class="token keyword">import</span> <span class="token string">&quot;virtual:windi.css&quot;</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>\u8FD9\u6837\u6211\u4EEC\u5C31\u5B8C\u6210\u4E86 Windi CSS \u5728 Vite \u4E2D\u7684\u63A5\u5165\uFF0C\u63A5\u4E0B\u6765\u6211\u4EEC\u5728 HelloWorld \u7EC4\u4EF6\u4E2D\u6765\u6D4B\u8BD5\uFF0C\u7EC4\u4EF6\u4EE3\u7801\u4FEE\u6539\u5982\u4E0B:</p><div class="language-html ext-html line-numbers-mode"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>font-bold text-2xl mb-2<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>Windi CSS \u6D4B\u8BD5<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span><span class="token punctuation">&gt;</span></span>233<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p>\u542F\u52A8\u9879\u76EE\u53EF\u4EE5\u770B\u5230\u5982\u4E0B\u7684\u6548\u679C\uFF0C\u8BF4\u660E\u6837\u5F0F\u5DF2\u7ECF\u6B63\u5E38\u751F\u6548:</p><p><img src="https://phsdevoss.eheren.com/pcloud/phs3.0/test/Snipaste_2023-03-31_15-13-11.jpg" alt="Windi CSS \u6D4B\u8BD5"></p><h3 id="windi-css-\u9AD8\u7EA7\u529F\u80FD" tabindex="-1"><a class="header-anchor" href="#windi-css-\u9AD8\u7EA7\u529F\u80FD" aria-hidden="true">#</a> Windi CSS \u9AD8\u7EA7\u529F\u80FD</h3><p>\u9664\u4E86\u672C\u8EAB\u539F\u5B50\u5316 CSS \u80FD\u529B, Windi CSS \u8FD8\u6709\u4E00\u4E9B\u975E\u5E38\u597D\u7528\u7684\u9AD8\u7EA7\u529F\u80FD: <code>attributify</code> \u548C <code>shortcuts</code></p><p>\u8981\u5F00\u542F\u8FD9\u4E24\u4E2A\u529F\u80FD, \u9700\u8981\u5728\u9879\u76EE\u6839\u76EE\u5F55\u65B0\u5EFA <code>windi.config.ts</code>:</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token comment">// windi.config.ts</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> defineConfig <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;vite-plugin-windicss&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineConfig</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token comment">// \u5F00\u542F attributify</span>
  attributify<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><h4 id="attributify" tabindex="-1"><a class="header-anchor" href="#attributify" aria-hidden="true">#</a> attributify</h4><p>\u9996\u5148\u6211\u4EEC\u6765\u770B <code>attributify</code>, \u7FFB\u8BD1\u8FC7\u6765\u5C31\u662F \u5C5E\u6027\u5316, \u4E5F\u5C31\u662F\u8BF4\u6211\u4EEC\u53EF\u4EE5\u7528 props \u7684\u65B9\u5F0F\u53BB\u5B9A\u4E49\u6837\u5F0F\u719F\u6089:</p><div class="language-html ext-html line-numbers-mode"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span>
    <span class="token attr-name">bg</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>blue-400 hover:blue-500 dark:blue-500 dark:hover:blue-600<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">text</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>sm white<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">font</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>mono light<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">p</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>y-2 x-4<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">border</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>2 rounded blue-200<span class="token punctuation">&quot;</span></span>
  <span class="token punctuation">&gt;</span></span>
    Windi CSS attributify \u6D4B\u8BD5
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><p>\u8FD9\u6837\u7684\u5F00\u53D1\u65B9\u5F0F\u4E0D\u4EC5\u7701\u53BB\u4E86\u7E41\u7410\u7684 class \u5185\u5BB9, \u8FD8\u52A0\u5F3A\u4E86\u8BED\u4E49\u5316, \u8BA9\u4EE3\u7801\u66F4\u5BB9\u6613\u7EF4\u62A4, \u5927\u5927\u63D0\u5347\u4E86\u5F00\u53D1\u4F53\u9A8C.</p><p>\u4E0D\u8FC7\u4F7F\u7528 <code>attributify</code> \u7684\u65F6\u5019\u9700\u8981\u6CE8\u610F\u7C7B\u578B\u95EE\u9898, \u4F60\u9700\u8981\u6DFB\u52A0 <code>types/shim.d.ts</code> \u6765\u589E\u52A0\u7C7B\u578B\u58F0\u660E, \u4EE5\u9632\u6B62\u7C7B\u578B\u62A5\u9519:</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> AttributifyAttributes <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;windicss/types/jsx&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">declare</span> <span class="token keyword">module</span> <span class="token string">&#39;react&#39;</span> <span class="token punctuation">{</span>
  <span class="token keyword">type</span> <span class="token class-name">HTMLAttributes<span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">&gt;</span></span> <span class="token operator">=</span> AttributifyAttributes<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h4 id="shortcuts" tabindex="-1"><a class="header-anchor" href="#shortcuts" aria-hidden="true">#</a> shortcuts</h4><p><code>shortcuts</code> \u7528\u6765\u5C01\u88C5\u4E00\u7CFB\u5217\u539F\u5B50\u5316\u80FD\u529B, \u5C24\u5176\u662F\u4E00\u4E9B\u5E38\u89C1\u7684\u7C7B\u540D\u96C6\u5408, \u6211\u4EEC\u5728 <code>windo.config.ts</code> \u6765\u914D\u7F6E\u4ED6:</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token comment">//windi.config.ts</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> defineConfig <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;vite-plugin-windicss&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineConfig</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  attributify<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  shortcuts<span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token string-property property">&quot;flex-c&quot;</span><span class="token operator">:</span> <span class="token string">&quot;flex justify-center items-center&quot;</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><p>\u6BD4\u5982\u8FD9\u91CC\u5C01\u88C5\u4E86 <code>flex-c</code> \u7684\u7C7B\u540D, \u63A5\u4E0B\u6765\u6211\u4EEC\u53EF\u4EE5\u5728\u4E1A\u52A1\u4EE3\u7801\u4E2D\u76F4\u63A5\u53BB\u4F7F\u7528\u8FD9\u4E2A\u7C7B\u540D:</p><div class="language-html ext-html line-numbers-mode"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>flex-c<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>Windi CSS shortcuts \u6D4B\u8BD5<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div>`,25);function y(S,w){const a=p("ExternalLinkIcon");return e(),o(l,null,[r,d,n("h2",k,[b,m,n("a",g,[h,c(a)]),v]),f],64)}var q=t(u,[["render",y],["__file","5-1.Windi CSS.html.vue"]]);export{q as default};