# Credits and source boundaries

- `vendor/cutaway` is copied without edits from Nyxera0x/cutaway at the commit in
  `UPSTREAM.json`. Copyright 2026 Nyxera0x and whaleyxbt; MIT license retained at
  `vendor/cutaway/LICENSE`.
- The original article is https://x.com/Nyxera0x/status/2118689860437315679.
- The upstream runtime, capture and sound foundations credit
  https://github.com/whaleyxbt/claude-motion.
- Upstream sound samples are attributed in `vendor/cutaway/sfx/samples/SOURCES.md`.
- npm dependencies retain their own distributed licenses. This repo does not
  replace those licenses or grant rights over a production's input media.
- New narrative workflow, timeline/rig helpers, wrappers and title example are
  provided under the root MIT license. Private series media is not included.

The upstream runner reads scene files, writes build/capture outputs and runs
FFmpeg/Python locally. Package installation downloads the declared npm packages.
The adapted skill adds no credential access, telemetry, startup task, daemon,
remote model or automatic publication. A user's explicit publication request
remains separate from executing an animation skill.
