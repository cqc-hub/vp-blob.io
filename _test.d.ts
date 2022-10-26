declare module 'pkg' {
	export const handler: () => string;

}

declare module 'pkg2' {
	const handler: () => number;

	export default handler;
}
