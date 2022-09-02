---
sidebar: 'auto'

prev:
 text: e.any | unknown | never
 link: /typescript/e.any | unknown | never.html

next:
 text: g.类型工具(part 2)
 link: /typescript/g.类型工具(part 2).html
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
interface Name Struct {
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

## 类型索引

索引类型指的不是某一个特定的类型工具， 他其实包含三个部分：**索引类型签名、索引类型查询、索引类型访问**.
实际上这三者都是独立的类型工具。 唯一的共同点上， **它们都过索引的形式来进行类型操作**， 但索引签名类型是**声明**，
后两者是**读取**。

### 索引签名类型

索引签名类型主要是指， 在类型别名或接口中， 通过以下语法来**快速声明一个键值类型一致的类型结构**：

```typescript
interface AllStringTypes {
  [key: string]: string;
}

type AllStringTypes = {
  [key: string]: string;
}

```

这时， 即使你还没声明具体的属性， 对于这些类型结构的访问属性也将全部被视为 string 类型。

```typescript
type PropType1 = AllStringTypes['cqc']; // string
type PropType2 = AllStringTypes['233']; // string
```

这个例子中我们声明的键的类型为 string（ <aMark>[key: string]</aMark> ),
这也意味着在实现这个类型结构的变量中**只能声明字符串类型的键**。

```typescript
const foo: AllStringTypes = {
  'cqc': '233'
}
```

但由于 javascript 中， 对于 <aMark>obj[prop]</aMark> 形式的访问会将**数字所以访问转换为字符串索引访问**，
也就是说， <aMark>obj[233]</aMark> 和 <aMark>obj['233']</aMark> 的效果是一致的。 因此，在字符串索引签名类型
中我们仍然可以声明数字类型的键。 类似的 symbol 类型也是如此：

```typescript
const foo: AllStringTypes = {
  'cqc': '233',
  233: 'cqc',
  [Symbol('cqc')]: 'symbol'
}

```

索引签名类型也可以和具体的键值对类型声明并存， 但这时这些具体的键值类型也需要符合索引签名类型的声明:

```typescript
interface AllStringTypes {
  [key: string]: string | number;
  age: number; // 键和值需要符合索引类型

   // error:  type 'boolean' is not assignable to 'string' index type 'string | number'
  isBool: boolean;
}
```

索引签名类型最常见的场景是在重构 javascript 代码时候， 为内部属性较多的对象声明一个 any 的索引签名类型，
以此来暂时支持**对类型未明确属性的访问**， 并在后续慢慢补全。

```typescript
interface AnyType {
  [key: string]: any;
}

const foo: AnyType['cqc'] = 'any value';
```

### 索引类型查询

使用 <aMark>keyof</aMark> 操作符进行查询。 严谨地说， 他可以将对象中的所有键转换为对应字面量类型，
然后在组合成联合类型。

注意， **这里并不会将数字类型的键名转换为字符串类型字面量， 而是仍然保持为数字类型字面量** 。

```typescript
interface Foo {
  name: string;
  233: string;
  '333': string;
}

type FooKeys = keyof Foo; // 'name' | 233 | '333'  (数字字面量类型仍然保持为数字类型字面量)
```

除了应用在已知的对象类型结构上以外， 你还可以直接 <aMark>keyof any</aMark> 来生产一个联合类型，
它会由所有可用作对象键值的类型组成： <aMark>string | number | symbol</aMark>。也就是说，
他是由无数字面量类型组成的， 由此我们可以知道， **keyof 的产物必定是一个联合类型**。

### 索引类型访问

在 javascript 中 我们可以通过 `obj[expression]` 的方式来动态访问一个对象属性（即计算属性），
expression 表达式会先被执行， 然后实现用回值来访问属性。 而 typescript 中我们也可以通过类型的方式，
只不过这里的 expression 要更换成类型。

