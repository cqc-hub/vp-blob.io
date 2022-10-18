interface IObj {
	name: 'ccc';
	age: number;
	fav: {
		game: {
			projectZero: string;
			hh: {
				p: string;
				w: '233';
			};
		};

		fu: number;
	};
}

type StrictConditional<A, B, Resolved, Rejected, Fallback = never> = [
	A
] extends [B]
	? [B] extends [A]
		? Resolved
		: Rejected
	: Fallback;

type StrictValueTypeFilter<
	T extends object,
	ValueType,
	Positive extends boolean = true
> = {
	[Key in keyof T]-?: StrictConditional<
		ValueType,
		T[Key],
		Positive extends true ? Key : never,
		Positive extends true ? never : Key,
		Positive extends true ? never : Key
	>;
}[keyof T];

type StrictPickByValueType<T extends object, ValueType> = Pick<
	T,
	StrictValueTypeFilter<T, ValueType>
>;

type t = StrictPickByValueType<IObj, number>;

// declare var test: t;
