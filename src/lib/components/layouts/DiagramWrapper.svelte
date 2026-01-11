<!-- ABOUTME: Wrapper for attention diagram SVG visualizations -->
<!-- ABOUTME: Provides dark background, legend, and attribution -->

<script>
  let { children, showLegend = true, attribution = null } = $props();
</script>

<div class="bg-[#0a0a1a] rounded-lg p-6 w-full">
  {@render children()}
  <div class="flex justify-between items-center mt-2 w-full">
    {#if showLegend}
      <div class="flex gap-4 text-[var(--text-small)]">
        <div class="flex items-center gap-1">
          <div class="w-3 h-3 rounded border-2 border-white bg-[#1e3a5f]"></div>
          <span class="text-gray-400">Learned</span>
        </div>
        <div class="flex items-center gap-1">
          <div
            class="w-3 h-3 rounded border-2 border-yellow-400 bg-[#1e3a5f]"
          ></div>
          <span class="text-gray-400">Items of Interest</span>
        </div>
      </div>
    {:else}
      <div></div>
    {/if}
    {#if attribution}
      <p class="text-[var(--text-small)] text-gray-500">
        Diagram inspired by
        <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external attribution link -->
        <a href={attribution.url} target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white underline">{attribution.name}</a>
      </p>
    {/if}
  </div>
</div>
