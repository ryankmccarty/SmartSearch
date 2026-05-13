# Endeavor Health — Design System & Style Guide

This document describes the visual design language of endeavorhealth.org. Use it to style new UI components—such as the homepage AI search tool—so they feel native to the Endeavor Health brand.

---

## Brand Overview

Endeavor Health is a large Chicago-area health system. Its visual identity is clean, modern, and trustworthy. The brand balances an authoritative dark navy with a vibrant electric blue CTA color and a warm golden yellow accent. Illustration and photography coexist, and the typography pairs a contemporary grotesque with a refined serif for expressive moments.

---

## Color Palette

### Primary Colors

| Role | Name | Hex / RGB |
|---|---|---|
| Brand Blue (primary CTA) | Endeavor Blue | `#235FF8` / `rgb(35, 95, 248)` |
| Dark Navy (header, dark surfaces) | Endeavor Navy | `#0E245B` / `rgb(14, 36, 91)` |
| Golden Yellow (secondary CTA, icon fills, accents) | Endeavor Gold | `#FFCF30` / `rgb(255, 207, 48)` |

### Secondary / Surface Colors

| Role | Name | Hex / RGB |
|---|---|---|
| Page background / white | White | `#FFFFFF` |
| Light blue background (map section, tinted modules) | Ice Blue | `#E1F5FC` / `rgb(225, 245, 252)` |
| Soft blue surface (tab panels, expandable cards) | Lavender Mist | `#F3F7FF` / `rgb(243, 247, 255)` |
| Search overlay / secondary nav tint | Periwinkle Tint | `#EAF0FE` / `rgb(234, 240, 254)` |
| Nav mega-menu background | Blue Fog | `#D3DFFE` / `rgb(211, 223, 254)` |
| Active/hover CTA blue | Active Blue | `#144CDC` / `rgb(20, 76, 220)` |
| Lighter gold (tag/badge backgrounds) | Pale Gold | `#FFE697` / `rgb(255, 230, 151)` |

### Semantic / Functional Colors

| Role | Hex / RGB |
|---|---|
| Body text (default) | `#000000` |
| Muted body text | `#555555` / `rgb(85, 85, 85)` |
| Link inline | `#235FF8` (same as Brand Blue) |
| Error / alert | `#CE3D0D` / `rgb(206, 61, 13)` |
| Success / green | `#008006` / `rgb(0, 128, 6)` |
| White text (on dark/photo backgrounds) | `#FFFFFF` |

### Color Usage Notes

- **Dark navy** (`#0E245B`) is used for the global utility navigation bar, article/story cards on dark backgrounds, and the careers accordion.
- **Brand blue** (`#235FF8`) is the default CTA button background, the circular search icon button, the navigation overlay, and inline link color.
- **Gold yellow** (`#FFCF30`) is used for secondary/ghost CTA pill buttons (e.g., "Explore all locations"), circular icon backgrounds on hero quick-link cards, and article category tags/pills.
- **White** cards float on photo backgrounds with a subtle navy-tinted shadow.
- **Light blue surfaces** (`#E1F5FC`) are used for map sections and lightly tinted background modules.
- **Lavender Mist** (`#F3F7FF`) is used for expandable card containers and the careers accordion expanded area.

---

## Typography

### Font Families

| Name | Style | Usage |
|---|---|---|
| **ES Klarheit Grotesk** | Sans-serif | Primary typeface — all body copy, headings (h1, h2), labels, buttons, navigation |
| **Spectral** | Serif | Secondary / expressive typeface — h3 accent headings, sub-section headings that need warmth |

Both fonts are loaded from the site's own CDN. Fallback: `sans-serif` for Klarheit, `serif` for Spectral.

### Type Scale

