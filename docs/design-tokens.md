# MathCity AI — Design Tokens & Motion Principles

Extracted from Figma File `6RAN0OcHeBGZGdoNgVU33G` (Frames `2:2` - `2:93` & Design System `2:92`).

## 1. Kids Mode Design System (Ages 6–12)

### Colors
- **Background**: `#F6F7FE` (Clean light periwinkle)
- **Primary / Brand Purple**: `#7154EC` (Vibrant purple for primary buttons, highlights, badges)
- **Primary Dark Text**: `#242344` (High contrast navy for primary headings and body)
- **Secondary Muted Text**: `#7B7A98`
- **Card Background**: `#FFFFFF` (Pure white rounded cards with soft elevation)
- **Green Accent / Success**: `#168865` (Correct answers, progress milestones)
- **Error Accent**: `#FF5353` (Incorrect answers, warnings)
- **Gold Coin Palette** (Never stars):
  - Primary Gold: `#FFB800`
  - Light Gold: `#FFE259`
  - Coin Gradient: Linear `[#FFE259, #FFA751]`
  - Coin Rim / Shadow: `#D48B00`
- **Card Shadows**:
  - Soft: `BoxShadow(color: Color(0x0D242344), blurRadius: 20, offset: Offset(0, 8))`
  - Card Border: 1.5px solid `#ECEEFA`

### Typography (Nunito Font Family)
- **Display 1**: 28px / Bold 800 / Line-height 1.2
- **Heading 1**: 24px / Bold 700 / Line-height 1.3
- **Heading 2**: 20px / SemiBold 600 / Line-height 1.3
- **Body Large**: 16px / SemiBold 600 / Line-height 1.4
- **Body Medium**: 14px / Medium 500 / Line-height 1.4
- **Caption / Tag**: 12px / Bold 700 / Line-height 1.2

### Border Radii & Metrics
- Standard Card Radius: `24.0`
- Button Radius: `20.0`
- Pill / Badge Radius: `999.0`
- Grid Gap / Spacing: `16.0` (compact), `24.0` (standard)

---

## 2. Teen Mode Design System (Ages 13–16)

### Colors
- **Background**: `#101526` (Deep space dark navy)
- **Surface / Card Background**: `#151C2D` (Elevated dark container)
- **Secondary Surface**: `#1E273D` (Sub-cards, inputs, table rows)
- **Primary Accent / Lime**: `#C7FA74` (High voltage lime green for actions, highlights)
- **Primary Dark Text on Lime**: `#101526`
- **Primary Text on Dark**: `#FFFFFF`
- **Secondary Text**: `#A5AFC7` (Muted cool slate)
- **Success Accent**: `#4EFA9D`
- **Error Accent**: `#FF6B6B`
- **Accent Purple / Indigo**: `#6C5CE7`

### Typography (Inter & Nunito)
- **Display 1**: 32px / Inter Bold 800 / Line-height 1.15
- **Heading 1**: 24px / Inter Bold 700 / Line-height 1.25
- **Heading 2**: 18px / Inter SemiBold 600 / Line-height 1.3
- **Body / Math Formula**: 15px / Inter Regular 400 / Line-height 1.5
- **Data & Metrics**: Monospace / Inter SemiBold 600

### Border Radii & Metrics
- Standard Card Radius: `16.0`
- Button Radius: `12.0`
- Card Border: 1px solid `Color(0x1FFFFFFF)`

---

## 3. Motion & Animation Principles

- **Micro-interactions (Buttons, Taps)**: `150ms`, Curve: `Curves.easeOutQuad`
- **Card Hover & Scale**: `200ms`, Scale factor `1.03`
- **Page / Screen Transitions**: `250ms`, Curve: `Curves.easeInOutCubic`
- **Coin Collection / Reward Flight**: `600ms`, Parabolic arc with scale and counter roll
- **Building Construction Complete**: `900ms`, Bounce-in with particle sparkle
- **Reduced Motion**: Automatically respect `MediaQuery.of(context).disableAnimations`
