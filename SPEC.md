### 1. Executive Summary

This specification outlines the modernization of the legacy **Fancy Longform** scrollytelling template (originally built on jQuery, ScrollMagic, and WOW.js) into an ultra-performant, content-first web template.

Development and authoring will take place within the **Antigravity** developer environment. The modernized stack transitions the project to **Astro**, **Tailwind CSS**, and **MDX** using **npm** for package management, creating a modular setup optimized for journalism students and modern web browsers.

### 2. Architecture & Tech Stack

The modernized **Fancy Longform** engine uses a static-first web ecosystem designed for swift compilation and fast load times:

|   |   |   |
|---|---|---|
|**Layer**|**Technology**|**Purpose**|
|**Development IDE**|**Antigravity**|Google's advanced coding workspace for prompt-driven development, live previewing, and editing.|
|**Meta-Framework**|[Astro](https://astro.build/ "null")|Delivers zero-JS by default, isolates interactive islands, and streamlines content compilation.|
|**Package Manager**|[npm](https://www.npmjs.com/ "null")|Standard dependency management, version lock-in, and build orchestration.|
|**Content Layer**|[MDX (Markdown + JSX)](https://mdxjs.com/ "null")|Empowering reporters to write stories in readable Markdown while embedding immersive scrolly components.|
|**Styling Framework**|[Tailwind CSS](https://tailwindcss.com/ "null")|Rapid utility-first styling system to replace heavy custom CSS stylesheets.|
|**Animation Engine**|Native APIs / [GSAP](https://greensock.com/ "null")|Native Intersection Observer API for performance-critical scroll triggers; GSAP + ScrollTrigger for complex pins.|

### 3. Workspace File & Folder Structure

Within the Antigravity workspace, the modern **Fancy Longform** codebase conforms to standard Astro conventions:

```
fancy-longform/
├── public/
│   ├── audio/                  # Story-specific background music/ambient audio
│   ├── video/                  # Optimized background video loops (.mp4, .webm)
│   └── fonts/                  # Self-hosted web typography
├── src/
│   ├── assets/                 # Raw images (automatically optimized on build)
│   ├── components/             # Reusable interactive components
│   │   ├── AudioPlayer.astro   # Intersection-observer based ambient sound trigger
│   │   ├── FullWidthVideo.astro# Full-bleed muted cinematic video backdrop
│   │   ├── ScrollyContainer.astro# Sticky background canvas with step pins
│   │   └── ScrollyStep.astro   # Container for text cards overlaying visual backdrops
│   ├── content/
│   │   ├── config.ts           # Schema validation for story metadata
│   │   └── stories/
│   │       └── desert-beauty.mdx# Migrated content written in MDX
│   ├── layouts/
│   │   └── StoryLayout.astro   # Main editorial wrapper (header, scroll tracker, layout grid)
│   └── pages/
│       ├── index.astro         # Catalog / landing page of available stories
│       └── stories/
│           └── [slug].astro    # Dynamic route handler to compile MDX stories
├── package.json                # Project script registry and dependencies
├── tailwind.config.mjs         # Customized editorial design tokens
└── astro.config.mjs            # Astro config integrating Tailwind & MDX
```

### 4. Project Configuration (`package.json`)

To compile the application inside the Antigravity preview environment, dependencies are declared via **npm**:

```
{
  "name": "fancy-longform-modern",
  "type": "module",
  "version": "2.0.0",
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "@astrojs/mdx": "^3.1.0",
    "@astrojs/tailwind": "^5.1.0",
    "astro": "^4.10.0",
    "gsap": "^3.12.5",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.3.0"
  },
  "devDependencies": {
    "prettier": "^3.3.0",
    "prettier-plugin-astro": "^0.14.0",
    "prettier-plugin-tailwindcss": "^0.6.1"
  }
}
```

### 5. Core Component Implementations

#### 5.1 GSAP-Driven Scrolly Container

Replacing legacy ScrollMagic and jQuery logic, `ScrollyContainer` orchestrates fixed backdrops with scrolling textual overlays.

```
---
// src/components/ScrollyContainer.astro
interface Props {
  id?: string;
}
const { id = "scrolly-section" } = Astro.props;
---

<div id={id} class="relative w-full min-h-screen flex flex-col md:flex-row bg-neutral-900 text-white">
  <!-- Left/Sticky Side: Visual Backdrop Canvas -->
  <div class="scrolly-visual w-full md:w-1/2 h-96 md:h-screen sticky top-0 overflow-hidden flex items-center justify-center bg-black">
    <slot name="visual" />
  </div>

  <!-- Right Side: Scrollable narrative cards -->
  <div class="scrolly-narrative w-full md:w-1/2 px-6 md:px-12 py-24 flex flex-col gap-96">
    <slot name="narrative" />
  </div>
</div>

<script>
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  const steps = document.querySelectorAll('.scrolly-step');
  
  steps.forEach((step) => {
    const targetId = step.getAttribute('data-target-id');
    const visualElement = document.querySelector(`[data-visual-id="${targetId}"]`);

    ScrollTrigger.create({
      trigger: step,
      start: "top center",
      end: "bottom center",
      onEnter: () => activateStep(visualElement, step),
      onEnterBack: () => activateStep(visualElement, step),
    });
  });

  function activateStep(visual: Element | null, step: Element) {
    if (!visual) return;
    
    // Hide inactive layers smoothly
    document.querySelectorAll('[data-visual-id]').forEach(el => el.classList.add('opacity-0'));
    document.querySelectorAll('.scrolly-step').forEach(el => el.classList.remove('text-white', 'opacity-100'));
    
    // Highlight current active layer and story segment
    visual.classList.remove('opacity-0');
    visual.classList.add('opacity-100');
    step.classList.add('text-white', 'opacity-100');
  }
</script>
```

#### 5.2 Lightweight Ambient Media Component

To keep the page lightweight and prevent background noise collisions, we use the native browser **Intersection Observer API** inside our Astro component:

```
---
// src/components/AudioPlayer.astro
interface Props {
  src: string;
  label?: string;
}
const { src, label = "Ambient Audio Track" } = Astro.props;
---

<div class="audio-trigger border border-neutral-700 bg-neutral-800/40 backdrop-blur rounded-lg p-4 flex items-center justify-between" data-audio-src={src}>
  <div class="flex flex-col">
    <span class="text-xs text-neutral-400 uppercase tracking-wider font-mono">Ambient Audio</span>
    <span class="text-sm font-semibold">{label}</span>
  </div>
  <audio class="hidden" loop src={src}></audio>
  <button class="audio-btn p-2 rounded-full bg-neutral-700 hover:bg-neutral-600 transition-all">
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 18.75V5.25L7.75 9.5H4.5v5h3.25L12 18.75z"/></svg>
  </button>
</div>

<script>
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  };

  const audioContainers = document.querySelectorAll('.audio-trigger');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const audio = entry.target.querySelector('audio');
      if (!audio) return;

      if (entry.isIntersecting) {
        audio.volume = 0;
        audio.play().catch(() => console.log('Autoplay deferred until user interaction'));
        fadeAudio(audio, 0.4, 1200);
      } else {
        fadeAudio(audio, 0, 1000, () => audio.pause());
      }
    });
  }, observerOptions);

  audioContainers.forEach(container => observer.observe(container));

  function fadeAudio(audio: HTMLAudioElement, targetVolume: number, duration: number, callback?: () => void) {
    const startVolume = audio.volume;
    const difference = targetVolume - startVolume;
    const startTime = performance.now();

    function update() {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      audio.volume = startVolume + (difference * progress);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else if (callback) {
        callback();
      }
    }
    requestAnimationFrame(update);
  }
</script>
```

### 6. Media Optimization Protocols

To prevent the performance degradation of the legacy `fancy-longform` template, this modern iteration mandates strict asset parameters:

1. **Lazy Loading Strategy**: Standard inline narrative imagery must leverage native browser layout-controlled deferred loading (`loading="lazy"`).
    
2. **Dynamic Format Transcoding**: Astro’s dynamic `<Image />` component must wrap critical narrative photographs to compile them automatically into optimized modern `.webp` and `.avif` payloads.
    
3. **Optimized Backdrop Videos**: Interactive video files must remain audio-muted, loop seamlessly, run with `playsinline` and `autoplay`, and feature static high-fidelity poster images for immediate initial rendering.
    

### 7. Authoring Workflow Example (MDX)

Writing longform articles in the Antigravity workspace becomes incredibly simple. Writers lay out their prose, and can seamlessly embed visual triggers using readable tags:

```
---
title: "The Silence of the Canyon"
description: "A modernized look at canyon ecology and water resources"
author: "Antigravity Workspace Builder"
pubDate: 2026-05-26
theme: "dark"
coverImage: "/images/canyon-header.webp"
---

import ScrollyContainer from '../../components/ScrollyContainer.astro';
import AudioPlayer from '../../components/AudioPlayer.astro';
import FullWidthVideo from '../../components/FullWidthVideo.astro';
```

# The Echoes of a Dry Riverbed

We have modernized this page using **Astro** in our **Antigravity** workspace. It ships virtually zero visual blocking scripts by default.

<FullWidthVideo videoSrc="/video/canyon-flyover.mp4" fallbackSrc="/images/canyon-fallback.jpg" />

<AudioPlayer src="/audio/desert-wind.mp3" label="Ambient Desert Soundscape" />

## Transitioning Landscapes

Here is a visual comparison of ecological transition over 100 years, using custom scrolly cards.
```
<ScrollyContainer>
  <div slot="visual">
    <img data-visual-id="historic" src="/images/canyon-1926.webp" class="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000" />
    <img data-visual-id="modern" src="/images/canyon-2026.webp" class="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-1000" />
  </div>
  
  <div slot="narrative">
    <div class="scrolly-step opacity-50 transition-all duration-500 min-h-screen flex items-center" data-target-id="historic">
      <div>
        <h3 class="text-2xl font-bold mb-4">1926: The Lush Floor</h3>
        <p class="text-neutral-400">Archival landscape surveys map out lush cottonwood thickets and active spring runs.</p>
      </div>
    </div>
    
    <div class="scrolly-step opacity-50 transition-all duration-500 min-h-screen flex items-center" data-target-id="modern">
      <div>
        <h3 class="text-2xl font-bold mb-4">2026: An Arid Basin</h3>
        <p class="text-neutral-400">A century of climatic shifts has left only coarse desert sands and drought-resistant flora.</p>
      </div>
    </div>
  </div>
</ScrollyContainer>
```