| Element | Font | Size (px) | Weight | Line Height | Notes |
|---|---|---|---|---|---|
| H1 | ES Klarheit Grotesk | 53.6px (~3.35rem) | 400 (Regular) | 64.3px (~1.2×) | Hero headline; mixed with `<em>` italic for emphasis |
| H2 | ES Klarheit Grotesk | 44.6px (~2.79rem) | 400 (Regular) | 53.5px (~1.2×) | Section titles |
| H3 | Spectral | 26px (~1.625rem) | 400 (Regular) | 31px (~1.2×) | Sub-section headings; letter-spacing: –1px |
| Body Large | ES Klarheit Grotesk | 22px (1.375rem) | 400 | 35.2px (1.6×) | Lead paragraph / introductory text |
| Body Default | ES Klarheit Grotesk | 17px (1.0625rem) | 400 | ~27px (1.6×) | General body copy, navigation links |
| Body Small | ES Klarheit Grotesk | 14.93px (~0.93rem) | 700 (Bold) | auto | Card labels, icon-link labels |
| Caption / Label | ES Klarheit Grotesk | 12px (0.75rem) | 700 (Bold) | auto | Article tags/badges, small metadata |
| Overline / Eyebrow | ES Klarheit Grotesk | 16px (1rem) | 700 (Bold) | auto | `text-transform: uppercase; letter-spacing: 1px` — used for section category labels like "CAREER OPPORTUNITIES", "PATIENT STORY", "VIDEO" |
| Button / CTA | ES Klarheit Grotesk | 17px (1.0625rem) | 700 (Bold) | auto | Pill button labels |
| Navigation Link | ES Klarheit Grotesk | 17px (1.0625rem) | 400–700 | auto | Main nav items |

### Italic / Emphasis

The hero headline uses a mixed-weight italic within a regular-weight heading. Wrap key phrases in `<em>` tags styled as italic, same font family (ES Klarheit Grotesk italic). This creates the brand's signature "conversational emphasis" look — e.g., *"Your **best health** is our endeavor."*

---

## Spacing & Layout

### Base Spacing Unit

The site uses a `25px` base spacing unit with multiples:

| Token | Value |
|---|---|
| `--global-spacing-xs` | 12.5px (half unit) |
| `--global-spacing` | 25px (1 unit) |
| `--gap-spacing-xs` | 20px |
| `--global-spacing-md` | 50px (2 units) |
| `--global-spacing-lg` | 75px (3 units) |
| `--global-spacing-xl` | 100px (4 units) |
| `--global-spacing-between-modules` | 80px |

### Container & Grid

- Max content width: ~1440px with comfortable horizontal padding (~25–50px on sides)
- Main content column: fluid, typically 65–75% on left, supporting panel on right
- Cards and tiles use a 4-column horizontal grid on desktop, collapsing to 1–2 on mobile

### Border Radius

| Use | Value |
|---|---|
| CTA pill buttons | `30px` (very rounded, pill shape) |
| White quick-action cards (hero) | `8px` |
| Search icon button | `50%` (circle) |
| Article tag/badge pills | `100px` (fully pill) |
| Input fields | `100px` (pill/rounded) |
| Image cards (specialty grid) | `8–12px` |
| Circular icon container (gold) | `50%` |

---

## Components

### 1. CTA Buttons

Two primary button variants exist:

**Primary (Blue Pill)**
- Background: `#235FF8`
- Text: `#FFFFFF`
- Font: ES Klarheit Grotesk, 17px, bold (700)
- Border-radius: `30px`
- Padding: `16px 35px`
- Hover: `#144CDC` (slightly darker blue)
- Example: "Explore all specialties", "Introducing Endeavor Health"

**Secondary (Gold Pill)**
- Background: `#FFCF30`
- Text: `#0E245B` (dark navy)
- Font: ES Klarheit Grotesk, 17px, bold (700)
- Border-radius: `30px`
- Padding: `16px 35px`
- Example: "Explore all locations", "Sign up"

**Tertiary (Inline Link with Arrow)**
- Background: none / transparent
- Text: `#235FF8`
- Font: ES Klarheit Grotesk, 17px
- Accompanied by a right-facing `›` or `→` chevron/arrow icon
- Used for "Start your search ›", "Browse 2026 CIF partners"

