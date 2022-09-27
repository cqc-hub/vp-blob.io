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

在这里， 为了体现 infer 作为类型工具的属性， 我们结合了索引类型与映射类型， 以及使用 `& string` 来确保属性名作为 string 类型的小技巧。

为什么需要这个小技巧， 如果不使用会有什么问题吗？

```typescript
type ReverseKeyValue<T extends Record<string, string>> = T extends Record<
 infer K,
 infer V
>
 ? Record<V, K>   // type 'V' does not satisfy the constraint 'string | number | symbol'.ts(2344)
 : never;

```

明明约束已经声明了 V 的类型是 string 为什么还是报错了

这是因为， 泛型参数 V 的来源是从键值类型推导出来的， typescript 中这样对键值类型进行 infer 推导， 将导致类型信息丢失， 而不满足索引签名类型只允许 `string | number | symbol` 的要求。

还记得映射类型的判断条件吗？
 需要同时满足其两端的类型， 我们使用 `V & string`  这一形式，就确保了最终符合条件的类型参数 V 一定回满足 `string | never` 这个类型， 因此可以被视为合法的索引签名类型。

### Promise

```typescript
type PromiseValue<T> = T extends Promise<infer V> ? V : T;

type r1 = PromiseValue<Promise<number>>; // number
type r2 = PromiseValue<Promise<string>>; // string

```

就像条件类型可以嵌套一样， infer 关键字也经常被使用在嵌套的场景中， 包括对类型结构深层信息的提取， 以及对提取到类型信息的筛选等。 比如上面的 PromiseValue， 如果传入了一个嵌套的 Promise 类型就失效了：

这时候我们就需要 进行嵌套的提取了：

```typescript
type PromiseValue<T> = T extends Promise<infer R>
 ? R extends Promise<infer N>
  ? N
  : R
 : T;
```

当然， 这个时候更应该使用递归来处理任意的嵌套深度：

```typescript
type PromiseValue<T> = T extends Promise<infer V> ? PromiseValue<V> : T;

type r = PromiseValue<Promise<Promise<Promise<string>>>>; // string

```

条件类型在泛型的基础上支持了基于类型信息的动态条件判断， 但无法直接消费填充类型信息， 而 infer 关键字 则为他补上了这一部分能力， 让我们可以进行更多奇妙的类型操作， typescript 中内置的工具类型中还有一些基于 infer 关键字的应用， 后面我们会在内置工具类型讲解中了解它们的具体实现

## 分布式条件类型

分布式条件类型听起来真的很高级， 但这里和分布式服务并不是一回事。 **分布式条件类型， 也称作条件类型的分布式特性**， 只不过是条件类型在满足一定情况下会执行的逻辑而已， 直接上例子：

```typescript
type Condition<T> = T extends 1 | 2 | 3 ? T : never;

type r1 = Condition<1 | 2 | 3 | 4 | 5>; // 1 | 2 | 3

type r2 = 1 | 2 | 3 | 4 | 5 extends 1 | 2 | 3 ? 1 | 2 | 3 | 4 | 5 : never; // never

```

这个例子可能让你充满了疑惑， 某些地方似乎和我们学习的知识并不一样？ 先不说这两个理论上应该执行结果一致的类型别名， 为什么在 r1 中诡异的返回了一个联合类型？

仔细观察就会发现， 唯一的差异就是在 r1 中， 进行判断的联合类型被作为泛型参数传入给另一个独立的类型别名， 而 r2 中直接对这两者进行判断。

> 记住第一个差异： <a-mark>是否通过泛型参数传入</a-mark>。

我们在看一个例子：

```typescript
type Naked<T> = T extends boolean ? 'Y' : 'N';
type Wrapped<T> = [T] extends [boolean] ? 'Y' : 'N';

type r3 = Naked<number | boolean>; // 'N' | 'Y'
type r4 = Wrapped<number | boolean>; // 'N'

```

现在我们都是通过泛型参数传入了， 但诡异的事情又发生了， 为什么第一个还是个联合类型？ 第二个倒是好理解一些 元组的成员有可能是数字类型， 显然和 `[boolean]` 不兼容。

 在仔细观察着两个例子你会发现， 它们唯一的差异就是条件类型中的 **泛型参数是否被数组包裹了**

> 第二个差异: <a-mark>泛型参数是否被数组包裹了</a-mark>

同时, 你会发现在 r3 的判断中， 其联合类型的两个分支， 恰好对应分别使用 number 和 boolean 其作为条件类型判断时候的结果。

把上面的线索梳理一下， 其实我们就打值得到了条件类型分布式起作用的条件。

- 首先， **你的类型参数需要是一个联合类型。**
- 其次， **类型参数需要通过泛型参数的方式传入， 而不能直接在外部进行判断（类似 r2）**
- 最后， **条件类型中的泛型参数不能被包裹**

而条件类型分布式特性会产生的效果也很明显了， 即将这个联合类型拆开来， 每个分支分别进行一次条件类型判断， 再将最后的结果合并起来（如 Naked 中）。 如果在严谨一些， 其实我们就得到了官方的解释：

**对于裸类型参数的检查类型， 条件类型会在实例化时期自动分发到联合类型上**。

这里的自动分发， 我们可以这么理解：

```typescript
type Naked<T> = T extends boolean ? 'Y' : 'N';

// (number extends boolean ? 'Y' : 'N') | (boolean extends boolean ? 'Y' : 'N')
type r3 = Naked<number | boolean>; // 'N' | 'Y'
```

写成伪代码其实就是这样的

```typescript
const Res3 = [];

for(const input of [number, boolean]) {
  if (input extends boolean) {
    Res3.push('Y');
  } else {
    Res3.push('N');
  }
}
```

这里的裸类型参数， 其实指的就是泛型参数是否完全裸露， 我们上面使用数组包裹泛型参数只是其中一种方式， 比如还可以这么做：

```typescript
type NoDistribute<T> = T & {};
type Wrapped<T> = NoDistribute<T> extends [boolean] ? 'Y' : 'N';

type r = Wrapped<number | boolean>; // 'N'

```

需要注意的是， 我们并不是智慧通过裸泛型参数， 来确保分布式特性能够发生。 在某些情况下， 我们也需要包括泛型参数来警用掉分布式特性。 最常见的场景也许还是联合类型的判断， 即我们不希望进行联合类型的兼容性判断，就像在最初的 r2 中那样.
