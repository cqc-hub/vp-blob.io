---
sidebar: auto

prev:
 text: j.类型系统层级
 link: /typescript/j.类型系统层级.html
---

#

## 条件类型基础

条件类型的语法类似于平常使用的三元表达式(伪代码)：

```typescript
ValueA === ValueB ? Result1 : Result2;
```

但需要注意的是， 条件类型中使用 extends 判断类型的兼容性， 而非判断类型的全等性。 这是因为在类型层面中，
对于能够进行赋值操作的两个变量， 我们**并不需要他们的类型完全相等， 只需要具备兼容性**， 对于两个完全相同的类型， 其 extends 自然也是成立的

条件类型绝大部分场景下回合泛型一起使用， 泛型参数的实际类型会在实际调用时才被填充（类型别名中显示传入， 或者函数中隐式提取）， 而条件类型在这一基础上，
可以基于填充后的泛型参数做进一步的类型操作：

```typescript
type LiteralType<T> = T extends string ? 'string' : 'other';

type Res1 = LiteralType<'cqc'>; // 'string'
type Res2 = LiteralType<233>; // 'other'
```

同三元表达式一样， 条件类型中也常见多层嵌套：

```typescript
type LiteralType<T> = T extends string
 ? 'string'
 : T extends number
 ? 'number'
 : T extends boolean
 ? 'boolean'
 : 'other';

type Res1 = LiteralType<'cqc'>; // 'string'
type Res2 = LiteralType<233>; // 'number'

```

而在函数中， 条件类型与泛型搭配同样非常常见， 考考你， 以下这个函数， 我们应该如何标注它的返回值类型

```typescript
function universalAdd<T extends string | number | bigint>(x: T, y: T) {
 return x + (y as any);
}
```

当我们调用这个函数时候， 由于两个参数都引用了泛型参数 T， 因此泛型会被填充为一个联合类型:

```typescript
universalAdd(233, 23); // T 填充为 233 | 23
universalAdd('cqc', '233'); // T 填充为 'cqc' | '233'
```

那么此时的返回值类型就需要从这个字面量联合类型中推导回其原本的基础类型。 在类型层级一节中， 我们知道
**同一基础类型的字面量联合类型， 其可以被认为是此基础类型的子类型**， 即 `'cqc' | '233'` 是 string 的子类型

因此， 我们可以使用嵌套的条件类型来进行字面量类型到基础类型的提取:

```typescript
type LiteralToPrimitive<T> = T extends string
 ? string
 : T extends number
 ? number
 : T extends bigint
 ? bigint
 : never;

 function universalAdd<T extends string | number | bigint>(x: T, y: T): LiteralToPrimitive<T> {
   return x + (y as any);
  }


  universalAdd('cqc', '233'); // string
  universalAdd(233, 1); // number
  universalAdd(10n, 10n); // bigint
```

条件类型还可以用来对更复杂的类型进行比较， 比如函数类型：

```typescript
type Func = (...args: any[]) => any;

type FunctionConditionType<T extends Func> = T extends (
 ...args: any[]
) => string
 ? 'A string return func!'
 : 'A non-string return func';

type r1 = FunctionConditionType<() => string>; // A string return func!
type r2 = FunctionConditionType<() => number>; // A non-string return func

```

在这里， 我们的条件类型用于判断两个函数类型是否具有兼容性， 而条件中并不限制次数类型， 仅比较二者的返回值类型

与此同时， 存在泛型约束和条件类型两个 extends 可能会让你感到疑惑， 但他们产生作用的时机完全不同， 泛型约束要求你传入符合结构的类型参数， 相当于**参数校验**。
而条件类型使用类型参数进行条件判断（就像 if else）， 相当于**实际内部逻辑**

## infer 关键字

上面讲到的这些条件类型， 本质上就是在泛型基于调用填充类型信息的基础上， 新增了**基于类型信息的条件判断**。 看起来不错， 但你可能也发现了一个无法满足的场景： <a-mark>提取传入的类型信息</a-mark>

在上面的例子中， 假如我们不在比较填充的函数类型是否是 `(...args: any[]) => string` 的子类型， 而是要拿到其返回值类型呢？ 或者说，
我们希望拿到填充的类型信息的一部分， 而不是只是用它来做条件呢？

### 函数

typescript 中支持通过 infer 关键字来 <a-mark>在条件类型中提取类型的某一部分信息</a-mark>， 比如上面我们要提取函数返回值类型的话， 可以这么放：

```typescript
type FunctionReturnType<T extends (...args: any[]) => any> = T extends (
 ...args: any[]
) => infer R
 ? R
 : never;

type t = FunctionReturnType<() => string>;  // string

```

看起来是新朋友， 其实还是老伙计。 上面的代码表达了， 当传入的类型参数满足 `T extends (...args: any[]) => infer R` 这样一个结构（不用管 `infer R`, 当它是 any 就行），
返回 `infer R` 位置的值， 即 R。 否则， 返回 never

### 数组

这里的类型结构当然不局限于函数类型结构， 还可以是数组：

```typescript
type Swap<T extends any[]> = T extends [infer A, infer B] ? [B, A] : T;

type r1 = Swap<['cqc', '233']>; // 符合结构 替换首尾元素 ['233', 'cqc']
type r2 = Swap<[1, 2, 3]>; // [1, 2, 3]

```

由于我们声明的结构是一个仅有两个元素的元组， 因此三个元素的元组就被认为是不符合类型结构来。 但我们可以使用呢 rest 操作符来处理任意长度的情况：

```typescript
//提取首尾两个
type ExtractStartAndEnd<T extends any[]> = T extends [
 infer Start,
 ...any[],
 infer End
]
 ? [Start, End]
 : T;

// 调换首尾两个
type SwapStartAndEnd<T extends any[]> = T extends [
 infer Start,
 ...infer Left,
 infer End
]
 ? [End, ...Left, Start]
 : T;

// 调换开头两个
type SwapFirstAndTwo<T extends any[]> = T extends [
 infer First,
 infer Second,
 ...infer Rest
]
 ? [Second, First, ...Rest]
 : T;

type t1 = ExtractStartAndEnd<[1, 2, 'cqc']>; // [1, 'cqc']
type t2 = SwapStartAndEnd<[1, 2, 'cqc']>; // ['cqc', 2, 1]
type t3 = SwapFirstAndTwo<[1, 2, 3, 4]>; // [2, 1, 3, 4]

```

是的， infer 甚至可以和 rest 操作符一样同时提取一组不定长的类型， 而 `...any[]` 的用法是否也让你直呼神奇？ 上面的输入输出仍然都是数组，
而实际上我们完全可以进行结构层面的转换。 比如从数组到联合类型：

```typescript
type ArrayItemType<T> = T extends Array<infer ElementType>
 ? ElementType
 : never;

type t1 = ArrayItemType<[]>; // never
type t2 = ArrayItemType<string[]>; // string
type t3 = ArrayItemType<[string, number]>; // string | number

```

### 接口

infer 结构也可以是接口:

```typescript
type PropType<T, K extends keyof T> = T extends {
 [Key in K]: infer R;
}
 ? R
 : never;

 // 反转键名与键值
type ReverseKeyValue<T extends Record<string, unknown>> = T extends Record<
 infer K,
 infer V
>
 ? Record<V & string, K>
 : never;




type t1 = PropType<
 {
  name: string;
 },
 'name'
>; // string

type t2 = PropType<
 {
  name: string;
  age: number;
 },
 'age' | 'name'
>; // string | number


type t3 = ReverseKeyValue<{
 name: 'cqc';
}>; // { cqc: 'name' }

```
