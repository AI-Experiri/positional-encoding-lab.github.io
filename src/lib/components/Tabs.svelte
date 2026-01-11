<script>
  // ABOUTME: Tab navigation for PE methods
  // ABOUTME: Simple inline pill-style tabs

  let { tabs = [], activeTab = '', onchange = () => {} } = $props();

  function selectTab(tabId) {
    onchange(tabId);
  }
</script>

<div class="flex flex-wrap gap-1.5">
  {#each tabs as tab (tab.id)}
    <button
      onclick={() => selectTab(tab.id)}
      title={tab.description}
      class="px-3 py-1.5 rounded-lg font-medium transition-all text-[var(--text-body)]
        {activeTab === tab.id
        ? `${tab.color} text-white shadow-lg`
        : 'bg-white/10 text-gray-300 hover:bg-white/20'}"
    >
      {tab.label}
    </button>
  {/each}
</div>
