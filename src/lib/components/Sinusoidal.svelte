<script>
  // ABOUTME: Scrolling visualizer for sinusoidal positional encoding
  // ABOUTME: Clean sections explaining WHY we use sinusoids

  import { generatePositionalEncodingMatrix } from '../utils/positionalEncoding.js';
  import { Section } from './layouts';
  import Sinusoidal_AttnDiagram from './Sinusoidal_AttnDiagram.svelte';

  let maxPosition = $state(128);
  let dModel = $state(256);
  let clockPosition = $state(0);

  let matrix = $derived(generatePositionalEncodingMatrix(maxPosition, dModel));

  let heatmapCanvas = $state(null);

  $effect(() => {
    if (!heatmapCanvas || !matrix) return;
    const ctx = heatmapCanvas.getContext('2d');
    const imageData = ctx.createImageData(dModel, maxPosition);
    const data = imageData.data;

    for (let pos = 0; pos < maxPosition; pos++) {
      for (let dim = 0; dim < dModel; dim++) {
        const value = matrix[pos][dim];
        const idx = (pos * dModel + dim) * 4;
        const rgb = valueToRGB(value);
        data[idx] = rgb.r;
        data[idx + 1] = rgb.g;
        data[idx + 2] = rgb.b;
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  });

  function valueToRGB(value) {
    const normalized = (value + 1) / 2;
    if (normalized < 0.5) {
      const intensity = normalized * 2;
      return { r: Math.round(intensity * 255), g: Math.round(intensity * 255), b: 255 };
    } else {
      const intensity = (normalized - 0.5) * 2;
      return { r: 255, g: Math.round((1 - intensity) * 255), b: Math.round((1 - intensity) * 255) };
    }
  }

  function toBinary(n, bits) {
    return n.toString(2).padStart(bits, '0').split('').map(Number);
  }

  function getClockAngle(pos, dimPair) {
    // Map dimPair (0-383) to visual range (0-2) for perceptible differences
    // At pos=100: fastest ≈ 5 rotations, slowest ≈ 100° rotation
    const visualIndex = (dimPair / 383) * 2;
    const freq = 1 / Math.pow(4, visualIndex);
    return pos * freq * 0.3;
  }

</script>

<div class="space-y-4">
  <!-- Header -->
  <Section>
    <div class="flex items-center gap-4 mb-2">
      <h2 class="text-[var(--text-h1)] font-bold text-[#e94560]">Sinusoidal Positional Encoding</h2>
      <a href="https://arxiv.org/abs/1706.03762" target="_blank" rel="noopener noreferrer" class="text-[var(--text-small)] text-gray-400 hover:text-white">
        Vaswani et al., 2017 ↗
      </a>
    </div>

    <!-- Core Summary -->
    <div class="bg-[#0f3460] rounded p-3 mb-3">
      <p class="text-[var(--text-body)] text-gray-300">
        <strong class="text-white">Core idea:</strong> Encode each position using <strong class="text-emerald-400">multiple frequencies</strong>
        so every position gets a <strong class="text-amber-400">unique vector</strong>.
        The sin/cos structure enables learning <strong class="text-cyan-400">relative position</strong>: for each (sin, cos) pair,
        shifting by k positions is a fixed 2×2 rotation.
      </p>
    </div>

    <p class="text-[var(--text-small)] text-gray-400">
      Fixed vectors added to token embeddings. Defined for any length; extrapolation often works better than learned embeddings, but is not guaranteed.
    </p>
  </Section>

  <!-- 1. The Problem -->
  <Section>
    <h3 class="text-[var(--text-h2)] font-semibold text-[#e94560] mb-2">1. The Problem</h3>
    <p class="text-[var(--text-body)] text-gray-300 mb-3">
      Transformers process all tokens in parallel — they have no inherent sense of order.
      Without position info, self-attention is <strong class="text-amber-400">permutation-equivariant</strong>:
    </p>
    <div class="grid md:grid-cols-2 gap-3">
      <div class="bg-[#0f3460] rounded p-3">
        <p class="text-[var(--text-small)] text-gray-400 mb-1">Original</p>
        <p class="text-[var(--text-body)] text-emerald-400 font-mono">"The cat sat on the mat"</p>
      </div>
      <div class="bg-[#0f3460] rounded p-3">
        <p class="text-[var(--text-small)] text-gray-400 mb-1">Scrambled</p>
        <p class="text-[var(--text-body)] text-red-400 font-mono">"mat the on sat cat The"</p>
      </div>
    </div>
    <p class="text-[var(--text-small)] text-gray-500 mt-2">
      The model can't <em>prefer</em> one ordering over another — if you permute the input, the outputs permute the same way.
    </p>
  </Section>

  <!-- 2. The Insight: Binary Counting -->
  <Section>
    <div class="flex items-center gap-3 mb-2">
      <h3 class="text-[var(--text-h2)] font-semibold text-[#e94560]">2. The Insight: Binary Counting</h3>
      <a href="https://kazemnejad.com/blog/transformer_architecture_positional_encoding/" target="_blank" rel="noopener noreferrer" class="text-[var(--text-small)] text-gray-400 hover:text-white">
        Kazemnejad ↗
      </a>
    </div>
    <p class="text-[var(--text-body)] text-gray-300 mb-3">
      Binary numbers uniquely encode each position. Each bit alternates at a different rate:
    </p>

    <div class="grid md:grid-cols-[auto_1fr] gap-4">
      <!-- Binary Table -->
      <div class="bg-[#0f3460] rounded p-2 overflow-x-auto">
        <p class="text-[var(--text-small)] text-gray-400 mb-1 text-center">Binary: Discrete (0/1)</p>
        <table class="text-center font-mono text-[var(--text-small)] mx-auto" style="border-spacing: 2px;">
          <thead>
            <tr class="text-gray-500 text-[9px]">
              <th></th>
              <th class="px-1">slow</th>
              <th class="px-1"></th>
              <th class="px-1"></th>
              <th class="px-1">fast</th>
            </tr>
            <tr class="text-gray-400 text-[var(--text-tiny)]">
              <th class="px-1">Pos</th>
              <th class="px-1">B3</th>
              <th class="px-1">B2</th>
              <th class="px-1">B1</th>
              <th class="px-1">B0</th>
            </tr>
          </thead>
          <tbody>
            {#each Array(16) as _, pos (pos)}
              {@const bits = toBinary(pos, 4)}
              <tr>
                <td class="px-1 text-gray-400">{pos}</td>
                {#each bits as bit, i (i)}
                  <td class="p-0">
                    <span
                      class="inline-block w-4 h-4 leading-4 rounded-sm text-[var(--text-tiny)]"
                      style="background: {bit === 1 ? '#e94560' : '#1a1a2e'}; color: {bit === 1 ? 'white' : '#555'}"
                    >{bit}</span>
                  </td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <!-- Waves -->
      <div class="bg-[#0f3460] rounded p-4">
        <p class="text-[var(--text-small)] text-gray-400 mb-2 text-center">Sinusoids: Continuous (smooth)</p>
        <svg viewBox="0 0 340 175" class="w-full" preserveAspectRatio="xMidYMid meet">
          <!-- Grid lines -->
          {#each [0, 1, 2, 3] as i (i)}
            <line x1="35" y1={20 + i * 40} x2="300" y2={20 + i * 40} stroke="#333" stroke-width="0.5" stroke-dasharray="2"/>
          {/each}

          <!-- Dim labels -->
          <text x="5" y="24" font-size="8" fill="#888">dim 0</text>
          <text x="5" y="64" font-size="8" fill="#888">dim 2</text>
          <text x="5" y="104" font-size="8" fill="#888">dim 4</text>
          <text x="5" y="144" font-size="8" fill="#888">dim 6</text>

          <text x="335" y="24" font-size="7" fill="#666" text-anchor="end">fast</text>
          <text x="335" y="144" font-size="7" fill="#666" text-anchor="end">slow</text>

          <!-- Waves at different frequencies -->
          {#each [0, 1, 2, 3] as dimIdx (dimIdx)}
            {@const freq = Math.pow(2, 3 - dimIdx)}
            {@const baseY = 20 + dimIdx * 40}
            <path
              d="M 35 {baseY} {Array.from({length: 276}, (_, x) => {
                const pos = x / 17.25;
                const val = Math.sin(pos * freq * 0.5);
                return `L ${35 + x} ${baseY - val * 12}`;
              }).join(' ')}"
              fill="none"
              stroke="#e94560"
              stroke-width="1.5"
            />
          {/each}

          <!-- Position markers -->
          {#each Array(16) as _, pos (pos)}
            <line x1={35 + pos * 17.5} y1="155" x2={35 + pos * 17.5} y2="5" stroke="#444" stroke-width="0.5" stroke-dasharray="1"/>
            <text x={35 + pos * 17.5} y="162" font-size="7" fill="#888" text-anchor="middle">{pos}</text>
          {/each}
        </svg>
        <p class="text-[var(--text-small)] text-gray-500 text-center mt-1">Each position → unique combination of wave values</p>
      </div>
    </div>

    <p class="text-[var(--text-small)] text-gray-400 mt-3 text-center">
      Same idea: different frequencies create unique patterns. Sinusoids are just the continuous version of binary bits.
    </p>
  </Section>

  <!-- 3. The Insight: Clock Hands -->
  <Section>
    <div class="flex items-center gap-3 mb-2">
      <h3 class="text-[var(--text-h2)] font-semibold text-[#e94560]">3. The Insight: Clock Hands</h3>
      <a href="https://kazemnejad.com/blog/transformer_architecture_positional_encoding/#discussion" target="_blank" rel="noopener noreferrer" class="text-[var(--text-small)] text-gray-400 hover:text-white">
        Kazemnejad discussion ↗
      </a>
    </div>
    <p class="text-[var(--text-body)] text-gray-300 mb-3">
      <strong class="text-white">Let's assume 768 dimensions = 384 (sin, cos) pairs = 384 clock hands.</strong>
      Each hand points to an angle on the unit circle, rotating at a different speed:
    </p>

    <!-- Why multiple clocks -->
    <div class="grid md:grid-cols-2 gap-3 mb-3 text-[var(--text-small)]">
      <div class="bg-[#0f3460] rounded p-3">
        <strong class="text-emerald-400">Fast hands (d0,1 ... d100,101):</strong>
        <p class="text-gray-400 mt-1">Spin quickly → distinguish nearby positions (word 5 vs word 6)</p>
      </div>
      <div class="bg-[#0f3460] rounded p-3">
        <strong class="text-amber-400">Slow hands (d666,667 ... d766,767):</strong>
        <p class="text-gray-400 mt-1">Spin slowly → distinguish distant positions (word 5 vs word 500)</p>
      </div>
    </div>

    <!-- Position clocks -->
    <div class="bg-[#0f3460] rounded p-4 mb-4">
      <p class="text-[var(--text-body)] text-white text-center mb-3">Each position encoded as 384 clock hands</p>
      <div class="flex items-center justify-center gap-2 mb-3">
        <span class="text-gray-400 text-[var(--text-small)]">Position:</span>
        <input type="range" bind:value={clockPosition} min="0" max="100" class="w-32 accent-[#e94560]" />
        <span class="text-white font-mono text-[var(--text-body)] w-6">{clockPosition}</span>
      </div>

      <div class="flex justify-center items-center gap-1 flex-wrap">
        <!-- First 5 clocks (fast) -->
        {#each [0, 1, 2, 3, 4] as dimPair (dimPair)}
          {@const angle = getClockAngle(clockPosition, dimPair)}
          {@const handX = 30 + Math.sin(angle) * 20}
          {@const handY = 30 - Math.cos(angle) * 20}
          <div class="text-center">
            <svg viewBox="0 0 60 60" class="w-16 h-16">
              <line x1="6" y1="30" x2="54" y2="30" stroke="#2a2a4a" stroke-width="1"/>
              <line x1="30" y1="6" x2="30" y2="54" stroke="#2a2a4a" stroke-width="1"/>
              <circle cx="30" cy="30" r="26" fill="none" stroke="#333" stroke-width="1.5"/>
              <line x1={handX} y1={handY} x2={handX} y2="30" stroke="#3b82f6" stroke-width="1" stroke-dasharray="2"/>
              <line x1={handX} y1={handY} x2="30" y2={handY} stroke="#f59e0b" stroke-width="1" stroke-dasharray="2"/>
              <circle cx="30" cy="30" r="2" fill="#10b981"/>
              <line x1="30" y1="30" x2={handX} y2={handY} stroke="#10b981" stroke-width="2" stroke-linecap="round"/>
              <circle cx={handX} cy={handY} r="2" fill="#10b981"/>
            </svg>
            <p class="text-[var(--text-small)] text-emerald-400">d{dimPair * 2},{dimPair * 2 + 1}</p>
          </div>
        {/each}

        <!-- Ellipsis -->
        <div class="text-center px-2">
          <svg viewBox="0 0 60 60" class="w-16 h-16">
            <circle cx="30" cy="30" r="26" fill="none" stroke="#333" stroke-width="1.5"/>
            <text x="30" y="35" text-anchor="middle" fill="#666" font-size="14">...</text>
          </svg>
          <p class="text-[var(--text-small)] text-gray-500">374 more</p>
        </div>

        <!-- Spread out slow clocks to show gradual slowdown -->
        {#each [100, 180, 260, 340, 383] as dimPair (dimPair)}
          {@const angle = getClockAngle(clockPosition, dimPair)}
          {@const handX = 30 + Math.sin(angle) * 20}
          {@const handY = 30 - Math.cos(angle) * 20}
          <div class="text-center">
            <svg viewBox="0 0 60 60" class="w-16 h-16">
              <line x1="6" y1="30" x2="54" y2="30" stroke="#2a2a4a" stroke-width="1"/>
              <line x1="30" y1="6" x2="30" y2="54" stroke="#2a2a4a" stroke-width="1"/>
              <circle cx="30" cy="30" r="26" fill="none" stroke="#333" stroke-width="1.5"/>
              <line x1={handX} y1={handY} x2={handX} y2="30" stroke="#3b82f6" stroke-width="1" stroke-dasharray="2"/>
              <line x1={handX} y1={handY} x2="30" y2={handY} stroke="#f59e0b" stroke-width="1" stroke-dasharray="2"/>
              <circle cx="30" cy="30" r="2" fill="#f59e0b"/>
              <line x1="30" y1="30" x2={handX} y2={handY} stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
              <circle cx={handX} cy={handY} r="2" fill="#f59e0b"/>
            </svg>
            <p class="text-[var(--text-small)] text-amber-400">d{dimPair * 2},{dimPair * 2 + 1}</p>
          </div>
        {/each}
      </div>
      <div class="flex justify-center gap-3 mt-2 text-[var(--text-small)]">
        <span class="text-blue-400">― sin</span>
        <span class="text-amber-400">― cos</span>
        <span class="text-gray-500">|</span>
        <span class="text-emerald-400">fast</span>
        <span class="text-gray-500">→</span>
        <span class="text-amber-400">slow</span>
      </div>
    </div>

    <!-- Why this matters: relative position -->
    <div class="bg-[#0f3460] rounded p-4">
      <p class="text-[var(--text-body)] text-white mb-3">Why This Enables Relative Attention</p>

      <!-- Step-by-step explanation -->
      <div class="space-y-3 text-[var(--text-body)]">
        <div class="flex gap-2">
          <span class="text-[#e94560] font-bold">1.</span>
          <p class="text-gray-300"><strong class="text-white">Goal:</strong> Attention needs patterns like "the verb is usually 2 words after the subject"</p>
        </div>

        <div class="flex gap-2">
          <span class="text-[#e94560] font-bold">2.</span>
          <p class="text-gray-300"><strong class="text-white">Problem:</strong> How can the model learn "k words apart" once and apply it everywhere?</p>
        </div>

        <div class="flex gap-2">
          <span class="text-[#e94560] font-bold">3.</span>
          <div class="text-gray-300">
            <strong class="text-white">Key property:</strong> The rotation from position t → t+k is <em>always the same angle</em>, no matter where t is:
          </div>
        </div>
      </div>

      <!-- Visual proof: same offset = same rotation -->
      <div class="bg-[#1a1a2e] rounded p-3 mt-3">
        <div class="flex justify-center items-center gap-4">
          <!-- Example 1: pos 5 → pos 10 -->
          <div class="text-center">
            <p class="text-[var(--text-small)] text-gray-500 mb-1">pos 5 → pos 10</p>
            {#each [0] as _, i (i)}
              {@const angle5 = getClockAngle(5, 0)}
              {@const angle10 = getClockAngle(10, 0)}
              <svg viewBox="0 0 60 60" class="w-16 h-16">
                <circle cx="30" cy="30" r="26" fill="none" stroke="#333" stroke-width="1.5"/>
                <line x1="30" y1="30" x2={30 + Math.sin(angle5) * 20} y2={30 - Math.cos(angle5) * 20}
                  stroke="#3b82f6" stroke-width="2" stroke-linecap="round"/>
                <line x1="30" y1="30" x2={30 + Math.sin(angle10) * 20} y2={30 - Math.cos(angle10) * 20}
                  stroke="#10b981" stroke-width="2" stroke-linecap="round"/>
                <path d="M {30 + Math.sin(angle5) * 12} {30 - Math.cos(angle5) * 12} A 12 12 0 0 1 {30 + Math.sin(angle10) * 12} {30 - Math.cos(angle10) * 12}"
                  fill="none" stroke="#e94560" stroke-width="2"/>
                <circle cx="30" cy="30" r="2" fill="#e94560"/>
              </svg>
            {/each}
          </div>

          <span class="text-2xl text-[#e94560]">=</span>

          <!-- Example 2: pos 50 → pos 55 -->
          <div class="text-center">
            <p class="text-[var(--text-small)] text-gray-500 mb-1">pos 50 → pos 55</p>
            {#each [0] as _, i (i)}
              {@const angle50 = getClockAngle(50, 0)}
              {@const angle55 = getClockAngle(55, 0)}
              <svg viewBox="0 0 60 60" class="w-16 h-16">
                <circle cx="30" cy="30" r="26" fill="none" stroke="#333" stroke-width="1.5"/>
                <line x1="30" y1="30" x2={30 + Math.sin(angle50) * 20} y2={30 - Math.cos(angle50) * 20}
                  stroke="#3b82f6" stroke-width="2" stroke-linecap="round"/>
                <line x1="30" y1="30" x2={30 + Math.sin(angle55) * 20} y2={30 - Math.cos(angle55) * 20}
                  stroke="#10b981" stroke-width="2" stroke-linecap="round"/>
                <path d="M {30 + Math.sin(angle50) * 12} {30 - Math.cos(angle50) * 12} A 12 12 0 0 1 {30 + Math.sin(angle55) * 12} {30 - Math.cos(angle55) * 12}"
                  fill="none" stroke="#e94560" stroke-width="2"/>
                <circle cx="30" cy="30" r="2" fill="#e94560"/>
              </svg>
            {/each}
          </div>

          <div class="text-[var(--text-small)] text-gray-400 pl-2 border-l border-gray-600">
            <p><span class="text-blue-400">―</span> start pos</p>
            <p><span class="text-emerald-400">―</span> +5 positions</p>
            <p><span class="text-[#e94560]">―</span> same Δ!</p>
          </div>
        </div>
      </div>

      <!-- Conclusion -->
      <div class="flex gap-2 mt-3">
        <span class="text-[#e94560] font-bold text-[var(--text-body)]">4.</span>
        <div class="text-[var(--text-body)] text-gray-300">
          <p><strong class="text-white">Result:</strong> For each (sin, cos) pair, PE(t+k) = M<sub>k</sub> × PE(t) where M<sub>k</sub> is a 2×2 rotation depending only on k.</p>
          <p class="text-gray-500 text-[var(--text-small)] mt-1">For the full d-dimensional vector, this becomes a <strong class="text-gray-400">block-diagonal matrix</strong> of 2×2 rotations (each pair uses a different angle because each has a different frequency).</p>
        </div>
      </div>
    </div>

  </Section>

  <!-- 4. The Insight: Trigonometric Identities -->
  <Section>
    <div class="flex items-center gap-3 mb-2">
      <h3 class="text-[var(--text-h2)] font-semibold text-[#e94560]">4. The Insight: Trigonometric Identities</h3>
      <a href="https://blog.timodenk.com/linear-relationships-in-the-transformers-positional-encoding/" target="_blank" rel="noopener noreferrer" class="text-[var(--text-small)] text-gray-400 hover:text-white">
        Denk ↗
      </a>
    </div>
    <p class="text-[var(--text-body)] text-gray-300 mb-3">
      Why can we represent "k positions ahead" as a fixed rotation? The math behind the clock analogy:
    </p>

    <!-- Steps 1-3 in one box -->
    <div class="bg-[#0f3460] rounded p-4 mb-4 space-y-4">
      <div class="flex gap-3">
        <span class="text-[#e94560] font-bold">1.</span>
        <div class="text-gray-300">
          <strong class="text-white">Question:</strong> Given PE(t) = [sin(t), cos(t)], can we compute PE(t+k) without knowing t?
        </div>
      </div>

      <div class="flex gap-3">
        <span class="text-[#e94560] font-bold">2.</span>
        <div class="text-gray-300 w-full">
          <strong class="text-white">Trig addition formulas</strong> tell us how to expand sin(t+k) and cos(t+k):
          <div class="bg-[#1a1a2e] rounded p-3 mt-2">
            <div class="font-mono text-[var(--text-body)] space-y-1">
              <p>sin(t+k) = sin(t)·cos(k) + cos(t)·sin(k)</p>
              <p>cos(t+k) = cos(t)·cos(k) − sin(t)·sin(k)</p>
            </div>
          </div>
          <p class="text-gray-400 text-[var(--text-body)] mt-2">Notice: the right side only uses sin(t), cos(t), sin(k), cos(k) — no "t+k" needed!</p>

          <p class="text-gray-500 text-[var(--text-small)] mt-3">Rewrite as matrix: PE(t+k) = M<sub>k</sub> × PE(t)</p>
          <div class="bg-[#1a1a2e] rounded p-3 mt-2">
            <!-- M_k label row -->
            <div class="flex items-center justify-center gap-3 text-gray-300 mb-1">
              <div class="invisible font-mono text-[var(--text-small)] px-1">
                <p>sin(t+k)</p>
                <p>cos(t+k)</p>
              </div>
              <span class="invisible font-mono text-[var(--text-h1)]">=</span>
              <p class="text-[var(--text-small)] text-amber-400 font-semibold">M<sub>k</sub></p>
              <span class="invisible font-mono text-[var(--text-h1)]">×</span>
              <div class="invisible font-mono text-[var(--text-small)] px-1">
                <p>sin(t)</p>
                <p>cos(t)</p>
              </div>
            </div>
            <!-- Matrix row -->
            <div class="flex items-center justify-center gap-3 text-gray-300">
              <!-- Result vector -->
              <div class="flex items-center">
                <svg viewBox="0 0 6 40" class="w-1.5 h-10"><path d="M5 2 Q2 2 2 6 L2 34 Q2 38 5 38" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
                <div class="font-mono text-[var(--text-small)] px-1">
                  <p>sin(t+k)</p>
                  <p>cos(t+k)</p>
                </div>
                <svg viewBox="0 0 6 40" class="w-1.5 h-10"><path d="M1 2 Q4 2 4 6 L4 34 Q4 38 1 38" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
              </div>

              <span class="font-mono text-[var(--text-h1)]">=</span>

              <!-- Rotation matrix -->
              <div class="flex items-center">
                <svg viewBox="0 0 6 40" class="w-1.5 h-10"><path d="M5 2 Q2 2 2 6 L2 34 Q2 38 5 38" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
                <div class="font-mono text-[var(--text-small)] px-1 text-center text-amber-400">
                  <p>cos(k) <span class="px-2">sin(k)</span></p>
                  <p>−sin(k) <span class="px-1">cos(k)</span></p>
                </div>
                <svg viewBox="0 0 6 40" class="w-1.5 h-10"><path d="M1 2 Q4 2 4 6 L4 34 Q4 38 1 38" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
              </div>

              <span class="font-mono text-[var(--text-h1)]">×</span>

              <!-- Input vector -->
              <div class="flex items-center">
                <svg viewBox="0 0 6 40" class="w-1.5 h-10"><path d="M5 2 Q2 2 2 6 L2 34 Q2 38 5 38" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
                <div class="font-mono text-[var(--text-small)] px-1">
                  <p>sin(t)</p>
                  <p>cos(t)</p>
                </div>
                <svg viewBox="0 0 6 40" class="w-1.5 h-10"><path d="M1 2 Q4 2 4 6 L4 34 Q4 38 1 38" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-3">
        <span class="text-[#e94560] font-bold">3.</span>
        <div class="text-gray-300">
          <strong class="text-white">Key observation:</strong> The matrix M<sub>k</sub> contains <strong class="text-amber-400">only k</strong> — not t. Same offset = same matrix from any starting position.
        </div>
      </div>
    </div>

    <!-- Step 4: The Key Insight -->
    <div class="bg-[#1a1a2e] border border-[#e94560] rounded p-4">
      <div class="flex gap-3">
        <span class="text-[#e94560] font-bold">4.</span>
        <div class="text-gray-300">
          <strong class="text-white">Key insight:</strong> The matrix M<sub>k</sub> contains <strong class="text-amber-400">only k</strong> (cos(k), sin(k)) — not t.
          <p class="text-gray-400 mt-2">
            This means: to go from <em>any</em> position t to position t+k, you always multiply by the <em>same</em> matrix.
            "5 positions ahead" is the same linear transformation whether you start at position 0 or position 1000.
          </p>
        </div>
      </div>
    </div>
  </Section>

  <!-- 5. The Insight: How Attention Uses PE -->
  <Section>
    <h3 class="text-[var(--text-h2)] font-semibold text-[#e94560] mb-2">5. The Insight: How Attention Uses PE</h3>
    <p class="text-[var(--text-body)] text-gray-300 mb-3">
      We don't directly encode relative position. Here's what actually happens:
    </p>

    <!-- Steps 1-3 in one box -->
    <div class="bg-[#0f3460] rounded p-4 mb-4 space-y-4">
      <div class="flex gap-3">
        <span class="text-[#e94560] font-bold">1.</span>
        <div class="text-gray-300">
          <strong class="text-white">What we add:</strong> Each token gets PE(pos) added to its embedding — this encodes <em>absolute</em> position
        </div>
      </div>

      <div class="flex gap-3">
        <span class="text-[#e94560] font-bold">2.</span>
        <div class="text-gray-300">
          <strong class="text-white">What the structure enables:</strong> The relationship PE(t) → PE(t+k) is always the same transformation M<sub>k</sub>
        </div>
      </div>

      <div class="flex gap-3">
        <span class="text-[#e94560] font-bold">3.</span>
        <div class="text-gray-300">
          <strong class="text-white">Where it's used:</strong> In Q·K attention, both Query and Key have PE baked in. The dot product becomes sensitive to position <em>offset</em>
        </div>
      </div>
    </div>

    <!-- Step 4: Key point -->
    <div class="bg-[#1a1a2e] border border-[#e94560] rounded p-4">
      <div class="flex gap-3">
        <span class="text-[#e94560] font-bold">4.</span>
        <div class="text-gray-300">
          <strong class="text-white">Key point:</strong> The model <strong class="text-white">learns</strong> to exploit this structure during training — it's not automatic.
          This is why later methods (RoPE, ALiBi) encode relative position <em>directly</em> into the attention computation.
        </div>
      </div>
    </div>
  </Section>

  <!-- 6. The Formula - Progressive Breakdown -->
  <Section>
    <h3 class="text-[var(--text-h2)] font-semibold text-[#e94560] mb-2">6. The Formula: pos / 10000<sup>2i/d</sup></h3>

    <!-- Step 1 & 2: Formula and breakdown side by side -->
    <div class="grid md:grid-cols-2 gap-3 mb-3">
      <!-- Step 1: The Formula -->
      <div class="bg-[#0f3460] rounded p-3">
        <p class="text-[var(--text-small)] text-emerald-400 font-semibold mb-2">STEP 1: The Formula</p>
        <div class="font-mono text-center text-[var(--text-body)] text-gray-300">
          <p>angle = <span class="text-amber-400">pos</span> / <span class="text-cyan-400">10000</span><sup><span class="text-[#e94560]">2i/d</span></sup></p>
          <p class="mt-1 text-[var(--text-small)] text-gray-500">Then: PE = [sin(angle), cos(angle)]</p>
        </div>
      </div>

      <!-- Step 2: Break down each part -->
      <div class="bg-[#0f3460] rounded p-3">
        <p class="text-[var(--text-small)] text-emerald-400 font-semibold mb-2">STEP 2: What Each Part Means</p>
        <div class="space-y-1 text-[var(--text-small)]">
          <div class="flex items-start gap-2">
            <span class="text-amber-400 font-mono font-bold w-14">pos</span>
            <span class="text-gray-300">= token position (0, 1, 2...)</span>
          </div>
          <div class="flex items-start gap-2">
            <span class="text-[#e94560] font-mono font-bold w-14">i</span>
            <span class="text-gray-300">= dimension index (0 to d/2 - 1)</span>
          </div>
          <div class="flex items-start gap-2">
            <span class="text-[#e94560] font-mono font-bold w-14">d</span>
            <span class="text-gray-300">= embedding size (e.g., 512)</span>
          </div>
          <div class="flex items-start gap-2">
            <span class="text-cyan-400 font-mono font-bold w-14">10000</span>
            <span class="text-gray-300">= base for frequency range</span>
          </div>
          <div class="flex items-start gap-2">
            <span class="text-[#e94560] font-mono font-bold w-14">2i/d</span>
            <span class="text-gray-300">= exponent (0 → 1)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 3: What 2i/d does -->
    <div class="bg-[#0f3460] rounded p-3 mb-3">
      <p class="text-[var(--text-small)] text-emerald-400 font-semibold mb-2">STEP 3: What 2i/d Does (The Key!)</p>
      <p class="text-[var(--text-small)] text-gray-300 mb-2">As dimension i increases, the exponent <span class="text-[#e94560]">2i/d</span> goes from 0 to 1:</p>
      <div class="bg-[#1a1a2e] rounded p-2 space-y-1 text-[var(--text-small)] font-mono">
        <div class="flex justify-between">
          <span class="text-gray-500">i=0:</span>
          <span>10000<sup class="text-[#e94560]">0</sup> = <span class="text-emerald-400">1</span></span>
          <span class="text-gray-400">→ angle = pos × 1</span>
          <span class="text-emerald-400">FAST</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">i=d/4:</span>
          <span>10000<sup class="text-[#e94560]">0.5</sup> = <span class="text-amber-400">100</span></span>
          <span class="text-gray-400">→ angle = pos / 100</span>
          <span class="text-amber-400">MEDIUM</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">i=d/2:</span>
          <span>10000<sup class="text-[#e94560]">1</sup> = <span class="text-[#e94560]">10000</span></span>
          <span class="text-gray-400">→ angle = pos / 10000</span>
          <span class="text-[#e94560]">SLOW</span>
        </div>
      </div>
      <p class="text-[var(--text-small)] text-gray-500 mt-2 text-center">Higher dimension = larger divisor = slower rotation = longer wavelength</p>
    </div>

    <!-- Step 4: Wavelength visualization -->
    <div class="bg-[#0f3460] rounded p-3 mb-3">
      <p class="text-[var(--text-small)] text-emerald-400 font-semibold mb-2">STEP 4: Resulting Wavelengths</p>
      <p class="text-[var(--text-small)] text-gray-400 mb-2">Wavelength = how many positions for one complete sin/cos cycle:</p>
      <div class="space-y-1">
        {#each [[0, 1, 6, 'emerald'], [64, 10, 63, 'emerald'], [128, 100, 628, 'amber'], [192, 1000, 6283, 'amber'], [255, 10000, 62832, 'red']] as [dim, divisor, wavelength, color] (dim)}
          <div class="grid grid-cols-[4rem_4rem_1fr_8rem] items-center gap-2 text-[var(--text-small)]">
            <span class="text-gray-500">dim {dim}:</span>
            <span class="text-cyan-400 font-mono text-right">÷{divisor}</span>
            <div class="h-3 bg-[#1a1a2e] rounded overflow-hidden">
              <div
                class="h-full rounded"
                style="width: {Math.min(100, Math.log10(wavelength + 1) * 25)}%; background: {color === 'emerald' ? '#10b981' : color === 'amber' ? '#f59e0b' : '#e94560'};"
              ></div>
            </div>
            <span class="text-gray-400 text-right">λ ≈ {wavelength.toLocaleString()} pos</span>
          </div>
        {/each}
      </div>
    </div>

    <!-- Step 5: Why this design? -->
    <div class="bg-[#0f3460] rounded p-3 mb-3">
      <p class="text-[var(--text-small)] text-emerald-400 font-semibold mb-2">STEP 5: Why This Design?</p>
      <div class="grid grid-cols-2 gap-2 text-[var(--text-small)]">
        <div class="bg-[#1a1a2e] rounded p-2">
          <p class="text-white font-semibold mb-1">Multi-Resolution</p>
          <p class="text-gray-400">Fast dims → nearby positions</p>
          <p class="text-gray-400">Slow dims → distant positions</p>
          <p class="text-gray-500 mt-1">Like mm, cm, m rulers together</p>
        </div>
        <div class="bg-[#1a1a2e] rounded p-2">
          <p class="text-white font-semibold mb-1">Exponential Spacing</p>
          <p class="text-gray-400">Each dim adds new "scale"</p>
          <p class="text-gray-400">No wasted dimensions</p>
          <p class="text-gray-500 mt-1">Equal info per dimension</p>
        </div>
      </div>
    </div>

    <!-- Step 6: Why 10000? -->
    <div class="bg-[#0f3460] rounded p-3 mb-3">
      <p class="text-[var(--text-small)] text-emerald-400 font-semibold mb-2">STEP 6: Why 10000 Specifically?</p>
      <div class="text-[var(--text-small)] text-gray-300 space-y-2">
        <p><strong class="text-cyan-400">10000</strong> sets the <strong class="text-white">range of wavelengths</strong> (frequency spectrum) across dimensions:</p>
        <div class="bg-[#1a1a2e] rounded p-2 font-mono text-center">
          <p>Slowest wavelength = 10000 × 2π ≈ <span class="text-amber-400">62,832 positions</span></p>
        </div>
        <p class="text-gray-500">This isn't a hard "maximum context" — sinusoids are defined for any position. But effective usable context depends on training range and how uniquely the model can resolve position offsets.</p>
        <p class="text-gray-500">Original Transformer trained on ≤512 tokens; 10000 gave ample headroom for the frequency spectrum.</p>
      </div>
    </div>

    <!-- Limitations & Future Improvements -->
    <div class="bg-[#1a1a2e] border border-amber-500/30 rounded p-3">
      <p class="text-[var(--text-small)] text-amber-400 font-semibold mb-2">LIMITATIONS & FUTURE IMPROVEMENTS</p>
      <div class="space-y-2 text-[var(--text-small)]">
        <div class="flex gap-2">
          <span class="text-red-400">✗</span>
          <div>
            <p class="text-gray-300"><strong class="text-white">Absolute, not relative:</strong> PE encodes "I am at position 5", not "I am 3 positions after X"</p>
            <p class="text-gray-500">Model must learn relative patterns indirectly</p>
          </div>
        </div>
        <div class="flex gap-2">
          <span class="text-red-400">✗</span>
          <div>
            <p class="text-gray-300"><strong class="text-white">Added, not integrated:</strong> PE is added to embeddings, not part of attention</p>
            <p class="text-gray-500">Position info can get "washed out" in deep layers</p>
          </div>
        </div>
        <div class="flex gap-2">
          <span class="text-red-400">✗</span>
          <div>
            <p class="text-gray-300"><strong class="text-white">Extrapolation uncertain:</strong> Defined for any position, but model may not generalize beyond training range</p>
            <p class="text-gray-500">Periodicity eventually causes ambiguity; later methods handle length better</p>
          </div>
        </div>
      </div>

      <p class="text-[var(--text-small)] text-emerald-400 mt-3">Later methods address these limitations.</p>
    </div>
  </Section>

  <!-- 7. Visualizing the Positional Encoding -->
  <Section>
    <h3 class="text-[var(--text-h2)] font-semibold text-[#e94560] mb-2">7. Visualizing the Positional Encoding</h3>
    <p class="text-[var(--text-body)] text-gray-300 mb-3">
      Each row (position) gets a unique pattern. Similar positions have similar colors.
    </p>

    <div class="bg-[#0f3460] rounded p-4">
      <!-- Color scale legend (top right) -->
      <div class="flex justify-end mb-2">
        <div class="flex items-center gap-2 text-[var(--text-small)] text-white">
          <span>-1</span>
          <div class="w-20 h-3 rounded" style="background: linear-gradient(to right, blue, white, red)"></div>
          <span>+1</span>
        </div>
      </div>

      <!-- Heatmap with Y-axis -->
      <div class="flex">
        <!-- Y-axis label (Position - vertical) -->
        <div class="flex flex-col justify-between items-center w-8 text-[var(--text-small)] text-white pr-1">
          <span>0</span>
          <span class="writing-mode-vertical">Position</span>
          <span>{maxPosition - 1}</span>
        </div>

        <!-- Heatmap canvas -->
        <div class="flex-1">
          <canvas
            bind:this={heatmapCanvas}
            width={dModel}
            height={maxPosition}
            class="w-full rounded"
            style="aspect-ratio: {dModel}/{maxPosition}; image-rendering: pixelated;"
          ></canvas>
        </div>
      </div>

      <!-- X-axis label (bottom) -->
      <div class="flex mt-1">
        <div class="w-8"></div>
        <div class="flex-1 flex justify-between text-[var(--text-small)] text-white">
          <span>dim 0 (fast)</span>
          <span class="text-center">Dimension →</span>
          <span>dim {dModel - 1} (slow)</span>
        </div>
      </div>

      <!-- Explanation for uniform colors -->
      <p class="text-[var(--text-small)] text-gray-500 mt-3 text-center">
        <strong class="text-gray-400">Why are high dimensions uniform?</strong> They cycle so slowly that at {maxPosition} positions, they haven't changed much yet.
      </p>
    </div>
  </Section>

  <!-- 8. How PE Combines with Token Embeddings -->
  <Section>
    <h3 class="text-[var(--text-h2)] font-semibold text-[#e94560] mb-2">8. How PE Combines with Token Embeddings</h3>
    <p class="text-[var(--text-body)] text-gray-300 mb-3">
      Two main ways to inject position info: <strong class="text-emerald-400">addition</strong> or <strong class="text-amber-400">concatenation</strong>.
      The original paper found sinusoidal (added) and learned (added) performed similarly.
    </p>

    <!-- Visual comparison -->
    <div class="grid md:grid-cols-2 gap-4 mb-4">
      <!-- Addition -->
      <div class="bg-[#0f3460] rounded p-4">
        <p class="text-[var(--text-body)] text-emerald-400 font-semibold mb-3 text-center">Addition (Original Transformer)</p>
        <div class="flex flex-col items-center gap-2">
          <!-- Token embedding -->
          <div class="flex items-center gap-2">
            <span class="text-[var(--text-small)] text-gray-400 w-16">Token:</span>
            <div class="flex gap-0.5">
              {#each [0.2, -0.5, 0.8, 0.1, -0.3, 0.6, -0.2, 0.4] as v, i (i)}
                <div class="w-5 h-8 rounded-sm flex items-center justify-center text-[8px] text-white" style="background: {v > 0 ? `rgba(59, 130, 246, ${Math.abs(v)})` : `rgba(239, 68, 68, ${Math.abs(v)})`}">
                  {v.toFixed(1)}
                </div>
              {/each}
            </div>
            <span class="text-[var(--text-small)] text-gray-500">d={8}</span>
          </div>

          <!-- Plus sign -->
          <span class="text-emerald-400 text-xl font-bold">+</span>

          <!-- PE -->
          <div class="flex items-center gap-2">
            <span class="text-[var(--text-small)] text-gray-400 w-16">PE(pos):</span>
            <div class="flex gap-0.5">
              {#each [0.84, 0.54, 0.91, 0.42, 0.14, 0.99, -0.76, 0.65] as v, i (i)}
                <div class="w-5 h-8 rounded-sm flex items-center justify-center text-[8px] text-white" style="background: {v > 0 ? `rgba(16, 185, 129, ${Math.abs(v)})` : `rgba(239, 68, 68, ${Math.abs(v)})`}">
                  {v.toFixed(1)}
                </div>
              {/each}
            </div>
            <span class="text-[var(--text-small)] text-gray-500">d={8}</span>
          </div>

          <!-- Equals sign -->
          <span class="text-white text-xl font-bold">=</span>

          <!-- Result -->
          <div class="flex items-center gap-2">
            <span class="text-[var(--text-small)] text-gray-400 w-16">Output:</span>
            <div class="flex gap-0.5">
              {#each [1.04, 0.04, 1.71, 0.52, -0.16, 1.59, -0.96, 1.05] as v, i (i)}
                <div class="w-5 h-8 rounded-sm flex items-center justify-center text-[8px] text-white" style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.5), rgba(16, 185, 129, 0.5))">
                  {v.toFixed(1)}
                </div>
              {/each}
            </div>
            <span class="text-[var(--text-small)] text-emerald-400 font-bold">d={8}</span>
          </div>
        </div>
        <p class="text-[var(--text-small)] text-gray-500 mt-3 text-center">Same size! No extra parameters.</p>
      </div>

      <!-- Concatenation -->
      <div class="bg-[#0f3460] rounded p-4">
        <p class="text-[var(--text-body)] text-amber-400 font-semibold mb-3 text-center">Concatenation (Alternative)</p>
        <div class="flex flex-col items-center gap-2">
          <!-- Token embedding -->
          <div class="flex items-center gap-2">
            <span class="text-[var(--text-small)] text-gray-400 w-16">Token:</span>
            <div class="flex gap-0.5">
              {#each [0.2, -0.5, 0.8, 0.1, -0.3, 0.6, -0.2, 0.4] as v, i (i)}
                <div class="w-5 h-8 rounded-sm flex items-center justify-center text-[8px] text-white" style="background: {v > 0 ? `rgba(59, 130, 246, ${Math.abs(v)})` : `rgba(239, 68, 68, ${Math.abs(v)})`}">
                  {v.toFixed(1)}
                </div>
              {/each}
            </div>
            <span class="text-[var(--text-small)] text-gray-500">d={8}</span>
          </div>

          <!-- Concat sign -->
          <span class="text-amber-400 text-xl font-bold">||</span>

          <!-- PE -->
          <div class="flex items-center gap-2">
            <span class="text-[var(--text-small)] text-gray-400 w-16">PE(pos):</span>
            <div class="flex gap-0.5">
              {#each [0.84, 0.54, 0.91, 0.42, 0.14, 0.99, -0.76, 0.65] as v, i (i)}
                <div class="w-5 h-8 rounded-sm flex items-center justify-center text-[8px] text-white" style="background: {v > 0 ? `rgba(16, 185, 129, ${Math.abs(v)})` : `rgba(239, 68, 68, ${Math.abs(v)})`}">
                  {v.toFixed(1)}
                </div>
              {/each}
            </div>
            <span class="text-[var(--text-small)] text-gray-500">d={8}</span>
          </div>

          <!-- Equals sign -->
          <span class="text-white text-xl font-bold">=</span>

          <!-- Result (concatenated - shown smaller) -->
          <div class="flex items-center gap-2">
            <span class="text-[var(--text-small)] text-gray-400 w-16">Output:</span>
            <div class="flex gap-0.5">
              {#each [0.2, -0.5, 0.8, 0.1] as v, i (i)}
                <div class="w-3 h-6 rounded-sm" style="background: rgba(59, 130, 246, {Math.abs(v)})"></div>
              {/each}
              {#each [-0.3, 0.6, -0.2, 0.4] as v, i (i)}
                <div class="w-3 h-6 rounded-sm" style="background: {v > 0 ? `rgba(59, 130, 246, ${Math.abs(v)})` : `rgba(239, 68, 68, ${Math.abs(v)})`}"></div>
              {/each}
              <span class="text-gray-600 text-[var(--text-small)]">|</span>
              {#each [0.84, 0.54, 0.91, 0.42] as v, i (i)}
                <div class="w-3 h-6 rounded-sm" style="background: rgba(16, 185, 129, {Math.abs(v)})"></div>
              {/each}
              {#each [0.14, 0.99, -0.76, 0.65] as v, i (i)}
                <div class="w-3 h-6 rounded-sm" style="background: {v > 0 ? `rgba(16, 185, 129, ${Math.abs(v)})` : `rgba(239, 68, 68, ${Math.abs(v)})`}"></div>
              {/each}
            </div>
            <span class="text-[var(--text-small)] text-amber-400 font-bold">d={16}</span>
          </div>
        </div>
        <p class="text-[var(--text-small)] text-gray-500 mt-3 text-center">Doubled size! More parameters needed.</p>
      </div>
    </div>

    <!-- Why Addition Works -->
    <div class="bg-[#0f3460] rounded p-4 mb-4">
      <p class="text-[var(--text-body)] text-white font-semibold mb-3">Why Addition Works (And Is Preferred)</p>
      <div class="space-y-3 text-[var(--text-small)]">
        <div class="flex gap-2">
          <span class="text-emerald-400 font-bold">1.</span>
          <div class="text-gray-300">
            <strong class="text-white">High-dimensional spaces are sparse:</strong> In 512+ dimensions, random vectors are nearly orthogonal.
            Token embeddings and PE occupy different "directions" — adding them doesn't cause destructive interference.
          </div>
        </div>

        <div class="flex gap-2">
          <span class="text-emerald-400 font-bold">2.</span>
          <div class="text-gray-300">
            <strong class="text-white">Bounded PE values:</strong> Sinusoidal PE is always in [-1, +1].
            Token embeddings are typically normalized. The scales are compatible.
          </div>
        </div>

        <div class="flex gap-2">
          <span class="text-emerald-400 font-bold">3.</span>
          <div class="text-gray-300">
            <strong class="text-white">Model learns to disentangle:</strong> Through training, attention learns to extract both
            content (from token) and position (from PE) from the combined vector.
          </div>
        </div>

        <div class="flex gap-2">
          <span class="text-emerald-400 font-bold">4.</span>
          <div class="text-gray-300">
            <strong class="text-white">Efficiency:</strong> No dimension increase = no extra parameters in subsequent layers.
            A 512-dim model stays 512-dim throughout.
          </div>
        </div>
      </div>
    </div>

    <!-- When to use each -->
    <div class="grid md:grid-cols-2 gap-3">
      <div class="bg-[#1a1a2e] border border-emerald-500/30 rounded p-3">
        <p class="text-[var(--text-small)] text-emerald-400 font-semibold mb-2">When Addition is Best</p>
        <ul class="text-[var(--text-small)] text-gray-400 space-y-1">
          <li>• High-dimensional embeddings (d ≥ 256)</li>
          <li>• Memory/compute constrained</li>
          <li>• Standard NLP tasks (most use cases)</li>
          <li>• When PE and content can share space</li>
        </ul>
      </div>
      <div class="bg-[#1a1a2e] border border-amber-500/30 rounded p-3">
        <p class="text-[var(--text-small)] text-amber-400 font-semibold mb-2">When Concatenation Might Help</p>
        <ul class="text-[var(--text-small)] text-gray-400 space-y-1">
          <li>• Low-dimensional embeddings</li>
          <li>• Position is critically important</li>
          <li>• Explicit separation needed</li>
          <li>• Some vision/audio models</li>
        </ul>
      </div>
    </div>

    <!-- What the Paper Actually Found -->
    <div class="bg-[#1a1a2e] border border-[#e94560] rounded p-3 mt-4">
      <p class="text-[var(--text-body)] text-white font-semibold mb-2">What the Paper Actually Found</p>
      <blockquote class="text-[var(--text-small)] text-gray-400 italic border-l-2 border-[#e94560] pl-3 mb-3">
        "We also experimented with using learned positional embeddings instead, and found that the two versions produced <strong class="text-white">nearly identical results</strong>."
        <span class="text-gray-500 block mt-1">— Vaswani et al., "Attention Is All You Need" (2017)</span>
      </blockquote>
      <div class="text-[var(--text-small)] text-gray-300 space-y-2">
        <p>
          <strong class="text-emerald-400">Important caveat:</strong> This comparison was between <strong class="text-white">sinusoidal vs learned</strong>,
          both using <strong class="text-white">addition</strong>. Concatenation is a different design tradeoff:
        </p>
        <ul class="text-gray-400 space-y-1 pl-4">
          <li>• Concatenation changes downstream parameterization and model capacity</li>
          <li>• Results depend on architecture and regularization choices</li>
          <li>• Not generally "equivalent" to addition</li>
        </ul>
        <p class="text-gray-500 mt-2">
          <strong class="text-gray-400">Why addition works well:</strong> In high-dimensional spaces (d=512+), random vectors are nearly orthogonal.
          Token embeddings and PE occupy different "directions" — adding them preserves both signals.
        </p>
      </div>
    </div>
  </Section>

  <!-- 9. How PE is Used in Attention -->
  <Section>
    <h3 class="text-[var(--text-h2)] font-semibold text-[#e94560] mb-2">9. How PE is Used in the Attention Mechanism</h3>
    <p class="text-[var(--text-body)] text-gray-300 mb-3">
      Sinusoidal PE is added to the input embeddings <strong class="text-white">before</strong> the attention computation.
      The position-enriched embeddings then flow through Q, K, V projections.
    </p>

    <!-- PE + Token Embeddings → Attention Flow -->
    <Sinusoidal_AttnDiagram />

    <div class="bg-[#0f3460] rounded p-3 mt-3">
      <p class="text-[var(--text-small)] text-gray-400">
        <strong class="text-white">Key insight:</strong> Position information is baked into X before Q, K, V are computed.
        The attention mechanism doesn't explicitly know about positions — it just sees enriched embeddings.
      </p>
    </div>
  </Section>

</div>

<style>
  .writing-mode-vertical {
    writing-mode: vertical-lr;
    transform: rotate(180deg);
  }
</style>
