---
sidebar: auto

prev:
 text: p.模板字符串
 link: /typescript/p.模板字符串.html
---

#

我们在上一节就已经了解到, 模版字符串的本质就是在一个字符串字面量类型结构做处理, 因此我们可以复刻一个字符串的值拥有的大部分方法, 从 trim 到 split, 从 startsWith 到 endsWith 等等, 这些就是本章我们需要学习的内容.

## 从简单的模式匹配开始(trim, includes)

最简单的模式匹配只有一层条件类型语句, 也就意味着我们不需要对模式匹配的结果做结构转换等操作.对比到字符串类型变量的方法, 也就是 trim, includes, startsWith, endsWith, 我们从比较有代表性的 includes 看起, 对应实现一个类型层面的版本:

```typescript
type Include<
 Str extends string,
 Search extends string
> = Str extends `${infer R1}${Search}${infer R2}` ? true : false;
```

在 `Include` 类型中, 我们并不需要去消费 R1 R2, 只需要判断字符串是否可以被划分为 被搜索到字符串 + 其他字符串即可, 我们来验证一下:

```typescript
type a = Include<'打火机咖啡杯', '咖啡1'>; // false
type b = Include<'打火机咖啡杯', '咖啡'>; // true
type c = Include<' ', ''>; // true
type d = Include<'', ''>; // false
```

在上面 `d` 中, 我们看到他的结果是 false, 但是实际上在 javascript 中, 他的值为 true, 所以这里我们需要单独处理一下:

```typescript
type _Include<Str extends string, Search extends string> = Str extends ''
 ? Search extends ''
  ? true
  : false
 : Include<Str, Search>;
```

而提到模版字符串模型中的去空字符串, 我会想到 **trim 三兄弟(trimStart, trimEnd, trim)** , 基于模式匹配的思路我们还是很容易实现对应类型:

```typescript
type TrimStart<Str extends string> = Str extends ` ${infer R}`
 ? TrimStart<R>
 : Str;

type TrimEnd<Str extends string> = Str extends `${infer R} ` ? TrimEnd<R> : Str;

type Trim<Str extends string> = TrimStart<TrimEnd<Str>>;
```

而类型版本的 StartsWith, EndsWith 和 Include 非常相似, 我们直接看 StartsWith 的最终实现

```typescript
// 此处还需要判断两个是否都为 '', 这里就不判断了
type StartsWith<
 Str extends string,
 Search extends string
> = Str extends `${Search}${infer R}` ? true : false;

type EndsWith<
 Str extends string,
 Search extends string
> = Str extends `${infer R}${Search}` ? true : false;
```

## 结构转换 Replace, Split, Join

### Replace

看起来 Replace 是挺复杂的, 但实际上仔细想想他和 Include 并没有区别, Include 判断**能否将字符串划分为被搜索字段和其他字段**, 那 Replace 不久是**将目标部分替换为新的部分, 按照原本结构组合就好了嘛**:

```typescript
type Replace<
 Str extends string,
 Search extends string,
 ReplaceMent extends string
> = Str extends `${infer Head}${Search}${infer Tail}`
 ? `${Head}${ReplaceMent}${Tail}`
 : Str;

type a = Replace<'cqc', 'qc', '要努力啊'>; // c要努力啊

```

到这里, 我们就实现了一个类型版本的 Replace, 然而, 你应该有遇到过需要全量替换的场景, 如 ReplaceAll, 当然没问题, 这时候我们就需要请出老朋友-递归 了

```typescript
type ReplaceAll<
 Str extends string,
 Search extends string,
 Replacement extends string
> = Str extends `${infer Head}${Search}${infer Tail}`
 ? ReplaceAll<`${Head}${Replacement}${Tail}`, Search, Replacement>
 : Str;

type b = ReplaceAll<'www.baidu.com', '.', '-'>; // www-baidu-com
```

### Split

除了 Replace, 在字符串类型值中还有一个常用的方法, `split`, 在类型层面, 我们可以实现 `split`, 毕竟 '分隔符' 这个词就在强烈暗示我们, 它一定存在某种规律, 比如最简单的, 假设我们所有字段都是 `a-b-c` 这个结构, 那么我们就可以这么拆分:

```typescript
type Split<Str extends string> =
 Str extends `${infer Head}-${infer Body}-${infer Tail}`
  ? [Head, Body, Tail]
  : [];
```

当然, 真实情况肯定没有这么简单, 分隔符的长度和字段都是不确定的, 但有着模式匹配和递归, 没有什么可以难倒我们:

```typescript
type Split<
 Str extends string,
 Delimiter extends string
> = Str extends `${infer Head}${Delimiter}${infer Tail}`
 ? [Head, ...Split<Tail, Delimiter>]
 : Str extends Delimiter
 ? []
 : [Str];

type a = Split<'www.baidu.com', '.'>; // ["www", "baidu", "com"]

//["c", "q", "c"]
type b = Split<'cqc', ''>;

type test = 'qc' extends `${infer H}${''}${infer c}` ? 1 : 2; // 1

```

这里有两种情况需要注意:

- 存在多处分割时候, Split 类型进行到最后一次, 即无法分割时候, 需要将最后一部分返回.

- 对于空字符作为分隔符, 其表现为将字符串按字母拆分(`b`), 这同样于 js `split` 一致

### StrLength

另外, 基于 Split, 我们也知道了字符串的长度

```typescript
type StrLength<T extends string> = Split<T, ''>['length'];
```

### Join

Split 是将一个字符串分割成一个数组, 而 Join 则是将一个数组组成一个字符串, 我们只需要使用递归取出每一个单元, 然后用模版插槽即可

```typescript
type Join<
 List extends Array<string | number>,
 Delimiter extends string
> = List extends [string | number, ...infer Rest]
 ? // @ts-expect-error
   `${List[0]}${Delimiter}${Join<Rest, Delimiter>}`
 : string;

```

> 这里的 Rest 无法被推导正确类型, 因此使用 @ts-expect-error 忽略错误

看起来似乎没啥问题, 我们来试一下:

```typescript
// `c,q,c,${string}`
type a = Join<['c', 'q', 'c'], ','>;
```

啊哦, 明显不对, 我们来分析一下原因, 在执行至最后一次时候, 我们面对的条件类型大致是这样的:

```typescript
type JoinType = [] extends [string | number, ...infer Rest]
 ? // @ts-expect-error
   `cqc${Join<Rest, ''>}`
 : string;
```

这个条件很明显不成立, 因为它返回了 string 类型, 而这个 string 类型我们本意是用来兜底的: **如果 Join 无法拼成一个列表, 那么至少要返回一个 string 类型**

要解决这种情况, 我们只需要额外处理一下空数组的情况

```typescript
type Join<
 List extends Array<string | number>,
 Delimiter extends string
> = List extends []
 ? ''
 : List extends [string | number, ...infer Rest]
 ? // @ts-expect-error
   `${List[0]}${Delimiter}${Join<Rest, Delimiter>}`
 : string;

// c,q,c,
type a = Join<['c', 'q', 'c'], ','>;

```

但最终结果还是不大对, 实际上, 在递归过程进行到最后一项时候, 这个过程就应该被提前阻止. 这里还多了一个 `,` 的原因, 就是让这最后仅有的一项还进行了拼接,

因此, 我们需要单独处理下最后一项

```typescript
type Join<
  List extends Array<string | number>,
  Delimiter extends string
> = List extends []
  ? ''
  : List extends [string | number]
  ? List[0]
  : List extends [string | number, ...Rest]
  ? //@ts-expect-error
    `${List[o]}${Delimiter}${Join<Rest, Delimiter>}`
  : string;

// c,q,c
type a = Join<['c', 'q', 'c'], ','>;

```

看起来很简单的 Join 类型, 我们需要连续处理三次才完成, Split 其实也是, 很难注意到还需要在最后一次递归的单独特殊处理. 这也是类型编程中非常常见的一个场景, **一个工具可能要经过多次改进, 多种边界情况处理, 才能被称为"可用", 尤其是在递归的情况下**
