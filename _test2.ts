type Join<T extends Array<string>, Delimiter extends string> = T extends [
	string
]
	? T[0]
	: T extends [infer Head, ...infer Toil]
	? // @ts-expect-error
	  `${Head}${Delimiter}${Join<Toil, Delimiter>}`
	: '';

type a = Join<['cq', 'c'], ''>;
