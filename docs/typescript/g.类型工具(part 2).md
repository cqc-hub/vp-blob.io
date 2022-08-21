---
sidebar: 'auto'
---

#

## 类型查询操作符: 熟悉又陌生的 typeof

typescript 中存在两种功能不同的 `typeof` 操作符，我们最常见的一种是存在 javascript 中,
用于检查类型的 typeof, 它会返回 `string` / `number` / `object` / `undefined` 等值。
而除此之外， typescript 还新增了用于类型查询的 typeof, 即 **Type Query Operator**,
这个 typeof 返回的是 typescript 的类型。

```typescript
const str = 'cqc';
const obj = { name: 'cqc' };

const nullVar = null;
const undefinedVar = undefined;

const func = (input: string) => input.length === 3;

type Str = typeof str; // 'cqc'
type Obj = typeof obj; // { name: string }

type Null = typeof nullVar; // null
type Undefined = typeof undefinedVar; // undefined

type Func = typeof func; // (input: string) => boolean
```

你不仅可以直接在类型标注中使用 typeof，还能在工具类型中使用 typeof;

```typescript
const func = (input: string) => input.length;

const func2: typeof func = (input1: string) => input1.length; // 入参名字可以变
```

绝大多数情况下， typeof 返回的类型就是你把鼠标悬浮在变量名上的自动推导出的类型，
并且是**最窄的推导程度（即到字面量类型级别）**。

你也不用担心混用了这两种 typeof， 在逻辑代码中使用的 typeof 一定是 javascript 中的 typeof，
而类型代码(类型标注、类型别名中等) 中的一定是类型查询的 typeof。同时， 为了更好的避免这种情况，
也就是隔离类型层和逻辑层，类型查询 typeof 操作符后面是不允许 使用表达式的：

```typescript
const inputValid = (input: string) => input.length;

let isValid: typeof inputValid('cqc'); // 不允许
```

## 类型守卫

typescript 中提供了非常强大的类型推导能力，它会随着你的代码逻辑而尝试不断的收窄类型，
这一能力称之为**类型控制流分析** (也简单理解为类型推导).

这么说有的抽象，我们可以想象有一条河流，他从上而下流过你的程序，随着代码的分支分出一条条
支流，在最后重新合并为一个完整的河流. 在河流流动的过程中，如果遇到了有特点条件才会进入支到
(比如 if else 语句, switch case 等), 那这条支流流过这里就会收集对应的信息，等到最后合并时，
它们就会嚷着交流: "我刚刚流过了一个只有字符串类型才能进入的代码分支!" "我刚刚流进了一个只有函数
类型才能进入的代码分支!" ... 就这样，它会把整个程序的类型信息都收集完毕

```typescript
const foo = (input: string | number) => {
  if (typeof input === 'string') {
    ...
  }

  if (typeof input === 'number') {
    ...
  }

  ...
}
```

在前面说 never 类型的时候就讲到了， 在类型控制流分析下, 每流过一个 if 分支，
后续联合类型的分支就少了一个, 因为这个类型已经在这个分支处理了， 不会进入下一个分支

```typescript
declare const strOrNumOrBool: string | number | boolean;

if (typeof strOrNumOrBool === 'string') {
  // string
} else if(typeof strOrNumOrBool === 'number') {
  // number
} else if(typeof strOrNumOrBool === 'boolean') {
  // boolean
} else {
  const _exitTypeCheck: never = strOrNumOrBool;
  throw new Error('unknown type');
}
```

在这里， 我们实际上通过 if 条件中的表达式进行了类型保护， 即告知了流过这里的分析程序
每个 if 分支代码块中是什么类型。
这即是编程语言的类型能力中最重要的一部分： **与实际逻辑紧密关联的类型**。 我们从逻辑中进行
类型的推导, 在返过来让逻辑为类型保驾护航。

前面说过， 类型控制流分析就像一条河流一样流过，那 if 中的条件表达式要是被提取出来了怎么办？

```typescript
const isString = (input: unknown): boolean => typeof input === 'string';

const foo = (input: string | number) => {
  if (isString(input)) {
    input // string | number （类型并没有被收窄）

    // 类型 'string | number' 上不存在属性 charAt
    input.charAt(0);
  }
}
```

奇怪， 我们只是把逻辑提取到了外面而已， 如果 isString 返回了 true， 那 input 也一定是 string 了呀?

想象类型控制流分析这条河流， 刚流进 `if (isString(input))` 就戛然而止了. 因为 isString 这个函数在
另外一个地方， 内部的函数判断逻辑并不在 foo 中。 这里的类型控制分析流做不到跨函数上下文来进行类型的信息收集
(但别的类型语言中可能是支持的).

