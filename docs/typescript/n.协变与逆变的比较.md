---
sidebar: auto
prev:
 text: n.协变与逆变的比较
 link: /typescript/n.协变与逆变的比较.html

next:
 text: o.进阶
 link: /typescript/o.进阶.html


---

#

## 总结

本章节没看懂， 只需要硬记 两点(在入参、出参 为继承关系且在开启严格函数类型检查的前提下的 函数类型)
只针对类型声明是通过 property 时候生效, (method 声明不生效（也就是说在 method 声明中函数是 双变的）)

```typescript
// method 声明
interface T1 {
 func(arg: string): number;
}

// property 声明
interface T2 {
 func: (arg: string) => number;
}

```

- 对于入参 <a-mark>((parent) => void) extends ((child) => void) </a-mark>  成立
- 对于出参 <a-mark>(() => child) extends (() => parent)</a-mark> 成立

可以通过 TypeScript ESLint 的规则以及 strictFunctionTypes 配置，来为 interface 内的函数声明启用严格的检查模式。

以下是正文

## 函数有类型层级嘛？ 如果有， 下面类型层级又是什么样子的

```typescript
type FooFunc = () => string;
type BarFunc = () => 'cqc';
type BarzFunc = () => number;
```

## 比较函数类型签名

首先要明确的是。 我们不会使用函数类型和其他类型（比如对象）比较， 因为这并没有什么意义， 本文中只会讲两个函数类型之间的比较。

```typescript
class Animal {
 asPat() {}
}

class Dog extends Animal {
 bark() {}
}

class Corgi extends Dog {
 cute() {}
}

```

对于一个接受 Dog 类型并返回 Dog 类型的函数， 我们可以这样表示

```typescript
type DogFactory = (arg: Dog) => Dog;
```

在本文中， 我们将其进一步简化为： `Dog -> Dog` 的表达形式。

对于函数类型的比较， 实际上我们要比较的即是参数类型与返回值类型（也只能是这俩位置）， 对于 Animal、Dog、Corgi 这三个类， 如果将它们分别可重复地放置在参数类型与返回值类型处， 相当于排列组合， 就可以得到以下这些函数签名类型：

> 这里的结果不包括 `Dog -> Dog`, 因为我们要用它作为基础来被比较

- `Animal -> Animal`
- `Animal -> Dog`
- `Animal -> Corgi`
- `Dog -> Dog`
- `Dog -> Animal`
- `Dog -> Corgi`
- `Corgi -> Corgi`
- `Corgi -> Dog`
- `Corgi -> Animal`

直接比较完整的函数类型并不符合我们的思维直觉， 因此我们需要引入一个辅助函数： 它接受一个 `Dog -> Dog` 类型的参数：

```typescript
function transformDogAndBark(dogFactory: DogFactory) {
 const dog = dogFactory(new Dog());

 dog.bark();
}
```

对于函数参数， 实际上类似于我们在类型系统层级时候讲到的， **如果一个值能够被赋值给某个类型的变量， 那么可以认为这个值的类型为此变量的子类型**

如一个简单接受 Dog 参数类型的函数：

```typescript
function makeDogBark(dog: Dog) {
  dog.bark();
}
```

它在调用时候只可能接受 Dog 类型 或 Dog 类型的子类型， 而不能接受 Dog 类型的父类型：

```typescript
makeDogBark(new Corgi()); //  可以
makeDogBark(new Animal()); // 报错
```

相对严谨的说， 这是因为 派生类（即子类） 会保留基类的属性和方法， 因此说其与基类兼容， 但基类不能未卜先知的拥有子类的方法。 相对形象地来说， 因为我们要让这只狗汪汪两声， 柯基、德牧 都会， 但如果你传个牛进来， 就很难办了。

> 里氏替换原则， 子类可以拓展父类的内容， 但不能改变父类原有的功能， 子类型 必须能够替换掉它们的基类

回到这个函数， 我们只会传入一只正常的狗狗， 但他不一定是什么品种。 其次， 你返回的也必须是一只狗狗， 我并不在意它是什么品种。

对这两条约束依次进行检查：

- 对于 `Animal/Dog/Corgi -> Animal` 类型， 无论他的参数类型是什么样的， 他的返回值类型都是不满足条件的。 因为它返回的并不一定是合法的狗狗， 即我们说它不是 `Dog -> Dog` 的子类

- 对于 `Corgi -> Corgi` 与 `Corgi -> Dog`, 其返回值满足了条件， 但是参数类型又不满足了。这两个类型需要接受 Corgi 类型， 可能程序内部需要它腿短的这个特性， 但我们可没说一定会传入柯基， 如果我们传个德牧， 程序可能就崩溃了

