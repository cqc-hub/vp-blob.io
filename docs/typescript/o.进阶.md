---
sidebar: auto

prev:
 text: n.协变与逆变的比较
 link: /typescript/n.协变与逆变的比较.html

next:
 text: p.模板字符串
 link: /typescript/p.模板字符串.html

---

#

## 属性修饰进阶

在内置工具类型一节中， 对属性修饰工具类型的进阶主要分为这么几个方向：

- 深层的属性修饰
- 基于已知属性的部分修饰， 以及基于属性类型的部分修饰

首先是深层属性修饰， 还记得我们在 infer 关键字异界首先接触到递归的工具类型吗？

```typescript
type PromiseValue<T> = T extends Promise<infer V> ? PromiseValue<V> : T;
```

可以看到， 此时我们只是在条件类型成立时， 再次调用了这个工具而已。 在某一次递归到条件类型不成立时候， 就会直接返回这个类型值。 那么对于 Partial、 Required， 其实我们也可以进行这样的处理：

```typescript
type DeepPartial<T extends object> = {
 [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

```

简单起见， 我们直接使用了 object 作为泛型约束条件， 这意味着也有可能传入函数、数组等类型。 但毕竟我们对这个类型知根知底， 就可以假设只会传入对象结构， 因此也只需要对对象类型进行处理了。

类似的， 我们还可以实现其他进行递归属性修饰的工具类型， 展示如下

```typescript
type DeepPartial<T extends object> = {
 [K in keyof T]: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

type DeepRequired<T extends object> = {
 [K in keyof T]-?: T[K] extends object ? DeepRequired<T[K]> : T[K];
};

type DeepReadonly<T extends object> = {
 readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

type DeepMutable<T extends object> = {
 -readonly [K in keyof T]: T[K] extends object ? DeepMutable<T[K]> : T[K];
};

```

另外， 在之前了解过， 存在一个从联合类型中 剔除 `null | undefined`  的工具类型 NoNullable

```typescript
type NoNullable<T> = T extends null | undefined ? never : T;
```

在对象结构中我们也常声明类型为 `null | string` 的形式， 代表了 **这里有值， 但是可能是空值**。 此时， 我们也可以将其等价为一种修饰属性（Nullable 属性， 前面则是 Optional / REadonly 属性）， 因此， 我们可以像访问性修饰工具类型那样， 实现一个 DeepNoNullable 来递归剔除所有属性的 null、 undefined：

```typescript
type DeepNoNullable<T extends object> = {
 [K in keyof T]: T[K] extends object
  ? DeepNoNullable<T[K]>
  : NoNullable<T[K]>;
};
```

当然， 就像 Partial 与 Required 的关系一样， DeepNoNullable 也有自己的另一半： DeepNullable

```typescript
type Nullable<T> = null | T;
type DeepNullable<T extends object> = {
 [K in keyof T]: T[K] extends object ? DeepNullable<T[K]> : Nullable<T[K]>;
};
```

> 需要注意的是， DeepNullable 和 DeepNoNullable 需要在开启 <a-mark>--strictNullChecks</a-mark> 才能正常工作。

搞定了递归属性修饰， 接着就是**基于已知属性进行部分修饰了**。 这其实也很简单， 你想， 如果我们要让一个对象的三个已知属性变为可选的， 那只需要把这个对象拆成 A、B 两个结构， 分别由 三个属性和其他属性组成， 然后让对象 A 的属性全部变为可选的， 和另外一个对象 B 组合起来， 不就行了吗？

拆开来看一下， 看看这里都用到了那些知识：

- 拆分对象结构， 那不就是 Pick、Omit
- 三个属性的对象全部变为可选， 那不就是属性修饰， 即 Partial
- 组合两个对象类型， 也就意味着得到了一个同时符合这两个对象类型结构的新结构， 那不就是交叉类型， 即 `&`

```typescript
type MarkPropsAsOptional<T extends object, K extends keyof T = keyof T> =
 Partial<Pick<T, K>> & Omit<T, K>;
```

T 为 需要处理的对象类型， 而 K 为需要标记为可选的属性， 由于此时 K 必须为T 内部的属性吗因此我们将其约束为 keyof T， 即对象属性组陈的字面量联合类型。 同时为了让他能够直接代替掉 Partial， 我们将其默认值 也设置为 keyof T，这样在不传入第二个泛型参数时候， 他的表现就和 Partial 一致， 即全量的属性可选。

