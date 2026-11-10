# Transitions.dev UI generation

Copyright (c) 2026 Jakub Antalik / Transitions.dev.

Source: https://github.com/Jakubantalik/transitions.dev/tree/main/skills/transitions-ui-generation

This portfolio uses the free UI generation runtime, not the CLI, paid transitions, or website branding. Permission and restrictions are preserved in `LICENSE.txt`. Retrieved 24 October 2026.

Upstream Git blob SHAs before local adaptation:

- `ui-generation.js`: `0a546a2ebba2e8cb0d3556d2227ea5754d177fd5`
- `ui-generation.css`: `ed2a49178865007c24d77464bd865e3296b9ba39`
- `text-image-generation.js`: `cb83b699b0d1b11d9ec6804c2b8dbebfadd980b4`
- `text-image-generation.css`: `474fcd474d9b68e3f65974b70cd2fa946b32acaf`

Local runtime adaptations:

- Bound dot density for large screenshots and avoid blur on large surfaces.
- Track document coordinates during scrolling, including sticky scenes.
- Keep native hit testing intact for links and forms during the drawing.
- Release completed overlay references so repeated section entrances do not retain SVG trees.

The React lifecycle, viewport/replay policy, interruption handling and portfolio palette are in `src/scroll-generation.jsx` and `src/scroll-generation.css`.
