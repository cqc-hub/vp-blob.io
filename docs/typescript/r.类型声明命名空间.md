---
sidebar: auto

prev:
  text: r.类型声明命名空间
  link: /typescript/r.类型声明命名空间.html
---

#

这里主要聊 typescript 的实战

## 类型检查指令

在前端世界的许多工具中，其实都提供了**行内注释**的能力，用于支持在某一处特定代码**使用特殊的配置来覆盖全局配置**。 最常见的即是 ESlint、Prettier 提供的禁用检查能力，如 `/* eslint-disable-next-lint */` , `prettier-ignore` 等。

typescript 中同样提供了数个行内注释（我们称为类型指令）， 来进行单行代码或单文件级别的配置能力。 这些指令均以 `// @ts-` 开头：

### ts-ignore 、 ts-expect-error （单行检查）

`ts-ignore` 应该是使用最为广泛的一个类型指令了， 他的作用就是直接禁用掉对下一行代码的类型检查

```typescript
// @ts-ignore
const name: string = 233; // 不会报错
```

基本上所有的类型报错都可以通过这个指令来解决，但由于它本质上是 ignore 而不是 disable， 也就意味着如果下一行代码没有问题， 那使用 ignore 反而是一个错误了。 因此 typescript 随后又引入了一个更严格版本的 ignore， 即 `ts-expect-error`, 它只有在 **下一行代码真的存在错误时** 才能被引用， 否则它会给出一个错误：

```typescript
// @ts-expect-error
const name: string = 599;

// @ts-expect-error 错误使用此指令，报错 (书上说的， 实际上我电脑并没有)
const age: number = 599;
```

在这里第二个 expect-error 指令会给出一个报错：无意义的 expect-error 指令。

> 总结： **在所有地方都不要使用 ts-ignore**， 直接把这个指令打入冷宫封存起来（使用 expect-error 代替）, 对于 ignore 指令， 本来就应当确保**下一行真的存在错误时候**才去使用。

### ts-check 、 ts-nocheck (整个文件)

使用了 ts-nocheck 指令的 ts 文件将不在接受类型检查：

```typescript
// @ts-nocheck  以下代码均不会抛出错误
const name: string = 233;
const age: number = 'cqc';
```

那么 `ts-check` 呢? 这看起来是一个多余的指令， 因为默认 ts 文件不是就会被检查嘛。 但实际上 ，这两个指令还可以用在 js 文件中。 要明白这一点， 首先我们要知道， typescript 并不是只能检查 ts 文件， 对于 js 文件它也可以通过类型推导 与 JSDoc 的方式进行不完全的类型检查。

```javascript
// js 文件
let myAge = 18;

// 使用 JSDoc 标注变量类型
/** @type { string } */
let myName;

class Foo {
 prop = 233;
}

```

在上面代码中， 声明了初始值的 myAge、Foo.prop 都能被推导除其类型， 而无初始值的 myName 也可以通过 JSDoc 标注的方式来显示的标注类型。

但是 js 是弱类型语言， 表现之一即是变量可以**被赋值为与初始值类型不一致的值** ：

```javascript
// js 文件
let myAge = 18;

// 使用 JSDoc 标注变量类型
/** @type { string } */
let myName;

// 不会报错
myAge = '233';
myName = 233;

```

我们的赋值操作在类型层面显然是不成立的， 但是是在 js 文件中， 因此这里并不会有类型报错。 如果希望在 js 文件中也能享受到类型检查， 此时 `ts-check` 指令就可以登场了:

```javascript
// @ts-check

let myAge = 18;

// 使用 JSDoc 标注变量类型
/** @type { string } */
let myName;

class Foo {
 prop = 233;
}

myAge = '233'; // error

// @ts-expect-error
myName = 233;

```

`ts-nocheck` 在 js 文件中的作用和 ts 文件其实也一致， 即禁用掉对当前文件的检查。 如果我们希望开启对所有 js 文件的检查， 而只是忽略掉其中少数呢？ 此时我们在 TSConfig 中启用 `checkJs` 的配置， 来开启**对所有包含的js文件的类型检查**， 然后使用 `ts-nocheck` 来忽略其中少数的js 文件

