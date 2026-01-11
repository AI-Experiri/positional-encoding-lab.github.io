<!-- ABOUTME: Reusable section wrapper with consistent styling -->
<!-- ABOUTME: Used across all PE visualization tabs -->

<script>
  let { children, title = '' } = $props();
</script>

<section class="bg-[#16213e] rounded-lg p-4 mb-4">
  {#if title}
    <h3 class="text-[var(--text-h2)] font-semibold text-[#e94560] mb-2">{title}</h3>
  {/if}
  {@render children()}
</section>
