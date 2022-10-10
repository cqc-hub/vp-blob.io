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
