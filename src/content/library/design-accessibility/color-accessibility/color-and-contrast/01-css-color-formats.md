---
title: "CSS Color Formats and Contrast: A Practical Guide"
description: "Read HEX, RGB, and HSL colors accurately, compute WCAG contrast ratios, and make better decisions about text, borders, focus states, and dark mode."
pubDate: 2026-10-25
author: "Chirag Singhal"
type: guide
tags: ["css", "color", "accessibility", "design"]
difficulty: "beginner"
toc: true
learningPaths: ["practical-web-foundation"]
references:
  - title: "MDN: CSS color values"
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS/color_value"
  - title: "W3C: CSS Color Module Level 4"
    url: "https://www.w3.org/TR/css-color-4/"
  - title: "WCAG 2.2: Contrast (Minimum)"
    url: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html"
---

A color is not only a hexadecimal string. It is a point in a color space, a set of channel values, and a relationship with every color placed next to it. CSS gives us several syntaxes for the same idea. The syntax you choose should match the job: palette work, opacity, perceptual adjustments, or contrast testing.

## HEX

A six-digit HEX color stores red, green, and blue in the sRGB color space:

```css
.brand {
  color: #c2410c;
}
```

Each pair is a hexadecimal byte from `00` to `ff`. The shorthand `#c40` expands to `#cc4400`, not to a color where each channel is 12. Alpha can be added as an eighth digit, or as a fourth digit in shorthand, but not every design system should rely on transparent text colors for accessibility.

HEX is compact and familiar. It is not easy to adjust perceptually by hand. If you want to make a palette lighter or darker while keeping its character, HSL or a modern color tool is often more comfortable.

## RGB and the modern space-separated syntax

```css
.notice {
  background: rgb(255 247 237);
  border-color: rgb(249 115 22 / 0.35);
}
```

The slash separates color channels from alpha. Percentages are also allowed. The older comma-separated `rgba()` form is still widely supported, but the modern syntax reads more consistently with `hsl()` and `oklch()`.

RGB values are useful when you are manipulating channels numerically. They are not intuitive for asking "what would this color look like if it were 10% lighter?" Lightness in RGB does not change linearly.

## HSL

HSL describes hue, saturation, and lightness:

```css
.accent {
  background: hsl(25 95% 53%);
}
```

Hue is an angle on the color wheel. Saturation and lightness are percentages. HSL is convenient for building a coherent palette:

- keep the hue stable while changing lightness
- create hover states with controlled saturation changes
- choose a border color from the same family

HSL is not perceptually uniform. Two colors with the same HSL lightness can appear to have different brightness. If you need perceptual adjustments, color spaces such as OKLCH are worth exploring, but check browser support and your team's tooling before adopting them broadly.

## Reading the same color in different formats

The orange used by this site is approximately:

| Format | Value |
| --- | --- |
| HEX | `#C2410C` |
| RGB | `rgb(194 65 12)` |
| HSL | `hsl(19 88% 40%)` |

The [color converter](/tools/color-converter/) translates among these forms without sending the value anywhere. Converting does not change the color, but the rounded values displayed by some tools can. Keep a canonical token in your design system instead of retyping conversions across files.

## Alpha is not a substitute for contrast

Opacity blends a color with what is behind it. The resulting contrast can be much lower than the contrast of the solid color:

```css
.muted {
  color: rgb(28 25 23 / 0.6);
  background: #fffefc;
}
```

At 60% opacity, the text may look acceptable to the designer on a bright monitor and fail for a low-vision reader in daylight. When text or an essential control needs a contrast guarantee, test the actual composite result, not the base color. Disabled text is often exempt from WCAG contrast requirements, but "disabled" should be a real state, not a convenient label for low-contrast instructions.

## WCAG contrast, precisely

WCAG 2 defines relative luminance for sRGB colors. Each channel is converted to a linear value:

$$
C_{\text{linear}} =
\begin{cases}
C_{\text{sRGB}} / 12.92 & C_{\text{sRGB}} \le 0.04045 \\
\left(\frac{C_{\text{sRGB}} + 0.055}{1.055}\right)^{2.4} & C_{\text{sRGB}} > 0.04045
\end{cases}
$$

Then:

$$
L = 0.2126R_{\text{linear}} + 0.7152G_{\text{linear}} + 0.0722B_{\text{linear}}
$$

The contrast ratio is:

$$
\text{ratio} = \frac{L_1 + 0.05}{L_2 + 0.05}
$$

where \(L_1\) is the lighter color's luminance and \(L_2\) is the darker one.

For normal text, WCAG 2.2 AA requires at least **4.5:1**; AAA requires **7:1**. Large text has lower thresholds: **3:1** for AA and **4.5:1** for AAA. Non-text UI components and graphical objects need **3:1** under the non-text contrast criterion.

A mid-grey such as `#777777` on white has a ratio around 4.48:1. It narrowly misses normal-text AA, even though it may look fine to many people. Use the [contrast checker](/tools/contrast-checker/) to test real pairs rather than trusting a palette screenshot.

## Contrast is necessary, not sufficient

Passing a ratio does not make an interface usable:

- small text at 4.5:1 can still be hard to read; type size and weight matter
- focus indicators need to be visible against the surrounding interface
- links inside paragraphs need a non-color cue, such as an underline
- charts need labels and patterns, not only color differences
- dark mode needs its own tested tokens, not an inverted palette

The [gradient generator](/tools/gradient-generator/) is useful for visual experiments, but text over a gradient should be checked at the lightest and darkest points it crosses. A single ratio for the average color is not enough.

## A practical palette habit

1. Define semantic tokens: background, surface, text, muted text, border, accent, and focus.
2. Keep raw palette values in one place.
3. Test the real combinations used in the interface, in both themes.
4. Do not use color alone to communicate status or required fields.
5. Check focus rings against the page and against the component they surround.

Color systems become reliable when the names describe intent and the contrast checks describe evidence. HEX or HSL is a notation choice; accessible results come from testing the composition.
