---
sidebar: auto
prev:
 text: m.反向类型推导
 link: /typescript/m.反向类型推导.html

# prev:
#  text: 条件类型与infer
#  link: /typescript/k.条件类型与infer.html


---

#

函数有类型层级嘛？ 如果有， 下面类型层级又是什么样子的：

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

而实际上， 如果我们去掉了包涵 Dog 类型的例子 会发现只剩下 `Animal -> Corgi` 了， 也即是说， `Animal -> Corgi < Dog -> Dog` 成立（A < B 意为 A 为 B 的子类型）

观察以上排除方式的结论：

- 参数类型**允许**为 Dog 的父类型， **不允许**为 Dog 的子类型。
- 返回值的类型**允许为 Dog**的子类型， **不允许**为 Dog的父类

你是否 get 到了什么？ 这里用来比较的两个函数类型， 其实就是把具有父子关系的类型放置在参数、返回值 的位置上， **最终函数类型的关系直接取决于类型的父子关系**， 取决于也就意味着其中有迹可循， 这个时候， 就可以引入协变与逆变的关系了。

## 协变与逆变

上一节我们得到的结论是 考虑 `Corgi < Dog < Animal`, 当有函数类型 `Dog -> Dog`, 仅有  `Animal -> Corgi < Dog -> Dog` 成立（即能被视为此函数的子类型）， 这里的参数类型与返回值实际上可以各自独立出来看：

考虑  `Corgi < Dog`, 假设我们对其返回值类型的函数签名类型包装， 则有 `(T -> Corgi) < (T -> Dog)`, 也就是说， 在我需要狗狗的地方， 柯基都是可以用的。 即不考虑参数类型的情况， 在包装为函数签名的返回值类型后， 其子类型层级关系保持一致。

考虑 `Dog < Animal`,  如果参数类型的函数签名类型包装， 则有 `Animal -> T < Dog -> T`, 也即是说， **在我需要条件满足是动物时， 狗狗都是可用的**。 即不考虑返回值类型的情况， 在为函数签名的参数类型包装后， 其子类型层级发生了逆变。

实际上， 这就是 typescript 中的 协变 与逆变 在函数签名类型中的表现形式。 这个单词最初来自于几何学领域中：**随着某一个量的变化， 随之变化一致的即称为协变， 而变化相反的即称为逆变**

用 typescript 的思路进行转换， 即如果有 `A < B`(A 是 B 的子类型)， 协变意味着 `Wrapper<A> < Wrapper<B>`, 而逆变意味着 `Wrapper<B> < Wrapper<A>`;

而在这里的示例中， **变化（Wrapper） 即指从单个类型到函数类型的包装过程**， 我们可以使用工具类型来实现独立的包装类型（独立指对参数类型与返回值类型）:

```typescript
type AsFuncArgType<T> = (arg: T) => void;
type AsFuncReturnType<T> = (arg: unknown) => T;
```

再使用这俩个包装类型演示我们上面的例子：

```typescript
// 成立 (T -> Corgi） < (T -> Dog),   (T -> Corgi) 是 (T -> Dog) 的子类型
type CheckReturnType = AsFuncReturnType<Corgi> extends AsFuncReturnType<Dog>
 ? 1
 : 2; // 1

  // 不成立, 结论： (Dog -> T) < (Animal -> T)
type CheckArgType = AsFuncArgType<Dog> extends AsFuncArgType<Animal> ? 1 : 2; // 2
```

进行一个总结， **函数类型的参数类型使用子类型逆变的方式确定是否成立， 而返回值类型使用子类型协变的方式确定**
