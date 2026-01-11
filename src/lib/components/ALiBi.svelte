<!-- ABOUTME: Visualizes ALiBi (Attention with Linear Biases) -->
<!-- ABOUTME: Shows linear distance penalty for length extrapolation -->

<div class="bg-[#16213e] rounded-lg p-6">
  <h2 class="text-[var(--text-h1)] font-bold text-cyan-500 mb-2">ALiBi: Attention with Linear Biases</h2>
  <p class="text-gray-400 mb-4">Press et al., 2022 — "Train Short, Test Long"</p>

  <!-- Core Summary -->
  <div class="bg-[#0f3460] rounded p-3 mb-4">
    <p class="text-[var(--text-body)] text-gray-300">
      <strong class="text-white">Core idea:</strong> <strong class="text-cyan-400">Subtract</strong> a penalty proportional to distance from attention scores:
      <code class="text-cyan-300">score = QK<sup>T</sup> − m·|i−j|</code>.
      <strong class="text-emerald-400">No learned parameters</strong> — just a fixed linear bias that naturally
      <strong class="text-amber-400">extrapolates to any length</strong>.
    </p>
  </div>

  <!-- Problems Addressed -->
  <div class="bg-[#0f3460] rounded-lg p-4 mb-4">
    <h3 class="text-[var(--text-h2)] font-semibold text-[#e94560] mb-3">Problems Addressed</h3>
    <div class="space-y-3">
      <div class="bg-[#1a1a2e] border border-red-500/30 rounded p-3">
        <p class="text-[var(--text-small)] text-red-400 font-semibold mb-2">Learned position embeddings don't extrapolate</p>
        <p class="text-[var(--text-small)] text-gray-300">
          Models trained on 1024 tokens fail at 2048 tokens — they've never seen those position embeddings.
        </p>
      </div>
      <div class="bg-[#1a1a2e] border border-red-500/30 rounded p-3">
        <p class="text-[var(--text-small)] text-red-400 font-semibold mb-2">Even sinusoidal PE struggles at longer lengths</p>
        <p class="text-[var(--text-small)] text-gray-300">
          While sinusoidal is theoretically generalizable, models still degrade on sequences much longer than training.
        </p>
      </div>
    </div>
  </div>

  <!-- Key Insight -->
  <div class="bg-[#0f3460] rounded-lg p-4 mb-4">
    <h3 class="text-[var(--text-h2)] font-semibold text-[#e94560] mb-3">Key Insight: Simpler is Better</h3>
    <div class="bg-[#1a1a2e] border border-cyan-500/30 rounded p-3 mb-3">
      <p class="text-[var(--text-small)] text-cyan-400 font-semibold mb-2">Just subtract distance from attention scores</p>
      <p class="text-[var(--text-small)] text-gray-300">
        No learned parameters. No sinusoids. Just: <strong class="text-white">closer tokens get higher attention, farther tokens get lower</strong>.
      </p>
    </div>
    <div class="bg-[#1a1a2e] rounded p-3">
      <code class="text-[var(--text-small)] text-cyan-300 block text-center">attention_score = Q·K<sup>T</sup> - m·|i - j|</code>
      <p class="text-[var(--text-small)] text-gray-500 mt-2 text-center">where m is a head-specific slope (fixed, not learned)</p>
    </div>
  </div>

  <!-- How It Works -->
  <div class="bg-[#0f3460] rounded-lg p-4 mb-4">
    <h3 class="text-[var(--text-h2)] font-semibold text-[#e94560] mb-3">How It Works</h3>
    <p class="text-[var(--text-small)] text-gray-300 mb-3">
      Each attention head gets a different slope m. Heads with steep slopes focus locally; heads with gentle slopes attend globally.
    </p>
    <div class="bg-[#1a1a2e] rounded p-3 mb-3">
      <p class="text-[var(--text-small)] text-gray-400 mb-2"><strong class="text-white">Example with 8 heads:</strong></p>
      <div class="space-y-1 text-[var(--text-small)] font-mono">
        <div class="flex items-center gap-2">
          <span class="text-cyan-400 w-16">Head 1:</span>
          <span class="text-gray-300">m = 1/2</span>
          <span class="text-gray-500">→ steep decay, very local</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-cyan-400 w-16">Head 2:</span>
          <span class="text-gray-300">m = 1/4</span>
          <span class="text-gray-500">→ moderate decay</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-cyan-400 w-16">...</span>
          <span class="text-gray-300">...</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-cyan-400 w-16">Head 8:</span>
          <span class="text-gray-300">m = 1/256</span>
          <span class="text-gray-500">→ gentle decay, global attention</span>
        </div>
      </div>
      <p class="text-[var(--text-small)] text-gray-500 mt-2">Slopes form a geometric sequence: m = 2<sup>-8/n</sup> for head n</p>
    </div>
    <div class="bg-[#1a1a2e] border border-cyan-500/30 rounded p-3">
      <p class="text-[var(--text-small)] text-gray-400 mb-2"><strong class="text-white">Attention bias matrix:</strong></p>
      <div class="text-[var(--text-small)] font-mono text-center text-cyan-300">
        <p>[ 0, -1, -2, -3, ... ]</p>
        <p>[ 0,  0, -1, -2, ... ] × m</p>
        <p>[ 0,  0,  0, -1, ... ]</p>
      </div>
      <p class="text-[var(--text-small)] text-gray-500 mt-2 text-center">Multiplied by head-specific slope m</p>
    </div>
  </div>

  <!-- Why ALiBi Works -->
  <div class="bg-[#0f3460] rounded-lg p-4">
    <h3 class="text-[var(--text-h2)] font-semibold text-[#e94560] mb-3">Why ALiBi Extrapolates</h3>
    <div class="space-y-2 text-[var(--text-small)] text-gray-300">
      <div class="flex gap-2">
        <span class="text-cyan-400 font-bold">1.</span>
        <p><strong class="text-white">No position embedding to break:</strong> Just a linear penalty that works at any distance.</p>
      </div>
      <div class="flex gap-2">
        <span class="text-cyan-400 font-bold">2.</span>
        <p><strong class="text-white">Recency bias is natural:</strong> In language, nearby words are usually more relevant — ALiBi encodes this directly.</p>
      </div>
      <div class="flex gap-2">
        <span class="text-cyan-400 font-bold">3.</span>
        <p><strong class="text-white">No learned parameters:</strong> Nothing to overfit to training length.</p>
      </div>
      <div class="flex gap-2">
        <span class="text-cyan-400 font-bold">4.</span>
        <p><strong class="text-white">Train short, test long:</strong> Models trained on 1024 tokens work on 10K+ tokens.</p>
      </div>
    </div>
    <div class="bg-[#1a1a2e] border border-amber-500/30 rounded p-3 mt-3">
      <p class="text-[var(--text-small)] text-amber-400">
        <strong>Used in:</strong> BLOOM, MPT, Falcon, and other models prioritizing length generalization.
      </p>
    </div>
  </div>
</div>
