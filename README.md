# NextStep — student career frontend

Run `npm start` (or `node server.cjs`), then visit http://127.0.0.1:4173. No dependency installation is required. Use `/?setup=1` to open profile setup again. `npm run check` checks current JavaScript syntax.

## Current frontend

- First-visit two-stage onboarding: name, course area, degree, year, career direction, and optional technology preference.
- Eleven course areas and 58 distinct related domain suggestions. Nine domains contain three introductory guided lessons each (27 lessons). Other domains are explicitly career overviews, not completed curricula.
- Each lesson follows purpose → concept → worked example → explicit understanding acknowledgement → challenge → feedback. The next lesson requires completion of the previous check.
- Optional five-minute timer exists only during a challenge. Expiry permits continued untimed practice; closing the panel stops the timer.
- XP is awarded once per learning task. A daily streak counts distinct local calendar days with completed learning tasks. Project milestones are self-recorded and do not certify skills.
- Project briefs, milestone journals, next actions, and optional evidence links.
- Opportunity preparation pathways, not live vacancies.
- Resume development guidance, selected optional credential links, an editable evidence-based draft, and browser Print / PDF.
- Navy, warm-white, and copper visual system; serif headings; click halos, page entrances, and gentle light sweeps. Motion can be disabled; OS reduced-motion settings are respected.

## Limits

This is a local frontend prototype. Profile, progress, journal, and resume details are stored in this browser's local storage. There is no server account, mentor service, code runner, credential verification, live opportunity feed, or full language-specific curriculum. All learning samples and roadmap frameworks require subject expert review before a student rollout. Certification suitability depends on the student's target role, prerequisites, resources, and current provider requirements. No employment or certification outcomes are guaranteed. Old prototype files remain in the source but are not loaded by the current entry page.

Icons are bundled from Lucide (ISC license in `dist/lucide-LICENSE.txt`). Google Fonts is optional; system font fallbacks remain available.

Appearance: the floating theme button switches between light and cinematic dark; the choice is saved locally. Dark mode adds click sparks, pulse rings, route sweeps and modal entrances. Reduced-motion preferences and the motion toggle suppress these effects. My Projects now uses plain-language briefs and four guided steps with draft/completion notes; empty notes cannot complete a step. Work is created outside this prototype and progress is self-recorded.

Boss: a separate assistant overlay is available from Ask Boss or Alt+B. Setup, privacy, voice limitations and API configuration are documented in BOSS-SETUP.md. Live AI requires a server-side GROQ_API_KEY or OPENAI_API_KEY for the selected provider. Existing learning, projects, and resume flows are not modified. Run npm run test:boss for simulated-provider integration tests.

Boss voice revision: spoken replies default on unless muted; Talk to Boss submits recognised questions directly, then resumes listening after speech. Hey Boss plus a question skips the introduction. Play last answer retries audio. Built-in site guides use exact current UI labels and are labelled separately from generated AI. Voice controller tests use simulated speech APIs; physical microphone recognition still needs user permission and a live device test.

## Hosted deployment

The Sites deployment uses a dependency-free Worker adapter in `deploy/`. Run `npm run build:sites` and `npm run test:hosted` to build and check the hosted artifact. Local development still uses `npm start`. The build embeds frontend assets and reviewed-in-source reference data; it does not read or embed `.env`. Configure provider keys as secret runtime variables in Sites. Hosted AI requests require the identity validated by Sites; current site access stays owner-only. Browser profiles and progress remain specific to each browser and origin.
