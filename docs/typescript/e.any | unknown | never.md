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

在类型流的分析中， 一旦一个返回值为 never 的函数被调用， 那么下方的代码都会被视为无效的代码（即无法执行到）：

```typescript
function justThrow(): never {
  throw new Error()
}

function foo(input: number) {
  if(input > 1) {
    justThrow();
    // 等同于 return 语句后面的代码， 即 dead code
    const name = 'cqc'
  }
}
```

我们可以显示的利用它来进行类型检查， 即上面在联合类型中 never 类型神秘消失的原因。
假设，我们需要对一个联合类型的每个类型分枝进行不同处理：

```typescript
declare const strOrNumOrBool: string | number| boolean;

if (typeof strOrNumOrBool === 'string') {
  console.log('string');
} else if(typeof strOrNumOrBool === 'number') {
  console.log('number');
}  else if(typeof strOrNumOrBool === 'boolean') {
  console.log('boolean');
} else {
  throw new Error('unknown input type: ' + strOrNumOrBool)
}
```

如果我们希望这个变量的每一种类型都需要得到妥善处理， 在最后可以抛出一个错误， 但这是只有运行时候
才会生效的措施， 是否能在类型检查时候就分析出来？

实际上， 由于 TypeScript 强大的类型分析能力， 每经过一个 if 语句处理， <aMark>strOrNumOrBool</aMark> 的类型分枝就会减少一个。
而在最后的 else 代码块中， 它的类型就只剩下了 nerve 类型， 即一个无法再细分、本质上并不存在的虚空类型。在这里， 我们可以利用 never 类型变量仅能
赋值给 never 类型变量的特性， 来巧妙地分支处理检查：

```typescript
if (typeof strOrNumOrBool === 'string') {
  // 一定是 string
  strOrNumOrBool.charAt(1);
} else if(typeof strOrNumOrBool === 'number') {
  strOrNumOrBool.toFixed();
} else if(typeof strOrNumOrBool === 'boolean') {
  strOrNumOrBool === true;
} else {
  const _exhaustiveCheck: never = strOrNumOrBool;
  throw new Error('unknown input type: ' + strOrNumOrBool)
}
```

假如某个粗心的同事新增了一个类型分支， <aMark>strOrNumOrBool</aMark> 变成了  <aMark>strOrNumOrBoolOrFunc</aMark>  却忘记了新增对应的处理分支， 此时在 else 代码块中就会出现将 Function 类型赋值给 never 类型变量的类型错误。

这实际就是利用了类型分析能力与 never 类型只能赋值给 never 这一点， 来确保联合类型能够被妥善处理。

除了主动使用 never 类型的两种方式， never 在某些情况下还会不请自来：

```typescript
const arr = [];

arr.push('cqc'); // 类型 string 不能赋值给 类型 never 的参数
```

此时这个未标明类型的数组被推导为了  <aMark>never[]</aMark> 类型， 这种情况仅会在你启用了 <aMark>strictNotNullChecks</aMark> 配置，
同时禁用了 <aMark>noImplicitAny</aMark> 配置时候才会出现。 解决这个问题也很简单， 为这个数组声明一个具体类型即可。

## 类型断言

警告编译器不准报错， 类型断言能显示的告诉类型检查程序当前这个变量的类型， 可以进行类型分析地修正、类型。
它其实就是一个将变量的已有类型更改为新指定类型的操作， 它的基本语法为 <aMark>as NewType</aMark>,
你可以将 any/unknown 类型断言到一个具体类型

```typescript
let unknownVar: unknown;

(unknownVar as { foo: () => {} }).foo();
```

还可以 as 到 any 来为所欲为， 跳过所有的类型检查:

```typescript
const str: string = 'cqc';

(str as any).func().foo;
```

也可以在联合类型断言一个具体的分支:

```typescript
function foo(union: string | number) {
  if ((union as string).includes('cqc')) {

  }


  if ((union as number).toFixed() === 599) {

  }
}
```

但是类型断言的正确打开方式是， 在 TypeScript 类型分析不正确或不符合预期时候， 将其断言为此处的正确类型:

```typescript
interface IFoo {
  name: string;
}

declare const obj: {
  foo: IFoo
}

const {
  foo = {} as IFoo
} = obj;
```

这里从 <aMark>{}</aMark> 字面量类型断言为了 <aMark>IFoo</aMark> 类型, 即为解构赋值默认值进行了预期的类型断言。
当然， 更严谨的方式应该是定义为 `Partial<IFoo>` 类型。

除了使用 as 语法以外， 你也可以使用 `<>` 语法。 它虽然书写更简洁， 但效果一致， 只是在 tsx 中尖括号并不能很好的被分析出来。

```typescript
function foo(arg: string | number) {
  if ((<string>arg).charAt(1)) {}
}
```

