---
name: Ecological Intelligence System
colors:
  surface: '#f4fcf0'
  surface-dim: '#d5dcd1'
  surface-bright: '#f4fcf0'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff6ea'
  surface-container: '#e9f0e5'
  surface-container-high: '#e3eadf'
  surface-container-highest: '#dde5d9'
  on-surface: '#171d16'
  on-surface-variant: '#3e4a3d'
  inverse-surface: '#2b322b'
  inverse-on-surface: '#ecf3e7'
  outline: '#6e7b6c'
  outline-variant: '#bdcaba'
  surface-tint: '#006e2d'
  primary: '#006b2c'
  on-primary: '#ffffff'
  primary-container: '#00873a'
  on-primary-container: '#f7fff2'
  inverse-primary: '#62df7d'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#825100'
  on-tertiary: '#ffffff'
  tertiary-container: '#a36700'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#7ffc97'
  primary-fixed-dim: '#62df7d'
  on-primary-fixed: '#002109'
  on-primary-fixed-variant: '#005320'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f4fcf0'
  on-background: '#171d16'
  surface-variant: '#dde5d9'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  table-text:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 24px
  margin-desktop: 40px
  container-max: 1440px
---

## Brand & Style
The design system is engineered for high-stakes ESG (Environmental, Social, and Governance) data analysis, blending the rigorous structural integrity of enterprise ERPs with the fluid, modern aesthetic of high-end SaaS. It targets sustainability officers and corporate executives who require institutional-grade reliability paired with intuitive data visualization.

The style is **Corporate Modern** with subtle **Glassmorphism** accents. It prioritizes clarity, utilizing generous whitespace to reduce cognitive load while managing complex datasets. The emotional response is one of "Verified Progress"—professional, calm, and technologically advanced. The aesthetic borrows the clean, modular efficiency of Odoo Enterprise but elevates it with softer depth and refined transitions.

## Colors
The palette is rooted in a "Trust Hierarchy." **Primary Green** represents sustainability and environmental health, used for positive trends and ecological metrics. **Primary Blue** is the anchor for navigation and governance, evoking blockchain-backed security and institutional trust.

Functional colors—**Warning Amber** and **Danger Red**—are used sparingly for social impact alerts and critical risk factors. The background is a crisp Slate-tinted white to reduce eye strain during long sessions, while surfaces remain pure white to provide maximum contrast for data layers.

## Typography
This design system utilizes **Inter** exclusively to ensure a systematic, utilitarian feel across all data densities. 

- **Headings:** Large and bold to provide clear entry points into complex dashboards.
- **Section Titles:** Medium weights that anchor card-based layouts.
- **Data Tables:** A dedicated "table-text" size (13px) allows for high-density information display without sacrificing legibility.
- **Labels:** Uppercase labels with slight tracking are used for secondary metadata and table headers to distinguish them from actionable content.

## Layout & Spacing
The system follows a **desktop-first, fluid grid** philosophy. A 12-column grid is used for the main dashboard content, with a fixed side navigation (240px). 

- **Gutter & Margins:** A generous 24px gutter ensures that complex data charts do not feel crowded. 
- **Rhythm:** Spacing follows a 4px baseline. Components primarily use 16px (md) and 24px (lg) increments for internal padding to maintain the "premium SaaS" feel.
- **Responsibility:** On tablet, the sidebar collapses into a rail or hamburger menu. On mobile, the 12-column grid reflows to a single column with 16px side margins.

## Elevation & Depth
Depth is created through a combination of **Tonal Layers** and **Ambient Shadows**.

1.  **Level 0 (Background):** #F8FAFC. The lowest layer.
2.  **Level 1 (Cards/Surface):** #FFFFFF. These use a "Soft Ambient" shadow: `0px 4px 20px rgba(15, 23, 42, 0.05)`. This creates a subtle lift without appearing heavy.
3.  **Level 2 (Modals/Dropdowns):** These use a more pronounced shadow and a 60% backdrop blur (Glassmorphism) when appearing over map or chart data to maintain context.
4.  **Outlines:** All cards and inputs feature a subtle 1px border in `#E2E8F0` to define boundaries in high-light environments.

## Shapes
The shape language is sophisticated and approachable.
- **Standard Cards:** 12px (`rounded-lg`) is the primary radius for all container elements, creating a soft, professional look.
- **Small Components:** Buttons and input fields use 8px (`rounded-md`) to maintain a sense of precision.
- **Visual Accents:** Data pill indicators (status tags) use fully rounded (pill-shaped) geometry to contrast against the structured grid of the ERP.

## Components
- **Buttons:** Primary buttons use a solid fill of Green or Blue with white text. Secondary buttons use a white fill with a 1px Slate border and Slate text.
- **Input Fields:** Use a 1px `#E2E8F0` border, 8px radius, and 14px text. Focus states use a 2px Primary Blue ring with 20% opacity.
- **Cards:** White background, 12px radius, and the standard ambient shadow. Headers within cards should have a subtle bottom border.
- **Chips/Badges:** Small, pill-shaped tags with low-saturation backgrounds (e.g., 10% opacity of the status color) and high-saturation text for readability.
- **Data Tables:** Minimalist style. No vertical lines; only subtle horizontal dividers. The header row uses the `label-caps` typography style with a light gray background.
- **Trust Indicators:** Small blockchain "verified" badges (using Primary Blue) appear next to critical data points to signify immutable records.