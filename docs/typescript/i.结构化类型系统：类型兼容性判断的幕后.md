---
sidebar: 'auto'
---

#

在 typescript 中， 你可能遇见过以下这样 看起来不太对， 但竟然能正常运行的代码：

```typescript
class Cat {
 eat() {}
}

class Dog {
 eat() {}
}

function feedCat(cat: Cat) {}

feedCat(new Dog());

```

这里的 <aMark>feedCat</aMark> 函数明明需要的是一只猫， 可为什么上传一只狗也可以呢？ 实际上， 这就是 typescript 的类型系统特性:
**结构化类型系统**

## 结构化类型系统

回到开头的问题， 如果我们给 Cat 类新增一个独特的方法， 这个时候的表现才是符合预期的， 即我们只能用真实的 Cat 类来进行调用:

```typescript
class Cat {
 eat() {}
 run() {}

}

class Dog {
 eat() {}

}

function feedCat(cat: Cat) {}

// Property 'run' is missing in type 'Dog' but required in type 'Cat'
feedCat(new Dog());
```

这是因为， typescript 比较两个类型并非通过类型的名称，（即 `feedCat` 函数只能通过 Cat 类型调用）, 而是
比较这两个类型上实际拥有的属性与方法。 也就是说， 这里实际上比较 Cat 类型上的属性是否都存在于 Dog 类型上。
这就是结构类型， 你可能听过结构类型的别称： **鸭子类型**, 其核心理念是， **如果你看到一只鸟走起来像鸭子， 游泳像鸭子， 叫的像鸭子， 那么这只鸟就是鸭子**

回到开头的问题，鸭子类型中的两个类型是通过对象中的属性方法来判断的。 如 这里面的 `Cat` 和 `Dog` 被视为同一个类型，
而为 Cat 类型添加独特的方法后就不在能被视为一个类型。 但如果为 `Dog` 添加一个独特的方法呢:

```typescript
class Cat {
 eat() {}

}

class Dog {
 eat() {}

 run() {}
}

function feedCat(cat: Cat) {}

feedCat(new Dog());
```

这个时候却没有类型报错了， 这是因为， 结构化类型系统 认为 Dog 类型 完全实现了 Cat 类型。 至于额外的方法 `run`,
可以认为是 Dog 类型继承 Cat 类型后添加的新方法， 即此时 Dog 类型可以被认为是 Cat 类的子类。 同样的， 面向对象编程中的
里氏替换原则也提到了鸭子测试： **如果它看起来像鸭子， 叫起来也像鸭子， 但是却需要电池才能工作， 那么你的抽象很可能出错了**。

更近一步， 在比较对象类型的属性时候， 同样采用结构化类型系统进行判断。 而对结构中的函数类型（即方法）进行比较时候， 同样存在类型的兼容性比较：

```typescript
class Cat {
 eat(): boolean {
  return true;
 }
}

class Dog {
 eat(): number {
  return 233;
 }
}

function feedCat(cat: Cat) {}

// Argument of type 'Dog' is not assignable to parameter of type 'Cat'.
feedCat(new Dog());

```

这就是结构化类型系统的核心理念， 即基于类型结构进行判断类型兼容性。

严格来说， 鸭子类型系统和结构化类型系统并不完全一致， 结构化类型系统意味着**基于完全的类型结构来判断类型兼容性**，
而鸭子类型则只基于**运行时访问的部分**来决定。 也就是说， 如果我们调用了 走、游泳、叫 这三个方法， 那么传入的类型
只需要存在这几个方法即可，而不需要类型结构完全一致。 但由于 typescript 本身并不是在运行时进行类型检查（也做不到）， 同时
官方文档中同样认为这两个概念是一致的(**One of typescript’s core principles is that type checking focuses on the shape that values have. This is sometimes called “duck typing” or “structural typing**).
因此在这里， 我们可以直接认为鸭子类型于结构化类型是同一概念。

## 标称类型系统

除了 **基于类型结构进行兼容性判断的结构化类型系统** 以外， 还有一种 **基于类型名进行兼容性判断的类型系统**， 标称类型系统。

标称类型系统要求， 两个可兼容的类型， **其名称必须是完全一致的**：

```typescript
type USD = number;
type CNY = number;

const CNYCount: CNY = 200;
const USDCount: USD = 200;

function addCNY(source: CNY, input: CNY) {
 return source + input;
}

addCNY(CNYCount, USDCount);

```

在结构化类型系统中， USD 与 CNY （分别代表美元、 人民币）被认为是两个完全一致的类型， 因此在 `addCNY` 函数中可以传入 USD 类型的变量。
这就很离谱了， 人民币与美元这两个单位实际意义并不一致， 怎么能进行相加?

在标称类型系统中， CNY 、 USD 被认为是两个完全不同的类型， 因此能够避免这一情况发生。 在《编程与类型系统》 一书中提到， 类型的重要意义之一是
**限制了数据的可用操作与实际意义**， 这一点在标称类型系统中的体现要更加明显。 比如， 上面我们可以通过类型的结构， 来让结构化类型系统认为两个类型
具有父子类型关系， 而对于标称类型系统， 父子类型关系只能通过显示的继承来实现， 称为 **标称子类型**。

```typescript
class Cat { }

// 实现一只短毛猫
class ShortCat extends Cat {}
```

### 在 typescript 中模拟标称类型系统

在看一遍这句话： **类型的重要意义之一是限制了数据的可用操作与实际意义**。 这往往是通过类型附带的**额外信息**来实现的（类似于元数据）， 要在 typescript 中实现，
其实我们也只需要为类型额外附加元数据即可， 比如 CNY 与 USD， 我们分别附加上它们的单位信息即可， 但同时又需要保留原本的信息（即原本的number类型）。

我们可以通过交叉类型的方式来实现信息的附加：

```typescript
export declare class TagProtector<T extends string> {
 protected __tag__: T;
}

export type Nominal<T, U extends string> = T & TagProtector<U>;
```
