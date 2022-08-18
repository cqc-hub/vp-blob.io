---
sidebar: 'auto'
---

#

类型工具就是可以对类型进行处理的工具。

按照使用方式划分， 类型工具可以分成三类:
**操作符、关键字、专用语法**

按照使用目的划分， 类型工具可以分成两类:
**类型创建、类型安全保护**

## 类型别名

类型别名可以说是 typescript 类型编程中最重要的一个功能， 从一个简单的函数类型别名，到让你眼花缭乱的类型体操，
都离不开类型别名

```typescript
type A = string;
```

我们通过`type`关键字声明了一个类型别名 A， 同时它的类型等价于 string 类型。类型别名的主要作用是对一组类型或
特定类型结构进行封装， 以便于在其他地方进行复用。

比如抽离一组联合类型：

```typescript
type StatusCode = 200 | 301 | 400 | 500 | 502;
type PossibleDataTypes = string | number | (() => unknown);

const status: StatusCode = 502;
```

抽离一个函数类型：

```typescript
type Handler = (e: Event) => void;

const clickHandler: Handler = (e) => { };
```

声明一个对象类型， 就像接口那样：

```typescript
type ObjectType = {
  name: string;
  age: number;
}
```

看起来类型别名真的非常简单， 不过是声明了一个变量让类型声明更加简洁和易于拆分吗？
如果真的知识把它作为类型别名， 用来进行特定类型的抽离封装， 那的确很简单。
然而， 类型别名还能作为工具类型。

**工具类同样基于类型别名， 只是多了个泛型**.

在类型别名中， 类型别名可以这么声明自己能够接受泛型。 一旦接受了泛型， 我们就叫他工具类型：

```typescript
type Factory<T> = T | number | string;
```

虽然现在类型别名摇身一变成了工具类型， 但他的基本功能仍然是创建类型， 只不过工具类型能够接受泛型参数，
实现**更灵活的类型创建功能**。 从这个角度来看， 工具类型就像一个函数一样， 泛型是入参， 内部逻辑基于
入参进行某些操作， 再返回一个新的类型。

```typescript
const foo: Factory<boolean> = true;
```

当然， 我们一般不会直接使用工具类型做类型标注， 而是再度声明一个新的类型别名：

```typescript
type FactoryWithBool = Factory<boolean>;

const foo: FactoryWithBool = true;
```

同时， 泛型参数的名称（上面的 'T'）也不是固定的。 通常我们使用大写的 T / K / U / V / M / O ...这种形式。
如果是为了可读性考虑， 也可以写成大驼峰形式的名称， 比如：

```typescript
type Factory<NewType> = NewType | number | string;
```

声明一个简单、有实际意义的工具类型：

```typescript
type MaybeNull<T> = T | null;
```

这个工具类型会接受一个类型， 并返回一个包括 null 的联合类型。
这样一来， 在实际使用时候就可以确保你处理了可能为空值的属性读取与方法调用：

```typescript
type MaybeNull<T> = T | null;

function process(input: MaybeNull<{ handler: () => {} }>) {
  input?.handler();
}
```

类似的还有 MaybePromise、 MaybeArray。 这也是日常开发中最常用的一类工具类型：

```typescript
type MaybeArray<T> = T | T[];

function ensureArray<T>(input: MaybeArray<T>): T[] {
  return Array.isArray(input) ? input : [input];
}
```

另外， 类型别名中可以接受任意个泛型， 以及为泛型指定约束、默认值等， 后面泛型中会讲到。

总之， 对于工具类来说， 它的主要意义是**基于传入的泛型进行各种类型操作**， 得到一个新的类型，
这个类型操作指代的非常广泛， 甚至说类型编程的大半难度都在这里。

## 联合类型与交叉类型

前面了解过 联合类型 `|`, 实际上， 联合类型还有一个和他很像的孪生兄弟： **交叉类型**。
他和联合类型的使用位置一样， 只不过符号是 `&`, 即按位与运算符。

实际上， 正如联合类型的符号是 `|`, 他代表了按位或， 即只需要符合联合类型中的一个类型，
即可以认为实现了这个联合类型， 如 `A | B`, 只需要实现 A 或 B 即可。

而代表按位与的 `&` 则不同， 你需要符合这里的所有类型， 才可以说实现了这个交叉类型，
即 `A & B`, **需要同时满足 A 与 B 两个类型** 才行：

```typescript
interface NameStruct {
  name: string;
}

interface AgeStruct {
  age: number;
}

type ProfileStruct = NameStruct & AgeStruct;

const profile: ProfileStruct = {
  name: 'cqc',
  age: 25
}
```

很明显这里的 profile 对象需要同时符合这两个对象的结构。 从另一个角度来看，
ProfileStruct 其实就是一个新的， 同时包含了 NameStruct 和 AgeStruct
两个接口所有属性的类型。 这里是对于对象的合并， 那对原始类型呢？

```typescript
type StrAndNum = string & number; // never
```

可以看出， 他直接变成了 never， 想想前面给出的定义， 新的类型会同时符合交叉类型的所有成员，
存在既是 string 又是 number 的类型吗？ 当然不存在。 实际上， 这也是 never 这一 BottomType 的实际意义之一，
描述**根本不存在的类型**。

对于对象类型的交叉类型， 其内部的同名属性类型同样会按照交叉类型进行合并：

```typescript
type Struct1 = {
  primitiveProp: string;

  objectProp: {
    name: string;
  }
}

type Struct2 = {
  primitiveProp: number;
  objectProp: {
    age: number;
  }
}

type Composed = Struct1 & Struct2;

// never (string & number)
type PrimitiveProp = Composed['primitiveProp'];

// { name: string; age: number; }
type ObjectProp = Composed['objectProp'];
```

如果是两个联合类型组成的交叉类型呢？ 其实还是一样的思路， 既然只需要实现一个联合类型成员
就能认为是实现了这个联合类型， 那么各实现两边联合类型中的一个就行了， 也就是两边联合类型的交集：

```typescript
// 1 | 2
type UnionIntersection1 = (1 | 2 | 3) & (1 | 2);

// string
type UnionIntersection2 = (string | number | symbol) & string;
```

总结一下联合类型和交叉类型的区别就是，联合类型只需要符合成员之一即可（`||`）, 而交叉类型需要严格符合每一位成员（`&&`）.
