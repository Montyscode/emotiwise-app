# EmotiWise - Emotional Journaling App Design Guidelines

## Design Approach: Reference-Based (Inspired by Notion + Headspace)
**Justification**: This app combines productivity (journaling) with wellness (emotional health), requiring a calming yet functional interface that builds trust and encourages daily engagement.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Light Mode: 240 15% 25% (deep navy blue for trust/stability)
- Dark Mode: 240 20% 90% (soft white-blue)

**Secondary Colors:**
- Sage Mentor: 120 25% 45% (calming green)
- Jax Mentor: 25 35% 55% (warm terracotta)
- Background: Light 220 15% 98%, Dark 240 15% 8%

**Accent Colors (minimal use):**
- Success/Progress: 140 30% 50% (soft green)
- Warning/Attention: 35 40% 60% (muted orange)

### B. Typography
**Primary Font**: Inter (Google Fonts)
- Headers: 600 weight
- Body: 400 weight
- Emphasis: 500 weight

**Secondary Font**: Crimson Text (for journal entries and quotes)
- Creates warmth and personal connection

### C. Layout System
**Tailwind Spacing**: Consistent use of 2, 4, 6, 8, 12, 16 units
- Micro spacing: p-2, m-2
- Component spacing: p-4, gap-4, m-6
- Section spacing: p-8, my-12, gap-16

### D. Component Library

**Navigation**: Clean sidebar with gentle iconography (Heroicons)
**Forms**: Rounded corners (rounded-lg), soft shadows, focus states with primary color
**Cards**: Subtle elevation with rounded-xl, minimal borders
**Buttons**: 
- Primary: Filled with primary color
- Secondary: Outline with background blur when over images
**Data Displays**: Clean tables, progress indicators with soft animations
**AI Mentors**: Distinct avatar areas with personality-appropriate colors

### E. Visual Treatment

**Gradients**: Subtle background gradients from 240 10% 98% to 220 8% 95% in light mode
**Imagery**: 
- Small avatar icons for AI mentors (Sage: wise owl, Jax: bold geometric)
- Minimal decorative elements
- No large hero images - focus on content and functionality

**Backgrounds**: Clean, minimal with soft color blocks for section separation

## Page-Specific Guidelines

### Landing Page (3 sections maximum):
1. **Hero**: Clean headline with dual mentor introduction, subtle gradient background
2. **Value Proposition**: Three-column feature highlights (AI mentorship, MBTI analysis, progress tracking)
3. **CTA Section**: Simple signup form with trust indicators

### Dashboard:
- **Layout**: Sidebar navigation, main content area with cards
- **AI Mentor Areas**: Dedicated sections with personality-appropriate styling
- **Journal Interface**: Clean textarea with formatting options
- **Progress Tracking**: Minimal charts with primary color scheme

## Emotional Design Principles
1. **Trust**: Consistent spacing, professional typography, calming colors
2. **Warmth**: Rounded corners, soft shadows, personal typography for journal content
3. **Clarity**: High contrast text, clear navigation, obvious interactive elements
4. **Progress**: Subtle animations for state changes, visual feedback for journal entries

## Accessibility Focus
- High contrast ratios (4.5:1 minimum)
- Consistent dark mode throughout all components
- Clear focus indicators
- Readable font sizes (16px minimum for body text)

This design creates a professional yet approachable environment where users feel safe exploring their emotions while receiving AI-powered insights through a clean, distraction-free interface.