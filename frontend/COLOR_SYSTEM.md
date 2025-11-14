# DQA Application Color System

This document outlines the comprehensive color palette system implemented in the DQA application, designed for optimal accessibility and user experience across light and dark themes.

## Color Philosophy

The color system is based on modern UI/UX principles with:
- **Semantic naming** for consistent usage
- **Accessibility compliance** with proper contrast ratios
- **Theme-aware design** supporting both light and dark modes
- **Scalable architecture** for easy maintenance and expansion

## Color Categories

### 1. Base Colors
- `background` - Primary application background
- `foreground` - Primary text color
- `card` - Card/panel backgrounds
- `card-foreground` - Card text color

### 2. Primary Brand Colors
- `primary` - Teal brand color (#00CCCC / HSL: 180 100% 40%)
- `primary-foreground` - Primary button text (white/dark)

### 3. Surface Variants
- `surface` - Main surface background
- `surface-secondary` - Elevated surfaces (sidebars, cards)
- `surface-tertiary` - Highest elevation (dropdowns, modals)

### 4. Semantic Colors

#### Success (Green)
- `success` - Success actions/messages
- `success-foreground` - Success text
- `success-muted` - Subtle success backgrounds

#### Warning (Yellow/Orange)
- `warning` - Warning states/cautions
- `warning-foreground` - Warning text
- `warning-muted` - Subtle warning backgrounds

#### Danger (Red)
- `danger` - Error states/destructive actions
- `danger-foreground` - Error text
- `danger-muted` - Subtle error backgrounds

#### Info (Blue)
- `info` - Informational states
- `info-foreground` - Info text
- `info-muted` - Subtle info backgrounds

### 5. Utility Colors
- `border` - Border colors
- `input` - Input field borders
- `muted` - Muted backgrounds
- `muted-foreground` - Secondary text
- `ring` - Focus ring colors

## Usage Examples

### Buttons
```tsx
// Primary action
<button className="bg-primary text-primary-foreground hover:bg-primary/90">Submit</button>

// Success action
<button className="bg-success text-success-foreground hover:bg-success/90">Save</button>

// Warning action
<button className="bg-warning text-warning-foreground hover:bg-warning/90">Warning</button>

// Danger action
<button className="bg-danger text-danger-foreground hover:bg-danger/90">Delete</button>
```

### Cards and Surfaces
```tsx
// Main card
<div className="bg-card border border-border">

// Elevated surface
<div className="bg-surface-secondary border border-border">

// Warning card
<div className="bg-warning-muted border border-warning">
```

### Text
```tsx
// Primary text
<h1 className="text-foreground">

// Secondary text
<p className="text-muted-foreground">

// Success message
<span className="text-success">Operation successful</span>

// Error message
<span className="text-danger">Something went wrong</span>
```

## Theme Support

### Light Theme
- Clean, high-contrast design
- Teal primary (#00CCCC)
- White/light gray backgrounds
- Dark text for readability

### Dark Theme
- Warm, eye-friendly dark backgrounds
- Lighter teal primary for better contrast
- Muted colors for reduced eye strain
- Light text with proper contrast ratios

## Implementation Status

### ✅ Completed
- [x] Tailwind CSS configuration updated
- [x] CSS variables defined for both themes
- [x] ComparisonPage component updated
- [x] Sidebar component updated
- [x] TopBar component updated
- [x] Button component variants added
- [x] DataTable component updated
- [x] Layout component updated

### 📋 Usage Guidelines

1. **Always use semantic colors** instead of hardcoded values
2. **Test in both light and dark themes** during development
3. **Use muted variants** for subtle backgrounds
4. **Maintain contrast ratios** for accessibility
5. **Be consistent** with color usage across components

### 🎨 Color Values Reference

#### Light Theme
- Primary: `hsl(180 100% 40%)`
- Success: `hsl(142 76% 36%)`
- Warning: `hsl(48 96% 53%)`
- Danger: `hsl(0 84% 60%)`
- Info: `hsl(221 83% 53%)`

#### Dark Theme
- Primary: `hsl(180 100% 50%)`
- Success: `hsl(142 71% 45%)`
- Warning: `hsl(48 96% 65%)`
- Danger: `hsl(0 84% 70%)`
- Info: `hsl(221 83% 65%)`

This color system provides a solid foundation for building consistent, accessible, and visually appealing user interfaces across the entire DQA application.