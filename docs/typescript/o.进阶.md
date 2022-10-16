---
sidebar: auto

prev:
 text: n.协变与逆变的比较
 link: /typescript/n.协变与逆变的比较.html

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