你也可以通过 TypeScript ESLint 提供的 <aMark>consistent-type-assertions</aMark> 规则来约束断言风格。

需要注意的是， 类型断言应当是在迫不得已的情况下使用的。 虽然说我们可以用类型断言纠正不正确的类型分析， 但类型分析在
大部分场景下还是可以智能地满足我们的需求的。

总的来说， 在实际场景中， 还是 <aMark>as any</aMark> 这一操作更多。 但这也是让你的代码编程 AnyScript 的罪魁祸首之一， 请务必小心使用.

### 双重断言

如果在使用类型断言时候， 原类型与断言类型之间差异过大， 也就算指鹿为马太过离谱， 离谱到了指鹿为霸王龙的程度， TypeScript 会给你
一个类型报错

```typescript
const str: string = 'cqc';

// 从 x 类型到 y 类型到断言可能是错误的， blabla
(str as { handler: () => {} }).handler();
```

此时他会提醒你先断言道 unknown 类型， 在断言到 预期类型， 就像这样：

```typescript
const str: string = 'cqc';

(str as unknown as { handler: () => {} }).handler();

// 尖括号断言
(<{handler: () => {}}>(<unknown>str)).handler();
```

这是因为你的断言类型和原类型的差异太大， 需要先断言到一个通用的类， 即 any/unknown。
这一通用类型包含了所有可能的类型， 因此**断言到它和从它断言到另一个类型**的差异不大。

### 非空断言

非空断言其实是类型断言的简化， 它使用<aMark>!</aMark> 语法， 即 <aMark>obj!.func()!.prop</aMark> 的形式
标记前面的一个声明一定是非空的（实际上就是剔除了 null 和 undefined 类型）

```typescript
declare const foo: {
  func?: () => ({
    prop?: number | null;
  })
}

foo.func!().prop!.toFixed();
```

其应用位置类似于可选链`foo.func?.().prop?.toFixed()`, 但不同的是， 非空断言的运行时仍然会保持调用链， 因此在运行时候可能会报错。
而可选链则会在某一部分收到 undefined 或 null 时候直接短路掉， 不会再发生后面的调用。

你可以通过 <aMark>non-nullable-type-assertion-style</aMark>
规则来检查代码中是否存在类型断言能够被简写为非空断言的情况。

类型断言还用一种用法上作为代码提示的辅助工具， 比如对于下面这个稍微复杂的接口：

```typescript
interface IStruct {
  foo: string;
  bar: {
    barPropA: string;
    barPropB: string;
    barMethodL: () => void;
    baz: {
      handler: () => Promise<void>
    }
  }
}

```

假设你想要基于这个结构随便实现一个对象

```typescript
const obj: IStruct = {};
```

这时候等你的是 一堆类型报错， 你必须规规整整地实现这个接口才可以。 但如果使用类型断言， 我们可以在
保留类型提示的前提下， 不那么完整地实现这个结构:

```typescript
const obj = <IStruct>{
  bar: {
    // 仍有类型提示， 错误实现时候仍有 报错信息
    baz: {}
  }
}
```

## 扩展

这一章节讲的其实都和 TypeScript 的类型层级有所关联, 前面讲到过，
any 与 unknown 属于 **Top Type**, 表现在它们包含了所有可能的类型， 而
never 属于 **Bottom Type**， 表现在它是一个虚无的、不存在的类型。那么加上此前学习的原始类型与字面量类型等，
按照类型的包含来进行划分， 我们大概能够梳理出这么个类型层级关系：

- 最顶级的类型  any、unknown
- 特殊的 Object， 它也包含了所有的类型, 但和 Top Type 比较还是差了一层
- String、Boolean、Number 这些装箱类型
- 原始类型与对象类型
- 字面量类型，即更精确的原始类型与对象类型， 需要注意的是 null、 undefined 并不是字面量类型的子类型
- 最底层的never

> 实际上这个层级链并不完全， 因为还有联合类型、交叉类型、 函数类型的情况， 后面会讲到

而实际上类型断言的工作原理也和类型层级有关，在判断断言是否成立，即差异是否能接受时， 实际上判断的即是这两个类型是否能够找到一个公共的父类型.
比如 <aMark>{ }</aMark> 和 <aMark>{ name: string }</aMark> 其实可以认为拥有公共的父类型 <aMark>{ }</aMark> (一个新的 <aMark>{ }</aMark>,
你可以理解为这是一个基类， 参与断言的 `{ }` 和 `{ name: string; }` 是它的派生类。
)

如果找不到具有意义的公共父类型呢？ 这时候就需要请出 **Top Type** 了， 先把它断言到 **Top Type**， 那么就拥有了公共父类型**Top Type**， 在
断言到具体类型也是同理。
你可以理解为先向上断言，再向下断言。
