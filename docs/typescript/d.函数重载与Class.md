---
sidebar: 'auto'

prev:
 text: c.字面量类型与枚举
 link: /typescript/c.字面量类型与枚举.html

next:
 text: e.any | unknown | never
 link: /typescript/e.any | unknown | never.html
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

不同与实例成员， 类内部的静态成员**无法通过 this 访问**, 需要通过<aMark>Foo.staticHandler</aMark>进行访问. 在 es5 中表现形式如下

```javascript
var Foo = /** @class */ (function() {
  function Foo () {}

  Foo.staticHandler = function() {}
  Foo.prototype.publicHandler = function() {}

  return Foo
}())

const foo = new Foo();
foo.publicHandler(); //  publicHandler
foo.staticHandler(); // typeError (staticHandler is not a function)

Foo.staticHandler(); // staticHandler
```

从上面例子可以看出, **静态成员是直接挂载在函数体上， 而实例成员挂载在原型上**， 这是二者的最重要差异。
> 静态成员不会被实例继承， 它始终只属于单前第一的这个类（包括子类），
> 而原型对象上的**实例成员则会沿着原型链进行传递**， 能够被继承

对于静态成员和实例成员的使用时机， 其实并不需要非常刻意的进行划分。 比如这里用 **类 + 静态成员** 来收敛变量与 utils 方法:

```typescript
class Utils {
  private static identifier = 'cqc';

  private static studyWithU() {};

  public static makeHappy() {
    Utils.studyWithU();

    //...
  }

  makeHappyInstance() {
    Utils.makeHappy();
  }
}

const utils = new Utils();
utils.makeHappy(); // typeError
utils.makeHappyInstance(); // makeHappyInstance
Utils.makeHappy(); // makeHappy
```

### 继承、实现、抽象类

Class 基本不会离开继承。 和 javascript 一样， typescript 中也使用 extends 关键字来实现继承

```typescript
class Base {}
class Derived extends Base {}
```

对于上面两个类， 比较严谨的称呼是 **基类（Base）** 与 **派生类(Derived)**。 当然，如果说你觉着叫 父类与子类更容易理解
也没问题。 关于基类与派生类, 我们需要了解的是 **派生类对基类成员对访问与覆盖操作**

基类中的哪些成员可以被派生类访问， 完全是有其访问性修饰符决定的。我们在上面已经介绍过， 派生类中可以访问到
使用 <aMark>public</aMark> 或 <aMark>protected</aMark> 修饰符的基类成员。 除了访问以外， 基类中的方法也可以
在派生类中被覆盖， 但我们仍然可以通过 super 访问到基类中的方法;

```typescript
class Base {
  print() {}
}

class Derived extends Base {
  print() {
    super.print();
    // some new operations ...
  }
}
```

在派生类中覆盖基类方法时候， 我们并不能确定派生类的这一方法能够覆盖基类方法， 万一基类中不存在这个方法呢？ so， typescript 4.3 中新增了
<aMark>override</aMark> 关键字， 来确保派生类尝试覆盖的方法一定在基类中存在定义

```typescript
class Base {
  print() {}
}

class Derived extends Base {
  // 这里ts将会给出错误， 因为尝试覆盖的方法未在基类中声明  override print 才行
  override printA() {
  }
}

```

除了基类和派生类以外， 还有一个比较重要的概念： **抽象类**。

抽象类是对类结构与方法的抽象， 简单来说， **一个抽象类描述了一个类中应当有哪些成员（属性、方法等），一个抽象方法描述了这一方法在实际实现中的结构**。
我们知道类的方法和函数非常相似， 包括结构， 因此抽象方法其实描述的就是这个方法的**入参类型**与**返回值类型**.

抽象类使用 <aMark>abstract</aMark>关键字声明:

```typescript
// 无法声明静态的抽象成员
abstract class AbsFoo {
  abstract absProp: string;
  abstract get absGetter(): string;
  abstract absMethod(name: string): string;
}
```

注意， 抽象类中的成员也需要使用 abstract 关键字才能被视作抽象类成员， 如这里的抽象方法。我们可以实现（<aMark>implements</aMark>）一个抽象类：

```typescript
class Foo implements AbsFoo {
  absProp: string = 'cqc';

  get asbGetter() {
    return this.absProp;
  }

  absMethod(name: string) {
    return name
  }
}
```

要实现一个抽象类， 我们必须实现这个抽象类的每一个抽象成员。 需要注意的是， **在 ts 中无法声明静态的抽象成员**。

对于抽象类， 他的本质就是描述类的的结构。 看到结构，你是否想到了 interface ？ 是的， interface 不仅可以声明函数结构， 也可以声明类的结构:

```typescript
interface FooAbstract {
  absProp: string;
  get absGetter(): string;
  absMethod(name: string): string;
}

class Foo implements FooAbstract {
  absProp = 'cqc';

  get absGetter() {
    return this.absProp;
  }

  absMethod(name: string) {
    return name
  }
}
```

