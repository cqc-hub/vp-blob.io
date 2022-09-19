---
sidebar: auto

prev:
 text: j.类型系统层级
 link: /typescript/j.类型系统层级.html
---

#

## 条件类型基础

条件类型的语法类似于平常使用的三元表达式(伪代码)：

```typescript
ValueA === ValueB ? Result1 : Result2;
```

但需要注意的是， 条件类型中使用 extends 判断类型的兼容性， 而非判断类型的全等性。 这是因为在类型层面中，
对于能够进行赋值操作的两个变量， 我们**并不需要他们的类型完全相等， 只需要具备兼容性**， 对于两个完全相同的类型， 其 extends 自然也是成立的

条件类型绝大部分场景下回合泛型一起使用， 泛型参数的实际类型会在实际调用时才被填充（类型别名中显示传入， 或者函数中隐式提取）， 而条件类型在这一基础上，
可以基于填充后的泛型参数做进一步的类型操作：

```typescript
type LiteralType<T> = T extends string ? 'string' : 'other';

type Res1 = LiteralType<'cqc'>; // 'string'
type Res2 = LiteralType<233>; // 'other'
```

同三元表达式一样， 条件类型中也常见多层嵌套：

```typescript
type LiteralType<T> = T extends string
 ? 'string'
 : T extends number
 ? 'number'
 : T extends boolean
 ? 'boolean'
 : 'other';

type Res1 = LiteralType<'cqc'>; // 'string'
type Res2 = LiteralType<233>; // 'number'

```
