---
sidebar: auto

# prev:
#  text: o.进阶
#  link: /typescript/o.进阶.html

prev:
  text: q.字符串进阶
  link: /typescript/q.字符串进阶.html
---

#

首先我们要知道的是，**装饰器本质上其实就是一个函数**， 只不过他的入参是提前确定好的。 同时， typescript 中装饰器目前**只能在类以及类成员上使用**

装饰器通过 `@` 语法来使用:

```typescript
const Deco = (target: any) => {};

@Deco
class Foo {}
```

这样的装饰器只能起草固定的功能， 我们实际上使用最多的是 Decorator Factory， 即装饰器工厂(一个函数， 内部返回了一个函数):

```typescript
function Deco() {
  return () => {}
}

@Deco()
class Foo {}
```

在这种情况下， 程序会先执行 `Deco()`， 在用内部返回的函数作为装饰器的实际逻辑。 这样， 我们就可以灵活地通过入参来调整装饰器的作用

## 装饰器大起底

typescript 中的装饰器可以分为

- 类装饰器 （常用）
- 方法装饰器 （常用）
- 访问符装饰器
- 属性装饰器 （常用）
- 参数装饰器

### 类装饰器

类装饰器是直接作用在类上的装饰器， 他在执行时的入参只有一个， 那就是这个类本身（而不是类的原型对象）。 因此， 我们可以通过类装饰器来覆盖类的属性和方法， 如果你在类装饰器中返回了一个新的类， 它甚至可以篡改掉整个类的实现。

```typescript
const AddMethod = (): ClassDecorator => {
 return (target: any) => {
  target.prototype.newInstanceMethod = () => {
   console.log('this is new method');
  };

  target.newStaticMethod = () => {
   console.log('this is new Static method');
  };
 };
};

const AddProperty = (v: string): ClassDecorator => {
 return (target) => {
  target.prototype.newInstanceProp = v;
  (<any>target).newStaticProp = v;
 };
};

@AddProperty('cqc')
@AddMethod()
class Foo {
 newInstanceMethod() {
  console.log('www');
 }
}
```

这里， 我们通过 ts 内置的 ClassDecorator 类型来进行类型标注， 由于类装饰器只有一个入参， 我们也不想使用过多的类型代码， 所以这里直接使用 any了。 我们的函数返回了一个 ClassDecorator， 因此这个装饰器就是一个 Decorator Factory， **在实际实现时候需要以 `@Deco()`** 的形式调用。

在 `AddProperty、AddMethod` 方法中， 我们分别在 `target、 target.prototype` 上添加了方法与属性， 还记得 es6 中 Class 的本质仍然是基于原型的吗？ 在这里 `target 上的属性实际上是 静态成员`， 也就是实例上不会获得的方法， 而 `target.prototype` 上的属性才是会随着继承与实例化过程被传递的实例成员。

我们在装饰器中新增的属性方法并没有直接在 Foo 中定义， 而是通过装饰器来强行添加！ 我们也可以在装饰器中返回一个子类

```typescript
const OverrideBar = (target: any) => {
 return class extends target {
  print() {
   console.log('this is new print');
  }

  overridedPrint() {
   console.log('This is Overrided Bar!');
  }
 };
};

@OverrideBar
class Bar {
 print() {
  console.log('old print');
 }
}

const bar: any = new Bar();

bar.print(); // this is new print
bar.overridedPrint(); // This is Overrided Bar!

```

### 方法装饰器

方法装饰器的入参包括 **类的原型、方法名、方法的属性描述符**, 而通过属性描述符你可以控制这个方法的内部实现（即 value）、 可变性（即 writable） 等信息

能拿到原本实现， 也就意味着， 我们可以在指向原本方法的同时， 插入一段新的逻辑：

```typescript
function HiOverride(): MethodDecorator {
  return (target, propKey, desc: TypedPropertyDescriptor<any>) => {
    const oldFn = desc.value;

    desc.value = function (...args) {
      oldFn.call(this, args);
      console.log('new method', propKey);
      console.log(target === Foo.prototype); // true

      return 'aaa';
    };
  };
}

class Foo {
  @HiOverride()
  sayHi() {
    console.log('old method');
    console.log('this.name: ', this.name);
  }

  _name = 'cqc';

  get name() {
    return this._name;
  }

  set name(str: string) {
    this._name = str;
  }
}

const foo = new Foo();

foo.sayHi();

```

这里主要了解下 MethodDecorator 类型的三个入参

- target: 类的原型，（不是类本身， 比如这里对应的就是 `Foo.prototype`）
- propKey: 当前作用装饰器对应的方法名
- desc: 该方法的描述信息(可以通过 `desc.value` 来获取该属性的值)

### 访问符装饰器

访问符装饰器并不常见, 但他其实就是 `get value() {}`, `set value(v) {}` 这样的方法, 其中 getter 是在访问这个属性 `value`时候触发, setter 是在对这个 `value` 进行赋值时候触发.

**访问符装饰器本质上仍然是方法装饰器, 他们使用的类型定义也相同,** 需要注意的是, 访问符装饰器只能同时应用在一对 getter/setter 的其中一个, 即要么装饰 getter, 要么装饰 setter, 装饰器入参中的描述符都会包括 getter/setter 方法

