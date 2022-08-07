---
sidebar: 'auto'
---

#

## 函数

### 函数的类型签名

如果说变量的类型说描述了这个变量的值的类型， 那么函数的类型就是描述了 **函数入参类型与函数返回值类型**， 它们同样适用 <aMark>:</aMark> 的语法进行类型标注

```typescript
// 函数声明
function foo(name: string): number {
  return name.length;
}

// 函数表达式
const foo1 = function (name: string): number {
  return name.length;
};

// 变量类型标注方式(可读性差， 一般不推荐)
const foo2: (name: string) => number = (name) => name.length;
```

如果只是为了描述这个函数的类型结构， 甚至可以这么做

```typescript
interface IFunc {
  (name: string): number;
}

const foo: IFunc = (name) => name.length;
```

### void 类型

在 ts 中， **一个没有返回值（即没有调用 return 语句）的函数**， 其返回类型应当被标记为 void 而不是 undefined, 即使它实际的值是 undefined

```typescript
// 没有调用 return
function foo(): void {}

// 调用了 return 但没有返回值_
function bar(): void {
  return;
}
```

在基础类型中提到过， **在 typescript 中，undefined 类型是一个实际的、有意义的类型值， 而 void 才代表着空的、没有意义的类型值**.
相比之下， void 就相当于 js 中的 null 一样。 因此在我们没有实际返回值时候，使用 void 类型能更好的说明这个函数没有进行返回操作, 在上面的第二个
例子中， 其实更好的返回方式是使用 undefined

```typescript
//这个函数进行了返回操作， 但是没返回实际的值
function bar(): undefined {
  return;
}
```

### 可选参数 与 rest 参数

可选参数有两种表现形式

```typescript
// 在函数逻辑中注入可选参数默认值
function fn1(name: string, age?: number): number {
  const inputAge = age || 25;
  return name.length + inputAge;
}

// 直接设置可选参数默认值, 此时不需要加上 ‘?’
function fn2(name: string, age: number = 25) {
  return name.length + age;
}
```

对于 rest 参数的类型标注也比较简单， 由于其实际上是一个数组， 这里我们也应当用数组进行标注

```typescript
function foo(arg1: string, ...rest: any[]) {}

// 也可以使用 元祖来定义 rest
function foo1(name: string, ...rest: [string, number]) {}

foo1('cqc', 'ball', 25);
```

### 重载

在某些逻辑较复杂情况下， 函数有可能有多足入参类型和返回值类型

```typescript
function fun(foo: number, bar?: boolean): string | number {
  if (bar) {
    return String(foo);
  } else {
    return foo * 500;
  }
}
```

在上面这个实例中， 函数的返回类型是基于`bar`的值， 从内部逻辑来看， `bar` 为 true 时候， 返回值是 string， 否则 number。而这里的类型
签名完全没有体现这一点。

要实现与入参关联的返回值类型， 我们可以使用 typescript 提供的 **函数重载签名（Overload Signature）**, 重载改写上面的例子

```typescript
function func(foo: number, bar: true): string;
function func(foo: number, bar?: false): number;

function func(foo: number, bar?: boolean): string | number {
  if (bar) {
    return String(foo);
  } else {
    return foo * 500;
  }
}

func(1); // number
func(2, true); // string
func(3, false); // number
```

上面三个 <aMark>function func</aMark> 具有不同的意义， 这里有个需要注意的地方，拥有多个重载声明的函数在被调用时，
是按照重载顺序往下查找的。因此在第一个重载声明中， 为了和逻辑保持一致， 即 bar 在 true 时候返回 string 类型， 这里我们需要将第一个重载声明的 bar 声明为必选的字面量类型

> 你可以试着为第一个重载声明的 bar 参数也加上可选符号， 然后就会发现第一个函数调用错误地匹配到了第一个重载声明

- `function func(foo: number, bar: true): string`, 重载签名一， 传入 bar 的值为 true 时候， 函数返回值是 string;
- `function func(foo: number, bar?: false): number`, 重载签名二, 传入 bar 的值为 false 或者不传 bar， 函数返回值是 number;
- `function func(foo: number, bar?: boolean): string | number`, 函数的实现签名， 会包含重载签名的所有可能情况;

