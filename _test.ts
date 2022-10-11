type FirstArrayItemType<T extends any[]> = T extends [
	infer P extends string,
	...any[]
]
	? P
	: never;

type a = FirstArrayItemType<[233, 'cqc']>;
