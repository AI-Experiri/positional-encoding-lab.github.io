<!-- ABOUTME: Visualizes ALiBi (Attention with Linear Biases) -->
<!-- ABOUTME: Shows linear distance penalty for length extrapolation -->

<div class="space-y-4">
  <!-- Header -->
  <section class="bg-[#16213e] rounded-lg p-4">
    <div class="flex items-center gap-4 mb-2">
      <h2 class="text-[var(--text-h1)] font-bold text-cyan-500">ALiBi: Attention with Linear Biases</h2>
      <a href="https://arxiv.org/abs/2108.12409" target="_blank" class="text-[var(--text-small)] text-gray-400 hover:text-white">
        Press et al., 2022 ↗
      </a>
    </div>

    <!-- Core Summary -->
    <div class="bg-[#0f3460] rounded p-3 mb-3">
      <p class="text-[var(--text-body)] text-gray-300">
        <strong class="text-white">Core idea:</strong> <strong class="text-cyan-400">Subtract</strong> a penalty proportional to distance from attention scores:
        <code class="text-cyan-300">score = QK<sup>T</sup> − m·|i−j|</code>.
        <strong class="text-emerald-400">No learned parameters</strong> — just a fixed linear bias that naturally
        <strong class="text-amber-400">extrapolates to any length</strong>.
      </p>
    </div>

    <p class="text-[var(--text-small)] text-gray-400">
      "Train Short, Test Long" — models trained on 1024 tokens generalize to 10K+ tokens without fine-tuning.
    </p>
  </section>

  <!-- 1. The Problem -->
  <section class="bg-[#16213e] rounded-lg p-4">
    <h3 class="text-[var(--text-h2)] font-semibold text-[#e94560] mb-2">1. The Problem: Length Extrapolation</h3>
    <p class="text-[var(--text-body)] text-gray-300 mb-3">
      Previous position encoding methods hit a wall when sequences exceed training length:
    </p>

    <div class="grid md:grid-cols-2 gap-3">
      <div class="bg-[#0f3460] rounded p-3">
        <p class="text-[var(--text-small)] text-red-400 font-semibold mb-2">Learned position embeddings</p>
        <p class="text-[var(--text-small)] text-gray-300">
          Models trained on 1024 tokens fail at 2048 — they've never seen those position embeddings.
          The embedding table simply doesn't have entries beyond training length.
        </p>
      </div>
      <div class="bg-[#0f3460] rounded p-3">
        <p class="text-[var(--text-small)] text-red-400 font-semibold mb-2">Sinusoidal and RoPE</p>
        <p class="text-[var(--text-small)] text-gray-300">
          While theoretically generalizable, models still degrade on longer sequences.
          The attention patterns learned during training don't transfer well to unseen lengths.
        </p>
      </div>
    </div>

    <div class="bg-[#1a1a2e] border border-amber-500/30 rounded p-3 mt-3">
      <p class="text-[var(--text-small)] text-gray-300">
        <strong class="text-amber-400">The question:</strong> Can we design position encoding that
        <em>naturally</em> works at any length, without needing scaling tricks or fine-tuning?
      </p>
    </div>
  </section>

  <!-- 2. Key Insight -->
  <section class="bg-[#16213e] rounded-lg p-4">
    <h3 class="text-[var(--text-h2)] font-semibold text-[#e94560] mb-2">2. The Key Insight: Simpler is Better</h3>
    <p class="text-[var(--text-body)] text-gray-300 mb-3">
      What's the simplest position signal that could work?
    </p>

    <div class="bg-[#0f3460] border border-cyan-500/30 rounded p-4 mb-3">
      <p class="text-[var(--text-body)] text-cyan-400 font-semibold mb-2">Just subtract distance from attention scores</p>
      <p class="text-[var(--text-small)] text-gray-300 mb-3">
        No learned parameters. No sinusoids. No rotation matrices.
        Just: <strong class="text-white">closer tokens get higher attention, farther tokens get lower</strong>.
      </p>
      <div class="bg-[#1a1a2e] rounded p-3">
        <code class="text-[var(--text-body)] text-cyan-300 block text-center">attention_score = Q·K<sup>T</sup> - m·|i - j|</code>
        <p class="text-[var(--text-small)] text-gray-500 mt-2 text-center">where m is a head-specific slope (fixed, not learned)</p>
      </div>
    </div>

    <div class="bg-[#1a1a2e] border border-emerald-500/30 rounded p-3">
      <p class="text-[var(--text-small)] text-emerald-400 font-semibold mb-1">Why this works for extrapolation</p>
      <p class="text-[var(--text-small)] text-gray-300">
        The linear penalty <code class="text-cyan-300">-m·|i-j|</code> produces the same pattern at any length.
        Position 1000 is penalized the same way as position 100 — there's no "out of distribution" problem.
      </p>
    </div>
  </section>

  <!-- 3. How It Works -->
  <section class="bg-[#16213e] rounded-lg p-4">
    <h3 class="text-[var(--text-h2)] font-semibold text-[#e94560] mb-2">3. How It Works: Multi-Slope Attention</h3>
    <p class="text-[var(--text-small)] text-gray-300 mb-3">
      Each attention head gets a different slope m. Steep slopes focus locally; gentle slopes attend globally.
    </p>

    <div class="bg-[#0f3460] rounded p-3 mb-3">
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

    <div class="bg-[#0f3460] rounded p-3">
      <p class="text-[var(--text-small)] text-gray-400 mb-2"><strong class="text-white">Attention bias matrix:</strong></p>
      <div class="text-[var(--text-small)] font-mono text-center text-cyan-300">
        <p>[ 0, -1, -2, -3, ... ]</p>
        <p>[ 0,  0, -1, -2, ... ] × m</p>
        <p>[ 0,  0,  0, -1, ... ]</p>
      </div>
      <p class="text-[var(--text-small)] text-gray-500 mt-2 text-center">Lower triangular distance matrix, multiplied by head-specific slope m</p>
    </div>
  </section>

  <!-- 4. Why ALiBi Works -->
  <section class="bg-[#16213e] rounded-lg p-4">
    <h3 class="text-[var(--text-h2)] font-semibold text-[#e94560] mb-2">4. Why ALiBi Extrapolates</h3>

    <div class="space-y-2 text-[var(--text-small)] text-gray-300 mb-4">
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

    <div class="bg-[#0f3460] rounded p-3">
      <p class="text-[var(--text-small)] text-amber-400">
        <strong>Used in:</strong> BLOOM, MPT, Falcon, and other models prioritizing length generalization.
      </p>
    </div>
  </section>

  <!-- What happened next -->
  <section class="bg-gradient-to-br from-cyan-600/30 via-blue-700/20 to-purple-800/20 border-2 border-cyan-400 shadow-lg shadow-cyan-500/20 rounded-lg p-4 mb-4">
    <h3 class="text-[var(--text-h2)] font-semibold text-cyan-300 mb-2">💡 What happened next</h3>

    <p class="text-[var(--text-small)] text-gray-300 mb-4">
      ALiBi showed that simpler position encoding works. This raised a radical question...
    </p>

    <div class="space-y-3 text-[var(--text-small)] mb-4">
      <div class="flex gap-2">
        <span class="text-cyan-400">?</span>
        <div>
          <p class="text-gray-300"><strong class="text-white">Do we need position encoding at all?</strong></p>
          <p class="text-gray-500">ALiBi is simple, but it still adds explicit position bias...</p>
        </div>
      </div>
      <div class="flex gap-2">
        <span class="text-cyan-400">?</span>
        <div>
          <p class="text-gray-300"><strong class="text-white">Is causal masking enough?</strong></p>
          <p class="text-gray-500">The mask already tells you "this token can only see tokens before it"</p>
        </div>
      </div>
      <div class="flex gap-2">
        <span class="text-cyan-400">?</span>
        <div>
          <p class="text-gray-300"><strong class="text-white">Can position emerge from content and context?</strong></p>
          <p class="text-gray-500">Maybe the model can learn position implicitly from patterns in the data?</p>
        </div>
      </div>
    </div>

    <!-- Teaser for NoPE -->
    <div class="bg-[#e94560]/20 border border-[#e94560]/50 rounded p-3">
      <p class="text-[var(--text-small)] text-gray-300">
        <strong class="text-[#e94560]">NoPE (2023)</strong> tested the extreme:
        <strong class="text-white">remove position encoding entirely</strong>.
        Just causal masking — and surprisingly, it works for many tasks.
      </p>
      <p class="text-[var(--text-small)] text-gray-500 mt-2">
        → See the <strong class="text-pink-400">NoPE</strong> tab
      </p>
    </div>
  </section>
</div>