- 对于 `Dog -> Corgi`, `Animal -> Corgi` 、 `Animal -> Dog`, 首先它们的参数类型正确的满足了约束，能接受一只狗狗。 其次， 它们返回值类型也一定能 汪汪汪

而实际上， 如果我们去掉了包涵 Dog 类型的例子 会发现只剩下 `Animal -> Corgi` 了， 也即是说， `(Animal -> Corgi) ≼ (Dog -> Dog)` 成立（A ≼ B 意为 A 为 B 的子类型）

观察以上排除方式的结论：

- 参数类型**允许**为 Dog 的父类型， **不允许**为 Dog 的子类型。
- 返回值的类型**允许为 Dog**的子类型， **不允许**为 Dog的父类

你是否 get 到了什么？ 这里用来比较的两个函数类型， 其实就是把具有父子关系的类型放置在参数、返回值 的位置上， **最终函数类型的关系直接取决于类型的父子关系**， 取决于也就意味着其中有迹可循， 这个时候， 就可以引入协变与逆变的关系了。

## 协变与逆变

上一节我们得到的结论是 考虑 `Corgi ≼ Dog ≼ Animal`, 当有函数类型 `Dog -> Dog`, 仅有  `Animal -> Corgi ≼ Dog -> Dog` 成立（即能被视为此函数的子类型）， 这里的参数类型与返回值实际上可以各自独立出来看：

考虑  `Corgi ≼ Dog`, 假设我们对其返回值类型的函数签名类型包装， 则有 `(T -> Corgi) ≼ (T -> Dog)`, 也就是说， 在我需要狗狗的地方， 柯基都是可以用的。 即不考虑参数类型的情况， 在包装为函数签名的返回值类型后， 其子类型层级关系保持一致。

考虑 `Dog ≼ Animal`,  如果参数类型的函数签名类型包装， 则有 `Animal -> T ≼ Dog -> T`, 也即是说， **在我需要条件满足是动物时， 狗狗都是可用的**。 即不考虑返回值类型的情况， 在为函数签名的参数类型包装后， 其子类型层级发生了逆变。

实际上， 这就是 typescript 中的 协变 与逆变 在函数签名类型中的表现形式。 这个单词最初来自于几何学领域中：**随着某一个量的变化， 随之变化一致的即称为协变， 而变化相反的即称为逆变**

用 typescript 的思路进行转换， 即如果有 `A ≼ B`(A 是 B 的子类型)， 协变意味着 `Wrapper<A> ≼ Wrapper<B>`, 而逆变意味着 `Wrapper<B> ≼ Wrapper<A>`;

而在这里的示例中， **变化（Wrapper） 即指从单个类型到函数类型的包装过程**， 我们可以使用工具类型来实现独立的包装类型（独立指对参数类型与返回值类型）:

```typescript
type AsFuncArgType<T> = (arg: T) => void;
type AsFuncReturnType<T> = (arg: unknown) => T;
```

再使用这俩个包装类型演示我们上面的例子：

```typescript
// 成立 (T -> Corgi） ≼ (T -> Dog),   (T -> Corgi) 是 (T -> Dog) 的子类型
type CheckReturnType = AsFuncReturnType<Corgi> extends AsFuncReturnType<Dog>
 ? 1
 : 2; // 1

  // 不成立, 结论： (Dog -> T) ≼ (Animal -> T)
type CheckArgType = AsFuncArgType<Dog> extends AsFuncArgType<Animal> ? 1 : 2; // 2
```

进行一个总结， **函数类型的参数类型使用子类型逆变的方式确定是否成立， 而返回值类型使用子类型协变的方式确定**

## TsConfig 中的 StrictFunctionTypes

功能描述：

在比较两个函数类型是否兼容时候， 将对函数参数进行更严格的检查， 而实际上， 这里的更严格指的即是 **对函数参数类型启用逆变检查**， 很自然的我们会产生一些疑问：

如果启用了这个配置才是逆变检查， 那么原来是怎么样子的？ 在实际场景中的逆变检查又是什么样子的？

还是以上面三个类为例：

```typescript
function fn(dog: Dog) {
 dog.bark();
}

type CorgiFunc = (input: Corgi) => void;
type AnimalFunc = (input: Animal) => void;

```

我们通过赋值方式来实现对函数类型的比较：

```typescript
const fun1: CorgiFunc = fn;
const fun2: AnimalFunc = fn; // err
```

还记得嘛？ 如果赋值成立， 说明 fn 的类型是 `CorgiFunc` / `AnimalFunc` 的子类型;

这两个赋值实际上等价于：

- `(Dog -> T) ≼ (Corgi -> T)`

