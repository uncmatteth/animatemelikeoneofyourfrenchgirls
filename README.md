# Animate me like one of your French girls

We took [Nyxera0x's Cutaway](https://github.com/Nyxera0x/cutaway) and added a
bunch of things for a different job: making fully animated episodes for
**The Living Worlds**.

The original idea is great: start with a reference, build parts you can actually
move, check what came out against the picture, and catch mistakes early. We're
extending that into story scenes with reusable sets, character layers, fixed
prop locations, dialogue timing and cinematic title cards. This version runs
with Codex and local tools.

[The Living Worlds website](https://thelivingworlds.fun/) ·
[@TheLivingWorlds on X](https://x.com/TheLivingWorlds)

## What is here

- A native Codex skill: [`SKILL.md`](SKILL.md).
- The exact upstream Cutaway source in [`vendor/cutaway`](vendor/cutaway), pinned
  and checked against the commit recorded in [`UPSTREAM.json`](UPSTREAM.json).
- Frame-by-frame browser rendering, using the original kit and capture runner.
- A shared timeline for dialogue, inserted title time and speaker-specific mouth cues.
- Reusable layered-character support with explicit joint pivots.
- A cinematic crystal title example and scene structure checks.
- Review rules for faces, hands, foot contact, ropes, speaking mouths and stable scenery.

This is the toolkit we're developing for the series. It is not a promise that
one picture automatically becomes a finished animated episode. Human acting,
clean character layers and hidden views still need to be built and checked.
The included title example proves rendering and title motion; it does not prove
finished human animation. Production artwork, scripts, voices and unreleased
episode footage are kept outside this public repo.

## Install for Codex

Clone this repository and add it as a local skill:

```sh
git clone https://github.com/uncmatteth/animatemelikeoneofyourfrenchgirls.git
cd animatemelikeoneofyourfrenchgirls
npm ci --ignore-scripts
mkdir -p "$HOME/.codex/skills"
ln -s "$(pwd)" "$HOME/.codex/skills/animatemelikeoneofyourfrenchgirls"
```

Use `$animatemelikeoneofyourfrenchgirls` in Codex on the next turn. Don't overwrite
an existing installation; inspect it first. Node.js 20+, Python 3 and FFmpeg are
required for the upstream tools. Set `CHROMIUM` to an existing Chromium/Chrome
binary, or install Playwright's Chromium explicitly with `npx playwright install chromium`.
No model API key, Claude subscription or cloud renderer is required by this kit.
Optional external generation tools are separate choices.

## Try the renderer

```sh
npm test
node scripts/check-scene.mjs examples/door-and-title/timeline.json
node scripts/build.mjs ./examples/door-and-title --out ./output
node scripts/capture.mjs ./output/dist/door-and-title.html --size 1280x720 --fps 24 --to 8 --out ./output/title-proof.mp4
```

Review stills before a long render:

```sh
node scripts/capture.mjs ./output/dist/door-and-title.html --size 1280x720 --dpr 1 --stills 0,2,4,6 --out ./output/title-sheet.png
```

Keep generated media and large package caches on a suitable writable drive.
The capture runner prints which GPU the browser obtained. Check it and the
actual images before starting a large render.

## Where this came from

Credit to **[Nyxera0x](https://x.com/Nyxera0x)** for the original
[article](https://x.com/Nyxera0x/status/2118689860437315679) and
[Cutaway skill](https://github.com/Nyxera0x/cutaway). That is the starting point
for this work, not something we're claiming to have invented.

Cutaway itself builds on [whaleyxbt/claude-motion](https://github.com/whaleyxbt/claude-motion).
Its source and MIT notices are retained. Upstream's recorded samples retain
their [CC0 source credits](vendor/cutaway/sfx/samples/SOURCES.md), including the
preparation work from [Barty-Bart/motion-graphics](https://github.com/Barty-Bart/motion-graphics).
See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and [LICENSE](LICENSE).
