type FunctionType = (...args: any) => any;

type LastParameter<T extends FunctionType> = T extends (arg: infer P) => any
	? P
	: T extends (...args: infer R) => any
	? R extends [...any, infer Q]
		? Q
		: never
	: never;

type a = (name: string) => void;
type b = (name: string, age: number) => void;
type c = () => Promise<string>;

type a1 = LastParameter<a>;
type b1 = LastParameter<b>;
type c1 = LastParameter<c>;

type d = Awaited<c>;

