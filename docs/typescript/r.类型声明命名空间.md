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
