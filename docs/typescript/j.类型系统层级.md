---
sidebar: auto
prev:
 text: i.结构化类型系统：类型兼容性判断的幕后
 link: /typescript/i.结构化类型系统：类型兼容性判断的幕后.html

next:
 text: 条件类型与infer
 link: /typescript/k.条件类型与infer.html
---

# 类型系统层级

如果说类型系统是 typescript 中的重要基础知识， 那么类型层级就是类型系统中的重要概念之一。 对于没有类型语言经验的人来说，
类型层级是最重要的基础概念也不为过。

类型层级一方面能帮助我们明确各种类型的层级与兼容性， 而兼容性问题往往就是许多类型错误产生的原因。 另一方面, 类型层级也是我们
后续学习条件类型必不可少的前置知识。

类型层级实际上指的是， **typescript 中所有类型的兼容关系， 从最上面一层的 any， 到最底层的 never 类型。** 那么， 从上至下的类型兼容关系到底是什么？

## 判断类型兼容性的方式

在开始前， 我们需要先了解下如何直观地判断两个类型的兼容性。 本节我们主要使用条件类型来判断类型兼容性， 类似这样:

```typescript
type Res = 'cqc' extends string ? 1 : 2;
```

如果返回 1， 则说明 `cqc` 为 string 的子类型。 否则， 说明不成立。 但注意， 不成立不意味着 string 就是 `cqc` 的子类型了。 还有一种备选的，
通过赋值来进行兼容性检查的方式， 其使用方式大致是这样的：

```typescript
declare let source: string;

declare let anyType: any;
declare let neverType: never;

anyType = source;

// Type 'string' is not assignable to type 'never'.
neverType = source;

```

对于变量 a = 变量b， 如果成立， 意味着 `<变量 b 的类型> extends <变量 a 的类型>` 成立， **即 b 类型 是 a 类型的子类型**，
在这里即是 `string extends never`,  这明显是不成立的。

觉着不好理解？ 那可以试着这么想， 我们有一个 ‘狗’ 类型的变量， 还有两个分别是 ‘柯基’ 类型 与 ‘橘猫’ 类型的变量。

- 狗 = 柯基， 意味着将柯基作为狗， 这是没问题的。

- 狗 = 橘猫， 很明显不对， 程序对 ‘狗’ 这个变量的使用， 都建立在它是一个 ‘狗’ 类型的基础上， 你给个猫， 让后面咋办？

着两种判断方式并没有明显的区别， 只在使用场景上略有差异。 在需要判断多个类型的层级时， 条件类型更为直观， 而如果只是两个类型之间的兼容性判断时， 使用类型声明则更好理解一些

## 从原始类型开始

了解了类型兼容性判断的方式后， 我们就可以开始探讨类型层级了。 首先， 我们从原始类型、 对象类型（后面统称为基础类型） 和它们对应的字面量类型开始。

```typescript
type Res1 = 'cqc' extends string ? 1 : 2; // 1
type Res2 = 1 extends number ? 1 : 2; // 1
type Res3 = true extends boolean ? 1 : 2; // 1
type Res4 = { name: string } extends object ? 1 : 2; // 1
type Res5 = { name: 'cqc' } extends object ? 1 : 2; // 1
type Res6 = [] extends object ? 1 : 2; // 1

```

很明显， 一个基础类型和它们对应的字面量类型必定存在父子类型关系。 严格来说， object 出现在这里并不恰当， 因为它 代表着**所有非原始类型的类型， 即数组、对象、函数类型**，
所以这里 Res6 成立的原因是 `[]` 这个字面量类型也可以被认为是 object 的字面量类型。

我们将结论简记为， **字面量类型 < 对应的原始类型**。

## 向上探索， 直到穹顶之上

我们继原始类型与字面量类型之后， 向上、向下去探索类型层级。

### 联合类型

在联合类型之中， 只需要符合其中一个类型， 我们就可以认为实现了这个联合类型， 用条件表达式是这样的:

