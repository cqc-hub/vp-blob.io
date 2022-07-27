---
sidebar: 'auto'
---

#

## 字面量类型与联合类型

比如后端接口返回的消息结构 一般某些字段都取的一些固定的值， 比如 code、 status..

```typescript
// 使用联合类型 + 字面量类型 可以更好的推导
interface IRes {
  code: -1 | 0 | 1;
  status: 'success' | 'failure';
  data: any;
}
```

对于 <aMark> declare var res: IRes</aMark>, 可以认为它其实就是快速生成一个符合指定类型， 但没有实际值的变量， 同时它也不存在与运行时中

```typescript
declare var res: IRes;

// 此处 自动推导 res.xxx
if (res.status) {
}
```

## 字面量类型

`const status: 'success' = 'success';` 这里的 'success' 也是一种类型， 叫做字面量类型, 他代表着比原始类型更精确的类型， 同时也是原始类型的子类型

为什么说字面量类型比原始类型更精确， 可以来看看这个例子

```typescript
const str1: 'cqc' = 'cqc1'; // err 不能把类型 'cqc' 分配给 'cqc1'；
const str2: string = 'cqc';
const str3: string = 'cqc233';
```

上面的代码， 原始类型可以包括同类型的值， 而字面量类型要求的说 值级别的字面量一致

单独使用字面量类型比较少见， 因为单个字面量类型并没有什么意义。他通常和联合类型（即这里的<aMark>|</aMark>）一起使用, 表达一组字面量类型

```typescript
interface ITemp {
  bool: true | false;
  num: 1 | 2 | 3;
  str: 'c' | 'q' | 'l';
}
```

## 联合类型

联合类型可以理解成， 它代表了 **一组类型的可用集合**, 只要最终赋值的类型属于联合类型的成员之一， 就可以认为符合这个联合类型

```typescript
interface Temp {
  mixed: true | string | 599 | {} | (() => {}) | (1 | 2);
}
```

> 需要注意的几点
>
> - 对于联合类型中的函数类型， 需要用括号<aMark>()</aMark> 包裹
> - 可以在联合类型中进一步嵌套联合类型， 但这些嵌套的联合类型最终都会被展平到第一级中

联合类型的常用场景之一是通过多个对象类型的联合， 来实现手动的互斥属性， 即这一属性如果有字段 1， 那就没有字段 2

```typescript
interface Temp {
  user:
    | {
        vip: true;
        expires: string;
      }
    | {
        vip: false;
        promotion: string;
      };
}
```

## 对象字面量类型

对象字面量类型就是一个对象类型的值， 当然，也就意味着这个对象的值全部都为字面量值

```typescript
interface Temp {
  obj: {
    name: 'cqc';
    age: 25;
  };
}

// 要实现对象字面量类型， 意味着要实现这个类型的 每一个属性， 每一个值
const temp: Temp = {
  obj: {
    name: 'cqc',
    age: 25,
  },
};
```

总的来说 在需要更精确类型情况下， 我们可以使用字面量类型加上联合类型的方式，将类型从 string 这种宽泛的原始类型直接收窄到 <aMark>'resolved' | 'pending' | 'rejected'</aMark>

需要注意的是， **无论是原始类型还是对象类型的字面量类型，它们的本质都是类型而不是值**. 它们在编译时同样会被擦除

## 枚举

> 枚举并不是 javascript 中的原生概念， 在其他语言中都是老朋友了（java、c#..），目前也已经存在给 javascript 引入枚举支持的 [proposal-enum](https://github.com/rbuckton/proposal-enum), 但
> 目前仍处于 Stage 0 阶段.

如果要和 javascript 中现有的概念对比， 大概就是类似这样

```javascript
export default {
  Home_Url: 'url1',
  Setting_Url: 'utl2',
};

// 或者是
export const PageUrl = {
  Home_Url: 'url1',
  Setting_Url: 'url2',
};
```

如果把这段代码替换成枚举， 应该是

```typescript
enum PageUrl {
  Home_Url: = 'url1',
  Setting_Url = 'url2'
}

const home = PageUrl.Home_Url;
```

这么做好处十分明显：

- 有了更好的类型提示
- 这些常量被真正的 **约束在一个命名空间** 下

如果没有声明枚举的值， 它会默认使用数字枚举， 从 0 开始， 以 1 递增

```typescript
enum Items {
  Foo, // 0
  Bar, // 1
  Baz, //2

  // 如果只有某个成员指定了枚举值， 那么这个成员之后的成员会开始从枚举值递增（最开始从 0 开始）
  A1 = 9,
  A2, //10
}
```

在数据型枚举中， 可以使用延迟求职的枚举值， 比如函数

```typescript
const returnNum = () => 100 + 499;
enum Items2 {
  Foo = returnNum(),
  Bar = 599,
  Baz,
}
```

需要注意的是， 如果某个成员使用了延迟求值， 那么该成员的**下一个非延迟求值的成员**必须指定具体的值

```typescript
enum Items {
  Baz,
  Foo = returnNum(),
  Bar = 599,
}
```

枚举和对象的重要差异在于， <aMark>对象是单向映射的， 只能从键映射到键值</aMark>。而<aMark>枚举（值为数字的枚举成员）是双向映射的</aMark>(字符串仍是单向)，即
你可以从枚举成员映射到枚举值， 也可以从枚举值映射到枚举成员

```typescript
enum Items {
  Foo,
  Bar = 'BarValue',
  Baz = 'BazValue',
}

const fooValue = Items.Foo; // 0
const fooKey = Items[0]; // 'Foo'

// 编译原理
let obj: any = {};
obj[(obj['foo'] = 1)] = 'foo';

obj.foo; // 1
obj[1]; // foo
```

## 常量枚举

常量枚举和枚举相似， 只是其声明中多了一个 const

```typescript
const enum Items {
  Foo,
  Bar,
  Baz,
}

const fooValue = Items.Foo;
```

和普通枚举的差异主要在于访问性与编译产物. 对于枚举常量， 你**只能通过枚举成员访问枚举值（单向）**， 不能通过值访问成员

> 实际上， 常量枚举的表现、编译产物 还受到配置项 <aMark>--isolateModules</aMark> 以及 <aMark>--preserveConstEnums</aMark> 等的影响

## 总结

对于字面量类型， 可以使用它来提供更精确的类型标注， 比如可以将 用户类型与全球状态码 这一类属性的类型，都使用
**字面量类型 + 联合类型** 的形式改写， 获得更详细的类型消息与更严格的类型约束
