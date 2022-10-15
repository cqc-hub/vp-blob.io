---
sidebar: auto

prev:
 text: n.协变与逆变的比较
 link: /typescript/n.协变与逆变的比较.html

---

#

## 属性修饰进阶

在内置工具类型一节中， 对属性修饰工具类型的进阶主要分为这么几个方向：

- 深层的属性修饰
- 基于已知属性的部分修饰， 以及基于属性类型的部分修饰

首先是深层属性修饰， 还记得我们在 infer 关键字异界首先接触到递归的工具类型吗？

```typescript
type PromiseValue<T> = T extends Promise<infer V> ? PromiseValue<V> : T;
```

可以看到， 此时我们只是在条件类型成立时， 再次调用了这个工具而已。 在某一次递归到条件类型不成立时候， 就会直接返回这个类型值。 那么对于 Partial、 Required， 其实我们也可以进行这样的处理：

```typescript
type DeepPartial<T extends object> = {
 [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

```
