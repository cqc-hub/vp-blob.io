---
sidebar: 'auto'

prev:
 text: g.类型工具(part 2)
 link: /typescript/g.类型工具(part 2).html

next:
 text: i.结构化类型系统：类型兼容性判断的幕后
 link: /typescript/i.结构化类型系统：类型兼容性判断的幕后.html
---

#

## 类型别名中的泛型

在类型工具里面， 我们已经接触过泛型了, 比如类型别名如果声明了泛型坑位，那其实等价于一个接受参数的函数,
类型别名中的泛型大多都是用来进行工具类型的封装, 比如在映射中学习的工具类型：

```typescript
type Stringify<T> = {
  [K in keyof T]: string;
}


type Clone<T> = {
  [K in keyof T]: T[K];
}
```

Stringify 会将一个对象类型的所有属性内容设置为 string， Clone 则会进行类型的完全复制。

我们可以提前看一个 typescript 内置的工具类的实现:

```typescript
type Partial<T> = {
  [K in keyof T]?: T[K];
}
```

工具类型 `Partial` 会将传入的对象类型复制一份， 但会多了一个 `?` 的可选标记, 也就是说，
我们获得了一个属性均可选的山寨版类型。

```typescript
interface IFoo {
 prop1: string;
 prop2: number;
 prop3: () => void;
}

type PartialIFoo = Partial<IFoo>;

// 等价于
interface PartialIFoo {
  prop1?: string;
  prop2?: number;
  prop3?: () => void;
}

```

> 内置工具类型地解析、扩展、进阶， 在后面会慢慢讲到

类型别名与泛型的结合中， 除了映射类型、索引类型等类型工具以外， 还有一个非常重要的工具： **条件类型**，简单了解下：

```typescript
type IsEqual<T> = T extends true ? 1 : 2;

type A = IsEqual<true>; // 1
type B = IsEqual<false>; // 2
type C = IsEqual<'cqc'>; // 2
```

在条件类型参与的情况下， 通常泛型会被作为条件类型中的判断条件( <aMark>T extends condition</aMark> , 或者 <aMark>type extends T</aMark> ),
以及返回值（即 <aMark>:</aMark> 的值）， 这也是我们筛选类型需要依赖的能力之一。

## 泛型约束与默认值

像函数可以声明一个参数的默认值一样， 泛型同样有着默认值的设定， 比如：

```typescript
type Factory< = boolean> = T | number | string;
```

这样在你调用时候就可以不带任何参数了， 默认会使用我们设置的默认值来填充。

```typescript
const foo: Factory = false;
```

除了声明默认值之外， 泛型还能做到一样函数参数做不到的事情， **泛型约束**。 也就是说，
你可以要求传入这个工具类型的泛型必须符合某些条件， 否则你就拒绝进行后面的逻辑。
在函数中， 我们只能在逻辑中处理:

```typescript
const add = function(source: number, add: number) {
  if (typeof source !== 'number' || typeof add !== 'number') {
    throw new Error('Invalid arguments!')
  }

  return source + add;
}

```

而在泛型中， 我们可以使用 `extends` 关键字来约束传入的泛型参数必须符合要求。 关于 extends，
`A extends B` 意味着 **A 是 B 的子类型**， 这里我们暂时只需要了解简单的判断逻辑， 也就是说，
A 比 B 更精确， 或者说更复杂。 具体来说， 可以分为以下几类：

- 更精确， 如**字面量类型是对呀原始类型的子类型**， 即 `'cqc' extends string`, `599 extends number` 成立。
类似的， **联合类型子集均为联合类型的子类型**， 即 `1` 、 `1 | 2` 是 `1 | 2 | 3 | 4` 的子类型。

- 更复杂， 如 `{ name: string }` 是 `{ }` 的子类型， 因为在 `{ }` 的基础上增加了额外的类型， 基类与派生类（父类与子类） 同理。

我们来看下面的例子：

```typescript
type ResStatus<ResCode extends number> = ResCode extends 1000 | 1001 | 1002 ? 'success' : 'failure';
```

这个例子会工具传入的请求码判断请求是否成功， 这意味着它只能处理数字字面量类型的参数， 因此我们通过 `extends number` 来标明其类型约束，
如果传入一个不合法的值， 就会出现类型错误：

