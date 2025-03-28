/**
 * Click outside action for handling dropdown behavior
 * Used to close the dropdown when clicking outside of it
 */
export function clickOutside(node: HTMLElement, { callback }: { callback: () => void }) {
	const handleClick = (event: MouseEvent) => {
		if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
			callback();
		}
	};

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
}
