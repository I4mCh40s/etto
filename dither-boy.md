# Dither Boy

**Developer**: Studio AAA (Jack McArdle)  
**Website**: https://studioaaa.com/ditherboy/  
**Product Page**: https://studioaaa.com/product/dither-boy/  
**Current Version**: 6.0  
**Price**: £60.00 (discounted to £45.00)  
**Platforms**: macOS (Catalyst and later), Windows  
**Licensing**: One-time purchase, no subscription, all future updates included

---

## Overview

Dither Boy is a standalone desktop application for authentic retro image, video, and animation dithering. Unlike plugins or filters in mainstream design software, it transforms dithering algorithms from functional compression tools into granular, editable, malleable effects—giving designers precise control over the aesthetic outcome.

The software began development in May 2024 and was released by Studio AAA as their first design software product. As of 2026, the development team has completed over a year of free post-launch updates, with v6.0 representing the most recent major overhaul.

---

## Core Technical Specifications

### Platforms and Distribution

| Aspect | Details |
|--------|---------|
| **Application Type** | Standalone software (not a plugin) |
| **Operating Systems** | macOS (all versions after Catalina), Windows |
| **Distribution Formats** | `.DMG` (macOS), `.EXE` (Windows installer) |
| **License Verification** | Internet access required |
| **Installation** | No third-party software required (e.g., Photoshop, Affinity Photo) |

### System Requirements Notes

- **Windows S Mode**: Windows devices with S Mode enabled will block installation from outside the Microsoft Store. Users must manually switch out of S Mode (irreversible process) via Settings > System > Activation.
- **No Plugin Dependencies**: Works entirely independently of Adobe Creative Suite, Affinity, or any other design software.

---

## Dithering Algorithms (63 Total)

Dither Boy provides 63 fully editable, animatable dithering algorithms compatible with SVG, PNG, and JPG output:

| Category | Count | Description |
|----------|-------|-------------|
| **Error Diffusion** | 15 | Classic dithering that distributes quantization error to neighboring pixels (e.g., Floyd-Steinberg, Jarvis, Stucki) |
| **Ordered Dithering** | 5 | Matrix-based dithering (e.g., Bayer 4x4, 8x8) producing regular dot patterns |
| **Pattern Dithers** | 8 | Threshold-based pattern generation creating stippled/textured effects |
| **Glitch Effects** | 17 | Custom glitch art algorithms with adjustable sliders for real-time control |
| **Special Effects** | 16 | Unique modulation, halftone, and bitmap effects |
| **Epsilon Glow** | 1 | Bespoke effect specifically engineered to work with dithering patterns |
| **Temporal Effects** | Various | Animation modifiers that make dithering dance or move in video/animation timelines |

### Notable Algorithm Features

- All algorithms support **animation** and are compatible with vector output
- **Custom sliders** on glitch effects allow granular control over distortion parameters
- **Epsilon Glow** is a proprietary effect unavailable elsewhere
- Temporal effects are compatible with any Dither Boy algorithm

---

## Color System (v4.0+)

Version 4.0 introduced a fundamental architecture change: color is now deeply integrated directly into the dithering algorithm rather than applied as a post-process filter.

### Palette System

| Feature | Details |
|--------|---------|
| **Built-in Palettes** | Categorized collections (e.g., "retro") |
| **Palette Extraction** | Automatic extraction from source images |
| **User Palettes** | Downloadable and shareable community palettes |
| **Update Cadence** | New palettes released monthly (free) via Extras menu |

### Color Controls

- **Depth Slider**: Controls how many shades/levels of color are used from a selected palette
- **Palette Preview**: Hover over palette dropdown and scroll to preview in real-time
- **Direct Manipulation**: Color is inserted during the dithering process itself, ensuring every effect takes full advantage of the retro color system

---

## Video and Animation Support

### Video Processing (v2.0+)

- **Format Support**: MP4 files
- **Timeline Editor**: Full timeline-based editing interface
- **Live Preview**: Playback of video dithering results in real-time (v6.0)
- **Temporal Effects**: Apply movement/animation to dithering patterns across video frames

### Animation Capabilities