而其组成中 `Partial<Pick<T, K>>` 为需要标记为可选的属性组成的对象子结构， `Omit<T, K>` 则为不需要处理的部分， 使用交叉类型将其组合即可

我们来实现其他类型的部分修饰

```typescript
type Flatten<T> = {
 [K in keyof T]: T[K];
};


type Mutable<T> = {
 -readonly [K in keyof T]: T[K];
};

type MarkPropsAsRequired<
 T extends object,
 K extends keyof T = keyof T
> = Flatten<Required<Pick<T, K>> & Omit<T, K>>;

type MarkPropsAsReadonly<
 T extends object,
 K extends keyof T = keyof T
> = Flatten<Readonly<Pick<T, K>> & Omit<T, K>>;


type MarkPropsAsMutable<
 T extends object,
 K extends keyof T = keyof T
> = Flatten<Mutable<Pick<T, K>> & Omit<T, K>>;
```

## 结构工具类型进阶

前面对结构工具类型主要给出了两个进阶方向：

- 基于键值类型的 Pick、Omit
- 子结构的互斥处理

首先是基于键值类型的 Pick、Omit， 我们就称之为 PickByValueType 好了。 他的实现方式其实还是类似部分属性修饰中那样， 将对象拆分为两个部分， 处理完毕再组装。 只不过， 现在我们无法预先确定要拆分的属性了， 而是需要**基于期望的类型去拿到所有此类型的属性名**， 如想 Pick 出所有函数类型的值， 那就要先拿到所有函数类型属性名。 先来一个 FunctionKeys
 工具类型：

 ```typescript
 type FuncStruct = (...args: any[]) => any;

type FunctionKeys<T extends object> = {
 [K in keyof T]: T[K] extends FuncStruct ? K : never;
}[keyof T];
 ```

`{}[keyof T]` 这个写法我们是第一次见， 但我们可以拆开来看， 先看看前面的 `{ [K in keyof T]: T[K] extends FuncStruct ? K : never  }` 部分， 为何在条件类型成立时它发挥了键名 K， 而非索引类型查询 `T[K]` ?

```typescript
type Tmp<T extends object> = {
 [K in keyof T]: T[K] extends FuncStruct ? K : never;
};


type Res = Tmp<{
 foo: () => void;
 bar(): number;
 baz: () => string;
 a: string;
}>;
/**
 * Res:
 * {
 *  foo: 'foo',
 *  bar: 'bar',
 *  baz: 'baz',
 *  a: never
 * }
 */

type ResEqual = {
  foo: 'foo',
   bar: 'bar',
   baz: 'baz',
   a: never
}
```

在 Res（等同 ResEqual） 中，  我们获得了一个 **属性名-属性名字面量类型**的结构， 对于非函数类型的属性， 其值为 never。 然后， 我们加上 `[keyof T]`  这一索引类型查询 + keyof 操作符的组合

```typescript
type WhatWillWeGet = Res[keyof Res]; // "foo" | "bar" | "baz"
```

我们神奇的获得了所有函数类型的属性名！ 这又是如何实现的呢？ 其实就是我们在此之前学习过的， 当索引类型查询中使用了一个联合类型时， 它会使用类似分布式条件类型的方式， 将这个联合类型的成员依次进行访问， 然后最终在组合起来， 上面的例子可以这么简化：

```typescript
type WhatWillWeGetEqual1 = Res['foo' | 'bar' | 'baz'];
type WhatWillWeGetEqual2 = Res['foo'] | Res['bar'] | Res['baz'];
type WhatWillWeGetEqual3 = 'foo' | 'bar' | 'baz' | never;
```

TypeFilter:

```typescript
type StrictConditional<A, B, Resolved, Rejected, Fallback = never> = [
 A
] extends [B]
 ? [B] extends [A]
  ? Resolved
  : Rejected
 : Fallback;

type StrictValueTypeFilter<
 T extends object,
 ValueType,
 Positive extends boolean = true
> = {
 [Key in keyof T]-?: StrictConditional<
  ValueType,
  T[Key],
  Positive extends true ? Key : never,
  Positive extends true ? never : Key,
  Positive extends true ? never : Key
 >;
}[keyof T];

type StrictPickByValueType<T extends object, ValueType> = Pick<
 T,
 StrictValueTypeFilter<T, ValueType>
>;
```

