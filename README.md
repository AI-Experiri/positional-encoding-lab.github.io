# PositionalEncodingLab

An interactive visualization application that demonstrates positional encoding methods in transformer neural networks. Chronicles the evolution from the original 2017 Sinusoidal encoding through 2023's NoPE, showing why each innovation was created and how they work mathematically and visually.

## Features

- **7 Positional Encoding Methods**: Sinusoidal, Relative PE, Transformer-XL, T5, RoPE, ALiBi, NoPE
- **Interactive Visualizations**: Clock hand animations, heatmaps, attention flow diagrams
- **Mathematical Explanations**: LaTeX-rendered equations with step-by-step derivations
- **Educational Content**: Intuitive explanations alongside formal mathematics

## Tech Stack

- **Framework**: SvelteKit 2 with Svelte 5 (runes)
- **Styling**: Tailwind CSS with custom dark theme
- **Graphics**: SVG.js for attention flow diagrams
- **Math**: MathJax 3 for equation rendering

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dev server runs at `http://localhost:5173`.

## Project Structure

```
src/
├── routes/
│   └── +page.svelte              # Main page with tab navigation
├── lib/
│   ├── components/
│   │   ├── Sinusoidal.svelte     # Original 2017 method
│   │   ├── RelativePE.svelte     # Shaw et al., 2018
│   │   ├── TransformerXL.svelte  # Dai et al., 2019
│   │   ├── T5.svelte             # Raffel et al., 2020
│   │   ├── RoPE.svelte           # Su et al., 2021
│   │   ├── ALiBi.svelte          # Press et al., 2022
│   │   ├── NoPE.svelte           # Kazemnejad et al., 2023
│   │   └── layouts/              # Reusable layout components
│   └── utils/
│       ├── positionalEncoding.js # PE calculation utilities
│       └── attentionSVGs.js      # SVG drawing helpers
└── app.css                       # Global styles
```

## Covered Methods

| Method         | Year | Paper             | Key Innovation                                  |
| -------------- | ---- | ----------------- | ----------------------------------------------- |
| Sinusoidal     | 2017 | Vaswani et al.    | Fixed sin/cos patterns at different frequencies |
| Relative PE    | 2018 | Shaw et al.       | Attention based on relative position            |
| Transformer-XL | 2019 | Dai et al.        | Relative PE with segment recurrence             |
| T5             | 2020 | Raffel et al.     | Bucketed relative PE, shared across layers      |
| RoPE           | 2021 | Su et al.         | Rotation matrices applied to embeddings         |
| ALiBi          | 2022 | Press et al.      | Linear distance bias, no learned parameters     |
| NoPE           | 2023 | Kazemnejad et al. | Architecture modifications instead of PE        |

## Development

```bash
# Run code quality checks (lint + unused code detection)
npm run code-quality

# Run tests
npm run test

# Format code
npm run format
```

## License

MIT