```typescript
type Res7 = 1 extends 1 | 2 | 3 ? 1 : 2; // 1
type Res8 = 'q' extends 'c' | 'q' | 'j' ? 1 : 2; // 1
type Res9 = true extends true | false ? 1 : 2; // 1

```

在这一层面上， 并不需要联合类型的所有成员均为字面量类型， 或者字面量类型来自于同一基础类型 这样的前提， 只需要这个类型存在于联合类型中。

对于原始类型， 联合类型的比较其实也是一致的：

```typescript
type Res10 = string extends string | number | number ? 1 : 2; // 1

```

结论： **字面量类型 < 包含此字面量类型的联合类型, 原始类型 < 包含此原始类型的联合类型**。

而如果一个联合类型由同一个基础类型的类型字面量组成， 那这个时候情况又有点不一样了。 既然你的所有类型成员都是字符串字面量类型，
那你岂不是为 string 类型的小弟？ 如果你的所有类型成员都是对象、数组字面量类型、 函数类型， 那你岂不是为 object 类型的小弟？

```typescript
type Res11 = 'cqc' | 'ljy' | 'cxj' extends string ? 1 : 2; // 1
type Res12 = {} | (() => void) | [] extends object ? 1 : 2; // 1

```

结论： **同一基础类型的字面量类型 < 此基础类型**。

合并一下结论， 去掉比较特殊的情况， 我们得到了这个最终结论： **字面量类型 < 包含此字面量类型的联合类型（同一基础类型） < 对应的原始类型**， 即：

```typescript
// 2
type Res13 = 'cqc' extends 'cqc' | '233'
 ? 'cqc' | '233' extends string
  ? 2
  : 1
 : 0;

```

对于这种嵌套的联合类型， 我们这里直接观察最后一个条件语句的结果即可， 因为如果所有条件语句都成立， 那结果就是最后一个条件语句为真时的值。
另外， 由于联合类型实际上是一个比较特殊的存在， 大部分类型都存在至少一个联合类型作为其父类型， 因此在后面我们不会再体现联合类型。

### 装箱类型

在「基础类型」 中， 已经讲到了装修对象 String 在 typescript 中的体现： String 类型， 以及在原型链顶端傲视群雄的 Object 对象 与 Object 类型。

很明显， string 类型会是 String 类型的子类型， String 类型会是 Object 类型的子类型， 那中间还有吗？ 还真有， 而且你不一定能猜到。
我们直接看从 string 到 Object 的类型层级：

```typescript
type Res14 = string extends String ? 1 : 2; // 1
type Res15 = String extends {} ? 1 : 2; // 1
type Res16 = {} extends object ? 1 : 2; // 1
type Res17 = object extends {} ? 1 : 2; // 1
type Res18 = {} extends Object ? 1 : 2; // 1

```

这里看着像是混进来一个很奇怪的东西， `{ }` 不是 object 的子类型吗？ 为什么能在这里比较， 并且 String 还是它的子类型呢？

这时候我们回忆一下在结构化类型系统中学习到的一个概念， 假设我们把 String 看作一个普通的对象， 上面存在一些方法， 如：

```typescript
interface String {
  replace: //...
  replaceAll: //...
  startsWith: //...
  endsWith: //...
  includes: //...
}

```

这个时候， 是不是可以看作， String 继承了 `{ }` 这个对象，然后自己实现了这个方法? 当然可以，**在结构化类型系统的比较下，String 会被认为是 `{}` 的子类型.**
这里从 <a-mark> string < {} < object </a-mark> 看起来构建了一个类型链， 但实际上 <a-mark> string extends object </a-mark> 并不成立:

```typescript
type Temp = string extends object ? 1 : 2; // 2
type Temp2 = String extends object ? 1 : 2; // 1
type Temp3 = string extends {} ? 1 : 2; // 1
```

由于结构化类型系统这一特性存在，我们能得到一些看起来矛盾的结论:

```typescript
type Result16 = {} extends object ? 1 : 2;  // 1
type Result17 = object extends {} ? 1 : 2; // 1

type Result18 = object extends Object ? 1 : 2; // 1
type Result19 = Object extends object ? 1 : 2; // 1

type Result20 = Object extends {} ? 1 : 2; // 1
type Result21 = {} extends Object ? 1 : 2; // 1
```