**Circular Icon Button (Search)**
- Background: `#235FF8`
- Icon: white search magnifier SVG
- Size: 55×55px circle
- Border: `2px solid #FFFFFF`

### 2. Quick-Action Hero Cards

Floating white cards that appear over the hero photo background.

- Background: `#FFFFFF`
- Border-radius: `8px`
- Box-shadow: `rgba(14, 36, 91, 0.15) 0px 4px 20px 0px`
- Padding: `20px 10px`
- Content: circular gold icon (40–50px) + bold label text below
- Text: ES Klarheit Grotesk, ~15px, bold (700), `#000000`
- Icon background: `#FFCF30`, circle `50%`
- Icon color: `#0E245B` (navy)
- Arranged in a 4-column row

### 3. Search Input

- Background: `#FFFFFF` (or very light `rgba` tint on dark backgrounds)
- Border: subtle (1px) light grey or transparent — relies on shadow
- Border-radius: `100px` (pill)
- Padding: `0 100px 0 25px` (extra right padding for submit button)
- Font: ES Klarheit Grotesk, 17px
- Placeholder color: `rgb(128, 128, 128)` (muted grey)
- Submit button: circular, same style as the circular icon button (blue or gold)

**Popular Searches chips / pills** (shown below search bar):
- Background: `#FFFFFF` or `#F3F7FF`
- Border: `1px solid rgba(14, 36, 91, 0.15)` (light navy tint)
- Border-radius: `100px` (fully pill)
- Text: ES Klarheit Grotesk, 15px, regular (400), `#000000`
- Padding: `8px 16px`

### 4. Article / Story Cards

**Light card (on white background)**
- Background: `#FFFFFF`
- Border-radius: `8px`
- Box-shadow: subtle `rgba(14, 36, 91, 0.1) 0px 2px 10px`
- Contains: thumbnail image, eyebrow tag (gold), title (H3 or bold body), category tags

**Dark card (navy background)**
- Background: `#0E245B`
- Text: `#FFFFFF`
- Border-radius: `8px`
- Contains: eyebrow overline (uppercase, bold, white), H3 title in Spectral white, tag pills (gold), description text

### 5. Article Category Tags / Badges

- Background: `#FFCF30`
- Text: `#0E245B`
- Font: ES Klarheit Grotesk, 12px, bold (700)
- Border-radius: `100px`
- Padding: `4px 10px`
- Used for content labels: "Expert care", "Neurosciences", "Community impact"

### 6. Overline / Section Eyebrow Labels

- Font: ES Klarheit Grotesk, 16px, bold (700)
- `text-transform: uppercase`
- `letter-spacing: 1px`
- Color: `#000000` on light backgrounds, `#FFFFFF` on dark surfaces
- Used above major section headings to categorize content (e.g., "CAREER OPPORTUNITIES", "VIDEO", "PATIENT STORY")

### 7. Navigation Bar

**Utility Bar (top strip)**
- Background: `#0E245B` (dark navy)
- Text / links: `#FFFFFF`, ES Klarheit Grotesk, 15px
- Contains: Find a doctor, Locations, Careers, Give, Patient portal

**Main Navigation**
- Background: transparent over hero, `#FFFFFF` on scroll (sticky)
- Brand logo: white (on hero) / navy (on scroll)
- Nav links: ES Klarheit Grotesk, 17px, regular
- Active / hover state: `#235FF8`
- Circular search button (blue, 55px)

### 8. Illustrated Modules (CTA Banners)

Full-width blue banner sections (e.g., newsletter signup, "Get health insights"):
- Background: `#235FF8`
- Text: `#FFFFFF`
- Illustrative flat SVG figures on left/right sides (cycling, sitting on bench)
- CTA button: Gold pill (`#FFCF30` / `#0E245B` text)
- Centered headline + subtext layout

### 9. Stats / Data Tiles

Floating white cards displaying large numeric stats.

