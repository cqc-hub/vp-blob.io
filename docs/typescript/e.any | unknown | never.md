---
sidebar: 'auto'
---

#

## any、unknown、never

ts 提供了一个内置类型 any， 来表示所谓的任意类型。

```typescript
log(message?: any, ...optionalParams: any[]): void;
```

在这里， 一个被标记为 any类型 的参数可以接受任意类型的值。除了 message 是any以外， optionalParams 作为一个reset参数，
也使用 <aMark>any[]</aMark>
进行了标记， 这就意味着你可以使用任意类型的任意数量类型来调用这个方法。 除了显式的标记了一个变量或参数为 any，在某些情况下
你的变量/参数也会被隐式地推导为any。 比如使用 let 声明一个变量但是不提供初始值， 以及不为函数参数提供类型标注:

```typescript
// any
let foo;

function func(params) {
  params //any
}
```

以上函数声明在 tsconfig 中启用了 <aMark>noImplicitAny</aMark>
时会报错， 你可以显式为这两个参数指定 any 类型， 或暂时关闭这一配置（不推荐）。 而 any 类型的变量几乎
无所不能， 他可以在声明后再次接受任意类型的值， 同时可以被赋值给其他任意类型的变量:

```typescript
// 被标记为 any 类型的变量可以拥有任意类型的值
let anyVar: any = 'cqc';

anyVar = false;
anyVar = 233;
anyVar = () => {};
// ...

// 标记为具体类型的变量也可以接受任何 any 的参数可以接受任意类型的值
const val1: string = anyVar;
const val2: number = anyVar;
const val3: {} = anyVar;
```

你可以在 any 类型变量上任意地进行操作， 包括赋值、访问、方法调用等等，
此时可以认为类型推导与检查时被完全禁用的：

```typescript
let anyVar: any = null;

anyVar.foo.bar();
anyVar[0][1].prop1;
```

any 类型的主要意义， 其实就是为了表示一个 **无拘无束的“任意类型”，他能兼容所有类型，也能被所有类型兼容**。
这一作用其实也意味着类型世界给你开了一个外挂， 无论什么时候， 你都可以使用 any 类型跳过类型检查。
当然，运行时候出现问题就需要自己负责.

> any 的本质是类型系统中的顶级类型， 即 Top Type， 这是许多类型语言中的重要概念。

### any 类型的使用

any 类型的万能性也导致我们经常滥用它， 比如类型不兼容了就 any 一下， 类型不想写了也 any 一下，
不确定可能是啥类型 还是 any 一下。 此时 TypeScript 就变成了令人诟病的 AnyScript.
为了避免这一情况， 我们需要记住一下使用小 tips：

- 如果类型不兼容报错导致你使用 any， 考虑使用类型断言代替
- 如果是类型太复杂到值你不想全部声明而使用 any， 考虑将这一出的类型去断言为你需要的最简类型。
如你需要调用 <aMark>foo.bar.baz()</aMark>, 就可以先将 foo 断言为一个具有 baz 方法的类型。
- 如果你是想表达一个未知类型， 更合理的方式是使用 unknown。

unknown 类型和 any 类型有些类似， 一个 unknown 类型的变量可以再次赋值为任意其他类型， 但只能赋值给 any 与 unknown 类型的变量:

```typescript
let unknownVar: unknown = 'cqc';

// 可以再次赋值为任意其他类型
unknownVar = false;
unknownVar = {
  name: 'cqc'
}
unknownVar = () => {}


const val1: string = unknownVar; //error
const val2: number = unknownVar; // error
const val3: () => {} = unknownVar; // error
// ...


// 但只能赋值给 any 与 unknown 类型的变量
const val4: any = unknownVar;
const val5: unknown = unknownVar;
```

### any、unknown 区别

any 与 unknown 的一个主要差异体现在赋值给别的变量时候， any 就像是 **我身化万千无处不在**,
所有类型都把它当自己人。 而 unknown 就像是 **我虽身化万千， 但我坚信我在未来的某一刻会得到一个确定的类型**, 只有 any 和 unknown 自己把它当自己人.

简单的说， any 放弃了所有的类型检查， 而 unknown 没有。 这一点也体现在对 unknown 类型的变量进行了属性访问时候:

```typescript
let unknownVar: unknown;

unknownVar.foo(); // 报错： 对象类型为 unknown
```

要对 unknown 类型进行属性访问， 需要进行类型断言， 即“虽然这是一个未知的类型， 但我保证它在这里就是这个类型”

```typescript
let unknownVar: unknown;

(unknownVar as { foo: () => {} }).foo();
```

在类型未知的情况下， 更推荐使用 unknown 标注。 这相当你使用额外的心智负担保证了类型在各处的结构，
后续重构为具体类型时也可以获得最初始的类型休息， 同时还保证了类型检查的存在。

当然， unknown 使用起来很麻烦， 一堆类型断言写起来可不太好看。 归根结底， 到底使用哪个完全取决于你自己， 毕竟语言只是工具嘛。

## never

never 就是一个什么都没有的类型， 和 void 类似， 但相比于 void ， never 还要更加彻底一点:

```typescript
// 'cqc' | 599 | true | void
type UnionWithNever = 'cqc' | 599 | true | void | never;
```

将鼠标挪动类型别名上， 你会发现这里显示的类型上 <aMark>'cqc' | 599 | true | void</aMark> .
never 类型直接被无视掉了， 而 void 仍然存在。 这是因为， void 作为类型表示一个空类型，
就像没有返回值的函数使用 void 来作为返回值类型标注一样， void 类型就像 javascript 中的 null 一样代表“
这里有类型， 但是个空类型”。

而 never 才是一个 “什么都没有” 的类型， 它甚至不包括空的类型， 严格来说， **never 类型不携带任何的类型信息**，
因此会在联合类型中被直接移除， 比如我们看 void 和 never 的类型兼容性:

```typescript
declare let v1: never;
declare let v2: void;

v1 = v2; // X 类型 void 不能赋值给类型 never

v2 = v1;
```

在编程语言的类型系统中， never 类型被称为 **Bottom Type**， 是**整个类型系统层级中最底层的类型**，
和 null、 undefined 一样， 它是所有类型的子类型， 但只有 never 类型的变量能够赋值给另一个 never 类型变量。

通常我们不会显式的声明一个 never 类型， 它主要被类型检查所使用。 但在某些情况下使用 never 确实是符合逻辑的，
比如一个只负责抛出错误的函数：

```typescript
function justThrrow(): never {
  throw new Error()
}
```