```typescript
type Res1 = ResStatus<1000>; // success
type Res2 = ResStatus<2000>; // failure

type Res3 = ResStatus<'6666'>; // 类型 string 不满足约束 number
```

与此同时， 如果我们想让这个类型别名可以无需显示传入泛型参数也能调用， 并且默认情况是成功的， 这样就可以为这个泛型参数声明一个默认值：

```typescript
type ResStatus<ResCode extends number = 1000> = ResCode extends 1000 | 1001 | 1002 ? 'success' : 'failure';

type Res4 = ResStatus; // success
```

在 typescript 中， 泛型参数存在默认约束（在下面的函数泛型， Class 泛型中也是）。 这个默认约束值 在 typescript 3.9 版本以前是 any，
而在 3.9 之后是 unknown。 在 typescript eslint 中， 你可以使用 [no-unnecessary-type-constraint](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/no-unnecessary-type-constraint.md) 规则， 来避免代码中声明了与
默认约束相同的约束。

## 多泛型关联

我们不仅可以同时传入多个泛型参数， 还可以让这几个泛型参数之间也存在联系。

```typescript
type Conditional<Type, Condition, TruthyResult, FalsyResult> =
 Type extends Condition ? TruthyResult : FalsyResult;

// passed!
type Result1 = Conditional<'cqc', string, 'passed!', 'rejected!'>;

// rejected!
type Result2 = Conditional<'cqc', boolean, 'passed!', 'rejected!'>;
```

这个例子表明， **多泛型参数其实就像接受更多参数的函数，其内部的运行逻辑（类型操作）会更加抽象，**
**表现在参数（泛型参数）需要进行的逻辑运算（类型操作）会更加复杂**。

上面我们说， 多个泛型参数之间的依赖， 其实指的即是在后续泛型参数中， 使用前面的泛型参数作为约束或默认值：

```typescript
type ProcessInput<
 Input,
 SecondInput extends Input = Input,
 ThirdInput extends Input = SecondInput
> = ThirdInput;
```

这里的内部类型操作并不是重点， 直接忽略即可。 从这个例子中， 我们可以知道：

- 这个工具类型接受 1 - 3 个泛型参数。
- 第二、 三个泛型参数的类型需要是**首个泛型参数的子类型**。
- 当只传入一个泛型参数时，其第二个泛型参数会被赋值为此参数， 而第三个则会赋值为第二个泛型参数， 相当于**均使用了这唯一传入的泛型参数**。
- 当传入了两个泛型参数时，第三个泛型参数**会默认赋值为第二个泛型参数的值**。

多泛型关联在一些复杂的工具类型中非常常见， 后面会在实战中讲， 这里了解即可。

## 对象类型中的泛型

由于泛型提供了对类型结构的复用能力， 我们也经常在对象类型结构中使用泛型。 最常见的一个例子应该还是响应类型结构的泛型处理：

```typescript
interface IRes<TData = unknown> {
  code: number;
  error?: string;
  data: TData;
}
```

这个接口描述了一个通用的响应类型结构， 预留了实际响应数据的泛型坑位， 然后在你的请求函数中就可以传入特定的响应类型了：

```typescript
interface IUserProfileRes {
  name: string;
  avatar: string;
}

const fetchUserProfile = (): Promise<IRes<IUserProfileRes>> => {
  return ...
}

type StatusSucceed = boolean;
const handlerOperation = (): Promise<IRes<StatusSucceed>> => { };
```

而泛型嵌套的场景也非常常用, 比如对存在分页结构的数据， 我们也可以将其分页的响应结构抽离出来：

```typescript
interface IPaginationRes<TItem = unknown> {
  data: TItem[];
  page: number;
  toTalCount: number;
  hasNextPage: boolean;
}

const fetchUserProfileList = (): Promise<IPaginationRes<IUserProfileRes>> => {
  ...
}
```

这些结构看起来很复杂， 但其实就是**简单的泛型参数填充**而已。 就像我们会封装请求库、 请求响应拦截器一样，
对请求中的参数、响应中的数据的类型的封装其实也不应该落下。 甚至在理想情况下， 这些结构体封装应该在请求库
封装一层中就被处理掉。

