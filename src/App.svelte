<script>
  // ABOUTME: Main page for positional encoding visualization
  // ABOUTME: Shows evolution of PE methods from 2017 to present with tabs

  import Tabs from './lib/components/Tabs.svelte';
  import KeepAlive from './lib/components/KeepAlive.svelte';
  import Sinusoidal from './lib/components/Sinusoidal.svelte';
  import RelativePE from './lib/components/RelativePE.svelte';
  import TransformerXL from './lib/components/TransformerXL.svelte';
  import T5 from './lib/components/T5.svelte';
  import RoPE from './lib/components/RoPE.svelte';
  import ALiBi from './lib/components/ALiBi.svelte';
  import NoPE from './lib/components/NoPE.svelte';

  const tabs = [
    {
      id: 'sinusoidal',
      label: 'Sinusoidal',
      description: 'Absolute sinusoidal encoding (Vaswani et al., 2017)',
      color: 'bg-purple-600',
    },
    {
      id: 'relative-pe',
      label: 'Relative-PE',
      description: 'First relative PE in attention (Shaw et al., 2018)',
      color: 'bg-blue-600',
    },
    {
      id: 'transformer-xl',
      label: 'Transformer-XL',
      description: 'Relative PE with segment recurrence (Dai et al., 2019)',
      color: 'bg-green-600',
    },
    {
      id: 't5',
      label: 'T5',
      description: 'Bucketed relative PE, shared across layers (Raffel et al., 2020)',
      color: 'bg-yellow-600',
    },
    {
      id: 'rope',
      label: 'RoPE',
      description: 'Rotary Position Embedding (Su et al., 2021)',
      color: 'bg-orange-600',
    },
    {
      id: 'alibi',
      label: 'ALiBi',
      description: 'Attention with Linear Biases (Press et al., 2022)',
      color: 'bg-cyan-600',
    },
    {
      id: 'nope',
      label: 'NoPE',
      description: 'No Positional Encoding (Kazemnejad et al., 2023)',
      color: 'bg-pink-600',
    },
  ];

  let activeTab = $state('sinusoidal');

  function handleTabChange(tabId) {
    activeTab = tabId;
  }
</script>

<main class="min-h-screen bg-[#1a1a2e] px-6 md:px-10 lg:px-16 py-4 flex flex-col">
  <div class="max-w-7xl mx-auto w-full flex flex-col flex-1 min-h-0">
    <!-- Compact Header with Tabs -->
    <div class="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4">
      <h1 class="text-[var(--text-h1)] font-bold text-[#e94560] whitespace-nowrap">Positional Encoding</h1>
      <Tabs {tabs} {activeTab} onchange={handleTabChange} />
    </div>

    <!-- Tab Content (lazy mount + keep alive) -->
    <KeepAlive show={activeTab === 'sinusoidal'}>
      <Sinusoidal />
    </KeepAlive>

    <KeepAlive show={activeTab === 'relative-pe'}>
      <RelativePE />
    </KeepAlive>

    <KeepAlive show={activeTab === 'transformer-xl'}>
      <TransformerXL />
    </KeepAlive>

    <KeepAlive show={activeTab === 't5'}>
      <T5 />
    </KeepAlive>

    <KeepAlive show={activeTab === 'rope'}>
      <RoPE />
    </KeepAlive>

    <KeepAlive show={activeTab === 'alibi'}>
      <ALiBi />
    </KeepAlive>

    <KeepAlive show={activeTab === 'nope'}>
      <NoPE />
    </KeepAlive>

    <!-- Footer -->
    <footer class="mt-auto pt-6 flex justify-between items-center text-[var(--text-small)] text-gray-500">
      <div class="flex flex-col gap-1">
        <a
          href="https://ohgodmodels.xyz"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-gray-300 transition-colors">OHGOD Models Philosophy</a
        >
        <a
          href="https://debugarguments.app"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-gray-300 transition-colors">Debug Arguments App</a
        >
      </div>
      <div class="flex flex-col gap-1 text-right">
        <a
          href="https://bicepjai.com"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-gray-300 transition-colors">Created by bicepjai</a
        >
        <span>Created with claude</span>
      </div>
    </footer>
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: system-ui, -apple-system, sans-serif;
  }
</style>
