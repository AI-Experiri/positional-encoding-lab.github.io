<!-- ABOUTME: Visualizes T5 bucketed relative position bias -->
<!-- ABOUTME: Shows logarithmic bucketing and scalar bias addition -->

<div class="space-y-4">
  <!-- Header -->
  <section class="bg-[#16213e] rounded-lg p-4">
    <div class="flex items-center gap-4 mb-2">
      <h2 class="text-[var(--text-h1)] font-bold text-[#e94560]">T5: Bucketed Relative Position Bias</h2>
      <a href="https://arxiv.org/abs/1910.10683" target="_blank" class="text-[var(--text-small)] text-gray-400 hover:text-white">
        Raffel et al., 2020 ↗
      </a>
    </div>

    <!-- Core Summary -->
    <div class="bg-[#0f3460] rounded p-3 mb-3">
      <p class="text-[var(--text-body)] text-gray-300">
        <strong class="text-white">Core idea:</strong> Not all position differences are equally important.
        <strong class="text-yellow-400">Nearby tokens</strong> need precise distance info — "1 vs 2 tokens apart" determines if something is an adjective or a verb.
        <strong class="text-gray-500">Distant tokens</strong> just need "roughly how far" — at 50 tokens away, you're retrieving context, not parsing grammar.
      </p>
    </div>

    <p class="text-[var(--text-small)] text-gray-400">
      T5 uses 32 learned scalar biases with logarithmic bucketing — fine-grained near, coarse-grained far.
    </p>
  </section>

  <!-- 1. The Problem -->
  <section class="bg-[#16213e] rounded-lg p-4">
    <h3 class="text-[var(--text-h2)] font-semibold text-[#e94560] mb-2">1. The Problem: Too Many Position Parameters</h3>
    <p class="text-[var(--text-body)] text-gray-300 mb-3">
      Previous methods (Sinusoidal, Transformer-XL) gave every distance unique treatment.
      But is the difference between "50 tokens apart" and "51 tokens apart" really meaningful?
    </p>
    <div class="bg-[#0f3460] rounded p-3 mb-3">
      <div class="flex items-center gap-2 text-[var(--text-small)] font-mono overflow-x-auto pb-2">
        <span class="text-gray-500">distance:</span>
        <span class="bg-green-900/30 px-2 py-1 rounded text-green-300 border border-green-500/50">1</span>
        <span class="bg-green-900/30 px-2 py-1 rounded text-green-300 border border-green-500/50">2</span>
        <span class="text-gray-500">...</span>
        <span class="bg-gray-700/30 px-2 py-1 rounded text-gray-400">50</span>
        <span class="bg-gray-700/30 px-2 py-1 rounded text-gray-400">51</span>
        <span class="text-gray-500">...</span>
        <span class="bg-gray-700/30 px-2 py-1 rounded text-gray-400">100</span>
        <span class="bg-gray-700/30 px-2 py-1 rounded text-gray-400">101</span>
      </div>
      <p class="text-[var(--text-small)] text-gray-500">Each distance gets unique treatment — but is this necessary?</p>
    </div>

    <div class="bg-[#1a1a2e] border border-amber-500/30 rounded p-3">
      <p class="text-[var(--text-small)] text-gray-300">
        <strong class="text-amber-400">The question:</strong> Does exact distance always matter,
        or can we group similar distances together?
      </p>
    </div>
  </section>

  <!-- 2. Local vs Long-Range -->
  <section class="bg-[#16213e] rounded-lg p-4">
    <h3 class="text-[var(--text-h2)] font-semibold text-[#e94560] mb-2">2. Why Local Precision Matters More</h3>
    <p class="text-[var(--text-body)] text-gray-300 mb-3">
      Language has two types of dependencies, and they have very different distance patterns:
    </p>

    <div class="grid md:grid-cols-2 gap-4 mb-4">
      <!-- Syntactic -->
      <div class="bg-[#0f3460] rounded p-4">
        <p class="text-[var(--text-body)] text-green-400 font-semibold mb-2">Syntactic Dependencies: LOCAL</p>
        <p class="text-[var(--text-small)] text-gray-300 mb-2">Grammar operates on adjacent or near-adjacent tokens:</p>
        <div class="space-y-2 text-[var(--text-small)]">
          <div class="bg-[#1a1a2e] rounded p-2">
            <p class="text-gray-400 mb-1"><strong class="text-white">Subject-verb agreement:</strong></p>
            <p class="font-mono">"The <span class="text-cyan-400">cat</span> <span class="text-green-400">sits</span>" — <span class="text-green-300">1 token apart</span></p>
          </div>
          <div class="bg-[#1a1a2e] rounded p-2">
            <p class="text-gray-400 mb-1"><strong class="text-white">Adjective-noun:</strong></p>
            <p class="font-mono">"<span class="text-cyan-400">Big</span> <span class="text-green-400">dog</span>" — <span class="text-green-300">adjacent</span></p>
          </div>
          <div class="bg-[#1a1a2e] rounded p-2">
            <p class="text-gray-400 mb-1"><strong class="text-white">Preposition phrase:</strong></p>
            <p class="font-mono">"on the <span class="text-green-400">mat</span>" — <span class="text-green-300">1-2 tokens</span></p>
          </div>
        </div>
        <p class="text-[var(--text-small)] text-green-400 mt-3 font-semibold">
          ✓ Here, 1 vs 2 tokens = different grammatical role
        </p>
      </div>

      <!-- Semantic -->
      <div class="bg-[#0f3460] rounded p-4">
        <p class="text-[var(--text-body)] text-amber-400 font-semibold mb-2">Semantic Dependencies: LONG-RANGE</p>
        <p class="text-[var(--text-small)] text-gray-300 mb-2">Meaning connections span across sentences:</p>
        <div class="space-y-2 text-[var(--text-small)]">
          <div class="bg-[#1a1a2e] rounded p-2">
            <p class="text-gray-400 mb-1"><strong class="text-white">Coreference:</strong></p>
            <p class="font-mono">"The <span class="text-amber-400">cat</span>... 50 tokens... <span class="text-amber-400">it</span> sat"</p>
            <p class="text-gray-500 mt-1">Just need "far back", not exactly how far</p>
          </div>
          <div class="bg-[#1a1a2e] rounded p-2">
            <p class="text-gray-400 mb-1"><strong class="text-white">Topic tracking:</strong></p>
            <p class="text-gray-500">Knowing "this was mentioned earlier" is sufficient</p>
          </div>
        </div>
        <p class="text-[var(--text-small)] text-amber-400 mt-3 font-semibold">
          ≈ Here, 50 vs 51 tokens = same relationship
        </p>
      </div>
    </div>

    <!-- The insight box -->
    <div class="bg-[#1a1a2e] border border-yellow-500/50 rounded p-3">
      <p class="text-[var(--text-body)] text-white font-semibold mb-1">The Insight</p>
      <p class="text-[var(--text-small)] text-gray-300 mb-2">
        <strong class="text-green-400">"1 vs 2 tokens apart"</strong> = likely different syntactic role (adjective vs verb).
        <strong class="text-gray-500">"50 vs 51 tokens apart"</strong> = same semantic relationship (both are "context from earlier").
      </p>
      <p class="text-[var(--text-small)] text-gray-300">
        <strong class="text-yellow-400">So:</strong> Give nearby distances their own unique encoding (distance 1 ≠ distance 2).
        But for far distances, group them together (distances 50-60 can share one encoding) — saves parameters without losing useful information.
      </p>
    </div>
  </section>

  <!-- 3. T5's Solution -->
  <section class="bg-[#16213e] rounded-lg p-4">
    <h3 class="text-[var(--text-h2)] font-semibold text-[#e94560] mb-2">3. T5's Solution: Logarithmic Bucketing</h3>
    <p class="text-[var(--text-body)] text-gray-300 mb-3">
      Instead of unique embeddings for every possible distance, T5 learns only <strong class="text-yellow-400">32 embedding vectors</strong>.
      Relative positions (distances between tokens) are mapped to these 32 embeddings using logarithmic bucketing:
    </p>

    <div class="bg-[#0f3460] rounded p-4 mb-4">
      <div class="space-y-3">
        <!-- Close distances -->
        <div>
          <p class="text-[var(--text-body)] text-green-400 font-semibold mb-2">Close distances (0-15): Exact buckets</p>
          <div class="flex items-center gap-1 text-[var(--text-small)] font-mono overflow-x-auto pb-2">
            <span class="bg-green-900/40 px-3 py-1.5 rounded text-green-300 border border-green-500/30">0</span>
            <span class="bg-green-900/40 px-3 py-1.5 rounded text-green-300 border border-green-500/30">1</span>
            <span class="bg-green-900/40 px-3 py-1.5 rounded text-green-300 border border-green-500/30">2</span>
            <span class="bg-green-900/40 px-3 py-1.5 rounded text-green-300 border border-green-500/30">3</span>
            <span class="text-gray-500">...</span>
            <span class="bg-green-900/40 px-3 py-1.5 rounded text-green-300 border border-green-500/30">14</span>
            <span class="bg-green-900/40 px-3 py-1.5 rounded text-green-300 border border-green-500/30">15</span>
          </div>
          <p class="text-[var(--text-small)] text-gray-500">Each distance gets its own bucket = maximum precision where it matters</p>
        </div>

        <!-- Far distances -->
        <div>
          <p class="text-[var(--text-body)] text-amber-400 font-semibold mb-2">Far distances (16-128): Logarithmic buckets</p>
          <div class="flex items-center gap-1 text-[var(--text-small)] font-mono overflow-x-auto pb-2">
            <span class="bg-amber-900/40 px-2 py-1.5 rounded text-amber-300 border border-amber-500/30">16-18</span>
            <span class="bg-amber-900/40 px-2 py-1.5 rounded text-amber-300 border border-amber-500/30">19-23</span>
            <span class="bg-amber-900/40 px-2 py-1.5 rounded text-amber-300 border border-amber-500/30">24-31</span>
            <span class="bg-amber-900/40 px-2 py-1.5 rounded text-amber-300 border border-amber-500/30">32-47</span>
            <span class="text-gray-500">...</span>
            <span class="bg-amber-900/40 px-2 py-1.5 rounded text-amber-300 border border-amber-500/30">97-128</span>
          </div>
          <p class="text-[var(--text-small)] text-gray-500">Bucket sizes grow exponentially = "roughly how far" is enough</p>
        </div>

        <!-- Beyond 128 -->
        <div>
          <p class="text-[var(--text-body)] text-gray-400 font-semibold mb-2">Beyond 128: Same embedding</p>
          <div class="flex items-center gap-1 text-[var(--text-small)] font-mono">
            <span class="bg-gray-700/40 px-2 py-1.5 rounded text-gray-400 border border-gray-500/30">129, 130, 200, 500, 1000...</span>
            <span class="text-gray-500">→ all use embedding #31 (the same learned scalar)</span>
          </div>
          <p class="text-[var(--text-small)] text-gray-500">Beyond this, we rely on layer composition (explained below)</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 4. How It Works -->
  <section class="bg-[#16213e] rounded-lg p-4">
    <h3 class="text-[var(--text-h2)] font-semibold text-[#e94560] mb-2">4. How It Works: Scalar Bias Addition</h3>
    <p class="text-[var(--text-body)] text-gray-300 mb-3">
      T5 radically simplifies position encoding compared to previous approaches:
    </p>

    <div class="grid md:grid-cols-2 gap-4 mb-4">
      <div class="bg-[#0f3460] rounded p-4">
        <p class="text-[var(--text-body)] text-gray-400 font-semibold mb-2">Previous (Transformer-XL)</p>
        <code class="text-[var(--text-body)] text-gray-300 block mb-2 font-mono">score += Q · R(i-j)ᵀ</code>
        <p class="text-[var(--text-small)] text-gray-500">Dot product with position vectors (expensive)</p>
      </div>
      <div class="bg-[#0f3460] border border-yellow-500/30 rounded p-4">
        <p class="text-[var(--text-body)] text-yellow-400 font-semibold mb-2">T5</p>
        <code class="text-[var(--text-body)] text-yellow-300 block mb-2 font-mono">score += b[bucket(i-j)]</code>
        <p class="text-[var(--text-small)] text-gray-500">Just add a learned scalar (cheap!)</p>
      </div>
    </div>

    <!-- What is b? -->
    <div class="bg-[#1a1a2e] border border-yellow-500/30 rounded p-4 mb-4">
      <p class="text-[var(--text-body)] text-yellow-400 font-semibold mb-2">What is <code class="bg-yellow-900/30 px-1 rounded">b</code>?</p>
      <div class="space-y-2 text-[var(--text-small)] text-gray-300">
        <p><strong class="text-white">A lookup table of 32 learned scalars</strong> — one scalar per bucket, learned during training.</p>
        <div class="bg-[#0f3460] rounded p-3 font-mono text-[var(--text-small)]">
          <span class="text-gray-500">b = [</span>
          <span class="text-yellow-300">-0.12</span><span class="text-gray-500">,</span>
          <span class="text-yellow-300"> 0.08</span><span class="text-gray-500">,</span>
          <span class="text-yellow-300"> 0.15</span><span class="text-gray-500">,</span>
          <span class="text-yellow-300"> 0.22</span><span class="text-gray-500">, ... (32 scalars total)</span>
          <span class="text-gray-500">]</span>
        </div>
        <div class="flex gap-2 mt-2">
          <span class="text-green-400">✓</span>
          <p><strong class="text-white">Each attention head</strong> has its own independent set of 32 biases</p>
        </div>
        <div class="flex gap-2">
          <span class="text-green-400">✓</span>
          <p><strong class="text-white">Shared across all layers</strong> — unlike Shaw et al. which learns per-layer embeddings</p>
        </div>
        <div class="flex gap-2">
          <span class="text-green-400">✓</span>
          <p><strong class="text-white">Not a d-dimensional vector</strong> — just a single number added to the attention logit</p>
        </div>
      </div>
    </div>

    <!-- Example -->
    <div class="bg-[#0f3460] rounded p-4">
      <p class="text-[var(--text-body)] text-white font-semibold mb-3">Example: Query at position 50</p>
      <div class="bg-[#1a1a2e] rounded p-3">
        <div class="space-y-2 text-[var(--text-small)] font-mono">
          <div class="flex items-center gap-3 flex-nowrap">
            <span class="text-gray-500 whitespace-nowrap">attending to 49:</span>
            <span class="text-white whitespace-nowrap">dist = 1</span>
            <span class="text-gray-500">→</span>
            <span class="text-green-400 whitespace-nowrap">embedding #1</span>
            <span class="text-gray-500">(unique)</span>
          </div>
          <div class="flex items-center gap-3 flex-nowrap">
            <span class="text-gray-500 whitespace-nowrap">attending to 45:</span>
            <span class="text-white whitespace-nowrap">dist = 5</span>
            <span class="text-gray-500">→</span>
            <span class="text-green-400 whitespace-nowrap">embedding #5</span>
            <span class="text-gray-500">(unique)</span>
          </div>
          <div class="flex items-center gap-3 flex-nowrap">
            <span class="text-gray-500 whitespace-nowrap">attending to 30:</span>
            <span class="text-white whitespace-nowrap">dist = 20</span>
            <span class="text-gray-500">→</span>
            <span class="text-amber-400 whitespace-nowrap">embedding #17</span>
            <span class="text-gray-500">(shared 19-23)</span>
          </div>
          <div class="flex items-center gap-3 flex-nowrap">
            <span class="text-gray-500 whitespace-nowrap">attending to 0:</span>
            <span class="text-white whitespace-nowrap">dist = 50</span>
            <span class="text-gray-500">→</span>
            <span class="text-amber-400 whitespace-nowrap">embedding #24</span>
            <span class="text-gray-500">(shared 45-63)</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 5. The 128-Token Boundary -->
  <section class="bg-[#16213e] rounded-lg p-4">
    <h3 class="text-[var(--text-h2)] font-semibold text-[#e94560] mb-2">5. The 128-Token Boundary</h3>
    <p class="text-[var(--text-body)] text-gray-300 mb-3">
      A single attention layer can only distinguish positions up to 128 tokens apart.
      But this isn't a limitation — it's a design choice:
    </p>

    <div class="bg-[#1a1a2e] border border-yellow-500/50 rounded p-4 mb-4">
      <p class="text-[var(--text-body)] text-white font-semibold mb-2">From the Paper</p>
      <blockquote class="text-[var(--text-small)] text-gray-400 italic border-l-2 border-yellow-500 pl-3">
        "We use <strong class="text-yellow-400">32 embeddings</strong> for all of our models with ranges that increase in size logarithmically up to an offset of <strong class="text-yellow-400">128</strong> beyond which we assign all relative positions to the same embedding. Note that a given layer is insensitive to relative position beyond 128 tokens, but <strong class="text-yellow-400">subsequent layers can build a sensitivity to larger offsets</strong> by combining local information from previous layers."
        <span class="text-gray-500 block mt-2">— Raffel et al., Section 3.3</span>
      </blockquote>
    </div>
  </section>

  <!-- 6. Layer Composition -->
  <section class="bg-[#16213e] rounded-lg p-4">
    <h3 class="text-[var(--text-h2)] font-semibold text-[#e94560] mb-2">6. How Layers Build Long-Range Sensitivity</h3>
    <p class="text-[var(--text-body)] text-gray-300 mb-3">
      Each layer only "sees" 128 tokens of relative position. But stacking layers creates global reach:
    </p>

    <div class="bg-[#0f3460] rounded p-4 mb-4">
      <div class="space-y-4 text-[var(--text-body)]">
        <div class="flex items-start gap-3">
          <span class="bg-yellow-900/40 px-3 py-1 rounded text-yellow-300 text-[var(--text-small)] font-semibold">Layer 1</span>
          <div>
            <p class="text-gray-300">Token at position 500 learns about positions 372-628</p>
            <p class="text-[var(--text-small)] text-gray-500">Direct attention within ±128 token window</p>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <span class="bg-yellow-900/40 px-3 py-1 rounded text-yellow-300 text-[var(--text-small)] font-semibold">Layer 2</span>
          <div>
            <p class="text-gray-300">Now attends to enriched representations from Layer 1</p>
            <p class="text-[var(--text-small)] text-gray-500">Each neighbor carries info from <em>their</em> 128-token windows</p>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <span class="bg-yellow-900/40 px-3 py-1 rounded text-yellow-300 text-[var(--text-small)] font-semibold">Layer 3+</span>
          <div>
            <p class="text-gray-300">Information propagates further with each layer</p>
            <p class="text-[var(--text-small)] text-gray-500">By layer N, token 500 has indirect access to the entire sequence</p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-[#1a1a2e] border border-green-500/30 rounded p-3">
      <p class="text-[var(--text-body)] text-white font-semibold mb-1">Key Insight</p>
      <p class="text-[var(--text-small)] text-gray-300">
        Each layer doesn't need global reach. By combining <strong class="text-yellow-400">local information from previous layers</strong>,
        the model builds sensitivity to larger offsets through composition. This is more parameter-efficient than explicit long-range position encodings.
      </p>
    </div>
  </section>

  <!-- 7. Summary -->
  <section class="bg-[#16213e] rounded-lg p-4">
    <h3 class="text-[var(--text-h2)] font-semibold text-[#e94560] mb-2">7. Why This Design Works</h3>

    <div class="grid md:grid-cols-2 gap-4">
      <div class="bg-[#0f3460] rounded p-4">
        <p class="text-[var(--text-body)] text-yellow-400 font-semibold mb-3">Benefits</p>
        <div class="space-y-2 text-[var(--text-small)] text-gray-300">
          <p>• <strong class="text-white">Fewer parameters:</strong> 32 scalars per head vs hundreds of vectors</p>
          <p>• <strong class="text-white">Better generalization:</strong> Bucketing prevents overfitting to exact distances</p>
          <p>• <strong class="text-white">Captures locality:</strong> Fine-grained near, coarse-grained far</p>
          <p>• <strong class="text-white">Layer composition:</strong> Long-range via stacking, not explicit biases</p>
        </div>
      </div>

      <div class="bg-[#0f3460] rounded p-4">
        <p class="text-[var(--text-body)] text-gray-400 font-semibold mb-3">Compared to Previous Methods</p>
        <div class="space-y-2 text-[var(--text-small)] text-gray-300">
          <p>• <strong class="text-white">vs Sinusoidal:</strong> Relative, not absolute positions</p>
          <p>• <strong class="text-white">vs Transformer-XL:</strong> Scalars, not vectors (simpler)</p>
          <p>• <strong class="text-white">Key innovation:</strong> Logarithmic bucketing matches linguistic intuition</p>
        </div>
      </div>
    </div>
  </section>

  <!-- What happened next -->
  <section class="bg-gradient-to-br from-cyan-600/30 via-blue-700/20 to-purple-800/20 border-2 border-cyan-400 shadow-lg shadow-cyan-500/20 rounded-lg p-4 mb-4">
    <h3 class="text-[var(--text-h2)] font-semibold text-cyan-300 mb-2">💡 What happened next</h3>

    <p class="text-[var(--text-small)] text-gray-300 mb-4">
      T5's scalar biases were simple and effective, but still required a learned lookup table.
      Researchers wondered...
    </p>

    <div class="space-y-3 text-[var(--text-small)] mb-4">
      <div class="flex gap-2">
        <span class="text-cyan-400">?</span>
        <div>
          <p class="text-gray-300"><strong class="text-white">Can we get relative positions without any lookup table?</strong></p>
          <p class="text-gray-500">What if the math itself encoded relative distance?</p>
        </div>
      </div>
      <div class="flex gap-2">
        <span class="text-cyan-400">?</span>
        <div>
          <p class="text-gray-300"><strong class="text-white">What if position lived in the geometry of vectors?</strong></p>
          <p class="text-gray-500">Rotating Q and K vectors so their dot product naturally encodes distance?</p>
        </div>
      </div>
      <div class="flex gap-2">
        <span class="text-cyan-400">?</span>
        <div>
          <p class="text-gray-300"><strong class="text-white">Could we combine the elegance of sinusoids with relative positioning?</strong></p>
          <p class="text-gray-500">Use continuous functions, but make them encode relative distance in the attention computation?</p>
        </div>
      </div>
    </div>

    <!-- Teaser for RoPE -->
    <div class="bg-[#e94560]/20 border border-[#e94560]/50 rounded p-3">
      <p class="text-[var(--text-small)] text-gray-300">
        <strong class="text-[#e94560]">RoPE (2021)</strong> found an elegant answer:
        <strong class="text-white">rotate Q and K vectors by their position</strong>.
        When you compute Q·K, the rotation angles subtract — giving you relative position for free.
      </p>
      <p class="text-[var(--text-small)] text-gray-500 mt-2">
        → See the <strong class="text-orange-400">RoPE</strong> tab
      </p>
    </div>
  </section>
</div>