```typescript
interface NumberRecord {
  [key: string]: number;
}

type PropType = NumberRecord[string]; // number
```

这里， 我们使用 string 类型来访问 NumberRecord. 由于其内部声明了数字类型的索引签名，
这里访问到的结果即是 number 类型。 注意， 其访问方式与返回值均是类型。

更直观的例子是通过字面量类型来进行索引类型访问：

```typescript
interface Foo {
  name: string;
  age: number;
}

type PropName = Foo['name']; // string
type PropAge = Foo['age']; // number
```

看起来这里就是普通的值访问， 但实际上这里的 `name` 和 `age` 都是**字符串字面量类型， 而不是一个 javascript 字符串值**。
索引类型查询的本质其实就是， **通过键的字面量类型(`'name'`)访问这个键对应的键值类型(`string`)**.

看到这里你肯定会想到， 上面的 keyof 操作符能一次性获取这个对象所有的键的字面量类型， 是否能用在这里？
当然， 这里可是 typescript !

```typescript
interface Foo {
  PropA: number;
  PropB: string;
  PropC: boolean;
}

type PropTypeUnion = Foo[keyof Foo]; // number | string | boolean
```

使用字面量联合类型进行索引类型访问时， 其结果就是将联合类型每个分支对应的类型进行访问后的结果，
重新组装成联合类型。 **索引类型查询、索引类型访问通常会和映射类型一起搭配使用**， 前两者负责访问键，
而映射类型在其基础上访问键值类型（映射类型下面讲到）。

注意， 在未声明索引签名类型的情况下， 我们不能使用 <aMark>Foo[string]</aMark> 这种原始类型的访问方式，
而只能通过键名的字面量类型来进行访问。

```typescript
interface Foo {
  PropA: number;
}

type PropAType = Foo['PropA'];

// Error: 类型 Foo 没有匹配类型 'string' 的索引签名
type PropAType = Foo[string];
```

索引类型的最佳拍档之一就是映射类型， 同时映射类型也是类型编程中常用的一个手段。

### 映射类型： 类型编程第一步

不同于索引类型包含好几个部分， 映射类型指的就是一个确切的类型工具。 看到映射这个词你应该
能联想到 javascript 中数组的 map 方法， 实际上也是如此， 映射类型的主要作用即是**基于键名映射到键值类型**。
概念不好理解， 直接上例子：

```typescript
type Stringify<T> = {
  [key in keyof T]: string;
}
```

这个工具类型会接受一个对象类型（假设我们只会这么用）， 使用 keyof 获得这个对象类型的键名组成字面量联合类型，
然后通过映射类型（即这里的 in 关键字） 将这个联合类型的每一个成员映射出来， 并将其键值类型 设置为 string。

具体使用的表现上这样的：

```typescript
interface Foo {
  prop1: string;
  prop2: number;
  prop3: boolean;
  prop4: () => void;
}

type StringifyFoo = Stringify<Foo>;

// 等价于
interface StringifyFoo {
  prop1: string;
  prop2: string;
  prop3: string;
  prop4: string;
}
```

我们可以使用 伪代码的形式进行说明：

```typescript
const StringFieldFoo = {};
for(const k of Object.keys(Foo)) {
  StringFieldFoo[k] = string;
}
```

看起来好像很奇怪， 我们应该很少会需要把一个接口的所有属性类型映射到 string？ 这有什么意义吗？

既然拿到了键， 那键值类型其实也能拿到：

```typescript
type Clone<T> = {
  [K in keyof T]: T[K];
}
```

这里的 `T[K]` 其实就是上面说到的索引类型访问， 我们使用键的字面量类型访问到了键值的类型，
这里相当于克隆了一个接口。 这里需要注意的是， 只有 `K in` 属于映射类型的语法， `keyof T` 属于 keyof 操作符，
`[K in keyof T]` 的 `[]` 属于索引类型签名， `T[K]` 属于索引类型访问。