- `(Dog -> T) ≼ (Animal) -> T`

结合上面所学， 我们很明显能够发现第二种应当是不成立的， 但是在禁用了 `strictFunctionTypes` 的情况下， typescript 并不会抛出错误。 这是因为， 在默认情况下， 对函数参数的检查采用**双变**， **即逆变和协变都被认为是可以接受的**

在 typescript  eslint 中， 有这么一条规则：[method-signature-style](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/method-signature-style.md), 他的意图是约束在接口中声明方法时， 需要使用 property 而非 method 形式

```typescript
// method 声明
interface T1 {
 func(arg: string): number;
}

// property 声明
interface T2 {
 func: (arg: string) => number;
}

```

进行如此约束的原因， 对于 property 声明， 才能在开启严格函数类型检查的情况下享受到**基于逆变的参数类型检查**

对于 method 声明（以及构造函数声明）， 其无法享受到这一更严格的检查原因则是对于 如 Array 这样的定义， 我们希望他的函数方法就是以协变的方式进行检查， 举个例子， `Dog[] ≼ Animal[]` 是否成立？

- 我们并不能简单比较 Dog 与 Animal ， 而是要将它们视为两个完整的类型比较， 即 `Dog[]` 的每一个成员（属性、方法）是否都能对应的赋值 给 `Animal[]`
- `Dog[].push ≼ Animal[].push`  是否成立?
- 由 push 方法的类型签名进一步推导， `Dog -> void ≼ Animal -> void` 是否成立?
- `Dog -> void ≼ Animal -> void` 在逆变的情况下意味着 `Animal ≼ Dog`, 而这很明显是不对的！
- 简单来说， `Dog -> void ≼ Animal -> void` 是否成立本身就为 `Dog[] ≼ Animal` 提供了一个前提答案

因此， 如果 typescript 在此时仍然强制使用参数逆变的规则进行检查， 那么 `Dog[] ≼ Animal[]` 就无法成立， 也就意味着 无法将 Dog 赋值给 Animal， 这不就前后矛盾了嘛？所以在大部分情况下， 我们确实希望方法参数类型的检查是可以双变， 这也是为什么它们的声明中类型结构使用 method 方式来声明：

```typescript
interface Array<T> {
 push(...items: T[]): number;
}

```

## 扩展

### 联合类型与兄弟类型下的比较

上面我们只关注了显示父子类型关系， 实际上在类型层级中还有隐式的父子类型关系（联合类型） 以及兄弟类型（同一基类的两个派生类）。
对于隐式的父子类型其可以仍然沿用显式的父子类型协变与逆变判断， 但对于兄弟类型， 比如 Dog 与 Cat， 需要注意的是它们根本就**不满足逆变与协变的发生条件（父子关系）**， 因此 `(Cat -> void) ≼ (Dog -> void)` (或者反过来)， 无论在严格检查还是默认检查下均不成立。

### 非函数签名包装类型的变换

我们在最开始一直以函数体作为包装类型来作为协变与逆变的转变前提， 后面虽然提到了使用数组的作为包装类型（`Dog[]`）, 但只是一笔带过，重点还是在函数体方面。 现在， 如果我们就是要考虑类似数组这种包装类型呢？ 比如直接一个简单的笼子 Cage？

先不考虑 Cage 内部的实现， 只知道它同时只能放一个物种的动物， `Cage<Dog>` 能被作为 `Cage<Animal>` 的子类型嘛？ 对于这一类型的比较， 我们可以直接使用实际场景来代入:

- 假设我需要一笼动物， 但并不会对它们进行除了读以外的操作，那么你给我一笼狗也是可以的， 但你不能给我一笼植物。 也就意味着， 此时 List 是 readonly 的， 而 `Cage<Dog> ≼ Cage<Animal>` 成立. **即在不可变的 Wrapper 中， 我们允许其遵循协变**

- 假设我需要一笼动物， 并且会在其中新增其他物种， 比如说兔子啊王八， 这个时候你给我一笼兔子就不行了， 因为这个笼子只能放狗， 放兔子可能会变异（？）， 也就意味着， 此时 List 是 Writable 的， 而 `Cage<Dog> Cage<Rabit> Cage<Turtle>` 彼此之间是互斥的， 我们称为 **不变**， 用来放狗的笼子绝不能用来放兔子， 即无法分配

- 如果我们再改下规则， 现在一个笼子可以放任意物种的动物， 狗和兔子可以放一个笼子里， 这个时候任意笼子都可以放任意物种， 放狗的可以放兔子， 放兔子的也可以放狗， 即可以互相分配， 我们称之为 **双变**。

也就是说， 包装类型的表现与我们实际需要的效果是紧密联系的
