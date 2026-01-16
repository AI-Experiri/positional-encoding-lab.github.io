<!-- ABOUTME: Visualizes Transformer-XL relative position encoding -->
<!-- ABOUTME: Shows sinusoidal R encoding and four-term decomposition -->

<script>
  import { Section, ContentBox } from './layouts';
  import TransformerXL_AttnDiagram from './TransformerXL_AttnDiagram.svelte';
</script>

<div class="space-y-4">
  <!-- Header -->
  <Section>
    <div class="flex items-center gap-4 mb-2">
      <h2 class="text-[var(--text-h1)] font-bold text-[#e94560]">Transformer-XL Positional Encoding</h2>
      <a href="https://arxiv.org/abs/1901.02860" target="_blank" class="text-[var(--text-small)] text-gray-400 hover:text-white">
        Dai et al., 2019 ↗
      </a>
    </div>

    <!-- Core Summary -->
    <div class="bg-[#0f3460] rounded p-3 mb-3">
      <p class="text-[var(--text-body)] text-gray-300">
        <strong class="text-white">Core idea:</strong> Use the <strong class="text-emerald-400">sinusoidal formula</strong>
        on <strong class="text-amber-400">relative distance</strong> instead of absolute position.
        This gives generalizable distance encodings while keeping the smooth properties of sinusoids.
      </p>
    </div>

    <p class="text-[var(--text-small)] text-gray-400">
      Combines benefits of sinusoidal (smooth, generalizable) with relative PE (translation invariant).
    </p>
  </Section>

  <!-- 1. The Problem -->
  <Section>
    <h3 class="text-[var(--text-h2)] font-semibold text-[#e94560] mb-2">1. The Problem</h3>

    <p class="text-[var(--text-body)] text-gray-300 mb-3">
      Shaw et al.'s relative PE uses <strong class="text-white">fully learned</strong> embeddings for each distance.
      This works well for distances seen during training, but has a fundamental limitation:
    </p>

    <div class="grid md:grid-cols-2 gap-3">
      <div class="bg-[#0f3460] rounded p-3">
        <p class="text-[var(--text-small)] text-gray-400 mb-1">Trained with max distance k=16</p>
        <div class="flex gap-1 mb-2">
          {#each Array(17) as _, i (i)}
            <div class="w-4 h-4 rounded text-[8px] flex items-center justify-center {i <= 16 ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}">
              {i}
            </div>
          {/each}
        </div>
        <p class="text-[var(--text-small)] text-green-400">Distances 0-16: ✓ have learned embeddings</p>
      </div>
      <div class="bg-[#0f3460] rounded p-3">
        <p class="text-[var(--text-small)] text-gray-400 mb-1">At inference with longer sequences</p>
        <div class="flex gap-1 mb-2">
          {#each [15, 16, 17, 18, 19] as d (d)}
            <div class="w-6 h-4 rounded text-[8px] flex items-center justify-center {d <= 16 ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}">
              {d}
            </div>
          {/each}
        </div>
        <p class="text-[var(--text-small)] text-red-400">Distances 17+: ✗ no embedding exists</p>
      </div>
    </div>

    <ContentBox variant="dark" class="mt-3 border border-red-500/30">
      <p class="text-[var(--text-small)] text-gray-300">
        <strong class="text-red-400">The limitation:</strong> Learned embeddings are a lookup table —
        if you train with k=16, you have 33 embeddings (distances -16 to +16).
        Distance 17 simply doesn't exist in the table.
      </p>
    </ContentBox>

    <div class="bg-[#1a1a2e] border border-amber-500/30 rounded p-3 mt-3">
      <p class="text-[var(--text-small)] text-gray-300">
        <strong class="text-amber-400">The question:</strong> Can we get relative position encoding
        that generalizes to <em>any</em> distance, not just those seen during training?
      </p>
    </div>
  </Section>

  <!-- 2. The Key Insight -->
  <Section>
    <h3 class="text-[var(--text-h2)] font-semibold text-[#e94560] mb-2">2. The Key Insight</h3>

    <ContentBox variant="dark" class="border border-blue-500/30 mb-4">
      <p class="text-[var(--text-body)] text-white font-semibold mb-2">Use sinusoidal encoding, but on relative distance instead of absolute position.</p>
      <p class="text-[var(--text-small)] text-gray-400">
        The sinusoidal formula can compute an encoding for <em>any</em> input value — it's a continuous function, not a lookup table.
        By feeding it relative distance instead of absolute position, we get smooth, generalizable distance encodings.
      </p>
    </ContentBox>

    <div class="grid md:grid-cols-2 gap-4">
      <ContentBox variant="dark" class="border border-purple-500/30">
        <p class="text-[var(--text-small)] text-purple-400 font-semibold mb-2">Original Sinusoidal (2017)</p>
        <code class="text-[var(--text-small)] text-purple-300 block mb-2">PE(pos) = sin/cos(pos / 10000<sup>2i/d</sup>)</code>
        <p class="text-[var(--text-small)] text-gray-500">Input: <strong class="text-white">absolute position</strong></p>
        <p class="text-[var(--text-small)] text-gray-400 mt-1 italic">"I am at position 5"</p>
      </ContentBox>
      <ContentBox variant="dark" class="border border-green-500/30">
        <p class="text-[var(--text-small)] text-green-400 font-semibold mb-2">Transformer-XL R</p>
        <code class="text-[var(--text-small)] text-green-300 block mb-2">R(dist) = sin/cos(dist / 10000<sup>2i/d</sup>)</code>
        <p class="text-[var(--text-small)] text-gray-500">Input: <strong class="text-white">relative distance (i-j)</strong></p>
        <p class="text-[var(--text-small)] text-gray-400 mt-1 italic">"We are 3 apart"</p>
      </ContentBox>
    </div>

    <p class="text-[var(--text-small)] text-gray-400 mt-3 text-center">
      Same formula, different input. R(17) is computed the same way as R(5) — no lookup table needed.
    </p>
  </Section>

  <!-- 3. How It Works -->
  <Section>
    <h3 class="text-[var(--text-h2)] font-semibold text-[#e94560] mb-2">3. How It Works: The Four-Term Decomposition</h3>

    <p class="text-[var(--text-small)] text-gray-300 mb-3">
      Transformer-XL restructures attention into four terms: two for <strong class="text-white">content</strong> and two for <strong class="text-white">position</strong>.
    </p>

    <!-- Example sentence -->
    <ContentBox variant="dark" class="mb-4">
      <p class="text-[var(--text-small)] text-gray-400 mb-2">Example: Computing attention from <strong class="text-amber-400">"sat"</strong> (position 2) to <strong class="text-cyan-400">"cat"</strong> (position 1)</p>
      <div class="flex items-center justify-center gap-1 text-[var(--text-body)] mb-2">
        <span class="bg-[#0f3460] px-2 py-1 rounded text-gray-400">The</span>
        <span class="bg-cyan-900/50 px-2 py-1 rounded text-cyan-400 border border-cyan-500/50">cat</span>
        <span class="bg-amber-900/50 px-2 py-1 rounded text-amber-400 border border-amber-500/50">sat</span>
        <span class="bg-[#0f3460] px-2 py-1 rounded text-gray-400">on</span>
        <span class="bg-[#0f3460] px-2 py-1 rounded text-gray-400">mat</span>
      </div>
      <p class="text-[var(--text-small)] text-gray-500 text-center">Relative distance: i - j = 2 - 1 = <strong class="text-white">1</strong> (one position apart)</p>
    </ContentBox>

    <p class="text-[var(--text-small)] text-gray-400 mb-3">Standard attention: <code class="text-purple-300">A = Q·Kᵀ</code>. Transformer-XL splits this into four terms:</p>

    <div class="space-y-3">
      <!-- Term A -->
      <div class="bg-[#1a1a2e] rounded p-3 border-l-2 border-green-500">
        <div class="flex items-start gap-3">
          <div class="flex-1">
            <p class="text-[var(--text-small)] text-green-400 font-semibold">Term A: Content → Content</p>
            <code class="text-[var(--text-small)] text-gray-300">Q("sat") · K("cat")ᵀ</code>
          </div>
          <div class="text-right">
            <p class="text-[var(--text-small)] text-gray-500">Example score</p>
            <span class="text-green-400 font-mono">+0.8</span>
          </div>
        </div>
        <p class="text-[var(--text-small)] text-gray-400 mt-2"><strong class="text-white">What:</strong> Standard content-based attention — how semantically related are these tokens?</p>
      </div>

      <!-- Term B -->
      <div class="bg-[#1a1a2e] rounded p-3 border-l-2 border-amber-500">
        <div class="flex items-start gap-3">
          <div class="flex-1">
            <p class="text-[var(--text-small)] text-amber-400 font-semibold">Term B: Content → Position</p>
            <code class="text-[var(--text-small)] text-gray-300">Q("sat") · (W<sub>k,R</sub> · R(1))ᵀ</code>
          </div>
          <div class="text-right">
            <p class="text-[var(--text-small)] text-gray-500">Example score</p>
            <span class="text-amber-400 font-mono">+0.3</span>
          </div>
        </div>
        <p class="text-[var(--text-small)] text-gray-400 mt-2"><strong class="text-white">What:</strong> Content-dependent distance preference — verbs might prefer attending to nearby tokens.</p>
        <p class="text-[var(--text-small)] text-gray-500 mt-1">W<sub>k,R</sub> is a learned matrix that projects R into the attention space.</p>
      </div>

      <!-- Term C -->
      <div class="bg-[#1a1a2e] rounded p-3 border-l-2 border-cyan-500">
        <div class="flex items-start gap-3">
          <div class="flex-1">
            <p class="text-[var(--text-small)] text-cyan-400 font-semibold">Term C: Global Content Bias</p>
            <code class="text-[var(--text-small)] text-gray-300">u · K("cat")ᵀ</code>
          </div>
          <div class="text-right">
            <p class="text-[var(--text-small)] text-gray-500">Example score</p>
            <span class="text-cyan-400 font-mono">+0.1</span>
          </div>
        </div>
        <p class="text-[var(--text-small)] text-gray-400 mt-2"><strong class="text-white">What:</strong> Global bias toward certain content types — "always pay attention to nouns".</p>
        <p class="text-[var(--text-small)] text-gray-500 mt-1">u is a learned vector, same for all queries.</p>
      </div>

      <!-- Term D -->
      <div class="bg-[#1a1a2e] rounded p-3 border-l-2 border-pink-500">
        <div class="flex items-start gap-3">
          <div class="flex-1">
            <p class="text-[var(--text-small)] text-pink-400 font-semibold">Term D: Global Position Bias</p>
            <code class="text-[var(--text-small)] text-gray-300">v · (W<sub>k,R</sub> · R(1))ᵀ</code>
          </div>
          <div class="text-right">
            <p class="text-[var(--text-small)] text-gray-500">Example score</p>
            <span class="text-pink-400 font-mono">+0.2</span>
          </div>
        </div>
        <p class="text-[var(--text-small)] text-gray-400 mt-2"><strong class="text-white">What:</strong> Global distance preference — "nearby tokens are generally more relevant".</p>
        <p class="text-[var(--text-small)] text-gray-500 mt-1">v is a learned vector, same for all queries.</p>
      </div>

      <!-- Total -->
      <ContentBox class="border border-white/20">
        <div class="flex items-center justify-between">
          <p class="text-[var(--text-small)] text-white font-semibold">Total Attention Score: A + B + C + D</p>
          <span class="text-white font-mono">0.8 + 0.3 + 0.1 + 0.2 = <strong class="text-green-400">1.4</strong></span>
        </div>
        <p class="text-[var(--text-small)] text-gray-500 mt-1">High score → "sat" will strongly attend to "cat" after softmax</p>
      </ContentBox>
    </div>
  </Section>

  <!-- 4. Why This Design -->
  <Section>
    <h3 class="text-[var(--text-h2)] font-semibold text-[#e94560] mb-2">4. Why This Design</h3>

    <div class="space-y-2 text-[var(--text-small)] text-gray-300">
      <div class="flex gap-2">
        <span class="text-green-400 font-bold">1.</span>
        <p><strong class="text-white">Generalizes to any distance:</strong> R uses a formula (not learned lookup), so it can compute encodings for any distance. W<sub>k,R</sub> learns to interpret sinusoidal patterns, which transfer to unseen distances.</p>
      </div>
      <div class="flex gap-2">
        <span class="text-green-400 font-bold">2.</span>
        <p><strong class="text-white">Translation invariance:</strong> "The cat sat" has the same internal structure whether it starts at position 0 or position 500.</p>
      </div>
      <div class="flex gap-2">
        <span class="text-green-400 font-bold">3.</span>
        <p><strong class="text-white">Learnable with fixed base:</strong> R is static (sinusoidal), but W<sub>k,R</sub>, u, and v are learned — the model decides how to use distance information.</p>
      </div>
    </div>

    <ContentBox variant="dark" class="border border-green-500/30 mt-3">
      <p class="text-[var(--text-body)] text-white font-semibold mb-2">Distance Clipping</p>
      <p class="text-[var(--text-small)] text-gray-300 mb-2">
        Relative distance is clipped: <code class="text-green-300">r = clip(i-j, -K, K)</code> where K is typically ~128.
      </p>
      <p class="text-[var(--text-small)] text-gray-500">
        Beyond K tokens apart, exact distance doesn't matter much — this keeps the effective vocabulary of distances bounded.
      </p>
    </ContentBox>
  </Section>

  <!-- 5. Generalization: Evolution of Position Encoding -->
  <Section>
    <h3 class="text-[var(--text-h2)] font-semibold text-[#e94560] mb-2">5. Generalization: How Dimensions Enable Flexibility</h3>

    <p class="text-[var(--text-small)] text-gray-400 mb-4">
      The key innovation is separating <strong class="text-emerald-400">formula-computed R</strong> (flexible rows) from
      <strong class="text-amber-400">learned W<sub>k,R</sub></strong> (fixed dimensions). This enables generalization to unseen distances.
    </p>

    <!-- Legend -->
    <div class="flex gap-4 mb-3 text-[10px]">
      <div class="flex items-center gap-1">
        <div class="w-3 h-3 rounded border-2 border-red-500 bg-red-900/50"></div>
        <span class="text-gray-400">learned</span>
      </div>
      <div class="flex items-center gap-1">
        <div class="w-3 h-3 rounded border-2 border-purple-500 bg-purple-900/50"></div>
        <span class="text-gray-400">formula</span>
      </div>
    </div>

    <!-- Three approaches in a row -->
    <div class="grid md:grid-cols-3 gap-3 mb-4">
      <!-- Sinusoidal (Vaswani) -->
      <div class="flex flex-col">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-3 h-3 rounded-full bg-purple-500"></div>
          <p class="text-[var(--text-small)] font-semibold text-purple-400">Sinusoidal (2017)</p>
        </div>
        <div class="bg-[#1a1a2e] rounded p-3 border border-purple-500/30 flex-1 flex flex-col">
          <p class="text-[10px] text-gray-400 mb-2">Absolute position, added to input</p>
          <div class="flex items-center gap-2 justify-center mb-3 flex-1">
            <div class="text-center">
              <div class="bg-purple-900/50 border border-purple-500 rounded p-2 mb-1">
                <p class="text-[var(--text-small)] text-purple-300 font-mono">PE</p>
                <p class="text-[10px] text-gray-400">L × d<sub>model</sub></p>
                <p class="text-[10px] text-purple-400">8 × 512</p>
              </div>
              <p class="text-[10px] text-gray-500">formula</p>
            </div>
            <span class="text-gray-500">→</span>
            <div class="text-center">
              <p class="text-[10px] text-gray-300">X + PE</p>
            </div>
          </div>
          <div class="mt-auto">
            <div class="bg-green-900/20 border border-green-500/30 rounded p-2 mb-2">
              <p class="text-[10px] text-green-300">Distance 100? <span class="text-green-400">✓ Works</span></p>
              <p class="text-[10px] text-gray-500">Formula computes any position</p>
            </div>
            <div class="flex flex-wrap gap-1 text-[10px]">
              <span class="text-green-400">✓ Generalizes</span>
              <span class="text-red-400">✗ Absolute</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Shaw et al. -->
      <div class="flex flex-col">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-3 h-3 rounded-full bg-blue-500"></div>
          <p class="text-[var(--text-small)] font-semibold text-blue-400">Shaw et al. (2018)</p>
        </div>
        <div class="bg-[#1a1a2e] rounded p-3 border border-blue-500/30 flex-1 flex flex-col">
          <p class="text-[10px] text-gray-400 mb-2">Relative distance, learned lookup</p>
          <div class="flex items-center gap-2 justify-center mb-3 flex-1">
            <div class="text-center">
              <div class="bg-blue-900/50 border border-blue-500 rounded p-2 mb-1">
                <p class="text-[var(--text-small)] text-blue-300 font-mono">a<sup>K</sup></p>
                <p class="text-[10px] text-gray-400">(2k+1) × d<sub>head</sub></p>
                <p class="text-[10px] text-blue-400">15 × 64</p>
              </div>
              <p class="text-[10px] text-red-400">learned</p>
            </div>
            <span class="text-gray-500">→</span>
            <div class="text-center">
              <p class="text-[10px] text-gray-300">Q · a<sup>K</sup></p>
            </div>
          </div>
          <div class="mt-auto">
            <div class="bg-red-900/20 border border-red-500/30 rounded p-2 mb-2">
              <p class="text-[10px] text-red-300">Distance 100? <span class="text-red-400">✗ Fails</span></p>
              <p class="text-[10px] text-gray-500">No row exists in lookup table</p>
            </div>
            <div class="flex flex-wrap gap-1 text-[10px]">
              <span class="text-green-400">✓ Relative</span>
              <span class="text-red-400">✗ Fixed size</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Transformer-XL -->
      <div class="flex flex-col">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
          <p class="text-[var(--text-small)] font-semibold text-emerald-400">Transformer-XL (2019)</p>
        </div>
        <div class="bg-[#1a1a2e] rounded p-3 border border-emerald-500/30 flex-1 flex flex-col">
          <p class="text-[10px] text-gray-400 mb-2">Relative distance, formula + learned projection</p>
          <div class="flex items-center gap-2 justify-center mb-3 flex-1">
            <div class="text-center">
              <div class="bg-emerald-900/50 border border-emerald-500 rounded p-2 mb-1">
                <p class="text-[var(--text-small)] text-emerald-300 font-mono">R</p>
                <p class="text-[10px] text-gray-400">? × d<sub>model</sub></p>
                <p class="text-[10px] text-emerald-400">? × 512</p>
              </div>
              <p class="text-[10px] text-emerald-400">formula</p>
            </div>
            <span class="text-gray-500">@</span>
            <div class="text-center">
              <div class="bg-amber-900/50 border border-amber-500 rounded p-2 mb-1">
                <p class="text-[var(--text-small)] text-amber-300 font-mono">W<sub>k,R</sub></p>
                <p class="text-[10px] text-gray-400">d<sub>model</sub> × d<sub>head</sub></p>
                <p class="text-[10px] text-amber-400">512 × 64</p>
              </div>
              <p class="text-[10px] text-red-400">learned</p>
            </div>
          </div>
          <div class="mt-auto">
            <div class="bg-green-900/20 border border-green-500/30 rounded p-2 mb-2">
              <p class="text-[10px] text-green-300">Distance 100? <span class="text-green-400">✓ Works</span></p>
              <p class="text-[10px] text-gray-500">R computes new row, W<sub>k,R</sub> unchanged</p>
            </div>
            <div class="flex flex-wrap gap-1 text-[10px]">
              <span class="text-green-400">✓ Relative</span>
              <span class="text-green-400">✓ Generalizes</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dimension comparison: Training vs Inference -->
    <ContentBox variant="dark" class="border border-emerald-500/30 mb-4">
      <p class="text-[var(--text-body)] text-white font-semibold mb-4">Transformer-XL: Why W<sub>k,R</sub> Generalizes</p>
      <div class="grid md:grid-cols-2 gap-4">
        <!-- Training -->
        <div class="bg-[#0f3460] rounded p-4">
          <p class="text-[var(--text-small)] text-amber-400 font-semibold mb-3">TRAINING (L=8, distances -7 to +7)</p>
          <div class="flex items-center gap-3 justify-center flex-wrap">
            <div class="text-center">
              <div class="bg-emerald-900/50 border-2 border-emerald-500 rounded p-3 min-w-[80px]">
                <p class="text-[var(--text-body)] text-emerald-300 font-mono font-bold">R</p>
                <p class="text-[var(--text-small)] text-emerald-400 font-bold">15 × 512</p>
              </div>
              <p class="text-[10px] text-emerald-400 mt-1">formula</p>
            </div>
            <span class="text-white text-[var(--text-h1)] font-bold">@</span>
            <div class="text-center">
              <div class="bg-amber-900/50 border-2 border-amber-500 rounded p-3 min-w-[80px]">
                <p class="text-[var(--text-body)] text-amber-300 font-mono font-bold">W<sub>k,R</sub></p>
                <p class="text-[var(--text-small)] text-gray-300">512 × 64</p>
              </div>
              <p class="text-[10px] text-amber-400 mt-1">learned</p>
            </div>
            <span class="text-white text-[var(--text-h1)] font-bold">=</span>
            <div class="text-center">
              <div class="bg-gray-700 border-2 border-gray-500 rounded p-3 min-w-[80px]">
                <p class="text-[var(--text-body)] text-gray-300 font-mono font-bold">Rel<sub>K</sub></p>
                <p class="text-[var(--text-small)] text-gray-300">15 × 64</p>
              </div>
              <p class="text-[10px] text-gray-400 mt-1">output</p>
            </div>
          </div>
        </div>

        <!-- Inference -->
        <div class="bg-[#0f3460] rounded p-4">
          <p class="text-[var(--text-small)] text-cyan-400 font-semibold mb-3">INFERENCE (L=128, distances -127 to +127)</p>
          <div class="flex items-center gap-3 justify-center flex-wrap">
            <div class="text-center">
              <div class="bg-emerald-900/50 border-2 border-emerald-500 rounded p-3 min-w-[80px] relative">
                <p class="text-[var(--text-body)] text-emerald-300 font-mono font-bold">R</p>
                <p class="text-[var(--text-small)] text-cyan-400 font-bold">255 × 512</p>
                <div class="absolute -top-2 -right-2 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center">
                  <span class="text-[10px] text-white font-bold">↑</span>
                </div>
              </div>
              <p class="text-[10px] text-emerald-400 mt-1">formula</p>
            </div>
            <span class="text-white text-[var(--text-h1)] font-bold">@</span>
            <div class="text-center">
              <div class="bg-amber-900/50 border-2 border-amber-500 rounded p-3 min-w-[80px] relative">
                <p class="text-[var(--text-body)] text-amber-300 font-mono font-bold">W<sub>k,R</sub></p>
                <p class="text-[var(--text-small)] text-gray-300">512 × 64</p>
                <div class="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <span class="text-[10px] text-white font-bold">✓</span>
                </div>
              </div>
              <p class="text-[10px] text-green-400 mt-1">same!</p>
            </div>
            <span class="text-white text-[var(--text-h1)] font-bold">=</span>
            <div class="text-center">
              <div class="bg-gray-700 border-2 border-gray-500 rounded p-3 min-w-[80px] relative">
                <p class="text-[var(--text-body)] text-gray-300 font-mono font-bold">Rel<sub>K</sub></p>
                <p class="text-[var(--text-small)] text-cyan-400 font-bold">255 × 64</p>
                <div class="absolute -top-2 -right-2 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center">
                  <span class="text-[10px] text-white font-bold">↑</span>
                </div>
              </div>
              <p class="text-[10px] text-gray-400 mt-1">more rows</p>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-4 text-[var(--text-small)] text-gray-300 space-y-1">
        <p>• <strong class="text-emerald-400">R rows expand</strong> (15 → 255) — formula computes new distances on demand</p>
        <p>• <strong class="text-amber-400">W<sub>k,R</sub> unchanged</strong> (512 × 64) — learned to interpret sinusoidal patterns</p>
        <p>• Matrix multiply: <span class="font-mono">(N × 512) @ (512 × 64) = (N × 64)</span> — works for any N</p>
      </div>
    </ContentBox>
  </Section>

  <!-- Architecture Note: Segment Recurrence -->
  <Section>
    <ContentBox variant="dark" class="border border-amber-500/30">
      <p class="text-[var(--text-small)] text-amber-400 font-semibold mb-2">Architecture Note: Segment Recurrence</p>
      <p class="text-[var(--text-small)] text-gray-300 mb-2">
        Transformer-XL also introduces segment recurrence — caching hidden states from previous chunks to extend context beyond the window size.
      </p>
      <div class="bg-[#0f3460] rounded p-2 mb-2">
        <div class="space-y-1 text-[var(--text-small)] font-mono">
          <div class="flex items-center gap-2">
            <span class="text-amber-400 whitespace-nowrap">Segment 1:</span>
            <span class="text-gray-300">[1-512]</span>
            <span class="text-gray-500">→</span>
            <span class="text-green-400">cache h₁</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-amber-400 whitespace-nowrap">Segment 2:</span>
            <span class="text-gray-300">[513-1024]</span>
            <span class="text-gray-500">→ attend to [h₁ ; current] →</span>
            <span class="text-green-400">cache h₂</span>
          </div>
        </div>
      </div>
      <p class="text-[var(--text-small)] text-gray-400 mb-2">
        This architecture <strong class="text-white">requires</strong> relative PE because both segments reuse positions [1, 2, ..., 512].
        With absolute PE, position 100 in both segments would be indistinguishable.
      </p>
      <p class="text-[var(--text-small)] text-gray-500 italic">
        Note: Most modern LLMs (GPT, Claude, LLaMA) don't use segment recurrence — they use longer context windows instead.
      </p>
    </ContentBox>
  </Section>

  <!-- 6. Attention Diagram -->
  <Section>
    <h3 class="text-[var(--text-h2)] font-semibold text-[#e94560] mb-2">6. Attention Flow Diagram</h3>
    <p class="text-[var(--text-small)] text-gray-300 mb-3">
      The diagram below shows the four-term decomposition (A, B, C, D) and how they combine to compute attention scores:
    </p>
    <div class="flex flex-wrap gap-3 mb-4 text-[var(--text-small)]">
      <div class="flex items-center gap-1">
        <div class="w-3 h-3 rounded bg-green-500"></div>
        <span class="text-green-400">Term A:</span>
        <span class="text-gray-400">Content → Content</span>
      </div>
      <div class="flex items-center gap-1">
        <div class="w-3 h-3 rounded bg-amber-500"></div>
        <span class="text-amber-400">Term B:</span>
        <span class="text-gray-400">Content → Position</span>
      </div>
      <div class="flex items-center gap-1">
        <div class="w-3 h-3 rounded bg-cyan-500"></div>
        <span class="text-cyan-400">Term C:</span>
        <span class="text-gray-400">Global Content Bias</span>
      </div>
      <div class="flex items-center gap-1">
        <div class="w-3 h-3 rounded bg-pink-500"></div>
        <span class="text-pink-400">Term D:</span>
        <span class="text-gray-400">Global Position Bias</span>
      </div>
    </div>
    <TransformerXL_AttnDiagram />
  </Section>

  <!-- What happened next -->
  <section class="bg-gradient-to-br from-cyan-600/30 via-blue-700/20 to-purple-800/20 border-2 border-cyan-400 shadow-lg shadow-cyan-500/20 rounded-lg p-4 mb-4">
    <h3 class="text-[var(--text-h2)] font-semibold text-cyan-300 mb-2">💡 What happened next</h3>

    <p class="text-[var(--text-small)] text-gray-300 mb-4">
      Transformer-XL solved the generalization problem with sinusoidal R, but the four-term decomposition adds complexity.
      Researchers started asking...
    </p>

    <div class="space-y-3 text-[var(--text-small)] mb-4">
      <div class="flex gap-2">
        <span class="text-cyan-400">?</span>
        <div>
          <p class="text-gray-300"><strong class="text-white">Is the four-term split necessary?</strong></p>
          <p class="text-gray-500">Could we get relative position benefits with a simpler formula?</p>
        </div>
      </div>
      <div class="flex gap-2">
        <span class="text-cyan-400">?</span>
        <div>
          <p class="text-gray-300"><strong class="text-white">Does precise distance always matter?</strong></p>
          <p class="text-gray-500">Maybe "3 tokens apart" and "4 tokens apart" can share the same bias?</p>
        </div>
      </div>
      <div class="flex gap-2">
        <span class="text-cyan-400">?</span>
        <div>
          <p class="text-gray-300"><strong class="text-white">Can we just add a bias instead of projecting R?</strong></p>
          <p class="text-gray-500">Skip W<sub>k,R</sub> entirely and learn scalar biases per distance bucket?</p>
        </div>
      </div>
    </div>

    <!-- Teaser for T5 -->
    <div class="bg-[#e94560]/20 border border-[#e94560]/50 rounded p-3">
      <p class="text-[var(--text-small)] text-gray-300">
        <strong class="text-[#e94560]">T5 (2020)</strong> took a radical simplification:
        just learn a <strong class="text-white">scalar bias per distance bucket</strong>, shared across heads.
        No sinusoids, no four terms — just b(i-j) added to attention scores.
      </p>
      <p class="text-[var(--text-small)] text-gray-500 mt-2">
        → See the <strong class="text-yellow-400">T5</strong> tab
      </p>
    </div>
  </section>
</div>
