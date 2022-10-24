---
sidebar: auto

prev:
 text: o.进阶
 link: /typescript/o.进阶.html

next:
  text: q.字符串进阶
  link: /typescript/q.字符串进阶.html
---

#

## 基础使用

来看一个最简单的例子：

```typescript
type World = 'World';

type Greeting = `Hello ${World}`
```

这里的 Greeting 就是一个模板字符串类型， 它内部通过与 JavaScript 中模板字符串相同的语法 `${}` , 使用了另一个类型别名 World， 其最终的类就是 **将两个字符串类型值组装在一起返回**

除了使用确定的类型别名以外， 模板字符串类型当然也支持通过泛型参数传入。 需要注意的是， 并不是所有值都能作为模板插槽：

```typescript
type Greeting<T extends string | number | boolean | null | undefined | bigint> =
 `Hello ${T}`;

type t1 = Greeting<'cqc'>; // "Hello cqc
type t2 = Greeting<233>; // Hello 233
type t3 = Greeting<true>; // Hello true
type t4 = Greeting<null>; // Hello null
type t5 = Greeting<undefined>; // Hello undefined
type t6 = Greeting<0xfffffff>; // Hello 268435455

```

目前有效的类型只有 `string | number | boolean | null | undefined | bigint` 这几个. 正如上面的例子所示， 这些类型在最终的字符串结果中都会被转换为字符串字面量类型， 即使是 null 、undefined

当然， 你也可以直接为插槽传入一个类型而非类型别名：

```typescript
type Greeting = `Hello ${string}`;
```

在这种情况下，Greeting 类型并不会编程 `Hello string`, 而是保持原样。 这也意味着它并没有实际意义， 此时就是一个无法改变的模板字符串类型， 但所有 `Hello` 开头的字面量类型都会被视为 `Hello ${string}` 的子类型， 例如 `Hello typescript`

很明显， 模板字符串类型的主要目的即是增强字符串字面量类型的灵活性， 进一步增强类型和逻辑代码的关联。 通过模板字符串类型你可以这样声明你的版本号：

```typescript

type Version = `${number}·${number}·${number}`;
```

而在需要声明大量存在关联的字符串字面量类型时候，模板字符串类型也能在减少代码的同时获得更好的类型保障。 举例来说， 当我们需要声明以下字符串类型时：

```typescript
type SKU =
  | 'iphone-16G-official'
  | 'xiaomi-16G-official'
  | 'honor-16G-official'
  | 'iphone-16G-second-hand'
  | 'xiaomi-16G-second-hand'
  | 'honor-16G-second-hand'
  | 'iphone-64G-official'
  | 'xiaomi-64G-official'
  | 'honor-64G-official'
  | 'iphone-64G-second-hand'
  | 'xiaomi-64G-second-hand'
  | 'honor-64G-second-hand';
```

随着商品、 内存数、货品类型的增加， 我们可能需要成几何倍地新增。 但如果使用模板字符串类型， 我们可以利用其**自动分发的特性**来实现简便又严谨的声明：

```typescript
type Brand = `iphone` | 'xiaomi' | 'honor';
type Memory = `16G` | '64G';
type ItemType = 'official' | 'second-hand';

type SKU = `${Brand}-${Memory}-${ItemType}`;
```

在插槽中传入联合类型， 然后你就会发现， 所有的联合类型排列组合都已经自动组合完毕了：

```typescript
type SKU = "iphone-16G-official" | "iphone-16G-second-hand" | "iphone-64G-official" | "iphone-64G-second-hand" | "xiaomi-16G-official" | "xiaomi-16G-second-hand" | "xiaomi-64G-official" | ... 4 more ... | "honor-64G-second-hand"
```

你可能会想， 如果某一种组合并不存在， 就像 `iphone-32G` 系列? 我们可以使用差集就可以处理掉， 比如我们可以只是剔除数个确定商品集合， 也可以再利用模板字符串类型的排列组合能力生成要剔除的集合。 通过这种方式， 我们不仅不需要再手动声明一大堆工具类型， 同时也获得了逻辑层面的保障： 他会忠实地将**所有插槽中的联合类型与剩余的字符串部分进行排列组合**

除了直接再插槽中传递联合类型， 通过泛型传入联合类型同样会有分发过程：

```typescript
type SizeRecord<Size extends string> = `${Size}-Record`;

type Size = 'Small' | 'Middle' | 'Large';

type UnionSizeRecord = SizeRecord<Size>; // "Small-Record" | "Middle-Record" | "Large-Record"

```

## 模板字符串类型的类型表现

模板字符串和字符串字面量类型实在太过相似， 我们很容易想到他和字符串类型之间的类型兼容性是怎样的。

实际上， 由于模板字符串类型最终的产物还是字符串字面量类型， 因此只要插槽位置的类型匹配， 字符串字面量类型就可以被认为是模板字符串类型的子类型， 比如我们上面的版本号：

```typescript
declare let v1: `${number}.${number}.${number}`;
declare let v2: '1.2.4';
```

但如果反过来， `v2 = v1` 很显然是不成立的， 因为 v1 还包涵了 `10.0.0` 等等情况。 同样的， 模板字符串类型和模板字符串也拥有着紧密的联系

```typescript
const greet = (to: string): `Hello ${string}` => `Hello ${to}`;

```

这个例子进一步体现了类型与值的紧密关联，通过模板字符串类型，现在我们能够进行更精确地类型描述了。

## 结合所有类型与映射类型

说到模板字符串插槽中传入联合类型的字段分发特性时， 你可能会想到此前我们接触的一个能够生成联合类型的工具： 索引类型查询操作符 keyof。 基于**keyof + 模板字符串类型**， 我们可以基于已有的对象来实现精确到字面量的类型推导

