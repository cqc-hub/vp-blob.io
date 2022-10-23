interface Io {
	name: string;
	age: number;
}

type F<T> = {
	[K in keyof T as T[K] extends string ? never : K]: T[K] extends string
		? never
		: T[K];
};

type t = F<Io>;

const obj: t = {
	age: 233
};