## 函数中的泛型

假设我们有这么一个函数， 他可以接受多个类型的参数并进行对应处理， 比如：

- 对于字符串， 返回部分截取；
- 对于数字， 返回它的 n 倍；
- 对于对象， 修改它的属性并返回；

这个时候， 我们要如何对函数进行类型声明？ 是 any 大法好？

`function handler(input: any): any { }`

还是用联合类型来包括所有可能类型？

```typescript
const handler = (input: string | number | { }): string | number | {} { };
```

第一种肯定要直接 pass， 第二种虽然麻烦了一些， 但似乎可以满足？ 但如果我们真的调用一下就知道不合适了。

```typescript
handler('cqc'); // string | number | {}
handler(233); // string | number | {}
handler({ name: 'cqc' }); // string | number | {}
```

虽然我们约束了入参类型， 但返回值的类型并没有像我们预期的那样和入参关联起来， 上面三个调用结果都是一个宽泛的联合类型
`string | number | {}`。难道要用重载一个个声明可能的关联关系？

```typescript
function handler(input: string): string;
function handler(input: number): number;
function handler(input: {}): {};

function handler(input: string | number | {}): string | number | {} {
  ...
}
```

天， 如果再多一些复杂的情况， 别说你愿不愿意补充每一种关联了， 同事看到这样的代码都会质疑你的水平。
这个时候， 我们就该请出泛型了:

```typescript
const handler = <T>(input: T): T => {
 return input;
};

const a = handler('cqc'); // 'cqc'
let b = 25;
handler(b); // number

```

我们为函数声明了一个泛型参数 T， 并将参数的类型与返回值类型指向这个泛型参数。 这样， 在这个函数接受到这个参数时候，
**T 会自动地被填充为这个参数的类型**。 这也就意味着你不在需要预先确定参数的可能类型了， 而**在返回值与参数类型关联的情况下**，
**也可以通过泛型参数来进行运算**。

在基于参数类型进行填充泛型时， 其类型信息会被推导到尽可能精确到程度， 如上面的 **`a` 会被推导到一个字面量类型 `cqc`, 而不是基础类型 `string`**。
而如果使用一个变量作为参数， 那么只会使用这个变量标注的类型（没有标注时候， 会使用 推导出的类型）。

在看一个例子：

```typescript
const swap = <T, U>([start, end]: [T, U]): [U, T] => {
 return [end, start];
};

const swap1 = swap(['cqc', 233]); // [number, string]
const swap2 = swap([null, 233]); // [number, null]
const swap3 = swap([{ name: 'cqc' }, {}]); // [{}, { name: string }]
```

在上面返回值类型对泛型参数进行了一些操作， 而你同样可以看到其调用信息符合预期。

函数中的泛型同样存在约束与默认值， 比如上面的 handler 函数， 现在我们希望做一些代码拆分， 不在处理对象类型的情况了：

```typescript
const handler = <T extends string | number>(input: T): T => {
 return input;
};
```

而 swap 函数， 现在我们只想处理数字元祖的情况:

```typescript
const swap = <T extends number, U extends number>([start, end]: [T, U]): [
 U,
 T
] => {
 return [end, start];
};

```

而多泛型关联也是如此， 比如 loadsh 的 pick 函数， 这个函数首先接受一个对象， 如何接受一个对象属性名组成的数组，
并从这个对象中截取选择的属性部分:

```typescript
const object = { a: 1, b: 2, c: 3, d: 4 };

_.pick(object, ['a', 'c']);
// => { a: 1, c: 3 }
```

这个函数很明显需要在泛型层面声明关联， 即数组中的元素只能来自于对象的属性名（组成的字面量联合类型！）， 因此我们可以这么写（部分简化）:

```typescript
pick<T extends object, U extends keyof T>(object: T, ...props: Array<U>): Pick<T, U>;
```

函数的泛型参数也会被内部的逻辑消费， 如：

```typescript
const handler = <T>(payload: T): Promise<[T]> {
  return new Promise((resolve, reject) => {
    resolve([payload])
  })
}
```