- Background: `#FFFFFF`
- Border-radius: `8px`
- Box-shadow: soft navy-tinted shadow
- Large number: ES Klarheit Grotesk, ~60–80px, bold
- Label: ES Klarheit Grotesk, 15–17px, regular
- Arrow/link: `#0E245B` with `›` chevron

### 10. Expandable Accordion / Tab Panel

- Collapsed tab background: `#235FF8` (blue) or `#0E245B` (navy)
- Collapsed tab text: `#FFFFFF`
- Collapsed tab icon: gold `+` circle
- Expanded panel background: `#FFFFFF`
- Expanded panel text: `#000000`
- Border-radius: `8px` on the container

### 11. Specialty Image Cards (Grid)

- Aspect ratio: approximately 3:4 (portrait) or square
- Image fills card, with text overlay at bottom-left
- Overlay text: ES Klarheit Grotesk, 22–26px, regular, `#FFFFFF`
- A circular gold `+` expand button in the bottom corner (`#FFCF30`, `#0E245B` icon)
- Border-radius: `8–12px`

---

## Iconography

- Icons are simple, filled or outlined, monochromatic
- On gold circular backgrounds: icon color is `#0E245B` (navy)
- On blue backgrounds: icon color is `#FFFFFF`
- Primary icon set appears to be Font Awesome + custom SVG icons
- Icon sizes: 24–32px within 48–56px circular containers
- Chevron/arrow icons accompany inline links and expandable items

---

## Photography & Illustration Style

**Photography**
- Warm, candid, human-centered clinical and community images
- Subjects: doctors with patients, surgeons, families, diverse community members
- Lighting: bright, warm, natural where possible
- Always has an authentic, real-world feel — not overly staged stock imagery

**Illustration**
- Flat, geometric SVG illustrations
- Limited color palette: navy, blue, gold, coral/orange accents on white/blue fields
- Used for CTAs and empty-state backgrounds (cyclist, couple on bench, wheelchair illustration)
- Characters are diverse, simplified, friendly

---

## Motion & Interaction

- Hero section: auto-advancing image slideshow with pause/play control
- Hover on cards: subtle elevation increase (box-shadow deepens)
- Hover on pill buttons: background darkens slightly
- Tab/accordion transitions: smooth expand/collapse (~0.3s ease)
- Sticky navigation: transitions from transparent to white on scroll with logo color swap
- Video modules: play button overlay (circular, gold/white); video opens inline

---

## Voice & Tone in UI Copy

- Direct, warm, empowering — "Your best health is our endeavor"
- Action-oriented CTAs: "Find the right doctor", "Explore all specialties", "Start your search"
- Mixed case (not all-caps) for CTAs; ALL CAPS reserved for overline/eyebrow labels only
- Short, confident headlines without jargon
- Italicize key emotional phrases within headlines for emphasis (e.g., *best health*)

---

## Design System Summary for MagicPatterns

When recreating the homepage search tool in Endeavor Health's visual style:

1. **Background**: Use `#F3F7FF` (Lavender Mist) or `#FFFFFF` for the search module surface — or a full-bleed `#235FF8` (Brand Blue) for a bold banner variant
2. **Search bar**: White pill input, `100px` border-radius, subtle shadow, ES Klarheit Grotesk placeholder text
3. **Submit button**: Circular (`50%`), `#235FF8` background, white arrow/search icon — OR a gold pill button for secondary context
4. **Popular search chips**: White background, `100px` border-radius, light navy border (`rgba(14,36,91,0.15)`), regular body text
5. **Heading**: ES Klarheit Grotesk, large (~44–54px), regular weight (400), with optional Spectral serif for subheadings
6. **Overline label**: "POPULAR SEARCHES" in 16px bold, `letter-spacing: 1px`, uppercase
7. **Color**: Lead with navy (`#0E245B`) and blue (`#235FF8`); gold (`#FFCF30`) for highlights and secondary actions
8. **Spacing**: Use 25px multiples; generous padding (50–80px) around the search module
9. **Illustration**: Consider a flat SVG illustration element (navy/blue/gold palette) flanking the search area to match site personality