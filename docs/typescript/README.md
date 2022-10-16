---
title: TypeScript
---
# {{ $frontmatter.title }}

不知道要写些什么， 总之 typescript nb, 加油 **奥里给!!!**

```typescript
// 类型结构复杂时候可以使用这个类型工具拍平， （直接 鼠标 hover 上去能看具体属性）
type Flatten<T> = { [K in keyof T]: T[K] };
```