16-17、 20-21 这两对， 无论怎么判断结果都是成立, 难道说明 `{}、 object、 Object` 类型都一致？

当然不，这里的 `{} extends` 和 `extends {}` 实际上是两种完全不同的比较方式.

`{} extends object` `{} extends Object` 意味着, `{}` 是 object 和 Object 的字面量类型， 是从**类型信息的层面出发的**， 即**字面量类型在基础类型之上提供了更详细的类型信息**

`object extends {}` `Object extends {}` 则是**从结构化的类型系统的比较**出发的. 即 `{}` 作为一个一无所有的空对象， 几乎可以视为所有类型的基类, 万物起源。

如果混淆了上面的两种结论， 就可能会得到 `string extends object` 这样的错误结论。

而 `object extends Object` `Object extends object`, 这两者要特殊一点，它们是因为 ‘系统设定’ 的问题, Object 包涵了所有除了 TopType 以外的类型(基础类型、函数类型等), object 包涵了 所有非原始类型的类型(233, '233'), 即 数组、对象、 函数，
这就导致了你中有我， 我中有你的神奇现象。

在这里， 我们暂时只关注 从类型信息层面出发的部分， 即结论为: <aMark>原始类型 < 原始类型对应的装箱类型 < Object 类型</aMark>

### Top Type

这里只有 any unknown 这俩，前面我们就已经了解到， any unknown 是系统设定为 TopType 的两个类型, 它们无视一切因果律， 是类型世界的规则产物。 因此 Object 也是 any、 unknown 的子类型。

```typescript
type Result22 = Object extends any ? 1 : 2; // 1
type Result23 = Object extends unknown ? 1 : 2; // 1

```

但如果把他们对调一下呢

```typescript
type Result24 = any extends Object ? 1 : 2; // 2 | 1
type Result25 = unknown extends Object ? 1 : 2; // 2

type Result26 = any extends 'cqc' ? 1 : 2; // 2 | 1
type Result27 = any extends string ? 1 : 2; // 2 | 1
type Result28 = any extends never ? 1 : 2; // 2 | 1
```

是不是感觉很匪夷所思? 实际上， 还是因为系统设定的原因. `any` 代表了所有的可能的类型，当我们使用 `any extends` 的时候，他包涵了 **让条件成立的一部分**， 以及 **条件不成立的一部分**.
而从实现上来说，在开始前 typescript 内部代码的逻辑处理中, 如果接受判断的类型是 any , 那么会直接返回**条件类型结果组合而成的联合类型**

因此 <aMark>any extends string</aMark> 并不能简单认为等价于以下类型:

```typescript
type Result30 = ('cqc' | {}) extends string ? 1 : 2; // 2
```

这种情况下， 由于联合成员并非均是 string 类型, 条件显然不成立

在前面学习 any 的时候， 你可能会感到困惑, 在赋值其他类型的时候， any 来者不拒, 而 unknown 只能赋值给 unknown 类型或者 any 类型. 这也是由于 ‘系统设定’ 的关系. 即 any 可以表达为 任何类型.

另外 any 与 unknown 类型之间的互相比较也是成立的:

```typescript
type Result31 = any extends unknown ? 1 : 2; // 1
type Result32 = unknown extends any ? 1 : 2; // 1
```

虽然还是存在系统设定的部分， 但我们还是只关注信息层面的层级， 即结论为 <aMark>Object < any | unknown</aMark>

## 向下探索， 直到虚无

向下探索其实就简单多了， 首先我们能确认一定有个 never 类型， 因为它代表了 ‘虚无’的类型, 一个根本不存在的类型.
对于这样的类型， 他会是任何类型的子类型，当然也包括字面量类型:

```typescript
type Result33 = never extends 'cqc' ? 1 : 2; // 1
```

你可能又会想到一些其他类型， 比如 null、 undefined、 void：

```typescript
type Result34 = null extends 'cqc' ? 1 : 2; // 2
type Result35 = undefined extends 'cqc' ? 1 : 2; // 2
type Result36 = void extends 'cqc' ? 1 : 2; // 2
```

