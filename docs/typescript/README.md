---
title: TypeScript
---
# {{ $frontmatter.title }}

不知道要写些什么， 总之 typescript nb, 加油 **奥里给!!!**

```typescript
function updata(state) {
    return {
        router: state.router
    }
}

// 获取函数入参类型———————————

type ArrType = Parameters<typeof updata>
// ArrType => [state: any]

// 如果想获取state的类型呢？这个时候需要用到infer

type GetType<T> = T extends (arg: infer P) => void ? P : string;

type StateType = GetType<typeof update>
//  StateType => any
// 因为state没有设置类型，所以ts推断state的类型为any

// 把这段代码翻译一下：
// (arg: infer P)：arg的类型待推断为P
// 整段代码的意思：如果T能赋值给(arg: infer P) => void，则返回P，否则返回string

// 获取函数的返回值类型，需要使用typescript提供的内置方法ReturnType
type Return = ReturnType<typeof update>
```