需要注意的是在 tsx 文件中泛型的尖括号可能会造成报错， 编译器无法识别这是一个组件还是一个泛型， 此时你可以让他长得更像泛型一点：

```typescript
const handler = <T extends any>(input: T): T => {}
```

函数中的泛型是日常使用较多的一部分， 更明显地体现了**泛型在调用时被填充**这一特性， 而类型别名中，我们更多的手动传入泛型。这一差异的
缘由其实就是它们的场景不同， 我们通常使用类型别名来**对已经确定的类型结构进行类型操作**, 比如将一组确定的类型放置在一起。 而在函数
这种场景中， 我们并不能确定泛型在实际运行时会被什么样的类型填充。

需要注意的是， 不要为了使用泛型而用泛型， 就像这样：

```typescript
const handler = <T>(v: T): void {
  console.log(v);
}
```

在这个函数中， 泛型 T **没有被返回值消费，也没有被内部逻辑消费**， 这样情况下即使随着调用填充了泛型参数， 也是没有意义的。因此这里可以使用 any 来进行类型标注。

## Class 中的泛型

class 中的泛型和函数中的泛型非常类似， 只不过函数中泛型参数的消费方式是参数和返回值类型， class 中的泛型消费方式则是属性、方法、乃至装饰器等。同时 class 内的
方法还可以在声明自己独有的泛型参数。 例：

```typescript
class Queue<TElementType> {
  private _list: TElementType[];

  constructor(initial: TElementType[]) {
    this._list = initial;
  }

  enqueue<TType extends TElementType>(ele: TType): TElementType[] {
    this._list.push(ele);
    return this._list;
  }

  enqueueWithUnknownType<TTpe>(element: TType): (TElementType | TType) {
    return [...this._list, element];
  }

  dequeue(): TElementType[] {
    this._list.shift();
    return this._list;
  }
}

```

其中， enqueue 的如此类型 TType 被约束为队列类型的子类型， 而 enqueueWithUnknownType 中的 TType 类型参数则不会受此约束，
它会在其被调用时候再对应的填充， 同时， 也会在返回值类型中被使用。

## 内置方法中的泛型

typescript 中为非常多的内置对象都预留了泛型坑位， 如 Promise 中

```typescript
const p = () => {
 return new Promise<boolean>((resolve) => {
  resolve(true);
 });
};

```

在你填充  Promise 的泛型之后， 其内部的 resolve 方法也自动填充了泛型， 而在 typescript 内部的
Promise 类型声明中同样是通过泛型实现：

```typescript
interface PromiseConstructor {
 resolve<T>(value: T | PromiseLike<T>): Promise<T>;
}

declare var Promise: PromiseConstructor;
```

还有 数组 `Array<T>` 当中， 其泛型参数代表数组的元素类型， 几乎贯穿所有的数组方法：

```typescript
const arr: Array<number> = [1, 2, 3];

//Argument of type 'string' is not assignable to parameter of type 'number'
arr.push('cqc');

// number | undefined
arr.find(() => false);

// number
arr.reduce((prev) => prev, 1);

// 报错  No overload matches this call.
arr.reduce<number[]>((prev, curr, idx, arr) => {
 return [...prev, curr];
}, []);
```

reduce 方法是相对特殊的一个， 它的类型声明存在几种不同的重载：

- 当你不传入初始值时候， 泛型参数会从数组的元素类型中进行填充。

- 当你传入初始值时候， 如果初始值类型与数组元素类型一致， 则使用数组的元素类型进行填充， 即上面的第一个 reduce。

- 当你传入一个非数组元素类型的初始值， 如上面第二个 reduce， reduce 的泛型参数会默认从这个初始值推导出的类型进行填充， 这里是 `never[]`

其中第三种情况也就意味着**消息不足， 无法推导出正确的类型**。 我们可以手动传入泛型参数来解决：

```typescript
arr.reduce<number[]>((prev, curr) => {
  return [...prev, curr];
}, [])
```

在 React 中， 我们同样可以找到无处不在的泛型坑位：

```typescript
const [state, setState] = useState<number[]>([]);

// 不传入默认值， 则类型为 number[] | undefined
const [state, setState] = useState();

//体现在 ref.current 上
const ref = useRef<number>();

const context = createContext<ContextType>({});
```
