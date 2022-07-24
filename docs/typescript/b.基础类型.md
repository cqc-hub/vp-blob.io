---
sidebar: auto
sidebarDepth: 2
---

#

## 基础类型

- javascript 的类型
  - number / string / boolean / null / undefined
  - es6、 es11 中又分别更新了 symbol / bigint

```typescript
const name: string = 'cqc';
const age: number = 25;
const male: boolean = true;
const undef: undefined = undefined;
const nul: null = null;
const obj: object = { name, age, male };
const bigintVar1: bigint = 9007199254740991n;
const bigintVar2: bigint = BigInt(9007199254740991);
const symbolVar: symbol = Symbol('unique');
```

### null 与 undefined

- javascript

  - null: 此处有值，但是个空值
  - undefined: 这里没有值

- typescript
  - null、undefined 都是具有具体意义的类型, 这两者在没有开启 <aMark>strictNullChecks</aMark>检查的时候， 会被视作其他类型的子类型， 比如 string 类型 会被认为包含了 null、undefined 类型

```typescript
const tmp1: null = null;
const tmp2: undefined = undefined;

// 仅在关闭 strictNullChecks 时成立 下同
const temp3: string = null;
const temp4: string = undefined;
```

## void

### js

```html
<a href="javascript:void(0)">清除缓存</a>
```

javascript 中 <aMark>void(0)</aMark> 等价于 <aMark>void 0</aMark> (即<aMark>void expression</aMark> 的语法)
void 操作符会执行后面跟着的表达式并返回一个 undefined, 如你可以使用它来执行一个立即执行的函数

```javascript
void (function life() {
  console.log('invoked');
})();
```

能这么做时因为， void 操作符强制将后面的函数声明 转化成了表达式， 因此整体相当于<aMark>void( (function life(){})() )</aMark>.

### ts

ts 中也有 void， 与 js 不同的是，这里的 void 用于描述一个内部没有 return 的语句， 或者没有显示 return 一个值的函数的返回值, 如:

```javascript
function fn1() {}
function fn2() return
function fn3() return undefined
```

fn1 和 fn2 返回值类型都被隐式推导为 void， 只有显示返回 undefined 的 fn3 才被推导为 undefined, 但实际执行后 fn1 fn2 fn3 返回值均是 undefined,

> 虽然 fn3 的返回值类型会被推导为 undefined， 但是仍然可以使用 void 类型进行标注， 可以理解为 void 表示一个空类型, 而 null、undefined 都是一个具有意义的实际类型（注意他们在 javascript 中的意义区别）。而 undefined ｜ null 能够被赋值给 void （关闭 strictNullChecks 配置情况下成立）

## 数组的类型标注

typescript 中有两种方式来声明一个数组类型

```typescript
const arr1: string[] = [];
const arr2: Array<string> = [];
```

他们完全等价， 一般以前者为主。 数组是日常开发大量使用的数据结构， 在某些情况下， 使用 **元祖(Tuple)** 来代替数组要更加稳妥
比如一个数组中只存放固定长度的变量， 但我们进行了超出长度的访问

```typescript
const arr3: string[] = ['c', 'q', 'c'];
console.log(arr3[666]);
```

这种情况是不符合预期的， 因为可以确定这个数组中只有三个成员， 这时候可以使用元祖类型进行类型标注

```typescript
const arr4: [string, string, string] = ['c', 'q', 'c'];

console.log(arr4[666]); // error

// 可以声明不同类型的成员
const arr5: [string, boolean, number] = ['hello', false, 233];

// 标记可选的类型成员
const arr6: [string, string?, string?] = ['hi', , ,];
const arr7: [string, string?, string?] = ['hi'];
```

对于可选标记的成员， 在 <aMark>--strictNullChecks</aMark> 配置下会被视为
一个 <aMark>string | undefined</aMark> 的类型。 此时元祖的长度属性也会发生变化， 如上面的 arr6 其
长度类型为 <aMark>1 | 2 | 3</aMark>

```typescript
type TupleLength = typeof arr6.length; // 1|2|3
```

