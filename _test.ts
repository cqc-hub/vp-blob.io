type Split<
	Str extends string,
	Delimit extends string
> = Str extends `${infer Head}${Delimit}${infer Tail}`
	? [Head, ...Split<Tail, Delimit>]
	: Str extends Delimit
	? []
	: [Str];

type a = Split<'cqc', ''>;