## 类型声明

在此前我们其实就以及接触了类型声明， 它实际上就是 `declare` 语法:

```typescript
declare var f1: () => void;

declare interface Foo {
 prop: string;
}

declare function foo(input: Foo): Foo;

declare class Foo {}

```

但不能为这些声明变量赋值：

```typescript
// error 不允许在环境上下文中使用初始值
declare let result = foo();

// yes
declare let result: ReturnType<typeof foo>;
```

这些类型声明就像我们在 typescript 中的类型标注一样， 会存放着特定的类型信息， 同时由于它们并不具有实际逻辑， 我们可以很方便的使用类型声明来进行类型兼容性的比较、 工具类型的声明、测试等等。

除了手动书写这些声明文件， 更常见的情况是你的 typescript 代码在编译后生成的声明文件：

```typescript
// 源代码
const handler = (input: string): boolean => input.length > 5;

interface Foo {
  name: string;
  age: number;
}

const foo: Foo = {
  name: 'cqc',
  age: 23
}

class FooCls {
  prop!: string;
}
```

这段代码在编译后会生成一个 `.js` 文件和一个 `.d.ts` 文件， 而后者即是类型声明文件：

```typescript
declare const handler: (input: string) => boolean;

interface Foo {
  name: string;
  age: string;
}

declare const foo: Foo;

declare class FooCls {
  prop: string;
}
```

这样一来， 如果别的文件或是别的项目导入了这段代码， 它们就能从这些类型声明获得对应部分的类型，这也是类型声明的核心作用：**将类型独立于`.js`文件进行存储**. 别人在使用你的代码时候， 就能获得这些额外的类型信息。 同时， 如果你在使用别人没有携带类型声明的 `.js` 文件， 也可以通过类型声明进行类型补全。

## 让类型定义全面覆盖你的项目

在学习下面的内容前， 不妨先想想你是否遇到过这么几个场景？

- 想要使用一个 npm 包， 但他发布的时间太早， 根本没有携带类型定义， 于是你的项目里就出现了这么一处没有被类型覆盖的地方。

- 你想要在代码里导入一些非代码文件， 反正 Webpack 会帮你处理， 但是可恶的 ts 又报错了？

- 这个项目在运行时动态注入了一些全局变量（如 `window.errorReporter`）, 你想要在代码里直接这样访问， 却发现类型又报错了

这些问题都可以通过类型声明来解决， 这也是他的核心能力， **通过额外的类型声明文件， 在核心代码文件以外去提供对类型的进一步补全**。 类型声明文件， 即 `.d.ts` 结尾的文件， 它会自动地被 ts 加载到环境中， 实现对应部分代码的类型补全

声明文件中并不包含实际的代码逻辑， 他做的事情只有一件： **为 typescript 类型检查与推导提供额外的类型信息**。 而使用的语法仍是 typescript 的 declare 关键字， 只不过我们要进一步学习其他打开方式了。

要详细学习声明文件与declare 关键字， 我们不妨先来看看如何解决上面的问题。 首先是五类线定义的 npm 包， 我们可以通过 declare module 的方式提供其类型：

```typescript
import foo from 'pkg';

const res = foo.handler();
```

这里的 pkg 是一个没有类型定义的npm 包（实际并不存在）， 我们来看如何为他添加类型提示.

```typescript
declare module 'pkg' {
  const handler: () => string;
}

```

现在我们的 res 就具有了 string 类型！ `declare module 'pkg'` 会默认导入 `foo` 添加一个具有 handler 的类型， 虽然这里的 `pkg` 根本不存在。 我们也可以在 `declare module` 中使用默认导出:

```typescript
declare module 'pkg1' {
  const handler: () => number;

  export default handler;
}


// ----
import bar from 'pkg1';

bar(); // number
```

> 在 `pkg` 的类型声明中， 你也可以使用 `export const handler: () => string;` 效果是一致的， 但由于对 `pkg1` 我们使用了默认导入， 因此必须要有一个 `export default`