上面三种情况当然不会成立， 别忘了在 typescript 中， **null、undefined、void 都是切实存在， 有具体意义的类型** , 它和 string 、 number 、object 并没有本质上的区别

因此， 这里我们得出结论： <aMark>never < 字面量类型</aMark>. 这就是类型世界的最底层, 有点像我的世界那味道， 挖穿了地面后，出现的是一片茫茫的空白与虚无。

## 类型层级链

综合上面的结论, 可以书写出这样一条层级链:

```typescript
type TypeChain = never extends 'cqc'
 ? 'cqc' extends 'cqc' | '233'
  ? 'cqc' | '233' extends string
   ? string extends String
    ? String extends Object
     ? Object extends any
      ? any extends unknown
       ? unknown extends any
        ? 8
        : 7
       : 6
      : 5
     : 4
    : 3
   : 2
  : 1
 : 0;  // 8


```

其返回的结果为 8 ，也就意味着所有结果都成立. 结合上面的结构化类型系统与类型系统设定， 我们还可以构建一条更长的类型层级链：

```typescript
type VerboseTypeChain = never extends 'cqc'
 ? 'cqc' extends 'cqc' | '233'
  ? 'cqc' | '233' extends string
   ? string extends {}
    ? string extends String
     ? String extends {}
      ? {} extends object
       ? object extends {}
        ? {} extends Object
         ? object extends Object
          ? Object extends object
           ? Object extends any
            ? Object extends unknown
             ? any extends unknown
              ? unknown extends any
               ? 8
               : 7
              : 6
             : 5
            : 4
           : 3
          : 2
         : 1
        : 0
       : -1
      : -2
     : -3
    : -4
   : -5
  : -6
 : -7; // 8

```

## 其他比较场景

除了我们上面提到的类型比较， 其实还存在着一些比较情况

- 对于基类与派生类， 通常情况下**派生类会完全保留基类的结构**， 而只是自己新增新的属性和方法。 在结构化类型的比较下， 其类型必然存在子类型关系。更不用说派生类本身就是 extends 基类得到的。

- 联合类型的判断， 前面我们只是判断联合类型的单个成员， 那如果是多个成员呢？

```typescript
type Result36 = 1 | 2 | 3 extends 1 | 2 | 3 | 4 ? 1 : 2; // 1
type Result37 = 2 | 4 extends 1 | 2 | 3 | 4 ? 1 : 2; // 1
type Result38 = 1 | 2 | 5 extends 1 | 2 | 3 | 4 ? 1 : 2; // 2
type Result39 = 1 | 5 extends 1 | 2 | 3 | 4 ? 1 : 2; // 2

```

实际上， 对于联合类型的比较， 我们只需要比较**一个联合类型成员是否可以被视为另一个联合类型的子集**， 即 **这个联合类型中所有成员在另一个联合类型中都能找到**。

- 数组和元组

数组和元组是一个比较特殊的部分， 直接上例子：

```typescript
type Result40 = [number, number] extends number[] ? 1 : 2; // 1
type Result41 = [number, string] extends number[] ? 1 : 2; // 2
type Result42 = [number, string] extends (number | string)[] ? 1 : 2; // 1
type Result43 = [] extends number[] ? 1 : 2; // 1
type Result44 = [] extends unknown[] ? 1 : 2; // 1
type Result45 = number[] extends (number | string)[] ? 1 : 2; // 1
type Result46 = any[] extends number[] ? 1 : 2; // 1
type Result47 = unknown[] extends number[] ? 1 : 2; // 2
type Result48 = never[] extends number[] ? 1 : 2; // 1

```

## 总结

> TopType > 顶级原型 > 装箱类型 > 基础类型（拆箱类型） > 对应字面量类型 > BottomType
>
> TopType: any 、 unknown
>
> 顶级原型: Object
>
> 装箱类型: String 、 Boolean 、 Number
>
> 基础类型（拆箱类型): string 、 boolean 、 number
>
> 对应字面量类型: 'cqc' 、 true 、 233
