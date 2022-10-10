---
sidebar: auto
# prev:
#  text: i.结构化类型系统：类型兼容性判断的幕后
#  link: /typescript/i.结构化类型系统：类型兼容性判断的幕后.html

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

## 结构工具类型

这一部分的工具类型主要是使用 **条件类型, 映射类型, 索引类型**.

结构工具类型其实又可以分为两类, 结构声明 和 结构处理.

结构声明工具类型即快速声明一个结构, 比如内置类型中的 Record:

```typescript
type Record<K extends keyof any, T> = {
  [P in K]: T
}
```

其中, `K extends keyof any` 即为键的类型, 这里使用 `extends keyof any` 标明, 传入的 K 可以是单个类型, 也可以是联合类型, 而 T 即为 属性的类型.

```typescript
type R1 = Record<string, unknown>;
type R2 = Record<string, any>;
type R3 = Record<string | number, any>;
```

其中, `Record<string, unknown>` 和 `Record<string, any>` 是日常使用较多的形式, 通常我们使用这两者来代替 object.

在一些工具类库源码中其实还存在类似的结构声明工具类型, 如:

```typescript
type Dictionary<T> = {
  [index: string]: T;
}

type NumbericDictionary<T> = {
  [index: number]: T;
}
```

Dictionary(字典) 结构只需要一个作为属性类型的泛型参数即可.

而对于结构处理工具类型, 在 typescript 中主要是 Pick, Omit 两位选手:

```typescript
type Pick<T, K in keyof T> = {
  [P in K]: T[P];
}

type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

首先来看 Pick, 它接受了两个泛型参数, T 即是我们会进行结构处理的原类型(一般是对象类型), 而 K 则被约束为 T 类型的键名联合类型. 由于泛型约束是立即推导填充的, 即你为第一个泛型参数传入 Foo 类型之后, K 的约束条件会立刻被填充, 因此在你输入 K 时候回货的代码提示.

而对于 Omit 类型, 看名字其实就能 get 到它是 Pick 的反向实现: **Pick 是保留这些传入的键, 移除其他, Omit 则是移除传入的键**

它的实现看起来很奇怪:

```typescript
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
```

首先我们能看出, Omit 是基于 Pick 实现的, 这也是 typescript 中成对工具类型的另一种实现方式.
上面的 Partial 与 Required 使用类似的结构, 在关键位置使用一个相反操作来实现反向;
而这里的 Omit 类型则是基于 Pick 的实现, 也就是**反向工具类型基于正向工具类型实现**.

首先接受的泛型参数类型, 也是一个类型与联合类型, 但是在将这个联合类型传入给 Pick 时候多了一个 `Exclude<A, B>` 的结构就是联合类型 A 中 不存在于 B 中的部分:

```typescript
type T1 = Exclude<1, 2>; // 1
type T2 = Exclude<1 | 2, 1>; // 2
type T3 = Exclude<1 | 2 | 3, 2 | 3>; // 1
```

因此, 在这里 `Exclude<keyof T, K>` 其实就是 T 的键名联合类型中剔除了 K 的部分, 将其作为 Pick 的键名, 就实现了一部分类型剔除的效果.