除了为确实类型的模块声明类型以外， 使用类型声明我们还可以为非代码文件， 如图片、css 文件等声明文件。

对于非代码文件， 比如说 markdown 文件， 假设我们希望导入一个 `.md` 文件， 由于其本质 和 npm 包 一样是一条导入语句， 因此我们可以类似地使用 declare module 语法：

```typescript
// declare.d.ts
declare module '*.md' {
  const raw: string;
  export default raw;
}

// ------
import raw from 'xx.md';

const content = raw.charAt(0); // string

```

对于非代码文件， 更常见的其实是 `.css`、`.module.css`, `.png` 这一类， 但基本语法都像相似。

总结一下， `declare module` 通常用于为没有提供类型定义的库进行类型补全， 以及为非代码文件提供基本类型定义。
但实际使用中，如果一个库没有内置类型定义， ts 也会提示你， 是否要安装 `@types/xxx` 这样的包。

## DefinitelyTyped

简单来说， `@types/` 开头的这一类 npm 包均属于 [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped), 它是 ts 维护的， 专门用于为社区存在的**无类型定义的 JavaScript 库**添加类型支持， 常见的又 `@types/react`, `@types/loadsh` 等等。

先来看看 `@types/node` 中 与 `@types/react` 中分别是如何进行类型声明的:

```typescript
// @types/node
declare module 'fs' {
 export function readFileSync(/** 省略 */): Buffer;
}

// @types/react
declare namespace React {
 function useState<S>(): [S, Dispatch<SetStateAction<S>>];
}

```

可以看到 `@types/node` 中仍然使用 `declare module` 的方式为 `fs` 这个内置模块声明了类型， 而 `@types/react` 则使用的是我们没见过的 `declare namespace` (后面介绍).

回到上面的最后一个问题， 如果第三方库并不是通过导出来使用， 而是直接在全局注入了变量， 如 CDN 引入与某些监控买点 sdk 的引入， 我们需要通过 `window.xxx` 的方式访问， 而类型声明很显然并不存在。 此时我们仍然可以通过类型声明， 但不再是通过 `declare module` 了·

## 扩展已有的类型定义

对于全局变量的声明， 还是以window 为例， 实际上 我们如果 Ctrl + 点击代码中的 window， 会发现它已经又类型声明了：

```typescript
declare var window: Window & typeof globalThis;

interface Window {
 // ...
}

```

这行代码来自于 `lib.dom.d.ts` 文件， 它定义了对浏览器文档对象模型的类型声明， 这就是 ts 提供的内置类型， 也是‘出厂自带’的类型检查能力的依据。 类似的， 还有内置的 `lib.es2021.d.ts` 这种文件定义了 ECMAScript 每个版本的类型声明新增或改动等等。

我们要做的， 实际上就是在内置类型声明的基础之上， 在新增一部分属性。 而别忘了， 在 js 中当你访问全局变量时， 是可以直接忽略 `window` 的

```typescript
// 不需要 window.onerror = xxx;
onerror = () => {};
```

反过来， 在类型声明中， 如果我们直接声明一个变量， 那就相当于将他声明在了全局空间中：

```typescript
// 类型声明
declare const errorReporter: (err: any) => void;

// 实际使用
errorReporter('err!');

```

而如果我们就是想将它显示地添加到已有的 `Window` 接口中呢？ 在接口一节中我们其实已经了解到，如果你有多个同名接口， 那么**这些接口实际上是会被合并的**, 这一特性在类型声明中也是如此。 因此， 我们再声明一个 Window 接口即可.

```typescript
interface Window {
  useTracker: (...args: any[]) => Promise<void>;
}

window.useTracker('click!');
```

类似的， 我们也可以扩展来自 `@type/` 包的类型定义:

```typescript
declare module 'fs' {
 const bump: () => string;
}

// ----
import { bump } from 'fs';

bump(); // string

```

总结一下着两个部分， typescript 通过 DefinitelyTyped, 也就是 `@types/` 系列的 npm 包来为无类型定义的 js npm 包提供类型支持， 这些类型定义的 npm 包内部其实就是数个 `.d.ts` 这样的声明文件。

