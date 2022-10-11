---
sidebar: auto
next:
 text: m.反向类型推导
 link: /typescript/m.反向类型推导.html

prev:
 text: 条件类型与infer
 link: /typescript/k.条件类型与infer.html


---

#

## 工具类型的分类

内置的工具类型按照类型操作的不同，可以大致分为以下几类:

- **属性修饰工具类型**: 属性的修饰， 包括对 对象、数组的 可选/必填/只读/可写.

- **结构工具类型**: 对原有类型的裁剪、拼接、转换等; 比如使用一个对象类型裁剪到一个新的对象类型，将联合类型结构转换到交叉类型结构。

- **集合工具类型**: 对集合（即联合类型）对处理，即 交集、并集、差集、补集.

- **模式匹配工具类型**: 基于 infer 对模式匹配, 对一个既有类型的特定位置的提取, 比如提取函数类型签名中的返回值。

- **模版字符串工具类型**: 模版字符串专属的工具类型, 比如神奇地将一个对象中的属性名转换成大驼峰的形式。

## 属性工具类型

这一部分的工具类型主要使用 **属性修饰、映射类型、索引类型** 相关.

在内置工具类型中， 访问性工具类型包括以下三类:

```typescript

type Partial<T> = {
 [K in keyof T]?: T[K];
};

type Required<T> = {
 [K in keyof T]-?: T[K];
};

type Readonly<T> = {
  readonly[K in keyof T]: T[K]
};
```

其中， Partial 与 Required 是一对工具类型， 它们的功能是相反的, 而在实现上，它们唯一的差异就是在索引类型签名处的可选修饰符， Partial 是 `?`, 即标记属性为可选， Required 是 `-?`, 标记属性为必填， 相当于如果属性上有 `?` 这个标记， 则移除它。

如果你觉着不好记，其实 Partial 也可以用 `+?` 显式的来标记：

```typescript
type Partial1<T> = {
 [K in keyof T]+?: T[K];
};

```

需要注意的是，可选标记并不等于修改此属性类型为 `原属性 | undefined`, 如果你声明一个对象去实现一个这种接口， 它仍会要求你传入此属性, 如下:

```typescript
interface IPerson {
  name: string | undefined;
}


// Property 'name' is missing in type...
const obj: IPerson = { }
```

**对于结构声明来说， 一个属性是否提供仅取决于其是否携带可选标记**，即是你使用 never 也无法标记此属性是可选的， 反而你会惊喜地发现你没办法给这个属性赋值了，毕竟只有 never 才能赋值给 never。

而类似 `+?`， Readonly 中也可以使用 `+readonly`,

```typescript
type Readonly<T> = {
  +readonly[K in keyof T]: T[K];
}
```

虽然 typescript 中没有提供他的另一半， 但是我们可以参考 Required， 来将属性中的 readonly 移除。

```typescript
type Mutable<T> = {
  -readonly[K in keyof T]: T[K];
}
```

另外， 你可能发现 Pick 会约束第二个参数的联合类型来自于对象属性， 而 Omit 并不这么要求？ 官方的考量是， 可能会出现这么一种情况：

```typescript
type Omit1<T, K> = Pick<T, Exclude<keyof T, K>>;
type Omit2<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// 这里就不能使用严格 Omit 了
declare function combineSpread<T1, T2>(
 obj: T1,
 otherObj: T2,
 rest: Omit1<T1, keyof T2>
): void;

type Point3d = { x: number; y: number; z: number };

declare const p1: Point3d;

// 能检测出错误了 rest 中少了 z
combineSpread(p1, { x: 23 }, { y: 33 });

```

如果在这里我们使用 `keyof otherObj` 去剔除 obj, 此时如果声明约束反而不符合预期。

## 集合根据类型

在数学概念中， 对于两个集合来说， 通常存在 **交集、并集、差集、补集** 这几个情况。

- 并集: 两个集合的合并， 合并时候重复元素只会保留一份 （这也是联合类型的表现行为）
- 交集: 两个集合的相交部分， 即同时存在于这两个集合内的元素的集合
- 差集: 对于 A、B 两个集合来说， A 相对于 B 的差集 即为 **A 中独有而 B 中不存在的元素** 的组成的集合， 或者说 **A 中剔除了 B 中也存在的元素以后剩下的部分**
- 补集: 补集是差集的特殊情况， 此时**集合 B 为集合 A 的子集**， 这种情况下 **A 相对于 B 的补集 + B = 完整的集合A**

内置工具中提供了交集与差集的实现

```typescript
type Extract<T, U> = T extends U ? T : never;
type Exclude<T, U> = T extends U ? never: T;
```