```typescript
function HiName(v: string): MethodDecorator {
  return (target, propKey, desc: TypedPropertyDescriptor<any>) => {
    const oldSetter = desc.set!;
    const oldGetter = desc.get!;

    desc.set = function (newValue: string) {
      const composed = `Raw: ${newValue}, Actual: ${v}-${newValue}`;
      oldSetter.call(this, composed);
    };

    desc.get = function () {
      return oldGetter.call(this) + '要幸福啊燕子';
    };
  };
}

class Foo {
  private _name = 'cqc';

  get name() {
    return this._name;
  }

  @HiName('哈哈啊哈')
  set name(str: string) {
    this._name = str;
  }
}

const foo = new Foo();

foo.name = '233';

console.log(foo.name); // Raw: 233, Actual: 哈哈啊哈-233要幸福啊燕子

```

### 属性装饰器

属性装饰器在独立使用时候能力非常有限, 它的入参只有 **类的原型与属性名称**, 返回值会被忽略, 但你仍然可以通过**直接在类的原型上赋值来修改属性**

```typescript
function ModifyNickName(otherName: string): PropertyDecorator {
  return (target: any, propKey) => {
    target[propKey] = 'cqc';
    target.otherName = otherName;
  };
}

class Foo {
  @ModifyNickName('大钢炮')
  nickName!: string;
}

const foo = new Foo();

foo.nickName; // cqc
// @ts-expect-error
foo.otherName; // 大钢炮

```

### 参数装饰器

参数装饰器包括了构造函数的参数装饰器与方法的参数装饰器, 它的入参包括**类的原型 参数名 参数在函数参数重的索引值(即第几个参数)**, 如果只是单独使用, 它的作用非常有限

```typescript
function CheckParam(): ParameterDecorator {
  return (target, propKey, index) => {
    console.log(target, propKey, index);
  };
}

class Foo {
  saiHi(@CheckParam() input: string) {
    console.log(input);
  }
}

const foo = new Foo();

```

### 装饰器的执行机制

装饰器的执行机制中主要包括 **执行时机 执行原理 执行顺序** 这三个概念

首先是执行时机, 还记得我们刚开始说的吗? 装饰器的本质就是一个函数, 因此只要在类上定义了它, 即是不去实例化这个类或者读取静态成员, 他也会正常执行. 很多时候, 我们并不会实例化具有装饰器的类, 而是通过反射元数据的能力来消费(后面说). 而装饰器的执行原理我们可以通过编译后的代码来了解

```typescript
@Cls()
class Foo {
  constructor(@Param() init?: string) { }

  @Prop()
  prop!: string

  @Method()
  handler(@Param() input: string) {

  }
}
```

-> 经过简化 [完整代码](https://www.typescriptlang.org/zh/play?ssl=5&ssc=10&pln=5&pc=16#code/GYVwdgxgLglg9mABAYQDYGcAUBKAXC1AQ3XQBEBTCOAJ0KhsQG8AoRRa8qEapTKQ6gHNO2RAF4AfE0QBfZnOahIsBIgCynABZwAJjnwao2nRSq161Jq0RUw6OKnIA6VHEGYA5Ju+aP2axxcPIh8AsJQopLScgpK0PBIAArUcAAO+ojJaeTUUACepjR0DCxsgdy8-EIi4lKlsvLMiuDxqokChAC2Ge20nZw5heYlAZwVIVXhkXUNCgACaFj+EEQkiABicHBWbLboUNQg0DSYc71dOIgwYDBQAPz4+9TXgqKMDdZnKen+bKnfjwOL3EiA8qGuACMQDoQB4mmwvmkcNZ9nQYBBEKjYBAsqlAc8wIIQR4sejEOCwFCYXDPoZjMi2JpCGAdI5qKdzt1RNdUiAoPiXm94R8EXTdAzMfxsZK0RAABLM1k5DkdLlXMC8-mSgmvKzWGJNZh7KCIYBbEFgcgAdw2WxwAG4gA)

```javascript
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
   // ...
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};

let Foo = class Foo {
    constructor(init) { }
    handler(input) {
    }
};

__decorate([
    Prop(),
], Foo.prototype, "prop", void 0);

__decorate([
    Method(),
    __param(0, Param()),
], Foo.prototype, "handler", null);

Foo = __decorate([
    Cls(),
    __param(0, Param()),
], Foo);
```

可以看到，上面的装饰器顺序依次是实例上的属性、方法、方法参数，然后是静态的属性、方法、方法参数，最后是类以及类构造函数参数。

在 TypeScript 官方文档中对应用顺序给出了详细的定义：

1. 参数装饰器，然后依次是方法装饰器，访问符装饰器，或属性装饰器应用到每个实例成员。
2. 参数装饰器，然后依次是方法装饰器，访问符装饰器，或属性装饰器应用到每个静态成员。
3. 参数装饰器应用到构造函数。
4. 类装饰器应用到类。

```typescript
function Deco(identifier: string): any {
  console.log(`${identifier} 执行`);
  return function () {
    console.log(`${identifier} 应用`);
  };
}

@Deco('类装饰器')
class Foo {
  constructor(@Deco('构造函数参数装饰器') name: string) {}

  @Deco('实例属性装饰器')
  prop?: number;

  @Deco('实例方法装饰器')
  handler(@Deco('实例方法参数装饰器') args: any) {}
}
```

result

```text
实例属性装饰器 执行
实例属性装饰器 应用
实例方法装饰器 执行
实例方法参数装饰器 执行
实例方法参数装饰器 应用
实例方法装饰器 应用
类装饰器 执行
构造函数参数装饰器 执行
构造函数参数装饰器 应用
类装饰器 应用
```
