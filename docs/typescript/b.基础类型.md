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
// 对于数组 没办法从类型层面
const arr1: string[] = [];
const [e1, e2, ...rest] = arr1;
```



<!-- <TypeScript-Primitive-And-Object /> -->