在上面的例子中， 我们用类群实现了一个接口。 这里接口的作用和抽象类一样， 都是**描述这个类的结构**.
除此之外， 我们还可以使用 **Newable Interface** 来**描述一个类的结构**（类似于描述函数结构的 Callable Interface）：

```typescript
class Foo {}

interface FooStruct {
  new(): Foo
}

declare const NewableFoo: Foostruct;

const foo = new NewableFoo();
```

## 总结

这一篇中了解了 ts 的函数与类， 它们分别代表了面向过程与面向对象的编程理念。 对于函数， 着重了解其结构体的类型， 即参数类型（可选参数与剩余参数） 与返回值类型的标注。
而对于类， 实际上我们了解更多的是新的语法， 如访问性修饰符 <aMark>public</aMark> / <aMark>private</aMark> / <aMark>protected</aMark>,
操作性修饰符<aMark>readonly</aMark>, 静态成员<aMark>static</aMark>, 抽象类<aMark>abstract</aMark>, 以及<aMark>override</aMark>等
在 javascript 中不存在或实现并不完全的能力

## 扩展

### 私有构造函数

```typescript
class Foo {
  private constructor() {}
}
```

看起来没有什么问题， 都是当你想要实例化这个类的时候， 一行美丽的操作机会出现：**类的构造函数被标记为私有，且只允许在类内部访问**.

那就很奇怪了， 我们要一个不能实例化的类有啥用？

有些场景下私有构造函数确实有奇妙的用法， 比如我将一个类作为 utils 方法时候， 此时 Utils 类内部全部都是静态成员，我也不希望真的有人去实例化这个类，
此时就可以使用私有构造函数来阻止它被错误的实例化:

```typescript
class Utils {
  static ident = 'cqc';

  private constructor() {}

  static fn() {}
}
```

或者一个类希望把实例化逻辑通过方法来实现， 而不是通过 new 的形式时候，也可以使用构造函数来达成目的.

### SOLID 原则

SOLID 原则是面向对象编程中的基本原则， 他包括以下五种基本原则。

#### S

**单一功能原则， 一个类应该仅仅具有一种职责**， 这也意味着只存在一种原因使得需要修改类的代码，
如对于一个数据实体的操作，其读操作于写操作也应当被视为两种不同的职责， 并被分配到两个类中。

#### O

 **开放封闭原则，一个类应当是可扩展但不可修改的**。 即假设我们的业务中支持通过微信、支付宝登录， 原本在一个login方法中进行 if else 判断，
假设后面又新增了抖音、美团登录， 难道要加 else if / switch case 吗？

```typescript

enum LoginType {
  WeChat,
  TaoBao,
  TikTok,
  // ...
}

class Login {
  public static handler(type: LoginType) {
    if (type === LoginType.WeChat) { }
    else if(type === LoginType.TaoBao) { }
    else if(type === LoginType.TikTok) {}
    else {
      throw new Error('Invalid Login Type!')
    }
  }
}


```

当然不， 基于开放封闭原则， 我们应当将登陆逻辑抽离出来， 不同登陆方式通过扩展这个基础类来实现自己的特殊逻辑。

```typescript
// interface LoginHandler {
//   handler(): void;
// }

abstract class LoginHandler {
  abstract handler(): void
}


class WeChatLoginHandler implements LoginHandler {
  handler() {}
}

class TaoBaoLoginHandler implements LoginHandler {
  handler() {}
}

class TikTokLoginHandler implements LoginHandler {
  handler() {}
}

class Login {
  public static handlerMap: Record<LoginType, LoginHandler> = {
    [LoginType.TaoBao]: new TaoBaoLoginHandler(),
    [LoginType.TikTok]: new TikTokLoginHandler(),
    [LoginType.WeChat]: new WeChatLoginHandler()
  }

  public static handler(type: LoginType) {
    Login.handlerMap[type].handler()
  }
}

```

#### L

**里式替换原则， 一个派生类可以在程序的任何一处对其基类进行替换**, 这也意味着， 子类完全继承父类的一切，
对父类进行了功能的扩展（而非收缩）

#### I

**接口分离原则， 类的实现应当只需要实现自己需要的那部分接口**。 比如微信登录支持指纹识别， 支付宝支持指纹识别、人脸识别， 这个时候微信登录的类
应该不需要实现人脸识别才对。 这也意味着我们提供的抽象类应当按照功能纬度拆分成粒度更小的组成才对

#### D

**依赖倒置原则**, 这是实现开闭原则的基础， 它的核心思想即是**对功能的实现应该依赖于抽象层**, 即不同的逻辑通过实现不同的抽象类。
还是登录的例子， 我们的登录提供方法应该基于共同的登录抽象类实现（LoginHandler）， 最终调用方法也基于这个抽象类， 而不是在一个高阶登录方法中去依赖多个低阶登录的提供方
