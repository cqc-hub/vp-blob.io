interface Foo {
	name: string;
	age: number;
	job: Job;
}

interface Job {
	f: string;
}

type ChangeListener = {
	on: (change: `${keyof Foo}Changed`) => void;
};

declare let listener: ChangeListener;

listener.on('')