而这些文件主要通过 declare / namespace 的语法进行类型的描述, 我们可以通过项目内额外的声明文件， 来实现为非代码文件的导入， 或者是全局变量添加上类型声明。

## 三斜线指令

对于多个类型声明文件， 如果我们想复用某一个已定义的类型， 就可以使用 三斜线指令， 它**就像是声明文件中的导入语句一样**, 他的作用就是**声明当前的文件 依赖的其他类型声明**， 而这里的”其他类型声明“包括了 ts 内置类型说明（`lib.d.ts`）, 三方库的类型声明以及你自己提供的类型声明文件等。

三斜线的本质就是一个自闭合的 XML 标签， 其语法大致如下：

```typescript
/// <reference path="./other.d.ts" />
/// <reference types="node" />
/// <reference lib="dom" />
```

**需要注意的是， 三斜线指令必须被放置在文件的顶部才能生效**

这里的三条指令作用其实都是声明当前文件所依赖的外部类型声明， 只不过使用的方式不同， 分别使用了 path、types、 lib 这三个不同属性。

- 使用 path 的 reference 指令， 其 path 的属性的值为一个相对路径， 指向你项目内的其他声明文件。 而编译时候， ts 会沿着 path 指定的路径不断深入寻找， 最深的那个没有其他依赖的声明文件会被最先加载。

```typescript
// @types/node 中的示例
/// <reference path="fs.d.ts" />
```

- 使用 types 的 reference 指令， 其types 的值是一个包名， 也就是你想引入的 `@types/` 声明， 如上面的例子中我们实际上是在声明当前文件对 `@types/node` 的依赖。 而如果你的代码文件 (`.ts`) 中声明了对某一个包的类型导入， 那么在编译产生的声明文件（`.d.ts`）中会自动包含引用它的指令。

```typescript
/// <reference types="node" />
```

- 使用 lib 的 reference 指令类似于 types， 只不过这里 lib 导入的是 ts 内置类型声明， 如下面的列子我们声明了对 `lib.dom.d.ts` 的依赖:

```typescript
// vite/client.d.ts
/// <reference  lib="dom" />
```

而如果我们使用 `/// <reference lib="esnext.promise" />` , 那么依赖的就是 `lib.esnext.promise.d.ts` 文件。

这三种指令的目的都是引入当前文件所依赖的其他类型声明， 只不过使用场景不同而已。

## namespace 命名空间

如果说三斜线指令的作用就像导入语句一样， 那么 namespace 就像一个模块文件一样， 将一组强相关的逻辑收拢到一个命名空间内部。

假设一个场景， 我们的项目里需要接入多个平台的支付 SDK， 最开始只有微信支付和支付宝:

```typescript
class WeChatPaySDK {}

class AliPaySDK {}

```

后来又多了美团支付、虚拟货币支付、信用卡支付等等

```typescript
class WeChatPaySDK {}

class AliPaySDK {}

class MeiTuanPaySDK {}

class CreditCarkPaySDK {}

class QQCoinPaySDK {}

```

随着业务的不断发展， 项目中可能需要引入越来越多的支付 SDK， 甚至还有比特币 、以太坊， 此时将这些所有的支付都放在一个文件内未免过于杂乱了。 这些支付方式其实大致可以分成两种： 现实货币于 虚拟货币。 此时我们就可以使用命名空间来区分这两类 SDK：

```typescript
// 注意， 这里是代码是在 .ts 文件中的， 此时它们具有实际逻辑意义的， 不能和类型混作一谈
export namespace RealCurrency {
 export class WeChatPaySDK {}

 export class AliPaySDK {}

 export class MeiTuanPaySDK {}

 export class CreditCardPaySDK {}
}

export namespace VirtualCurrency {
 export class QQCoinPaySDK {}

 export class BitCoinPaySDK {}

 export class ETHPaySDK {}
}

```

而命名空间的使用类似于枚举:

```typescript
const weChatPaySDK = new RealCurrency.WeChatPaySDK();
```

