type Flatten<T> = {
	[K in keyof T]: T[K];
};

type FuncStruct = (...args: any[]) => any;

type FunctionKeys<T extends object> = {
	[K in keyof T]: T[K] extends FuncStruct ? K : never;
}[keyof T];

type Tmp<T extends object> = {
	[K in keyof T]: T[K] extends FuncStruct ? K : never;
};

type r = Tmp<{
	foo: () => void;
	bar(): number;
	baz: () => string;
	a: string;
}>;

type r1 = FunctionKeys<{
	foo: () => void;
	bar(): number;
	baz: () => string;
	a: string;
}>;

type ResEqual = {
	foo: 'foo';
	bar: 'bar';
	baz: 'baz';
};

type r2 = ResEqual[keyof ResEqual];
