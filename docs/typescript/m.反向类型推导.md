---
sidebar: auto
prev:
 text: l.工具类型
 link: /typescript/l.工具类型.html

# prev:
#  text: 条件类型与infer
#  link: /typescript/k.条件类型与infer.html


---

#

## 无处不在的上下文

举一个最常见的例子

```typescript
window.onerror = (event, source, line, col, err) => {};
```

在这个例子里， 虽然我们并没有为 onerror 的各个参数声明类型， 但是它们也已经获得了正确的类型。

当然你肯定能猜到， 这是因为 onerror 的类型声明已经内置了：

```typescript
interface Handler {
 onerror: OnErrorEventHandlerNonNull;
}

interface OnErrorEventHandlerNonNull {
 (
  event: Event | string,
  source?: string,
  lineno?: number,
  error?: Error
 ): any;
}

```

我们自己实现一个函数签名， 也是一样的效果：

```typescript
type CustomHandler = (name: string, age: number) => boolean;

const handler: CustomHandler = (arg1, arg2) => true; // 也推导出来了参数类型
```

除了参数类型， 返回值类型同样会纳入管控：

```typescript
declare const struct: {
 handler: CustomHandler;
};

struct.handler = (name, age) => {}; //  Type 'void' is not assignable to type 'boolean'.
```

在这里，参数的类型基于其上下文类型中的参数类型位置来进行匹配， arg1 对应到 name（string）， arg2 对应到 age（number）。
这就是上下文类型的核心理念： **基于位置的类型推导**。 同时， 相对于我们上面提到的基于开发者输入进行的类型推导， 上下文类型更像是**反方向的类型推导**， 也就是**基于已定义的类型来规范开发者的使用**。

在上下文中， 我们实现的表达式可以只使用更少的参数， 而不能使用更多， 这还是因为上下文类型基于位置的匹配， 一旦参数个数超过定义的数量， 那就没法进行匹配了：

```typescript
window.onerror = (e) => {}; // 正常

window.onerror = (event, source, lineno, col, error, extra) => {}; // error

```

上下文类型也可以进行 ‘嵌套’ 情况下的类型推导：

```typescript
declare let func: (raw: number) => (input: string) => any;

func = (raw) => {
 return (input) => {};
};

```

在某些情况下， 上下文类型推导能力也会失效， 比如这里我们使用一个由函数组成的联合类型：

```typescript
class Foo {
 foo!: number;
}

class Bar extends Foo {
 bar!: number;
}

let f1: { (input: Foo): void } | { (input: Bar): void };

f1 = (input) => {}; // input 是 any

```

我们预期结果是 input 为 `Foo | Bar` 类型， 也就是所有符合结构的函数类型的参数， 但却失败了。

这是因为 typescript 中的上下文类型目前暂时不支持这一判断发士（而不是这不属于上下文类型的能力范围）。

你可以直接使用一个联合类型参数的函数签名：

```typescript
let f2: { (input: Foo | Bar): any };

f2 = (input) => {}; // input: Foo | Bar
```

如果此时将这两个联合类型再 嵌套一层， 此时上下文类型反而正常了：

```typescript
let f3:
 | { (raw: number): (input: Foo) => void }
 | {
   (raw: number): (input: Bar) => void;
   };

// raw: number
f3 = (raw) => {
 // input: Bar
 return (input) => {};
};
```

这里被推导为 Bar 的原因， 其实还和我们此前了解的协变、逆变有关。 任何接收 Foo 类型参数类型的地方， 都可以接收一个 Bar 参数， 因此推导到 Bar更安全（Bar extends Foo）

## void 返回值类型下的特殊情况

上面讲到， 上下文类型同样会推导并约束函数的返回值类型， 但存在这么个特殊情况， 当内置函数类型的返回值类型 是 void 时候：

```typescript
type CustomHandler = (name: string, age: number) => void;

const handler1: CustomHandler = (name, age) => true;
const handler2: CustomHandler = (name, age) => 'cqc';
const handler3: CustomHandler = (name, age) => null;

```

你会发现在这个时候， 我们的函数返回值类型变成了五花八门的样子， 而且还都不会报错！？ 同样的， 这也是一条世界底层的规则， **上下文类型对于 void 返回值类型的函数， 并不会真的要求它啥都不能返回**。 然而， 虽然这些函数可以实现返回任意类型的值， 但是**对于调用结果的类型， 仍然是 void**。

`const r1 = handler1('cqc', 233); // void`

这看起来是一种很奇怪的、错误的行为， 但实际上， 我们日常开发中的很多代码都需要这种行为才不会报错：

```typescript
const arr: number[] = [];
const list: number[] = [1, 2, 3];

list.forEach((item) => arr.push(item));
```

这是我们常用的简写方式， 然而， push 方法返回值是一个 number 类型（push 后数组的长度）， 而 forEach 的上下文声明中要求返回值 是 void 类型。 而如果此时 void 类型真的不允许任何返回值， 那这里我们就需要多套一个代码块才能确保类型符合了。

但这真的有必要嘛？ **对于一个 void 类型的函数， 我们真的会去消费他的返回值嘛？ 既然不会， 那么他想返回什么， 全凭他乐意好了**

## 拓展

### 将更少参数的函数赋值给具有更多参数的函数类型

在上面的例子中， 我们看到了这样一串代码：

```typescript
const arr: number[] = [];
const list: number[] = [1, 2 , 3];

list.forEach(item => arr.push(item));
```

在 forEach 的函数中， 我们会消费 list 的每一个成员。 但我们有时也会遇到并不实际消费数组成员的情况：

```typescript
list.forEach(() => arr.push(otherFactory));
```

这个时候， 我们实际上就是在**将更少参数的函数赋值给具有更多参数的函数类型**。

再看一个更明显的例子：

```typescript
function handler(arg: string) {
 console.log(arg);
}

function useHandler(callback: (arg1: string, arg2: number) => void) {
 callback('cqc', 233);
}

useHandler(handler);
```

handler 函数的类型签名很明显与 useHandler 函数的 callback 类型签名并不一致， 那么就需要为 handler 在声明一个额外的对应到arg2 的参数， 然而我们的handler代码里实际上并没有去消费第二个参数。

这实际上在 JavaScript 中也是我们经常使用的方式： **使用更少入参的函数来作为一个预期更多入参函数参数的实现**

```typescript
declare const list: any[];

// 就像实际这里 map 要求传入
// callbackfn: (value: number, index: number, array: any[]) => void, thisArg?: any
// 我们直接用更少参数的函数来进行调用
list.map(o => {
  // doSomething...
})
```