实际上，将判断逻辑分离出来提取到外部函数中进行复用是非常常见的。为了解决这一类型控制流分析的能力不足，
typescript 引入了 **is 关键字** 来显示的提供类型信息。

```typescript
const isString = (input: unknown): input is string => typeof input === 'string';

const foo = (input: string | number) => {
  if (isString(input)) {
    input // string  (input 类型被收窄了)
  } else {
    input // number
  }
}
```

isString 函数被称为类型守卫，在他的返回值中， 我们不再使用 boolean 作为类型标注，而是使用了 <aMark>input is string</aMark> ，
这个奇怪的搭配，拆开来看它是这样的:

- input: 函数中的某个参数
- `is string`: 即 **is关键字 + 预期类型**, 如果这个函数返回了 true， 那么 is 关键字前面这个入参的类型，
就会被**调用这个类型守卫的调用方 后续的类型控制分析流收集到**.

需要注意的是， 类型守卫函数中并不会对判断类型和实际类型的关联做检查:

```typescript
const isString = (input: unknown): input is number => typeof input === 'string';

const foo = (input: string | number) => {
  if (isString(input)) {
    input // 这里被推导成了 number， 类型守卫函数不会检查实际逻辑
  }
}
```

从这个角度来看， 类型守卫 **有些类似于 类型断言, 但类型守卫更宽松， 也更信任你一些, 你指定什么类型， 它就是什么类型**,
除了简单实用原始类型以外，我们还可以在类型守卫中使用对象类型、联合类型等。比如开发常用的两个守卫:

```typescript
type Falsy = false | '' | 0 | null | undefined;

const isFalsy = (val: unknown): val is Falsy => !isFalsy;

// 不包括 symbol、 bigint
type Primitive = string | number | boolean | undefined;

const isPrimitive = (val: unknown): val is Primitive => ['string', 'number', 'boolean', 'undefined'].includes(typeof val);
```

除了 typeof 以外， 我们还可以通过许多类似的方式进行类型保护，只要它能在联合类型的类型成员中起到筛选作用.

## 类型断言守卫

除了使用 is 关键字的类型守卫以外， 其实还存在使用 `asserts` 关键字的类型断言守卫,
如果你使用过测试用例或者 nodejs 的 assert 模块， 那对断言这个概念应该不陌生:

```typescript
import assert from 'assert';

let name: any = 'cqc';

assert(typeof name === 'number');

// number 类型
name.toFixed(); // 编译正常， 运行时候报错
```

上面这段代码在运行时候会抛出错误，因为 assert 接受到的表达式的执行结果是 false。
这其实也类似类型守卫的场景: 如果断言**不成立**， 比如这里意味着值不为 number，
那么断言下方的代码就执行不到（dead code）, 如果断言通过了， 不管最开始是什么类型，
断言过的代码中的类型**一定是符合断言的类型**, 比如在这里就是 number.

但**断言守卫和类型守卫最不同的在于：  在判断条件不通过时候， 断言守卫需要抛出一个错误**,
**类型守卫只需要剔除预期的类型**。 这里抛出的错误可能让你想到了 never 类型，但实际上情况要
复杂一些， 断言守卫并不会始终都抛出错误，所以他的返回值不能简单点使用 never，为此， typescript 3.7
版本专门引入了 asserts 关键字 来进行断言场景下的类型守卫, 比如前面的 assert 方法的签名可以是这样的：

```typescript
  // 只能使用标准函数写法， 不然使用时候报错（why？）
  // const assert = (condition: any, message: string): asserts condition => {
  //   if (!condition) {
  //     throw new Error(message)
  //   }
  // }

  function assert(condition: any, message: string): asserts condition {
    if (!condition) {
      throw new Error(message)
    }
  }


  const handler = (input: any) => {
    assert(typeof input === 'string');

    input; // string
  }
```

这里使用 <aMark>asserts condition</aMark> , 而 condition 来自于实际逻辑! 这也意味着，
我们将 **condition 这一逻辑层面的代码， 作为了类型层面的判断依据**. 相当于在返回值类型中使用了
一个逻辑表达式进行了类型标注。

举例来说， 对于 `assert(typeof input === 'string')` 这么一个断言, 如果函数成功返回，说明其
后续代码中 condition 均成立，也就是 input 神奇地变为了 string 这一类型。

这里的condition 甚至可以结合 is 关键字进一步提供类型守卫能力：

```typescript
function assert(input: any) asserts input is string {
  if (typeof input !== 'string') {
    throw new Error('input is not a string!')
  }
}

const handler = (input: any) => {
  assert(input);

  input; // string
}
```

