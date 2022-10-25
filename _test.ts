type t = 'foo_bar_baz';

type Split<
	Str extends string,
	Delimiter extends string
> = Str extends `${infer Head}${Delimiter}${infer Tail}`
	? [Head, ...Split<Tail, Delimiter>]
	: Str extends Delimiter
	? []
	: [Str];

type Join<
	T extends Array<string | number>,
	Delimiter extends string
> = T extends [string | number]
	? T[0]
	: T extends [infer Head, ...infer Rest]
	? // @ts-ignore
	  `${Head}${Delimiter}${Join<Rest, Delimiter>}`
	: '';

type CaptionArr<T extends Array<string>> = T extends [string]
	? [Capitalize<T[0]>]
	: T extends [infer H, ...infer R]
	? // @ts-ignore
	  [Capitalize<H>, ...CaptionArr<R>]
	: [];

type Capitial<T extends string> = Join<CaptionArr<Split<T, '_'>>, ''>;

type a = Capitial<t>;
type b = CaptionArr<['cqc']>;
