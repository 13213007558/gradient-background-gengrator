# Gradient Background Generator

A powerful Next.js application for creating stunning SVG gradient backgrounds with real-time preview, interactive color wheel, and AI-powered color recommendations based on color theory.

## Features

- **Real-time Preview**: See your gradient backgrounds update instantly as you modify colors
- **Interactive Color Wheel**: Visual color selection with drag-and-drop interface
- **Dual Selection Modes**:
  - **Free Selection Mode**: Manually choose any two colors on the color wheel
  - **Recommendation Mode**: AI-powered color recommendations based on color theory
- **Color Theory Algorithms**: 7 different harmony types including complementary, analogous, triadic, split-complementary, tetradic, square, and monochromatic
- **Custom Color Palettes**: Add up to 8 colors to create unique gradients
- **Preset Templates**: Choose from professionally designed color combinations
- **API Integration**: Generate gradients programmatically via REST API
- **SVG Export**: Download your creations as high-quality SVG files
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Color Wheel Features

### Free Selection Mode
- Drag the large dot (primary color) and small dot (secondary color) on the color wheel
- Real-time position-to-color conversion using HSL color space
- Visual feedback with color previews

### Recommendation Mode
Select from 7 color harmony algorithms:

| Harmony Type | Description | Use Case |
|-------------|-------------|----------|
| **Complementary** | Colors opposite on the color wheel (180° apart) | High contrast, visual impact |
| **Analogous** | Colors adjacent on the color wheel (±30°) | Harmonious, natural feel |
| **Triadic** | Three colors equally spaced (120° apart) | Balanced, vibrant |
| **Split Complementary** | Base color + two adjacent to its complement | Strong contrast, softer than complementary |
| **Tetradic** | Four colors in a rectangle shape | Rich, complex designs |
| **Square** | Four colors equally spaced (90° apart) | Balanced, modern feel |
| **Monochromatic** | Variations of the same hue | Clean, elegant, minimalist |

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing

### Run Color Algorithm Tests

Visit the test page in your browser:
```
http://localhost:3000/test
```

This page provides:
- **Unit Tests**: 14 automated tests for color conversion and harmony algorithms
- **Visual Demo**: Interactive demonstration of all 7 color harmony types
- **Real-time Preview**: Test different base colors and see recommended combinations

### Test Coverage

The test suite validates:
- ✅ Hex ↔ HSL color space conversions
- ✅ Round-trip conversion accuracy
- ✅ All 7 color harmony algorithms
- ✅ Contrast ratio calculations
- ✅ Edge cases and boundary conditions

## Preview

Preview the application locally on the Cloudflare runtime:

```bash
npm run preview
```

## Deploy

Deploy the application to Cloudflare:

```bash
npm run deploy
```

## Custom Domain

The deployed application is available at:

**gbg.nuclearrockstone.xyz**

Configure your DNS and Cloudflare settings accordingly (add the appropriate CNAME/A records and route the domain to your Cloudflare deployment).

## API Usage

Generate gradients programmatically using the REST API:

```
GET https://gbg.nuclearrockstone.xyz/api?colors=hex_FF0000&colors=hex_00FF00&width=800&height=600
```

### Parameters:
- `colors`: Hex colors with `hex_` prefix (e.g., `hex_FF0000` for red)
- `width`: Image width in pixels (100-2000)
- `height`: Image height in pixels (100-2000)

### Example Response:
Returns an SVG image with the specified gradient.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── route.ts          # API endpoint for gradient generation
│   ├── test/
│   │   └── page.tsx          # Test page for color algorithms
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              # Main application page
├── components/
│   ├── ColorWheel.tsx        # Interactive color wheel component
│   └── ui/                   # UI components (Button, Card, Input)
├── hooks/
│   └── useGradientGenerator.tsx  # Gradient generation hook
├── lib/
│   ├── services/
│   │   ├── gradientGenerator.ts   # SVG gradient generation
│   │   └── colorRecommendation.ts # Color theory algorithms
│   ├── constants.ts
│   └── utils.ts
```

## Color Theory Implementation

The color recommendation system is based on established color theory principles:

### Algorithms

1. **HSL Color Space**: All calculations use HSL (Hue, Saturation, Lightness) for intuitive color manipulation
2. **Hue Rotation**: Harmony calculations rotate around the color wheel by specific angles
3. **Contrast Calculation**: WCAG-compliant luminance-based contrast ratios

### Key Functions

```typescript
// Get complementary color (180° opposite)
getComplementaryColor('#FF0000') // → '#00FFFF'

// Get analogous colors (±30°)
getAnalogousColors('#FF0000') // → ['#FF8000', '#FF0080']

// Get triadic colors (120° spacing)
getTriadicColors('#FF0000') // → ['#00FF00', '#0000FF']

// Get all recommendations
getAllRecommendations('#FF0000') // → Array of 7 harmony recommendations
```

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Runtime**: Cloudflare Workers
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **Language**: TypeScript

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Changelog

### v2.0.0 - Color Wheel Update
- ✨ Added interactive color wheel component
- ✨ Added dual selection modes (Free & Recommendation)
- ✨ Implemented 7 color harmony algorithms
- ✨ Added test page with visual demos
- ✨ Enhanced color synchronization between wheel and list
- 🎨 Improved UI with collapsible sections