在上面这种情况下， 你无需再为断言守卫传入一个表达式, 而是将这个判断用的表达式放入断言守卫内部， 来获取更独立的代码逻辑。

## 基于 in 与 instanceof 的类型保护

`in` 操作符并不是 typescript 中新增的概念， 而是 javascript 中已有的部分，他可以通过
`key in object` 的方式来判断 key 是否存在 object 或其原型链上.

既然可以起到区分作用， 在 typescript 中自然可以通过它来进行类型保护。

```typescript
interface Foo {
  foo: string;
  fooOnly: boolean;
  shared: number;
}

interface Bar {
  bar: string;
  barOnly: boolean;
  shared: number;
}

const handler = (input: Foo | Bar) => {
  if ('foo' in input) {
    input; // Foo  (自动推导类型)
  } else {
    input; // Bar
  }
}

```

这里 foo / bar, fooOnly / barOnly, shared 属性们都有着不同意义，我们可以使用联合类型的某个类型成员中独有(具有辨识度)的属性来
区分 input 的联合类型。 但是， 如果用不具有辨识度的属性来判断的话， 那么 上面的例子中， if 内被推导的类型仍然是`Foo | Bar`, else 中则是 `never`。

这个可辨识属性可以是结构层面的, 比如结构 A 的 prop 是数组， 结构 B 的 prop 是对象, 或者结构 A 存在 prop 属性，
结构 B 不存在。

它甚至可以是同属性但字面量不同的差异：

```typescript
interface Foo {
  kind: 'foo';
  fooOnly: boolean;
  diffKey: string;
}

interface Bar {
  kind: 'bar';
  barOnly: boolean;
  diffKey: number;
}


const handler = (input: Foo | Bar) => {
  if (input.kind === 'foo') {
    input; // Foo
  }

  if (typeof input.diffKey === 'string') {
    input; // Foo | Bar (使用 typeof 不起作用 无法区分)
  }
}
```

如上面的例子， 对于同名不同值的属性， 需要使用字面量类型才能自动推导正确的属性（不能使用 typeof 区分）

除此之外， javascript 还存在一个 功能类似于 typeof、in 的操作符： `instanceof`, 它判断的是原型级别的东西，
如 `foo instanceof Base` 会 沿着 foo 的原型链来查找 `Base.prototype` 是否存在其上. 当然，在 es6 无处不在
的今天， 我们可以简单的认为这是判断 foo 是否是 Base 类的实例. 同样的 instanceof 可以进行类型保护：

```typescript
class FooBase {

}

class BarBase {

}

class Foo extends FooBase {
  fooOnly() {}
}

class Bar extends BarBase {
  barOnly() {}
}

const handler = (input: Foo | Bar) => {
  if (input instanceof Foo) {
    input; // Foo
  } else {
    input; // Bar
  }
}
```

## 扩展

### 接口的合并

在将交叉类型的时候， 你可能注意到了, 接口和类型别名都能直接使用交叉类型 `&`, 但除此之外，
接口还能使用 继承 进行合并，在继承时候 子接口可以声明同名类型， 但不能覆盖父接口中的此属性，
**子接口中的类型需要能兼容(extends)父接口中的类型**。

```typescript
interface Foo1 {
  info: {
    name: string;
  }

  onlyFoo1: boolean;
}

// Foo2 中包括了 Foo1 中的所有声明
interface Foo2 extends Foo1 {
  // 声明同名属性需要兼容父
  info: {
    name: string;
    age: number;
  };

  // 拓展新属性
  onlyFoo2: boolean;

  // 报错， 不能将 number 分配给 boolean
  onlyFoo1: number;
}


// 交叉类型 会合并属性
/**
 * Foo3 = {
 *  info: { age: number; name: string; };
 *  onlyFoo1: boolean;
 * }
 */
type Foo3 = Foo1 & {
  info: { age: number; };
}
```

这也是接口 和类型别名的重要差异之一 （extends）.

如果是接口 和 类型别名之间的合并呢？ 其实规则是一样的。

```typescript
type Base = {
  name: string;
}

interface IDerived extends Base {
  age: number;

  // error  不能 将 number 分配给 string
  name: number;
}


interface IBase {
  name: string;
}


type Derived = IBase & {
  name: number;
  age: number;
}

// Derived:
// {
//   name: never;
//   age: number;
// }

```

### 更强大的可辨识联合类型分析

类型控制流分析其实是在不停增强的，比如下面的例子在 4.6 以前版本中是报错的：

```typescript
type Args = ['a', string] | ['b', number];
type Func = (...args: Args) => void;

const func: Func = (kind, payload) => {
  if (kind === 'a') {
    payload; // 4.6 以前是 string | number, 4.6以后就是 string;
  }
}
```
