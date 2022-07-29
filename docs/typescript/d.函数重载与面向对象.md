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
```