唯一需要注意的是， 命名空间内部实际上就像是一个独立的代码文件，因此其中的变量需要到处以后，才能通过 `RealCurrency.WeChatPaySDK` 这样的形式访问。

**命名空间的内部**还可以再嵌套命名空间， 比如再虚拟货币中再新增区块链货币一类， 此时嵌套的命名空间也需要被导出：

```typescript
export namespace RealCurrency {
 export class WeChatPaySDK {}

 export namespace BlockChainCurrency {
  export class BitCoinPaySDK {}

  export class ETHPaySDK {
    pay() {
      return 'pay success';
     }
  }
 }
}


const ethPaySDK = new RealCurrency.BlockChainCurrency.ETHPaySDK();
ethPaySDK.pay(); // string
```

类似于类型声明中的同名接口合并， 命名空间也可以进行合并， 但需要通过三斜线指令来声明导入。

```typescript
// animal.ts
namespace Animal {
  export namespace ProtectedAnimals {}
}

// dog.ts
/// <reference path="animal.ts" />
namespace Animal {
  export namespace Dog {
    export function bark() {}
  }
}

// corgi.ts
/// <reference path="dog.ts" />
namespace Animal {
  export namespace Dog {
    export namespace Corgi {
      export function corgiBark() {}
    }
  }
}
```

实际使用时需要导入全部的依赖文件：

```typescript
/// <reference path="animal.ts" />
/// <reference path="dog.ts" />
/// <reference path="corgi.ts" />

Animal.Dog.Corgi.corgiBark();
```

除了在  `.ts` 文件中使用以外， namespace 也可以在声明文件中使用， 即 `declare namespace`:

```typescript
declare namespace Animal {
 interface Dog {}

 interface Cat {}
}

declare const dog: Animal.Dog;
declare const cat: Animal.Cat;

```

但如果你在 `@types/` 系列的包下， 想要通过 namespace 进行模块声明， 还需要将其导出, 然后才会加载到对应的模块下。
以 `@types/react` 为例:

```typescript
export = React;
export as namespace React;

declare namespace React {
 const sayHi: () => 'hello';
}

```

首先我们声明了一个 namespace React， 然后使用 `export = React` 将它导出了。 这样我们就能在 react 中导入方法时候， 获得 namespace 内部的类型声明， 如 sayHi

从这一角度来看， `declare namespace` 其实就类似于普通的 `declare` 语法， 只是内部的类型我们不在需要使用 declare 关键字（比如我们上面 React 直接内部 `const sayHi: () => 'hello'`）

而还有一行 `export as namespace React`, 他的作用是在启用了 `--allowUmdGlobalAccess` 配置的情况下， 允许将这个模块作为全局变量使用（也就是不导入直接使用）， 这一特性同样也使用于通过 CDN 资源导入模块时候的变量类型声明

除了这两处 namespace 使用， React 中还利用 namespace 合并特性， 在全局的命名空间中注入了一些类型：

```typescript
// 本地报错的????
declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> { }
  }
}
```

## 扩展

### 通过 JSDoc 在 js 文件中获得类型提示

在上面我们提到了可以在 js 中通过 JSDoc 来标注变量类型， 而既然有了类型标注， 那么自然也能享受到 ts 那样的类型提示了。 但这里我们需要使用更强大一些的 JSDoc 能力： `@type {}` 中使用导入语句

以拥有海量配置项的 webpack 为例:

```javascript
/** @type { import('webpack').Configuration } */
const config = {};

module.exports = config;
```

这个时候你会发现 config 已经可以得到 webpack 的类型提示

类似的， 也可以直接进行导出:

```javascript
module.exports = /** @type { import('webpack').Configuration } */ ({});
```

当然， webpack 本身也支持通过ts文件进行配置， 在使用 ts 配置时候， 一种方式是简单地使用它提供的类型作为一个对象的标注。 而目前更常见的一种方式其实是框架内部提供 `defineConfig` 这样的方法，让你直接获得类型提示， 如 Vite 中的做法:

```typescript
import { defineConfig } from 'vite';

export default defineConfig({});
```
