---
name: animatemelikeoneofyourfrenchgirls
description: Create reference-led animated story scenes, opening sequences and cinematic title cards with reusable characters, sets, props and a shared audio timeline. Use when the user asks to animate an episode, turn approved story art into animation, build a narrative animation workflow, or invokes $animatemelikeoneofyourfrenchgirls. Native Codex adaptation of Nyxera0x's Cutaway method.
---

# Animate me like one of your French girls

Build an animated scene the viewer can follow. Keep the characters recognizable,
make their actions visible, and keep physical objects in the same place across
shots. This skill is a workflow and renderer kit; it does not automatically
reconstruct a finished human rig from a single image.

## Read first

1. The user's current scope, existing source art, script, dialogue and corrections.
2. [The narrative job description](references/job-description.md).
3. [The scene review rubric](references/scene-review.md).
4. Upstream's [method](vendor/cutaway/SKILL.md) and
   [lessons](vendor/cutaway/docs/LESSONS.md) when adapting its renderer.

The vendored Cutaway source is retained with its MIT license and attribution.
Its robotic teardown, white/green palette, HUD and product-tour choreography are
examples, not the visual design of the user's film. Use the film's own references.

## Workflow

1. **Recover current authority.** Resolve the actual script/audio version and
   source images. Check previous experiments before repeating them. A file called
   `rig` is not proof that the character can act. Preserve original assets.
2. **Pin the scene.** Record the people, fixed set geometry, object anchors,
   entrances, exits and before/after state. Derive shot times from the recorded
   dialogue. A title card gets explicit inserted time, without speeding speech.
3. **Prepare actual moving assets.** Use approved 3D rigs or clean layered 2D
   artwork with repaired hidden areas, joint pivots and expression drawings.
   A flattened painting is a reference until those parts exist. Keep identity,
   palette, costume and established prop marks. Reject geometric stand-ins.
4. **Write observable acceptance criteria.** Ten to twelve checks for this scene:
   identities, geography, speaking mouths, physical contact, object count,
   motivation, action, timing, framing, look and sound. Measure important anchor
   positions/proportions rather than trusting memory.
5. **Prove a short action.** Render matching stills and a 5–10 second sample with
   meaningful character/prop movement. Compare source, output and neighboring
   shots. Inspect intermediate frames, not just the first and last. Review after
   at most two revisions; report a failed method instead of looping indefinitely.
6. **Respect the existing approval scope.** If the user requested a full segment,
   continue within that scope once the proof passes. If they requested a still or
   proof-only review, wait at that boundary. Never scale a failed test by calling
   it approved. An explicit stop stops production.
7. **Animate from one clock.** A scene exposes deterministic `render(t)` and resets
   every animated property on every call. Dialogue mouth/expression cues,
   choreography, cameras, light, props and sound refer to the same timeline.
   Turning a wheel does not open a story door before its activation event.
8. **Render locally.** Reuse the existing browser, Node, FFmpeg and Python.
   `npm ci --ignore-scripts` installs declared dependencies; use the existing
   Chromium via `CHROMIUM` when available. Put large assets/caches/frames on a
   verified writable external mount when local reserve is low. Do not stop other
   GPU services or install a remote generation provider as a side effect.
9. **Review the actual encode.** Check representative and transition frames,
   listen to the audio, verify duration/fps/dimensions, look for temporal jumps,
   and verify the final output path. A successful encode does not prove acting,
   voice quality, story clarity or visual continuity.
10. **Deliver concrete results.** Return the viewable video and a short account of
    what was inspected, what failed and what remains. Keep candidate, inspected
    and user-approved states distinct. Preserve corrections in the owning project
    record rather than building another tracker.

## Commands

Run from this skill directory (or use absolute paths):

```sh
npm ci --ignore-scripts
node scripts/build.mjs ./examples/door-and-title --out ./output
node scripts/capture.mjs ./output/dist/door-and-title.html --out ./output/proof.mp4 --size 1280x720 --fps 24 --to 8
node scripts/check-scene.mjs ./examples/door-and-title/timeline.json
npm test
```

`scripts/build.mjs` and `scripts/capture.mjs` wrap the pinned upstream kit.
`CHROMIUM`, `FFMPEG`, `FFPROBE`, `PYTHON`, `CUTAWAY_DEPS` and `CUTAWAY_OUT`
remain available. Full upstream robotic examples are in `vendor/cutaway/sims`.

## Never call these full character animation

- Panning/zooming a painting while its subjects remain frozen.
- Sliding an entire character without a weight shift or matching foot contact.
- Overlapping polygon cutouts that double arms, faces or coat outlines.
- Drawing a speaking mouth on the wrong character.
- Using motion interpolation to hide contradictory architecture or props.
- Measuring pixel density as proof that a human hand or story action is correct.
- Claiming the complete episode works because one attractive frame rendered.

## Public/private boundary

This public skill contains reusable tools, generic examples and upstream credits.
Keep a production's private art, dialogue, scripts, browser data, credentials and
unreleased footage in its owning project. Publish them only under separate,
explicit publication authority. Do not contact the original author automatically.