```typescript
interface Foo {
  name: string;
  age: number;
  job: Job;
}

type ChangeListener = {
  on: (change: `${keyof Foo}Changed`) => void;
};

declare let listener: ChangeListener;

// 提示并约束为 "nameChanged" | "ageChanged" | "jobChanged"
listener.on('');
```

在需要基于已有的对象类型进行字面量层面的变更时候， 我们现在能够放心地将这部分类型约束也交给模板字符串类型了。 而除了索引类型， 模板字符串类型也和映射类型有着奇妙的化学反应。

为了与映射类型实现更好的协作， ts 在引入模板字符串类型时支持了一个叫做**重映射（Remapping）** 的新语法， 基于模板字符串与重映射， 我们可以实现一个此前无法想象的新功能： **在映射键名时基于原键名做修改**

我们可以使用映射类型很容易的赋值一个接口:

```typescript
type Copy<T extends object> = {
  [K in keyof T]: T[K];
 }
```

然而， 如果我们赋值时候小小的修改下键名要怎么做？ 比如从 `name` 到 `modified_name` ? 修改键值类型我们都很熟练了， 但要修改键名， 就需要通过模板字符串类型

```typescript
type CopyWithRename<T extends object> = {
  [K in keyof T as `modified_${string & K}`]: T[K];
};

interface Foo {
  name: string;
  age: number;
}

// {
//   modified_name: string;
//   modified_age: number;
// }
type CopiedFoo = CopyWithRename<Foo>;
```

这里我们其实就是通过 `as` 语法， 将映射的键名作为变量， 映射到一个新的字符串类型。 需要注意的是， 由于对象的合法键名类型包括了 symbol， 而模板字符串类型插槽中并不支持 symbol 类型。 因此我们使用 `string & K` 来确保最终交由模板插槽的值， 一定会是合法的 string 类型。

## 专用工具类型

这些工具类型专用于字符串字面量类型

- Uppercase 字符串大写
- Lowercase 字符串小写
- Capitalize 首字母大写
- Uncapitalize 首字母小写

上面重映射部分。 我们成功将键名从 name 修改成了 modified_name 的形式， 如果要修改成我们更习惯的小驼峰形式呢？

此时就可以使用 Capitalize 工具类型了：

```typescript
type CopyWithRename<T extends object> = {
 [K in keyof T as `modified${Capitalize<string & K>}`]: T[K];
};

```

实际上， 这是 ts 首次引入了**能直接改变类型本身含义**的工具类型， 你肯定对他内部的实现很感兴趣， 然而当你跳到源码定义时候却会发现它们是这样的

```typescript
type Capitalize<S extends string> = intrinsic;
```

intrinsic 代表了这一工具类型由 TypeScript 内部进行实现，如果我们去看内部的源码，会发现更神奇的部分：

```typescript
function applyStringMapping(symbol: Symbol, str: string) {
  switch (intrinsicTypeKinds.get(symbol.escapedName as string)) {
    case IntrinsicTypeKind.Uppercase: return str.toUpperCase();
    case IntrinsicTypeKind.Lowercase: return str.toLowerCase();
    case IntrinsicTypeKind.Capitalize: return str.charAt(0).toUpperCase() + str.slice(1);
    case IntrinsicTypeKind.Uncapitalize: return str.charAt(0).toLowerCase() + str.slice(1);
  }
  return str;
}
```

在这里字符串字面量类型被作为一个字符串值一样进行处理，这些工具类型通过调用了字符串的 toUpperCase 等原生方法实现。而按照这个趋势来看，在未来我们很有可能实现对字面量类型的更多操作，甚至以后我们能直接调用 Lodash 来处理字符串类型也说不定。

## 模板字符串类型与模式匹配

模式匹配工具类型的核心理念就是对符合约束的某个类型结构， 提取某一个位置的类型， 比如函数结构中的参数与返回值类型。 而如果我们将一个字符串类型视为一个结构， 就能够在其中也应用模式匹配相关的能力，而我们此前所缺少的就是模板字符串类型的能力

模板插槽不仅可以声明一个占位的坑， 也可以声明一个要提取的部分

```typescript
type ReverseName<Str extends string> =
 Str extends `${infer First} ${infer Last}`
  ? `${Capitalize<Last>} ${First}`
  : Str;

```

我们一共在两处使用了模板字符串类型。 首先是在约束部分， 我们希望传入的字符串字面量类型是 中间带空格的形式。 注意， 这里的空格也要严格遵循， 因为它也是字面量类型的一部分，
对于符合这样约束的类型， 我们使用**模板插槽 + infer 关键字** 提取了其空格旁的两个部分。 最后将infer 提取出来的值， 再次使用模板插槽注入到了新的字符串类型中

除了显示使用 infer 进行模式匹配操作以外，由于模板字符串的灵活性， 我们甚至可以直接声明一个泛型来进行模式匹配操作。

```typescript
declare function handler<Str extends string>(arg: `Guess who is ${Str}`): Str;

handler('Guess who is cqc'); // 'cqc'
handler('Guess who is '); // ''

```

## 扩展

### 基于重映射的 PickValueType

上面讲到了重映射这个能力， 它使得我们可以在映射类型中去修改映射后的键名， 而如果映射后的键名变成了 never， 那么这个属性将不会出现在最终的接口结构中。
也就是说， 我们也可以基于重映射来实现**结构处理工具类型**， 比如说 PickValueType：

```typescript
type PickValueType<T, type> = {
 [K in keyof T as T[K] extends type ? K : never]: T[K] extends string
  ? never
  : T[K];
};

```