## 基于结构的互斥工具类型

先来看看如何声明一个接口， 它要么拥有 vipExpires， 要么拥有 promotionUsed 字段， 而不能同时拥有这两个字段， 你可能首先想到联合类型？

```typescript
interface VIP {
 vipExpires: number;
}

interface CommonUser {
 promotionUsed: boolean;
}

type User = VIP | CommonUser;

```

很遗憾， 这种方式并不会约束 “不能同时拥有两个字段” 这个条件

为了表示不能同时拥有， 实际上我们应该使用 never 类型来标记一个属性。 这里我们直接看完整实现：

```typescript
interface CommonUser {
 promotionUsed: boolean;
}

type Without<T, U> = {
 [P in Exclude<keyof T, keyof U>]?: never;
};

type XOR<T, U> = (Without<T, U> & U) | (Without<U, T> & T);

type XORUser = XOR<VIP, CommonUser>;

// 报错， 不允许同时拥有
const obj: XORUser = {
 vipExpires: 23,
 promotionUsed: false
};
```

对 Without 进一步展开可以看到， 他其实就是声明了一个不变的原属性 + 为never的其他属性接口

```typescript
type Temp1 = Flatten<Without<VIP, CommonUser>>; // { vipExpires?: never }
type Temp2 = Flatten<Temp1 & CommonUser>; // { promotionUsed: boolean; vipExpires?: undefined }
```

在通过联合类型的合并， 这样一来 XORUser 就满足了 “至少实现 VIP/CommonUser 这两个接口中的一个” ， “不能同时实现 VIP/CommonUser” 这两个条件。 如果再加上游客类型需要实现三个互斥属性， 也只需要额外嵌套一层：

```typescript
interface Visitor {
  returnType: 'sss';
}

// 联合类型会自动合并重复的部分
type XORUser = XOR<VIP, XOR<CommonUser, Visitor>>;
```

我们还可以使用互斥类型实现绑定效果， 即要么同时拥有 A、B 属性 要么一个都没

```typescript
type XORStruct = XOR<{}, {
  foo: string;
  bar: number;
}>
```

## 集合工具类型进阶

对于对象类型的交并补差集， 我们仍然沿用 “降级”的处理思路， 把他简化为可以用基础工具类型处理的问题即可。 在这里， 对象类型的交并补差集基本可以降维到对象属性名集合的交并补差集问题， 比如交集就是两个对象属性名的交集， 使用属性名的交集访问其中一个对象， 就可以获得对象之间的交集结构（不考虑同名属性冲突）

复习一下前面的一维集合：

```typescript
// 并集
type Concurrence<A, B> = A | B;

// 交集
type intersection<A, B> = A extends B ? A : never;

// 差集
type Difference<A, B> = A extends B ? never : A;

// 补集
type Complement<A, B extends A> = Difference<A, B>;

```

我们对应地实现对象属性名的版本：

```typescript
// 使用更精确的对象类型描述结构
export type PlainObjectType = Record<string, any>;

// 属性名并集
export type ObjectKeysConcurrence<
  T extends PlainObjectType,
  U extends PlainObjectType
> = keyof T | keyof U;

// 属性名交集
export type ObjectKeysIntersection<
  T extends PlainObjectType,
  U extends PlainObjectType
> = Intersection<keyof T, keyof U>;

// 属性名差集
export type ObjectKeysDifference<
  T extends PlainObjectType,
  U extends PlainObjectType
> = Difference<keyof T, keyof U>;

// 属性名补集
export type ObjectKeysComplement<
  T extends U,
  U extends PlainObjectType
> = Complement<keyof T, keyof U>;
```

对于交集、补集、差集，我们可以直接使用属性名的集合来实现对象层面的版本：

