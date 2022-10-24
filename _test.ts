class Animal {
	asPat() {}
}

class Dog extends Animal {
	bark() {}
}

class Corgi extends Dog {
	cute() {}
}

type DogFactory = (arg: Dog) => Dog;

function transformDogAndBark(dogFactory: DogFactory) {
	const dog = dogFactory(new Dog());

	dog.bark();
}

type AsFuncArgType<T> = (arg: T) => void;
type AsFuncReturnType<T> = (arg: unknown) => T;

// 成立 (T -> Corgi） < (T -> Dog),   (T -> Corgi) 是 (T -> Dog) 的子类型
type CheckReturnType = AsFuncReturnType<Corgi> extends AsFuncReturnType<Dog>
	? 1
	: 2; // 1

type CheckArgType = AsFuncArgType<Dog> extends AsFuncArgType<Animal> ? 1 : 2;