也就是说， 这个元祖的长度可能是 1、2、3

### 元祖别名

如果觉着元祖可读性不好 :joy: ， 比如 <aMark>[string, number, number]</aMark> 来说， 可能不知道他们具体代表什么， 不如使用对象形式,
而在 <aMark>TypeScript 4.0</aMark> 中, 有了具名元祖 [Labeled Tuple Elements](https://github.com/Microsoft/TypeScript/issues/28259) 的支持，
使得我们可以为元祖中的元素打上类似的属性标记

```typescript
const arr8: [name: string, age: number, height: number] = ['cqc', 25, 170];
const arr9: [name: string, age: number, height?: number] = ['cqc', 25];
```

除了显示的越界访问， 还可能存在隐式的越界访问， 如通过解构赋值的形式

```typescript
// 对于数组 没办法从类型层面检查里面有多少个元素
const arr1: string[] = [];
const [e1, e2, ...rest] = arr1;

// 对于元祖, 隐式的越界访问会抛出一个警告
const arr2: [name: string, age:: number] = ['cqc', 25];
const [name, age, other] = arr2; // err
```

## 对象的类型标注

```typescript
/**
 * name 必填
 * id 只读 readonly（不可再次编辑）
 * age 可选 ?
 */
interface IDescription {
  name: string;
  readonly id: number;
  age?: number;
}

const obj1: IDescription = {
  name: 'cqc',
  id: 1,
};

// 可以重新赋值 name
obj.name = 'cqc1';

obj.id = 2; // err  readonly property
```

> - <aMark>readonly</aMark> 可以防止对象属性被再次赋值，在数组与元祖层面也有 只读属性， 不同的是
>   - 只能将整个 数组/元祖 标记为只读， 而不能像对象那样 单单针对某个属性
>   - 一旦 数组/元祖 被标记为只读， 那么 该 数组/元祖 的类型上， 将不再有 pop、push 等会修改原数据的方法, 报错信息也将是 **类型 xxx 上不存在属性 ‘push’ 这种**

### type 与 interface

一般比起 type（Type Alias， 类型别名），用 interface | class 的形式来描述对象、类的结构上比较推荐的, 而类型别名
用来 **将一个函数签名、一组联合类型、一个工具类型等等抽离成一个完整独立的类型**

### Object、object 以及 {}

- <aMark>Object</aMark>， 在 javascript 中， 原型链的顶端 是 Object 以及 Function， 这意味着所有的原始类型与对象类型最终都指向 Object， 在 Typescript 中就表现为 <aMark>Object 包涵了所有的类型</aMark>.

```typescript
// 以下类型全部不会报错， 对于 null ｜ undefined ｜ void 0 ，需要关闭 strictNullChecks
const temp1: Object = undefined;
const temp2: Object = null;
const temp3: Object = void 0;

const temp4: Object = 'cqc';
const temp5: Object = 500;
const temp6: Object = { name: 'cqc' };
const temp7: Object = () => {};
const temp8: Object = [];
```

和 Object 类似的还有 Boolean Number String Symbol, 这几个**装箱类型(Boxed Types)** 同样包涵了一些超出预期的类型。 以 String 来说， 它包括了 undefined、null、 void 和 其代表的 **拆箱类型（Unboxed Types）** string, 但不包括其他装箱类型对应的拆箱类型, 如 boolean 与其基本对象类型.

```typescript
const temp9: String = undefined;
const temp10: String = null;
const temp11: String = void 0;
const temp12: String = 'cqc';

// 以下不成立 err
const temp13: String = 5050;
const temp14: String = { name: 'cqc' };
const temp15: String = () => {};
const temp16: String = [];
```

> **_在任何情况下， 都不应该使用这些 装箱类型_**

- <aMark>object</aMark>, object 的引入就是为了解决对 Object 类型的错误使用， 它代表 <aMark> 所有非原始类型的类型，即数组、对象与函数</aMark>

- <aMark>{}</aMark>（一个空对象）

<!-- <TypeScript-Primitive-And-Object /> -->