基于函数重载签名， 我们就可以实现了将入参类型和返回值类型的可能所有情况进行关联， 获得了更精确的类型标注能力

事实上， typescript 中的重载更像是伪重载， 它只有一个具体实现， 其重载体现在方法调用的签名上而非具体实现上。
而在如 c++ 等语言中， 重载体现在多个 **名称一致但入参不同的函数实现上**, 这才是更广义的函数重载

### 异步函数、Generator 函数等类型签名

对于异步函数、 Generator 函数、 异步 Generator 函数的类型签名， 其参数签名基本一致， 而返回值类型有些区别

```typescript
async function asyncFun(): Promise<void> {}

function* genFun(): Iterable<void> {}

async function* asyncGenFun(): AsyncIterable<void> {}
```

其中， Generator 函数与异步 Generator 函数现在基本已经不再使用，这里仅了解即可。
而对于异步函数（async 函数），其返回回值必定为一个 Promise 类型， 而 Promise 内部包含的类型则通过泛型的形式书写，
即`Promise<T>`.

## Class

### 类与类成员的类型签名

类的主要结构只有 **构造函数、属性、方法、访问符**, 我们只需要关注这三个部分即可。这里需要说明一点，有人可能认为装饰器也是 Class 的结构，
但个人认为它并不是 Class 携带的逻辑， 不应该被归类到这里。

属性的类型标注类似于变量， 而构造函数、方法、存取器的类型标注类似函数

```typescript
class Foo {
  prop: string;

  constructor(inputProp: string) {
    this.prop = inputProp;
  }

  print(addon: string): void {
    console.log(`${this.prop} and ${addon}`);
  }

  get propA(): string {
    return this.prop + 'A';
  }

  set propA(value: string) {
    this.prop = value + 'A';
  }
}
```

唯一需要注意的是 setter 方法不允许进行返回值的类型标注, 可以理解为setter的返回值并不会进行消费,
他是一个只会关注过程的函数.类的方法同样可以进行函数重载， 且语法一致，这里不做描述

就是函数可以通过 **函数声明** 和 **函数表达式** 创建一样, 类同样可以通过类声明 和 类表达式 创建

```typescript
// 类表达式
const Foo = {
  prop: string;

  constructor(v: string) {
    this.prop = v;
  }
}
```

### 修饰符

在ts中我们可以使用这些修饰符

- <aMark>public</aMark>

  在 类、类的实例、子类 中能被访问

- <aMark>private</aMark>

  仅在 类的内部 可以访问

- <aMark>protected</aMark>

  仅在类与子类中可以访问, 你可以把 类 和 类的实例当成两种概念， 一旦实例化完毕(出厂零件)， 那就和类（工厂） 没有任何关系了, 即不允许再访问 受保护的成员
- <aMark>readonly</aMark>

除了 **readonly** 以外， 其他修饰符都是属于 访问性修饰符，而 readonly 属于操作性修饰符(和 interface 中的 readonly 意义一致)

```typescript
class Foo {
  private prop: string;

  constructor(v: string) {
    this.prop = v;
  }

  protected print(addon: string): void {
    console.log(this.prop + addon);
  }

  public get propA(): string {
    return this.prop + 'A'
  }

  public set propA(v: string) {
    this.propA = v + 'A'
  }
}

```

> 我们通常不会为构造函数添加修饰符， 而是让他保持默认的 **public**

当你不显示使用 访问性修饰符 的时候， 成员默认是被标记为 public. 实际上，通过构造函数为类赋值
的方式还是略显麻烦, 需要通过 声明类属性 以及 在构造函数中赋值. 简单起见， 我们可以在 构造函数中对参数直接声明
应用访问性修饰符

```typescript
// 此时， 参数会直接被赋值， 免去后续的手动赋值（this.name = name）
class Foo {
  constructor(public name: string) {}
}

const foo = new Foo('cqc') // { name: 'cqc'}
```

### 静态成员

ts中， 可以用 static 关键字来标识一个成员为静态成员

```typescript
class Foo {
  static staticHandler() {}
  public publicHandler() {}
}
```

不同与实例成员， 类内部的静态成员**无法通过 this 访问**, 需要通过<aMark>Foo.staticHandler</aMark>进行访问
