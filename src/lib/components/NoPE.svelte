<!-- ABOUTME: Visualizes NoPE (No Positional Encoding) approach -->
<!-- ABOUTME: Shows how causal mask provides implicit position information -->

<div class="bg-[#16213e] rounded-lg p-6">
  <h2 class="text-[var(--text-h1)] font-bold text-pink-500 mb-2">NoPE: No Positional Encoding</h2>
  <p class="text-gray-400 mb-4">Kazemnejad et al., 2023 — "The Impact of Positional Encoding on Length Generalisation in Transformers"</p>

  <!-- Core Summary -->
  <div class="bg-[#0f3460] rounded p-3 mb-4">
    <p class="text-[var(--text-body)] text-gray-300">
      <strong class="text-white">Core idea:</strong> <strong class="text-pink-400">Remove PE entirely</strong>.
      The causal attention mask already provides <strong class="text-emerald-400">implicit position info</strong> —
      each token knows how many came before it. This forces the model to learn
      <strong class="text-amber-400">position-invariant patterns</strong> that generalize to any sequence length.
    </p>
  </div>

  <!-- Problems Addressed -->
  <div class="bg-[#0f3460] rounded-lg p-4 mb-4">
    <h3 class="text-[var(--text-h2)] font-semibold text-[#e94560] mb-3">The Question</h3>
    <p class="text-[var(--text-small)] text-gray-300 mb-3">
      Every PE method so far assumes position information is <strong class="text-white">necessary</strong>. But is it?
      What if the causal attention mask already provides implicit position information?
    </p>
    <div class="bg-[#1a1a2e] border border-pink-500/30 rounded p-3">
      <p class="text-[var(--text-small)] text-gray-300">
        In decoder-only models, token at position 5 can only attend to positions 1-5.
        This <strong class="text-white">triangular mask pattern</strong> implicitly encodes position —
        each token has a unique "attention horizon."
      </p>
    </div>
  </div>

  <!-- Key Finding -->
  <div class="bg-[#0f3460] rounded-lg p-4 mb-4">
    <h3 class="text-[var(--text-h2)] font-semibold text-[#e94560] mb-3">Key Finding</h3>
    <div class="bg-[#1a1a2e] border border-pink-500/30 rounded p-3 mb-3">
      <p class="text-[var(--text-small)] text-pink-400 font-semibold mb-2">Removing PE entirely can improve length generalization</p>
      <p class="text-[var(--text-small)] text-gray-300">
        On algorithmic tasks (copying, reversing, addition), NoPE generalizes better to longer sequences
        than sinusoidal, RoPE, or ALiBi — because there's no position encoding to break at unseen lengths.
      </p>
    </div>
    <div class="grid md:grid-cols-2 gap-4">
      <div class="bg-[#1a1a2e] border border-red-500/30 rounded p-3">
        <p class="text-[var(--text-small)] text-red-400 font-semibold mb-2">With PE</p>
        <p class="text-[var(--text-small)] text-gray-300">Model learns position-dependent patterns that break at unseen lengths</p>
      </div>
      <div class="bg-[#1a1a2e] border border-green-500/30 rounded p-3">
        <p class="text-[var(--text-small)] text-green-400 font-semibold mb-2">Without PE (NoPE)</p>
        <p class="text-[var(--text-small)] text-gray-300">Model forced to learn position-invariant algorithms that generalize</p>
      </div>
    </div>
  </div>

  <!-- How It Works -->
  <div class="bg-[#0f3460] rounded-lg p-4 mb-4">
    <h3 class="text-[var(--text-h2)] font-semibold text-[#e94560] mb-3">How Position is Inferred</h3>
    <p class="text-[var(--text-small)] text-gray-300 mb-3">
      Without explicit PE, the model infers position from the causal mask:
    </p>
    <div class="bg-[#1a1a2e] rounded p-3 mb-3">
      <div class="space-y-2 text-[var(--text-small)] font-mono">
        <div class="flex items-center gap-2">
          <span class="text-pink-400">Token 1:</span>
          <span class="text-gray-300">can attend to [1]</span>
          <span class="text-gray-500">→ knows it's first</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-pink-400">Token 3:</span>
          <span class="text-gray-300">can attend to [1, 2, 3]</span>
          <span class="text-gray-500">→ knows 2 tokens came before</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-pink-400">Token N:</span>
          <span class="text-gray-300">can attend to [1, ..., N]</span>
          <span class="text-gray-500">→ knows N-1 tokens came before</span>
        </div>
      </div>
    </div>
    <p class="text-[var(--text-small)] text-gray-500">
      The number of tokens a position can attend to uniquely identifies its position.
    </p>
  </div>

  <!-- Limitations -->
  <div class="bg-[#0f3460] rounded-lg p-4">
    <h3 class="text-[var(--text-h2)] font-semibold text-[#e94560] mb-3">Limitations</h3>
    <div class="space-y-2 text-[var(--text-small)] text-gray-300">
      <div class="flex gap-2">
        <span class="text-amber-400 font-bold">1.</span>
        <p><strong class="text-white">Decoder-only:</strong> Only works with causal attention mask. Encoder models (bidirectional) still need explicit PE.</p>
      </div>
      <div class="flex gap-2">
        <span class="text-amber-400 font-bold">2.</span>
        <p><strong class="text-white">Task-dependent:</strong> Works well for algorithmic tasks, but natural language may benefit from explicit position info.</p>
      </div>
      <div class="flex gap-2">
        <span class="text-amber-400 font-bold">3.</span>
        <p><strong class="text-white">Relative position unclear:</strong> The model knows "how many tokens before me" but not "how far apart are these two tokens."</p>
      </div>
    </div>
  </div>
</div>