- **Animate from Still Images**: Generate animated dithering from static sources
- **Frame-by-Frame Control**: Temporal effects compatible with all 63 algorithms
- **MP4 Export**: Output finalized animations directly from the app

### v6.0 Live Playback

The v6.0 major overhaul introduced live video playback and preview, eliminating the need to export and test externally before seeing results.

---

## Effects Pipeline

### Stackable Architecture

Dither Boy features a non-destructive, stackable effects pipeline where users can:

- Layer multiple effects on a single dither
- Reorder effects dynamically
- Combine effects (e.g., Epsilon Glow + JPEG Glitch + Chromatic Aberration)

### Built-in Stackable Effects

- Epsilon Glow (bespoke, dither-specific)
- JPEG Glitch
- Chromatic Aberration
- And additional effects designed specifically for Dither Boy

---

## Export and Output Formats

### Image Formats

| Format | Notes |
|--------|-------|
| **PNG** | Primary output, supports transparency |
| **JPG/JPEG** | Standard lossy output |
| **SVG** | Vector output for scalability |

### Specialized Exports

| Export Type | Use Case |
|-------------|----------|
| **Lossless Export** | Print production (toggle in Help > Settings) |
| **Black Vector Export** | Print and embroidery file generation |
| **CMYK Halftone** | Professional print workflows (v6.0 addition) |

---

## Additional Features

### Batch Processing

Located in the menu bar: **Edit > Batch**  
Guides users through batch processing multiple images with identical settings.

### Themes and UI Customization

- Multiple visual themes inspired by retro software aesthetics
- Theme options include nostalgic green (classic handheld device style) and pink variants
- New mascot design in full color on certain themes

### Documentation and Support

| Resource | Location |
|----------|----------|
| **Installation Guide** | `.PDF` included in download, also at studioaaa.com/ditherboyhelp |
| **Online Guide** | studioaaa.com/ditherboyhelp |
| **Video Tutorials** | Studio AAA YouTube channel |
| **Update Checker** | Help menu > Check for Updates (or updates.studioaaa.com/dither-boy) |
| **Contact** | email protected |

---

## Version History

| Version | Release Date | Key Additions |
|---------|--------------|---------------|
| **v1.0** | May 2024 | Initial release; 20+ dithering algorithms |
| **v2.0** | Early 2025 | Video dithering support |
| **v3.0** | 2025 | Glitch Art Update; expanded glitch effects |
| **v4.0** | July 2025 | Retro Shaded Dithering; color system; palette loading; themes; depth slider |
| **v4.0.5** | 2025 | Retro shading improvements |
| **v4.2** | 2025 | Print export settings; improved preset system; improved video compatibility |
| **v5.0** | 2025 | Live video playback and preview |
| **v6.0** | 2025/2026 | Major overhaul; CMYK Halftone; live preview improvements |

---

## Licensing and Commercial Use

- **Purchase Model**: One-time payment, no subscription
- **Commercial License**: Included; permits commercial use of output
- **Redistribution**: Not permitted
- **Future Updates**: All included at no additional cost
- **Updates Process**: Help menu > Check for Updates (requires license key + email)

---

## Workflow Integration

Dither Boy is designed to fit alongside existing design workflows:

1. Import image into Dither Boy
2. Select dithering algorithm and adjust parameters
3. Apply color palette and depth settings
4. Add stackable effects if desired
5. Export right back into Photoshop, video editing software, or other tools

The software works with any workflow regardless of whether the user works primarily in Photoshop, MS Paint, Affinity Photo, or other applications.

---

## Target Users

- Graphic designers working with retro/pixel aesthetics
- Digital artists exploring dithering as a creative medium
- Video editors requiring animated dithering effects
- Merch designers preparing files for print and embroidery
- Glitch art creators
- Artists seeking alternatives to mainstream design software monopolies

---

## Related Studio AAA Products

| Product | Type | Price |
|---------|------|-------|
| **Flareware** | Lens flare and optical effects software | £50.00 (sale: £25.00) |
| **Glitch Machine** | Adobe After Effects template | £45.00 |
| **Phantom Display** | Display mockup system | £20.00 - £50.00 |
| **Lens Flare Kit** | Design asset pack | £35.00 |
| **Printer Trash** | Printer effect textures | £15.00 |