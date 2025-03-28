export class CallFunctionOnDebounce {
	timeoutRef: ReturnType<typeof setTimeout> | null = null;
	private func: () => void;
	private delay: number;
	private deps: () => unknown[];

	constructor({ func, delay, deps }: { func: () => void; delay: number; deps: () => unknown[] }) {
		this.func = func;
		this.delay = delay;
		this.deps = deps;

		$effect(() => {
			this.deps();

			if (this.timeoutRef) {
				clearTimeout(this.timeoutRef);
			}

			this.timeoutRef = setTimeout(() => {
				this.func();
			}, this.delay);
		});
	}
}
