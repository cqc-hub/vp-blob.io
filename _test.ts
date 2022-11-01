const ComputedProfiler = (): MethodDecorator => {
	const start = new Date();
	return (target, propKey, desc) => {
		const originMethodImpl: any = desc.value!;
		// @ts-ignore
		desc.value = async function (...args: unknown[]) {
			const res = await originMethodImpl.apply(this, args);
			const end = new Date();
			console.log(
				`${String(propKey)} Time:`,
				end.getTime() - start.getTime()
			);
			console.log(this, target);

			return 'cqc' + res;
		};
	};
};

class Foo {
	// @ts-ignore
	@ComputedProfiler()
	fetch() {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve('res');
			}, 1500);
		});
	}
}

(async () => {
	console.log(await new Foo().fetch());
})();