这里的具体实现其实就是条件类型的分布式特性， **即当 T、U 都是联合类型（视为一个集合）时候， T 的成员会依次被拿出来进行 `extends U ? T1 : T2` 的计算， 然后将最终的结果再合并成一个联合类型**

比如对于交集 Extract， 其运行逻辑是这样的：

```typescript
type a = 1 | 2 | 3;
type b = 1 | 2 | 4;

type ExtractA = Extract<a, b>; // 1 | 2

// 实际的计算
type ExtractB = 1 extends b
 ? 1
 : never | 2 extends b
 ? 2
 : never | 3 extends b
 ? 3
 : never;

```

除了差集和交集， 我们也可以很容易实现并集和补集：

```typescript
// 并集
type Concurrence<A, B> = A | B;

// 交集
type Intersection<A, B> = A extends B ? A : never;

// 差集
type Difference<A, B> = A extends B ? never : A;

// 补集
type Complement<A, B extends A> = Difference<A, B>;


```

补集基于差集实现， 只需要约束**集合B 为 集合A 的子集 即可**。

内置工具类型中还有一个场景比较明确的集合工具类型：

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type _NotNullable<T> = Difference<T, null | undefined>
```

很明显， 他的本质就是集合 T 相对于 `null | undefined` 的差集， 因此我们可以使用之前的差集来进行实现。

在基于分布式条件类型的工具类型中， 其实也存在正反工具类型， 但**并不都是简单地替换条件类型结果两端**， 如交集和补集就只是简单替换了结果， 但二者的作用完全不同。

联合类型中会自动合并相同的元素， 因此我们可以默认这里指的类型集合全部都是类似 Set 那样的结构， 不存在重复元素。

## 模式匹配工具类型

这一部分主要使用 **条件类型 与 infer 关键字**。

在之前我们已经差不多了解了 infer 关键字的作用， 而更严格地说 infer 其实代表了 一种 **模式匹配** 的思路。 如正则表达式、 Glob 中都体现了这一概念。

首先是对函数类型签名的模式匹配:

```typescript
type FunctionType = (...args: any[]) => any;

type Parameters<T extends FunctionType> = T extends (...args: infer P) => any ? T : never;
type ReturnType<T extends FunctionType> = T extends (...args: any[]) => infer P ? P : never;

```

根据 infer 的位置不同， 我们就能获取到不同位置的类型， 在函数这里则是参数类型与返回值类型。

我们还可以更进一步， 比如只匹配第一个参数类型

```typescript
type FirstParams<T extends FunctionType> = T extends (arg: infer P, ...rest: any[]) => any ? P : never;
```

除了对函数类型进行模式匹配， 内置工具类型中还有一组对 Class 进行模式匹配的工具类型：

```typescript
type ClassType = abstract new (...args: any) => any;

type ConstructorParameters<T extends ClassType> = T extends abstract new (
 ...args: infer P
) => any
 ? P
 : never;

type InstanceType<T extends ClassType> = T extends abstract new (
 ...args: any
) => infer P
 ? P
 : any;

```

Class 的通用类型签名可能看起来比较奇怪， 但实际上它就是声明了可实例化（new）与可抽象（abstract） 罢了。 我们也可以使用接口来进行声明：

```typescript
interface ClassType<TInstance = any> {
  new (...args: any[]): TInstance;
}
```

对 Class 的模式匹配思路类似于函数， 或者说这是一个通用思路， 即基于放置位置的匹配。 放在参数部分， 那就是构造函数的参数类型， 放在返回值部分， 那当然就是 Class 的实例类型了。

## 拓展

在某些时候， 我们可能对 infer 提取的类型值有些要求， 比如我只想要数组的第一个为字符串的成员， 如果第一个成员不是字符串， 那我就不要了。

```typescript
type FirstArrayItemType<T extends any[]> = T extends [infer P, ...any[]]
 ? P extends string
  ? P
  : never
 : never;

```

看起来好像能满足需求， 但程序员总是精益求精的， 泛型可以声明约束， 只允许传入特定的类型， 那么 infer 中能否也添加约束， 只提取特定的类型？

typescript 4.7 中就支持了 infer 约束功能来实现**对特定类型的提取**， 比如上面的例子可以改写成这样：

```typescript
type FirstArrayItemType<T extends any[]> = T extends [
 infer P extends string,
 ...any[]
]
 ? P
 : never;
  ```

实际上， infer + 约束的场景是非常常见的， 尤其是在某些连续嵌套的情况下， 一层层的 infer 提取在筛选会严重地影响代码的可读性， 而 infer 约束这一功能无疑带来了更简洁直观的类型编程代码。
