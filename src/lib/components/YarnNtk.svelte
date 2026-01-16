<!-- ABOUTME: Visualizes RoPE scaling methods: Position Interpolation, NTK, and YaRN -->
<!-- ABOUTME: Shows the 48-hour story of community-driven improvements to context extension -->

<script>
  import { Section } from './layouts';

  // Interactive demo state
  let extensionFactor = $state(2);  // 1x, 2x, 4x, 8x context extension

  // Training context length (base)
  const TRAIN_CONTEXT = 4096;

  // Position compression visualization data
  let positionData = $derived.by(() => {
    const positions = [];
    const maxPos = TRAIN_CONTEXT * extensionFactor;
    const step = maxPos / 8;

    for (let i = 0; i <= 8; i++) {
      const originalPos = Math.round(i * step);
      positions.push({
        original: originalPos,
        piScaled: originalPos / extensionFactor,
        inBounds: originalPos / extensionFactor <= TRAIN_CONTEXT
      });
    }
    return positions;
  });
</script>

<div class="space-y-4">
  <!-- Header -->
  <Section>
    <div class="flex flex-wrap items-center gap-4 mb-2">
      <h2 class="text-[var(--text-h1)] font-bold text-[#e94560]">YaRN + NTK: RoPE Scaling Methods</h2>
      <div class="flex gap-3 text-[var(--text-small)]">
        <a href="https://arxiv.org/abs/2306.15595" target="_blank" class="text-gray-400 hover:text-white">PI (Meta) ↗</a>
        <a href="https://www.reddit.com/r/LocalLLaMA/comments/14lz7j5/" target="_blank" class="text-gray-400 hover:text-white">NTK (Reddit) ↗</a>
        <a href="https://arxiv.org/abs/2309.00071" target="_blank" class="text-gray-400 hover:text-white">YaRN ↗</a>
      </div>
    </div>

    <!-- Core Summary -->
    <div class="bg-[#0f3460] rounded p-3 mb-3">
      <p class="text-[var(--text-body)] text-gray-300">
        <strong class="text-white">Core problem:</strong> RoPE models fail beyond their training context length.
        These methods attempt to <strong class="text-amber-400">scale</strong> position indices to extend context windows
        without full retraining. The story of PI → NTK → YaRN is a remarkable tale of
        <strong class="text-emerald-400">open-source collaboration</strong> where a Reddit user improved on Meta's research in 48 hours.
      </p>
    </div>
  </Section>

  <!-- The 48-Hour Story -->
  <Section title="The 48-Hour Story">
    <div class="bg-[#1a1a2e] rounded p-4 mb-4">
      <div class="flex flex-col md:flex-row gap-4 md:items-center">
        <!-- Timeline -->
        <div class="flex-1 space-y-4">
          <div class="flex items-start gap-3">
            <div class="w-24 text-[var(--text-small)] text-gray-500 shrink-0">June 27</div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="px-2 py-0.5 bg-blue-600/30 text-blue-400 text-[var(--text-small)] rounded">Meta</span>
                <span class="text-white font-semibold">Position Interpolation (PI)</span>
              </div>
              <p class="text-[var(--text-small)] text-gray-400">"Compress positions uniformly to fit training range"</p>
            </div>
          </div>

          <div class="flex items-center gap-3 pl-12">
            <div class="h-8 w-0.5 bg-amber-500/50"></div>
            <span class="text-amber-400 text-[var(--text-small)] font-semibold">48 hours later...</span>
          </div>

          <div class="flex items-start gap-3">
            <div class="w-24 text-[var(--text-small)] text-gray-500 shrink-0">June 29</div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="px-2 py-0.5 bg-orange-600/30 text-orange-400 text-[var(--text-small)] rounded">Reddit</span>
                <span class="text-white font-semibold">NTK-Aware Scaling</span>
              </div>
              <p class="text-[var(--text-small)] text-gray-400">"Wait, uniform scaling destroys high-frequency info!"</p>
              <p class="text-[var(--text-small)] text-gray-500 mt-1">
                <span class="text-orange-400">bloc97</span> on r/LocalLLaMA
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3 pl-12">
            <div class="h-8 w-0.5 bg-gray-600/50"></div>
            <span class="text-gray-500 text-[var(--text-small)]">2 months later...</span>
          </div>

          <div class="flex items-start gap-3">
            <div class="w-24 text-[var(--text-small)] text-gray-500 shrink-0">Aug 31</div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="px-2 py-0.5 bg-amber-600/30 text-amber-400 text-[var(--text-small)] rounded">ICLR 2024</span>
                <span class="text-white font-semibold">YaRN</span>
              </div>
              <p class="text-[var(--text-small)] text-gray-400">"Formalize NTK + add temperature scaling"</p>
            </div>
          </div>
        </div>

        <!-- Highlight box -->
        <div class="md:w-64 bg-amber-500/10 border border-amber-500/30 rounded p-3">
          <p class="text-[var(--text-small)] text-amber-400 font-semibold mb-2">Open-Source ML at its Best</p>
          <p class="text-[var(--text-small)] text-gray-300">
            A Reddit user identified a flaw in Meta's research and proposed a fix — all within 48 hours of publication.
            This fix was later adopted by CodeLlama, Qwen, and many other models.
          </p>
        </div>
      </div>
    </div>
  </Section>

  <!-- Section 1: The Problem -->
  <Section title="The Problem: RoPE Has a Length Limit">
    <p class="text-[var(--text-small)] text-gray-300 mb-3">
      RoPE encodes position by rotating embeddings. But at positions beyond the
      <strong class="text-white">4K training context window</strong>, the rotation angles are
      <strong class="text-red-400">out of distribution</strong> — the model has never seen them.
    </p>

    <div class="bg-[#1a1a2e] rounded p-4 mb-3">
      <p class="text-[var(--text-small)] text-gray-400 mb-3">Model trained with 4K context window:</p>
      <div class="grid md:grid-cols-2 gap-4">
        <div class="border border-green-500/30 rounded p-3">
          <p class="text-[var(--text-small)] text-green-400 font-semibold mb-2">Within 4K Context</p>
          <div class="font-mono text-[var(--text-small)] text-gray-300">
            Position 3000 → θ<sub>3000</sub> <span class="text-green-400">✓ Seen during training</span>
          </div>
        </div>
        <div class="border border-red-500/30 rounded p-3">
          <p class="text-[var(--text-small)] text-red-400 font-semibold mb-2">Beyond 4K Context</p>
          <div class="font-mono text-[var(--text-small)] text-gray-300">
            Position 5000 → θ<sub>5000</sub> <span class="text-red-400">✗ Never seen!</span>
          </div>
        </div>
      </div>
    </div>

    <p class="text-[var(--text-small)] text-gray-500 mb-3">
      Result: Attention scores become meaningless, and the model produces garbage at long contexts.
    </p>

    <div class="bg-[#1a1a2e] border border-amber-500/30 rounded p-3">
      <p class="text-[var(--text-small)] text-gray-300">
        <strong class="text-amber-400">The question:</strong> How do we extend RoPE to longer contexts
        without retraining from scratch?
      </p>
    </div>
  </Section>

  <!-- Section 2: Position Interpolation (PI) -->
  <Section title="First Attempt: Position Interpolation (PI)">
    <div class="flex items-center gap-2 mb-3">
      <span class="px-2 py-0.5 bg-blue-600/30 text-blue-400 text-[var(--text-small)] rounded">Meta</span>
      <a href="https://arxiv.org/abs/2306.15595" target="_blank" class="text-[var(--text-small)] text-gray-400 hover:text-white">
        arXiv:2306.15595 ↗
      </a>
      <span class="text-[var(--text-small)] text-gray-500">June 27, 2023</span>
    </div>

    <p class="text-[var(--text-small)] text-gray-300 mb-3">
      <strong class="text-white">Idea:</strong> Compress position indices to fit within the training range.
      Want 8K context but trained on 4K? <strong class="text-blue-400">Divide all positions by 2</strong>.
    </p>

    <!-- Formula explanation -->
    <div class="bg-[#0f3460] rounded p-3 mb-3">
      <p class="text-[var(--text-small)] text-gray-400 mb-2">The change is simple — just divide the position before computing rotation:</p>
      <div class="font-mono text-[var(--text-small)] space-y-1">
        <div class="flex items-center gap-2">
          <span class="text-gray-500 w-24">Original:</span>
          <span class="text-orange-400">θ(m) = m × θ<sub>base</sub></span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-gray-500 w-24">With PI:</span>
          <span class="text-blue-400">θ(m) = (m ÷ scale) × θ<sub>base</sub></span>
        </div>
      </div>
      <p class="text-[var(--text-small)] text-gray-500 mt-2">
        where <span class="text-white">scale = target / training</span> (e.g., 8K/4K = 2)
      </p>
      <p class="text-[var(--text-small)] text-gray-400 mt-2">
        Position 6000 at inference → <span class="text-blue-400">6000 ÷ 2 = 3000</span> → rotation angle stays within training range
      </p>
    </div>

    <!-- Position compression visualization -->
    <div class="bg-[#1a1a2e] rounded p-4 mb-3">
      <p class="text-[var(--text-small)] text-gray-400 mb-3">
        Extension factor: <strong class="text-white">{extensionFactor}x</strong>
        (Target: {(TRAIN_CONTEXT * extensionFactor).toLocaleString()} tokens)
      </p>

      <div class="space-y-2 font-mono text-[var(--text-small)]">
        <div class="flex items-center gap-2">
          <span class="w-32 text-gray-500">Original:</span>
          <div class="flex-1 flex justify-between">
            {#each positionData as pos (pos.original)}
              <span class={pos.original > TRAIN_CONTEXT ? 'text-red-400' : 'text-gray-300'}>
                {pos.original.toLocaleString()}
              </span>
            {/each}
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-32 text-blue-400">PI scaled (÷{extensionFactor}):</span>
          <div class="flex-1 flex justify-between">
            {#each positionData as pos (pos.original)}
              <span class="text-green-400">{Math.round(pos.piScaled).toLocaleString()}</span>
            {/each}
          </div>
        </div>
        <div class="flex items-center gap-2 mt-2">
          <span class="w-32"></span>
          <div class="flex-1 h-2 bg-gray-700 rounded overflow-hidden">
            <div class="h-full bg-green-500/50" style="width: {100 / extensionFactor}%"></div>
          </div>
          <span class="text-[var(--text-small)] text-gray-500 ml-2">Training range</span>
        </div>
      </div>
    </div>

    <!-- The problem with PI -->
    <div class="bg-red-500/10 border border-red-500/30 rounded p-3">
      <p class="text-[var(--text-small)] text-red-400 font-semibold mb-2">The Problem</p>
      <p class="text-[var(--text-small)] text-gray-300">
        PI scales <strong class="text-white">all dimensions equally</strong>. But RoPE dimensions have different frequencies:
      </p>
      <ul class="text-[var(--text-small)] text-gray-300 mt-2 space-y-1">
        <li>• <strong class="text-cyan-400">High frequency</strong> → Fine-grained position ("Is this token 5 or 6?")</li>
        <li>• <strong class="text-purple-400">Low frequency</strong> → Coarse position ("First half or second half?")</li>
      </ul>
      <p class="text-[var(--text-small)] text-gray-400 mt-2">
        Uniform scaling destroys high-frequency detail → adjacent tokens become indistinguishable.
      </p>
    </div>
  </Section>

  <!-- Section 3: NTK Insight -->
  <Section title="The NTK Insight: Not All Frequencies Are Equal">
    <div class="flex items-center gap-2 mb-3">
      <span class="px-2 py-0.5 bg-orange-600/30 text-orange-400 text-[var(--text-small)] rounded">Reddit</span>
      <a href="https://www.reddit.com/r/LocalLLaMA/comments/14lz7j5/" target="_blank" class="text-[var(--text-small)] text-gray-400 hover:text-white">
        r/LocalLLaMA ↗
      </a>
      <span class="text-[var(--text-small)] text-gray-500">June 29, 2023 — just 48 hours after PI!</span>
    </div>

    <p class="text-[var(--text-small)] text-gray-300 mb-3">
      <strong class="text-white">The redditor's insight:</strong> Scale low frequencies MORE, high frequencies LESS.
      This preserves the model's ability to distinguish nearby tokens.
    </p>

    <!-- Frequency scaling comparison -->
    <div class="bg-[#1a1a2e] rounded p-4 mb-3">
      <p class="text-[var(--text-small)] text-gray-400 mb-3">Frequency scaling at {extensionFactor}x extension:</p>

      <div class="space-y-3">
        <!-- High freq dimensions -->
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="w-24 text-[var(--text-small)] text-cyan-400">High freq</span>
            <span class="text-[var(--text-small)] text-gray-500">(dims 24-31)</span>
          </div>
          <div class="flex gap-2">
            <div class="flex-1">
              <div class="text-[var(--text-small)] text-gray-500 mb-1">PI: ÷{extensionFactor}</div>
              <div class="h-3 bg-blue-500/50 rounded" style="width: {100 / extensionFactor}%"></div>
            </div>
            <div class="flex-1">
              <div class="text-[var(--text-small)] text-gray-500 mb-1">NTK: ÷{(1 + (extensionFactor - 1) * 0.1).toFixed(1)}</div>
              <div class="h-3 bg-orange-500/50 rounded" style="width: {100 / (1 + (extensionFactor - 1) * 0.1)}%"></div>
            </div>
          </div>
        </div>

        <!-- Low freq dimensions -->
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="w-24 text-[var(--text-small)] text-purple-400">Low freq</span>
            <span class="text-[var(--text-small)] text-gray-500">(dims 0-7)</span>
          </div>
          <div class="flex gap-2">
            <div class="flex-1">
              <div class="text-[var(--text-small)] text-gray-500 mb-1">PI: ÷{extensionFactor}</div>
              <div class="h-3 bg-blue-500/50 rounded" style="width: {100 / extensionFactor}%"></div>
            </div>
            <div class="flex-1">
              <div class="text-[var(--text-small)] text-gray-500 mb-1">NTK: ÷{(extensionFactor * 1.2).toFixed(1)}</div>
              <div class="h-3 bg-orange-500/50 rounded" style="width: {100 / (extensionFactor * 1.2)}%"></div>
            </div>
          </div>
        </div>
      </div>

      <p class="text-[var(--text-small)] text-gray-500 mt-3">
        NTK preserves high-freq detail (local relationships) while compressing low-freq (global position).
      </p>
    </div>

    <div class="bg-orange-500/10 border border-orange-500/30 rounded p-3">
      <p class="text-[var(--text-small)] text-orange-400 font-semibold mb-2">Why "NTK"? (Neural Tangent Kernel)</p>
      <p class="text-[var(--text-small)] text-gray-300 mb-2">
        The redditor connected RoPE interpolation to <strong class="text-white">Neural Tangent Kernel theory</strong>.
        In NTK theory, neural networks can be analyzed through their behavior at different frequency components.
      </p>
      <p class="text-[var(--text-small)] text-gray-300 mb-2">
        The key insight: when you uniformly scale RoPE (like PI does), you're effectively
        <strong class="text-white">losing high-frequency information</strong> — the fine-grained details that
        distinguish nearby tokens. NTK theory predicts this information loss.
      </p>
      <p class="text-[var(--text-small)] text-gray-300">
        The redditor's fix: adjust the RoPE base frequency in a way that spreads interpolation pressure across
        dimensions, preserving high-frequency detail. Hence <strong class="text-orange-400">"NTK-aware"</strong> scaling.
      </p>
    </div>
  </Section>

  <!-- Section 4: YaRN -->
  <Section title="YaRN: Putting It All Together">
    <div class="flex items-center gap-2 mb-3">
      <span class="px-2 py-0.5 bg-amber-600/30 text-amber-400 text-[var(--text-small)] rounded">ICLR 2024</span>
      <a href="https://arxiv.org/abs/2309.00071" target="_blank" class="text-[var(--text-small)] text-gray-400 hover:text-white">
        arXiv:2309.00071 ↗
      </a>
      <span class="text-[var(--text-small)] text-gray-500">Aug 31, 2023</span>
    </div>

    <p class="text-[var(--text-small)] text-gray-300 mb-3">
      <strong class="text-white">YaRN (Yet another RoPE extensioN)</strong> formalizes NTK and adds improvements:
    </p>

    <div class="grid md:grid-cols-3 gap-3 mb-4">
      <div class="bg-[#1a1a2e] border border-amber-500/30 rounded p-3">
        <p class="text-[var(--text-small)] text-amber-400 font-semibold mb-2">1. NTK-by-parts</p>
        <p class="text-[var(--text-small)] text-gray-300">
          Segment dimensions into low/mid/high frequency groups, apply different scaling to each.
        </p>
      </div>
      <div class="bg-[#1a1a2e] border border-amber-500/30 rounded p-3">
        <p class="text-[var(--text-small)] text-amber-400 font-semibold mb-2">2. Temperature Scaling</p>
        <p class="text-[var(--text-small)] text-gray-300">
          Adjust attention softmax temperature to compensate for changed attention distributions.
        </p>
      </div>
      <div class="bg-[#1a1a2e] border border-amber-500/30 rounded p-3">
        <p class="text-[var(--text-small)] text-amber-400 font-semibold mb-2">3. Efficiency</p>
        <p class="text-[var(--text-small)] text-gray-300">
          10x fewer tokens than PI for same quality. LLaMA 2 → 64K in just 400 steps.
        </p>
      </div>
    </div>

    <!-- YaRN segmentation visualization -->
    <div class="bg-[#1a1a2e] rounded p-4 mb-4">
      <p class="text-[var(--text-small)] text-gray-400 mb-3">YaRN dimension segmentation:</p>
      <div class="flex h-8 rounded overflow-hidden mb-2">
        <div class="bg-purple-500/50 flex-[8] flex items-center justify-center">
          <span class="text-[var(--text-small)] text-white">Low (0-7)</span>
        </div>
        <div class="bg-gray-500/50 flex-[16] flex items-center justify-center">
          <span class="text-[var(--text-small)] text-white">Mid (8-23)</span>
        </div>
        <div class="bg-cyan-500/50 flex-[8] flex items-center justify-center">
          <span class="text-[var(--text-small)] text-white">High (24-31)</span>
        </div>
      </div>
      <div class="flex text-[var(--text-small)] text-gray-400">
        <div class="flex-[8] text-center">Scale heavily</div>
        <div class="flex-[16] text-center">Blend</div>
        <div class="flex-[8] text-center">Keep mostly</div>
      </div>
    </div>

    <!-- YaRN Formulas -->
    <div class="bg-[#0f3460] rounded p-4">
      <p class="text-[var(--text-small)] text-amber-400 font-semibold mb-3">YaRN Formulas</p>

      <div class="grid md:grid-cols-3 gap-4">
        <!-- NTK-by-parts formula -->
        <div class="bg-[#1a1a2e] rounded p-3">
          <div class="flex items-center gap-2 mb-2">
            <p class="text-[var(--text-small)] text-purple-400 font-semibold">1. NTK-by-parts</p>
            <span class="px-1.5 py-0.5 bg-gray-600/50 text-gray-400 text-[10px] rounded">FIXED</span>
          </div>
          <div class="font-mono text-[var(--text-small)] text-gray-300 space-y-1">
            <p>θ'(d) = (1 - γ) × θ/s + γ × θ</p>
          </div>
          <p class="text-[var(--text-small)] text-gray-500 mt-2">
            γ = 0 for low dims (full scaling)<br/>
            γ = 1 for high dims (no scaling)<br/>
            γ blends in between
          </p>
        </div>

        <!-- Temperature scaling formula -->
        <div class="bg-[#1a1a2e] rounded p-3">
          <div class="flex items-center gap-2 mb-2">
            <p class="text-[var(--text-small)] text-gray-400 font-semibold">2. Temperature Scaling</p>
            <span class="px-1.5 py-0.5 bg-amber-600/50 text-amber-300 text-[10px] rounded">EMPIRICAL</span>
          </div>
          <div class="font-mono text-[var(--text-small)] text-gray-300 space-y-1">
            <p>softmax(QK<sup>T</sup> / (t × √d))</p>
            <p class="text-amber-400">√(1/t) = 0.1 × ln(s) + 1</p>
          </div>
          <p class="text-[var(--text-small)] text-gray-500 mt-2">
            Formula derived empirically, not learned
          </p>
        </div>

        <!-- Ramp function -->
        <div class="bg-[#1a1a2e] rounded p-3">
          <div class="flex items-center gap-2 mb-2">
            <p class="text-[var(--text-small)] text-cyan-400 font-semibold">3. Ramp Function γ</p>
            <span class="px-1.5 py-0.5 bg-gray-600/50 text-gray-400 text-[10px] rounded">HYPERPARAM</span>
          </div>
          <div class="font-mono text-[var(--text-small)] text-gray-300 space-y-1">
            <p>γ(r) = 0 if r &lt; α</p>
            <p>γ(r) = 1 if r &gt; β</p>
            <p>γ(r) = (r-α)/(β-α) else</p>
          </div>
          <p class="text-[var(--text-small)] text-gray-500 mt-2">
            For LLaMA: α=1, β=32 (fixed)
          </p>
        </div>
      </div>

      <p class="text-[var(--text-small)] text-gray-500 mt-3">
        Where s = scale factor (e.g., 2 for 2x context), d = dimension index, θ = original rotation angle.
        <strong class="text-gray-400">No trainable parameters</strong> — brief fine-tuning (400 steps) adapts the model to new PE scheme.
      </p>
    </div>
  </Section>

  <!-- Section 5: Actual Results from Papers -->
  <Section title="Actual Results">
    <p class="text-[var(--text-small)] text-gray-300 mb-4">
      Real benchmark numbers from the YaRN paper (Llama 2 7B/13B models):
    </p>

    <!-- Training Efficiency, Passkey, and Perplexity in 3 columns -->
    <div class="grid md:grid-cols-3 gap-4 mb-4">
      <!-- Training efficiency -->
      <div class="bg-[#1a1a2e] border border-gray-500/30 rounded p-4">
        <p class="text-[var(--text-small)] text-gray-400 font-semibold mb-2">Training Efficiency</p>
        <div class="space-y-2 text-[var(--text-small)]">
          <div class="flex justify-between">
            <span class="text-gray-400">YaRN steps:</span>
            <span class="text-white font-mono">400 + 200</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">vs PI:</span>
            <span class="text-amber-400 font-mono">10x fewer</span>
          </div>
        </div>
      </div>

      <!-- Passkey retrieval -->
      <div class="bg-[#1a1a2e] border border-green-500/30 rounded p-4">
        <p class="text-[var(--text-small)] text-green-400 font-semibold mb-2">Passkey Retrieval @ 128K</p>
        <div class="space-y-2 text-[var(--text-small)]">
          <div class="flex justify-between">
            <span class="text-gray-400">YaRN (7B):</span>
            <span class="text-green-400 font-mono">99.4%</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">YaRN (13B):</span>
            <span class="text-green-400 font-mono">99.4%</span>
          </div>
        </div>
      </div>

      <!-- Perplexity -->
      <div class="bg-[#1a1a2e] border border-amber-500/30 rounded p-4">
        <p class="text-[var(--text-small)] text-amber-400 font-semibold mb-2">Perplexity @ 128K</p>
        <div class="space-y-2 text-[var(--text-small)]">
          <div class="flex justify-between">
            <span class="text-gray-400">YaRN:</span>
            <span class="text-amber-400 font-mono">2.37</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Code Llama:</span>
            <span class="text-gray-300 font-mono">2.71</span>
          </div>
        </div>
        <p class="text-[var(--text-small)] text-gray-500 mt-1">Lower is better</p>
      </div>
    </div>
  </Section>

  <!-- Summary -->
  <Section title="Summary">
    <div class="bg-[#1a1a2e] rounded p-4">
        <p class="text-[var(--text-small)] text-amber-400 font-semibold mb-3">Key Takeaways</p>
        <ul class="space-y-2 text-[var(--text-small)] text-gray-300">
          <li class="flex gap-2">
            <span class="text-amber-400">1.</span>
            <span>RoPE fails beyond training length — rotation angles go OOD</span>
          </li>
          <li class="flex gap-2">
            <span class="text-amber-400">2.</span>
            <span>PI compresses positions uniformly — loses high-freq detail</span>
          </li>
          <li class="flex gap-2">
            <span class="text-amber-400">3.</span>
            <span>NTK scales non-uniformly — preserves local relationships</span>
          </li>
          <li class="flex gap-2">
            <span class="text-amber-400">4.</span>
            <span>YaRN = NTK + temperature — best scaling method</span>
          </li>
          <li class="flex gap-2">
            <span class="text-amber-400">5.</span>
            <span>Scaling may corrupt semantic attention — see "What happened next"</span>
          </li>
        </ul>
    </div>
  </Section>

  <!-- What happened next - custom styled eureka section -->
  <section class="bg-gradient-to-br from-cyan-600/30 via-blue-700/20 to-purple-800/20 border-2 border-cyan-400 shadow-lg shadow-cyan-500/20 rounded-lg p-4 mb-4">
    <h3 class="text-[var(--text-h2)] font-semibold text-cyan-300 mb-2">💡 What happened next</h3>

    <div class="bg-[#1a1a2e]/80 rounded p-4 mb-4">
      <div class="overflow-x-auto">
        <table class="w-full text-[var(--text-small)]">
          <thead>
            <tr class="text-gray-400">
              <th class="text-left py-2">Method @ 8K</th>
              <th class="text-center py-2">Perplexity</th>
              <th class="text-center py-2">Retrieval (NIAH)</th>
              <th class="text-left py-2">Verdict</th>
            </tr>
          </thead>
          <tbody class="text-gray-300">
            <tr class="border-t border-gray-700">
              <td class="py-2">RoPE (no scaling)</td>
              <td class="text-center">8.0</td>
              <td class="text-center text-red-400">~0%</td>
              <td class="text-red-400">Breaks completely</td>
            </tr>
            <tr class="border-t border-gray-700">
              <td class="py-2">YaRN</td>
              <td class="text-center text-green-400">3.0</td>
              <td class="text-center text-amber-400">~20%</td>
              <td class="text-amber-400">Looks good, fails tasks</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="text-[var(--text-small)] text-gray-400 mt-3">
        <strong class="text-white">Perplexity masks the real problem.</strong> YaRN maintains good perplexity
        but fails on retrieval tasks because semantic attention patterns are corrupted.
      </p>
    </div>

    <!-- Intuition -->
    <div class="bg-purple-500/10 border border-purple-500/30 rounded p-4 mb-4">
      <p class="text-[var(--text-small)] text-purple-400 font-semibold mb-3">Intuition: Why might this happen?</p>

      <p class="text-[var(--text-small)] text-gray-300 mb-3">
        RoPE frequencies may encode <strong class="text-white">two different things</strong>:
      </p>

      <div class="grid md:grid-cols-2 gap-3 mb-3">
        <div class="bg-[#1a1a2e] rounded p-3">
          <p class="text-[var(--text-small)] text-purple-400 font-semibold mb-1">Low Frequency</p>
          <p class="text-[var(--text-small)] text-gray-300">
            <strong class="text-white">Semantic attention</strong> — WHAT to attend to
          </p>
        </div>
        <div class="bg-[#1a1a2e] rounded p-3">
          <p class="text-[var(--text-small)] text-cyan-400 font-semibold mb-1">High Frequency</p>
          <p class="text-[var(--text-small)] text-gray-300">
            <strong class="text-white">Positional attention</strong> — WHERE tokens are
          </p>
        </div>
      </div>

      <p class="text-[var(--text-small)] text-gray-300">
        Scaling methods compress low frequencies to extend context, which may
        <strong class="text-purple-400">warp semantic attention</strong>.
      </p>
    </div>

    <!-- Teaser for DroPE -->
    <div class="bg-[#e94560]/15 border border-[#e94560]/40 rounded p-4">
      <p class="text-[var(--text-small)] text-[#e94560] font-semibold mb-2">What if we took a different approach?</p>
      <p class="text-[var(--text-small)] text-gray-300">
        Instead of trying to scale RoPE cleverly... what if we just <strong class="text-white">removed it entirely</strong> after training?
      </p>
      <p class="text-[var(--text-small)] text-gray-400 mt-2">
        → See the <strong class="text-[#e94560]">DroPE</strong> tab
      </p>
    </div>
  </section>
</div>
