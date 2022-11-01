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

能拿到原本实现， 也就意味着， 我们可以在指向原本方法的同时， 插入一段新的逻辑， 比如计算这个方法的执行耗时：

```typescript
const ComputedProfiler = (): MethodDecorator => {
 const start = new Date();
 return (target, propKey, desc) => {
  const originMethodImpl: any = desc.value!;
  // @ts-ignore
  desc.value = async function (...args: unknown[]) {
   const res = await originMethodImpl.apply(this, args);
   const end = new Date();
   console.log(
    `${String(propKey)} Time:`,
    end.getTime() - start.getTime()
   );
   console.log(this, target);

   // 实际上接收的值
   return 'cqc' + res;
  };
 };
};

class Foo {
 // @ts-ignore
 @ComputedProfiler()
 fetch() {
  return new Promise((resolve) => {
   setTimeout(() => {
    resolve('res');
   }, 1500);
  });
 }
}
```

这里主要了解下 MethodDecorator 类型的三个入参

- target: 类的原型，（不是类本身， 比如这里对应的就是 `Foo.prototype`）
- propKey: 当前作用装饰器对应的方法名
- desc: 该方法的描述信息(可以通过 `desc.value` 来获取该属性的值)
