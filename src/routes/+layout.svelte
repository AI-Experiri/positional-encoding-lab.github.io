<script>
	// ABOUTME: Root layout component that imports global styles
	// ABOUTME: Wraps all pages with common structure

	import '../lib/styles/app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Positional Encoding Visualizer</title>
</svelte:head>

{@render children()}
