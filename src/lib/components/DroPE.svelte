<!-- ABOUTME: Visualizes DroPE (Dropping Positional Embeddings) from Sakana AI 2024 -->
<!-- ABOUTME: Shows how removing PE after training enables zero-shot context extension -->

<script>
  import { Section } from './layouts';
</script>

<div class="space-y-4">
  <!-- Header -->
  <Section>
    <div class="flex flex-wrap items-center gap-4 mb-2">
      <h2 class="text-[var(--text-h1)] font-bold text-[#e94560]">DroPE: Dropping Positional Embeddings</h2>
      <div class="flex gap-3 text-[var(--text-small)]">
        <a href="https://arxiv.org/abs/2512.12167" target="_blank" class="text-gray-400 hover:text-white">arXiv ↗</a>
        <a href="https://pub.sakana.ai/DroPE/" target="_blank" class="text-gray-400 hover:text-white">Sakana AI ↗</a>
        <a href="https://github.com/SakanaAI/DroPE" target="_blank" class="text-gray-400 hover:text-white">GitHub ↗</a>
      </div>
    </div>

    <!-- Core Summary -->
    <div class="bg-[#0f3460] rounded p-3 mb-3">
      <p class="text-[var(--text-body)] text-gray-300">
        <strong class="text-white">Core idea:</strong> What if positional embeddings are just
        <strong class="text-emerald-400">training scaffolding</strong>? DroPE discovers that
        RoPE can be <strong class="text-emerald-400">removed entirely</strong> after pretraining,
        followed by brief recalibration. The result: <strong class="text-amber-400">zero-shot context extension</strong>
        without the semantic corruption that plagues scaling methods like YaRN.
      </p>
    </div>
  </Section>

  <!-- Section 1: The Big Idea -->
  <Section title="The Big Idea: PE as Scaffolding">
    <p class="text-[var(--text-small)] text-gray-300 mb-4">
      Building construction uses scaffolding — temporary structures that help during building but are
      <strong class="text-white">removed when the building is complete</strong>. DroPE proposes that
      positional embeddings work the same way.
    </p>

    <div class="grid md:grid-cols-2 gap-4 mb-4">
      <div class="bg-[#1a1a2e] border border-orange-500/30 rounded p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-2xl">🏗️</span>
          <span class="text-[var(--text-small)] text-orange-400 font-semibold">Training with RoPE</span>
        </div>
        <p class="text-[var(--text-small)] text-gray-300">
          RoPE provides strong inductive bias that <strong class="text-white">accelerates learning</strong>.
          The model learns positional patterns much faster with explicit position information.
        </p>
        <p class="text-[var(--text-small)] text-gray-500 mt-2">
          Like scaffolding: essential during construction
        </p>
      </div>

      <div class="bg-[#1a1a2e] border border-emerald-500/30 rounded p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-2xl">🏛️</span>
          <span class="text-[var(--text-small)] text-emerald-400 font-semibold">Inference without PE</span>
        </div>
        <p class="text-[var(--text-small)] text-gray-300">
          After training, positional information is <strong class="text-white">encoded in the weights</strong>.
          The explicit PE becomes unnecessary — and actually <strong class="text-red-400">constrains</strong> generalization.
        </p>
        <p class="text-[var(--text-small)] text-gray-500 mt-2">
          Like scaffolding: removed when building is done
        </p>
      </div>
    </div>

    <div class="bg-emerald-500/10 border border-emerald-500/30 rounded p-3">
      <p class="text-[var(--text-small)] text-emerald-400 font-semibold mb-2">Key Insight</p>
      <p class="text-[var(--text-small)] text-gray-300">
        "Positional embeddings accelerate learning but constrain generalization."
        By removing them after training, we get the best of both worlds.
      </p>
    </div>
  </Section>

  <!-- Section 2: Why Scaling Fails -->
  <Section title="Why Scaling Methods Fail">
    <p class="text-[var(--text-small)] text-gray-300 mb-3">
      As we saw in the YaRN+NTK tab, scaling methods have a <strong class="text-red-400">fundamental flaw</strong>:
      they must compress low-frequency components, which corrupts semantic attention.
    </p>

    <div class="bg-[#1a1a2e] rounded p-4 mb-4">
      <p class="text-[var(--text-small)] text-gray-400 mb-3">RoPE frequency spectrum:</p>

      <div class="flex h-12 rounded overflow-hidden mb-2">
        <div class="bg-purple-500/50 flex-1 flex items-center justify-center border-r border-gray-700">
          <span class="text-[var(--text-small)] text-white">Low Freq</span>
        </div>
        <div class="bg-cyan-500/50 flex-1 flex items-center justify-center">
          <span class="text-[var(--text-small)] text-white">High Freq</span>
        </div>
      </div>

      <div class="flex text-[var(--text-small)]">
        <div class="flex-1 text-center">
          <span class="text-purple-400 font-semibold">Semantic</span>
          <p class="text-gray-500">WHAT to attend to</p>
        </div>
        <div class="flex-1 text-center">
          <span class="text-cyan-400 font-semibold">Positional</span>
          <p class="text-gray-500">WHERE things are</p>
        </div>
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-4">
      <div class="bg-[#1a1a2e] border border-amber-500/30 rounded p-3">
        <p class="text-[var(--text-small)] text-amber-400 font-semibold mb-2">YaRN's Approach</p>
        <p class="text-[var(--text-small)] text-gray-300">
          Scale low frequencies to fit extended context → <strong class="text-red-400">corrupts semantic patterns</strong>
        </p>
        <p class="text-[var(--text-small)] text-gray-500 mt-2">
          Good perplexity, bad retrieval
        </p>
      </div>

      <div class="bg-[#1a1a2e] border border-emerald-500/30 rounded p-3">
        <p class="text-[var(--text-small)] text-emerald-400 font-semibold mb-2">DroPE's Approach</p>
        <p class="text-[var(--text-small)] text-gray-300">
          Remove PE entirely → <strong class="text-emerald-400">no frequencies to corrupt</strong>
        </p>
        <p class="text-[var(--text-small)] text-gray-500 mt-2">
          Semantic patterns preserved
        </p>
      </div>
    </div>
  </Section>

  <!-- Section 3: The DroPE Process -->
  <Section title="The DroPE Process">
    <p class="text-[var(--text-small)] text-gray-300 mb-4">
      DroPE is surprisingly simple — three steps:
    </p>

    <div class="flex flex-col md:flex-row gap-4 mb-4">
      <!-- Step 1 -->
      <div class="flex-1 bg-[#1a1a2e] rounded p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">1</span>
          <span class="text-[var(--text-small)] text-white font-semibold">Pretrain with RoPE</span>
        </div>
        <p class="text-[var(--text-small)] text-gray-300">
          Train normally using RoPE. Get fast convergence from the positional inductive bias.
        </p>
        <p class="text-[var(--text-small)] text-orange-400 mt-2 font-mono">~14B tokens</p>
      </div>

      <!-- Arrow -->
      <div class="hidden md:flex items-center">
        <span class="text-gray-500 text-2xl">→</span>
      </div>

      <!-- Step 2 -->
      <div class="flex-1 bg-[#1a1a2e] rounded p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">2</span>
          <span class="text-[var(--text-small)] text-white font-semibold">Drop PE</span>
        </div>
        <p class="text-[var(--text-small)] text-gray-300">
          Simply remove all positional embeddings from the model. No rotation matrices applied.
        </p>
        <p class="text-[var(--text-small)] text-red-400 mt-2 font-mono">instant</p>
      </div>

      <!-- Arrow -->
      <div class="hidden md:flex items-center">
        <span class="text-gray-500 text-2xl">→</span>
      </div>

      <!-- Step 3 -->
      <div class="flex-1 bg-[#1a1a2e] rounded p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">3</span>
          <span class="text-[var(--text-small)] text-white font-semibold">Recalibrate</span>
        </div>
        <p class="text-[var(--text-small)] text-gray-300">
          Brief continued training at original context length to recover performance.
        </p>
        <p class="text-[var(--text-small)] text-emerald-400 mt-2 font-mono">~0.5-2% of pretrain</p>
      </div>
    </div>

    <div class="bg-emerald-500/10 border border-emerald-500/30 rounded p-3">
      <p class="text-[var(--text-small)] text-emerald-400 font-semibold mb-2">Result</p>
      <p class="text-[var(--text-small)] text-gray-300">
        Zero-shot context extension: <strong class="text-white">2K → 8K → 32K+</strong> without any long-context fine-tuning.
        The model generalizes to any context length because there are no position-dependent rotations to go out of distribution.
      </p>
    </div>
  </Section>

  <!-- Section 4: Actual Results from Paper -->
  <Section title="Actual Results from Paper">
    <p class="text-[var(--text-small)] text-gray-300 mb-4">
      Real benchmark numbers from the DroPE paper (Table 1 & 2):
    </p>

    <!-- NIAH Results -->
    <div class="bg-[#1a1a2e] rounded p-4 mb-4">
      <p class="text-[var(--text-small)] text-gray-400 mb-3">NIAH (Needle-in-a-Haystack) at 2× context length:</p>
      <div class="overflow-x-auto">
        <table class="w-full text-[var(--text-small)]">
          <thead>
            <tr class="text-gray-400 border-b border-gray-700">
              <th class="text-left py-2 pr-4">Method</th>
              <th class="text-center py-2 px-2">Multi-Query</th>
              <th class="text-center py-2 px-2">Multi-Key</th>
              <th class="text-center py-2 px-2">Multi-Value</th>
            </tr>
          </thead>
          <tbody class="text-gray-300">
            <tr class="border-b border-gray-700/50">
              <td class="py-2 pr-4 text-emerald-400 font-semibold">DroPE</td>
              <td class="text-center px-2 text-emerald-400">28.0%</td>
              <td class="text-center px-2 text-emerald-400">41.6%</td>
              <td class="text-center px-2 text-emerald-400">23.3%</td>
            </tr>
            <tr class="border-b border-gray-700/50">
              <td class="py-2 pr-4">RoPE + YaRN</td>
              <td class="text-center px-2 text-amber-400">17.8%</td>
              <td class="text-center px-2 text-red-400">0.5%</td>
              <td class="text-center px-2 text-amber-400">14.6%</td>
            </tr>
            <tr class="border-b border-gray-700/50">
              <td class="py-2 pr-4">RoPE + NTK</td>
              <td class="text-center px-2 text-amber-400">21.1%</td>
              <td class="text-center px-2 text-amber-400">19.4%</td>
              <td class="text-center px-2 text-amber-400">16.5%</td>
            </tr>
            <tr>
              <td class="py-2 pr-4">NoPE baseline</td>
              <td class="text-center px-2 text-gray-500">9.2%</td>
              <td class="text-center px-2 text-amber-400">36.2%</td>
              <td class="text-center px-2 text-amber-400">21.4%</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-[var(--text-small)] text-gray-500 mt-2">Source: DroPE paper Table 1</p>
    </div>

    <!-- LongBench Results -->
    <div class="grid md:grid-cols-2 gap-4 mb-4">
      <div class="bg-[#1a1a2e] border border-emerald-500/30 rounded p-4">
        <p class="text-[var(--text-small)] text-emerald-400 font-semibold mb-3">SmolLM LongBench Average</p>
        <div class="space-y-2 text-[var(--text-small)]">
          <div class="flex justify-between">
            <span class="text-emerald-400">DroPE:</span>
            <span class="text-white font-mono">30.52</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">YaRN:</span>
            <span class="text-gray-300 font-mono">19.94</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">NTK:</span>
            <span class="text-gray-300 font-mono">17.11</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Base:</span>
            <span class="text-red-400 font-mono">2.98</span>
          </div>
        </div>
      </div>

      <div class="bg-[#1a1a2e] border border-emerald-500/30 rounded p-4">
        <p class="text-[var(--text-small)] text-emerald-400 font-semibold mb-3">Llama2-7B LongBench Average</p>
        <div class="space-y-2 text-[var(--text-small)]">
          <div class="flex justify-between">
            <span class="text-emerald-400">DroPE:</span>
            <span class="text-white font-mono">26.08</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">YaRN:</span>
            <span class="text-gray-300 font-mono">19.14</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">NTK:</span>
            <span class="text-gray-300 font-mono">21.88</span>
          </div>
        </div>
        <p class="text-[var(--text-small)] text-gray-500 mt-2">Source: DroPE paper Table 3</p>
      </div>
    </div>

    <!-- Recalibration efficiency -->
    <div class="bg-emerald-500/10 border border-emerald-500/30 rounded p-3">
      <p class="text-[var(--text-small)] text-emerald-400 font-semibold mb-2">Recalibration Efficiency</p>
      <p class="text-[var(--text-small)] text-gray-300">
        DroPE recovers <strong class="text-white">95% of performance</strong> with less than
        <strong class="text-white">0.8%</strong> of the original training budget.
        Full recovery achieved with 30B-120B additional tokens.
      </p>
    </div>
  </Section>

  <!-- Section 5: The Perplexity Trap (Revisited) -->
  <Section title="The Perplexity Trap (Revisited)">
    <p class="text-[var(--text-small)] text-gray-300 mb-4">
      A key finding from the DroPE paper: <strong class="text-white">perplexity can lie</strong>.
      Methods that maintain good perplexity may still fail on actual tasks.
    </p>

    <div class="bg-[#1a1a2e] rounded p-4 mb-4">
      <div class="overflow-x-auto">
        <table class="w-full text-[var(--text-small)]">
          <thead>
            <tr class="text-gray-400 border-b border-gray-700">
              <th class="text-left py-2 pr-4">Method @ 2x context</th>
              <th class="text-center py-2 px-4">Perplexity</th>
              <th class="text-center py-2 px-4">NIAH Success</th>
              <th class="text-left py-2 pl-4">What happened?</th>
            </tr>
          </thead>
          <tbody class="text-gray-300">
            <tr class="border-b border-gray-700/50">
              <td class="py-3 pr-4">RoPE (no scaling)</td>
              <td class="text-center px-4 text-red-400">8.0+</td>
              <td class="text-center px-4 text-red-400">~0%</td>
              <td class="pl-4 text-gray-500">Breaks completely</td>
            </tr>
            <tr class="border-b border-gray-700/50">
              <td class="py-3 pr-4">YaRN</td>
              <td class="text-center px-4 text-green-400">~3.0</td>
              <td class="text-center px-4 text-amber-400">~20%</td>
              <td class="pl-4 text-gray-500">Good perplexity, corrupted semantics</td>
            </tr>
            <tr>
              <td class="py-3 pr-4 text-emerald-400 font-semibold">DroPE</td>
              <td class="text-center px-4 text-green-400">~3.2</td>
              <td class="text-center px-4 text-green-400">~40%</td>
              <td class="pl-4 text-emerald-400">Semantics preserved</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="bg-amber-500/10 border border-amber-500/30 rounded p-3">
      <p class="text-[var(--text-small)] text-amber-400 font-semibold mb-2">Lesson</p>
      <p class="text-[var(--text-small)] text-gray-300">
        Don't trust perplexity alone for long-context evaluation.
        <strong class="text-white">Always test on downstream tasks</strong> like retrieval (Needle-in-a-Haystack).
      </p>
    </div>
  </Section>

  <!-- Section 6: Counter-Intuitive Findings -->
  <Section title="Surprising Findings">
    <div class="grid md:grid-cols-2 gap-4">
      <div class="bg-[#1a1a2e] border border-purple-500/30 rounded p-4">
        <p class="text-[var(--text-small)] text-purple-400 font-semibold mb-2">Can't train without PE from scratch</p>
        <p class="text-[var(--text-small)] text-gray-300">
          Models trained <strong class="text-white">without any PE</strong> from the start perform
          <strong class="text-red-400">worse</strong> than DroPE. The PE scaffold is crucial during training,
          even though it's removable after.
        </p>
      </div>

      <div class="bg-[#1a1a2e] border border-cyan-500/30 rounded p-4">
        <p class="text-[var(--text-small)] text-cyan-400 font-semibold mb-2">Minimal recalibration needed</p>
        <p class="text-[var(--text-small)] text-gray-300">
          Just <strong class="text-white">2K tokens</strong> (0.0125% of 16B pretraining) recovers 95%+ performance.
          Position information is deeply encoded in the weights — very little adjustment needed.
        </p>
      </div>

      <div class="bg-[#1a1a2e] border border-amber-500/30 rounded p-4">
        <p class="text-[var(--text-small)] text-amber-400 font-semibold mb-2">Gradient analysis reveals why</p>
        <p class="text-[var(--text-small)] text-gray-300">
          RoPE heads show <strong class="text-white">dramatically higher gradient norms</strong> at initialization.
          The rotations break attention uniformity, enabling faster positional learning.
        </p>
      </div>

      <div class="bg-[#1a1a2e] border border-emerald-500/30 rounded p-4">
        <p class="text-[var(--text-small)] text-emerald-400 font-semibold mb-2">Scales to 7B+</p>
        <p class="text-[var(--text-small)] text-gray-300">
          The method works across <strong class="text-white">model scales up to 7B parameters</strong>
          and trillion-token datasets. Not just a small-model phenomenon.
        </p>
      </div>
    </div>
  </Section>

  <!-- Summary -->
  <Section title="Summary">
    <div class="grid md:grid-cols-2 gap-4">
      <!-- The evolution -->
      <div class="bg-[#1a1a2e] rounded p-4">
        <p class="text-[var(--text-small)] text-emerald-400 font-semibold mb-3">The Evolution of Context Extension</p>
        <div class="space-y-2 text-[var(--text-small)]">
          <div class="flex gap-2 items-start">
            <span class="text-orange-400 shrink-0">RoPE:</span>
            <span class="text-gray-400">"Encode position with rotation"</span>
          </div>
          <div class="flex gap-2 items-start">
            <span class="text-amber-400 shrink-0">YaRN:</span>
            <span class="text-gray-400">"Scale the rotations cleverly"</span>
          </div>
          <div class="flex gap-2 items-start">
            <span class="text-emerald-400 shrink-0">DroPE:</span>
            <span class="text-white">"Just remove them entirely"</span>
          </div>
        </div>
      </div>

      <!-- Key takeaways -->
      <div class="bg-[#1a1a2e] rounded p-4">
        <p class="text-[var(--text-small)] text-emerald-400 font-semibold mb-3">Key Takeaways</p>
        <ul class="space-y-2 text-[var(--text-small)] text-gray-300">
          <li class="flex gap-2">
            <span class="text-emerald-400">1.</span>
            <span><strong class="text-white">PE is scaffolding</strong> — useful for training, removable after</span>
          </li>
          <li class="flex gap-2">
            <span class="text-emerald-400">2.</span>
            <span><strong class="text-white">Scaling corrupts semantics</strong> — there's no free lunch with frequency compression</span>
          </li>
          <li class="flex gap-2">
            <span class="text-emerald-400">3.</span>
            <span><strong class="text-white">Dropping works</strong> — 0.5% recalibration → unlimited context</span>
          </li>
          <li class="flex gap-2">
            <span class="text-emerald-400">4.</span>
            <span><strong class="text-white">Perplexity lies</strong> — always test on downstream tasks</span>
          </li>
          <li class="flex gap-2">
            <span class="text-emerald-400">5.</span>
            <span><strong class="text-white">Simple beats clever</strong> — sometimes the best solution is removal, not refinement</span>
          </li>
        </ul>
      </div>
    </div>
  </Section>
</div>
