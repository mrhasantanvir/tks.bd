---
name: Agro-Premium Aesthetic
colors:
  surface: '#f9faf2'
  surface-dim: '#d9dbd3'
  surface-bright: '#f9faf2'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4ed'
  surface-container: '#edefe7'
  surface-container-high: '#e7e9e1'
  surface-container-highest: '#e2e3dc'
  on-surface: '#191c18'
  on-surface-variant: '#42493e'
  inverse-surface: '#2e312c'
  inverse-on-surface: '#f0f1ea'
  outline: '#72796e'
  outline-variant: '#c2c9bb'
  surface-tint: '#3b6934'
  primary: '#154212'
  on-primary: '#ffffff'
  primary-container: '#2d5a27'
  on-primary-container: '#9dd090'
  inverse-primary: '#a1d494'
  secondary: '#7e5700'
  on-secondary: '#ffffff'
  secondary-container: '#feb300'
  on-secondary-container: '#6a4800'
  tertiary: '#333b35'
  on-tertiary: '#ffffff'
  tertiary-container: '#4a524b'
  on-tertiary-container: '#bdc5bc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bcf0ae'
  primary-fixed-dim: '#a1d494'
  on-primary-fixed: '#002201'
  on-primary-fixed-variant: '#23501e'
  secondary-fixed: '#ffdeac'
  secondary-fixed-dim: '#ffba38'
  on-secondary-fixed: '#281900'
  on-secondary-fixed-variant: '#604100'
  tertiary-fixed: '#dde5dc'
  tertiary-fixed-dim: '#c1c9c0'
  on-tertiary-fixed: '#161d18'
  on-tertiary-fixed-variant: '#414942'
  background: '#f9faf2'
  on-background: '#191c18'
  surface-variant: '#e2e3dc'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin: 32px
---

## Brand & Style

The design system is rooted in the concept of "Curated Earth." It targets a discerning audience that values transparency, sustainability, and the premium quality of farm-to-table produce. The visual narrative balances the raw, tactile nature of agriculture with the sophisticated precision of high-end e-commerce.

The style is **Modern Minimalism with Organic Accents**. It utilizes generous whitespace and a restricted color palette to convey a sense of calm and professional reliability. Unlike standard grocery platforms, this design system treats produce as high-value items, using editorial-style layouts and smooth transitions to evoke an emotional response of freshness and health.

## Colors

The palette is anchored by **Forest Green**, used intentionally to represent vitality and the brand's deep roots in nature. **Mango Orange** serves as the energetic counterpoint, reserved strictly for seasonal highlights, promotional urgency, and primary action triggers.

**Off-White** provides a soft, low-contrast canvas that reduces eye strain compared to pure white, enhancing the "organic" feel. A deep, green-tinted neutral is used for typography to maintain a softer, more premium look than pure black. The tertiary light green is used for subtle container backgrounds and soft UI states.

## Typography

This design system utilizes **Inter** for its exceptional legibility and systematic precision. Headlines use a tighter letter-spacing and heavier weight to create a grounded, authoritative presence. 

Body text is optimized for readability with a generous line-height, ensuring that descriptions of produce and farming practices feel accessible and inviting. Labels and metadata use increased tracking and uppercase styling where appropriate to create a clear informational hierarchy.

## Layout & Spacing

The layout follows a **Fixed Grid** model for desktop (1280px max-width) and a fluid 4-column model for mobile. It employs a 12-column grid with 24px gutters to allow for diverse content arrangements, from dense product listings to spacious editorial features.

Spacing follows an 8px rhythmic scale. The design system prioritizes "vertical breathing room"—using larger gaps (LG and XL) between sections to separate "The Harvest" from "The Story," reinforcing the premium positioning.

## Elevation & Depth

To maintain an organic feel, depth is created through **Tonal Layering** and **Ambient Shadows** rather than harsh outlines.

- **Soft Depth:** Elements like cards and modals use a very soft, multi-layered shadow with a subtle Forest Green tint (e.g., `rgba(45, 90, 39, 0.08)`) to make them feel integrated with the natural theme.
- **Surface Tiers:** High-priority content sits on pure white containers over the Off-White background, creating a natural hierarchy without visual clutter.
- **Subtle Glassmorphism:** For navigation bars and mobile headers, a high-blur backdrop effect is used to maintain context while keeping the interface feeling lightweight and modern.

## Shapes

The shape language is primarily **Rounded (Level 2)**, featuring 8px to 24px corner radii. This softens the UI and makes it feel more approachable and "human."

To enhance the organic theme, specific elements like image containers or call-to-action sections should occasionally use **Asymmetric Radii** (e.g., 40px 12px 40px 12px) to mimic the irregular shapes found in nature. Buttons use a consistent 8px radius for a professional, "high-end" tool feel.

## Components

### Buttons
- **Primary:** Forest Green fill with White text. Sharp, professional, used for "Add to Cart" or "Checkout."
- **Secondary:** Transparent with Forest Green border. Used for "View Details" or "Farmer Info."
- **Seasonal Action:** Mango Orange fill. Reserved for "Buy Seasonal" or "Flash Sale."

### Cards
Product cards feature a "Full-Bleed" image top with a subtle 1px border (`#E8F0E7`). Typography inside cards is left-aligned to maintain a clean, organized look.

### Specialized Badges
- **Pre-order:** A Mango Orange outline badge with a transparent center. This signals exclusivity and anticipation without overwhelming the product image.
- **Harvesting Soon:** A soft Tertiary Green fill with Forest Green text. This evokes a sense of "growth" and freshness. Use a small leaf icon prefix for added visual cues.

### Inputs & Selection
Forms use a soft-grey background with a Forest Green 2px border on focus. Radio buttons and checkboxes utilize the primary green when selected to reinforce trust.

### High-Quality Imagery
All imagery must feature natural lighting, macro-photography of produce, or wide-angle shots of clean gardens. Backgrounds should be minimal to keep the focus on the freshness of the item.