```typescript
export type ObjectIntersection<
  T extends PlainObjectType,
  U extends PlainObjectType
> = Pick<T, ObjectKeysIntersection<T, U>>;

export type ObjectDifference<
  T extends PlainObjectType,
  U extends PlainObjectType
> = Pick<T, ObjectKeysDifference<T, U>>;

export type ObjectComplement<T extends U, U extends PlainObjectType> = Pick<
  T,
  ObjectKeysComplement<T, U>
>;
```

需要注意的是在 ObjectKeysComplement 与 ObjectComplement 中， `T extends U` 意味着 T 是 U 的子类型，但在属性组成的集合类型中却相反， **U 的属性联合类型是 T 的属性联合类型的子类型**， 因为既然 T 是 U 的子类型， 那很显然 T 所拥有的属性更多嘛。

而对于并集， 就不能简单使用属性名并集版本了， 因为使用联合类型实现， 我们并不能控制**同名属性的优先级**， 比如我到底是保持源对象属性类型呢， 还是使用新对象的属性类型？

其实， 对于合并两个对象的情况， 其实就是两个对象各自特有的部分加上同名属性的组成部分。

对于 T、U 两个对象， 假设以 U 的同名属性优先， 思路会是这样的

- T 比 U 多的部分： T 相对于 U 的差集， `ObjectDifference<T, U>`
- U 比 T 多的部分： U 相对于 T 的差集， `ObjectDifference<U, T>`
- T 与 U 的交集， 由于 U 的优先级更高， 在交集处理中将 U 作为原集合， T 作为后传入的集合， `ObjectIntersection<U, T>`

我们就得到了 Merge

```typescript
type Merge<
 T extends PlainObjectType,
 U extends PlainObjectType
> = ObjectDifference<T, U> & ObjectIntersection<U, T> & ObjectDifference<U, T>;
```

如果要保证源对象优先级更高， 那么只需要在交集处理中将 T 视为原集合， U 作为后传入的集合即可：

```typescript
type Assign<T extends PlainObjectType, U extends PlainType> = ObjectDifference<T, U> & ObjectIntersection<T, U> & ObjectDifference<U, T>;
```

除了简单粗暴地完全合并以外， 我们还可以实现不完全的合集， 即使用对象 U 的属性类型覆盖 对象 T 中的同名属性类型， 但**不会将 U 独特的部分**合并过来

```typescript
type Override<T extends PlainObjectType, U extends PlainObjectType> = ObjectDifference<T, U> & ObjectIntersection<U, T>;
```

## 模式匹配工具类型进阶

在内置工具类型一节中， 我们对模式匹配工具类型的进阶方向其实只有深层嵌套这么一种， 特殊位置的 infer 处理其实大部分时候也是通过深层嵌套实现， 比如此前我们实现了提取函数的首个参数类型:

```typescript
type FirstParameter<T extends (...args: any) => any> = T extends (
 first: infer F,
 ...rest: any[]
) => any
 ? F
 : never;

```

要提取最后一个参数则是这样的:

```typescript
type FunctionType = (...args: any) => any;

type LastParameter<T extends FunctionType> = T extends (arg: infer P) => any
 ? P
 : T extends (...args: infer R) => any
 ? R extends [...any, infer Q]
  ? Q
  : never
 : never;
```

这也是模式匹配常用的一种方法， 通过 infer 提取到某个结构，然后再对这个结构进行 infer 提取。

我们在此之前曾经讲到一个提取Promise 内部值类型的工具类型 PromiseValue， typescript 内置工具类型中也存在这么一个作用的工具类型， 并且他的实现更为严谨：

```typescript
type Awaited<T> = T extends null | undefined
 ? T
 : T extends object & {
   then(onfulfilled: infer F): any;
   }
 ? F extends (value: infer V, ...args: any) => any
  ? Awaited<V>
  : never
 : T;
```

首先会发现， 在这里 Awaited 并非通过 `Promise<inter V>` 来提取函数类型， 而是通过 `Promise.then` 方法提取， 首先提取到 then 方法中的函数类型， 在通过这个函数类型的首个参数来提取出实际的值。

更严谨的来说， PromiseValue 与 Awaited 并不应该放在一起比较， 前者就只想提取 `Promise<void>` 这结构的内部类型， 后者则像在类型的层面执行了 `await Promise.then()` 之后的返回值类型。 同样的， 这里也用到了 infer 伴随结构转化的例子。
