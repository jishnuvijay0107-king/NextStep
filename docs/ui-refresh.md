# Local UI refresh

Applied skill: https://github.com/anthropics/skills/tree/main/skills/frontend-design

## Direction
A readable student learning workspace with the approved cinematic branding. Retain course-based navigation, guided lessons, current page artwork, and the compact Boss launcher.

Tokens: deep canvas #101722; raised surface #182230; primary text #eef2f6; secondary text #b2bece; cool highlight #b8d4e6; focus light #e5bd8f. Light mode remains available.

Type: locally bundled Manrope variable for UI, reading text, and headings. The approved wordmark keeps its own styling. Body 15–16px; controls 14px; metadata 11–12px; page headings 34–44px. Reading lines stay below 72 characters.

## Layout comparison
Keep content left aligned.

Rejected: another large decorative banner above an unchanged small-text grid.

Selected: existing useful page structure, stronger content scale, calmer section labels, and one clear action per card.

[ Navigation ] [ Title / course context                   ]
               [ Current learning / purposeful artwork   ]
               [ Filters or learning sequence            ]
               [ Readable content          | Next action ]

## Review before implementation
The repeated italic phrase, all-caps microcopy, and numbered domain cards were decorative defaults. Remove the repeated italic emphasis and domain numbering; retain numbers only for learning/project sequences. Do not add unrelated new features or redesign the approved logo. Preserve requested click effects and opening sequence, with reduced motion supported. Local preview only; do not push or deploy.

## Second pass: visible overview redesign
The first pass was too close to the existing page. Replace its slogan banner and equal metric cards with an asymmetric learning desk.

[ Greeting / selected course            | Change direction ]
[ Next concept / large lesson title     | Learning sequence ]
[ Why it matters / Learn CTA            | Actual completion ]
[ Streak / completed tasks / XP / projects inline strip     ]
[ Current project / next step           | Career preparation]

Use the existing palette and Manrope. A large lesson number watermark and connected lesson rail are the focal point, tied to the actual sequence. Keep alignment left, preserve approved branding and cinematic interaction effects. No fabricated achievements or opportunities.

## Welcome/setup redesign
Brief: the space image and huge serif slogan make onboarding feel generic. Focus on students choosing a direction.
Palette: midnight #101923, panel #172532, divider #344755, text #f0f4f5, muted #adbec8, silver-blue #b9d5df. Retain copper only in approved logo.
Type: Manrope throughout, 46–60px opening headline desktop, 32px mobile; form heading 30px, body 15px, labels 13px. No italic accent or tracked all-cap slogans.
Rejected: another cinematic space image behind an oversized slogan.
Selected: a career route diagram as a precise visual explanation, alongside a focused setup form. Left aligned typography, meaningful stage numbers only in setup and learning sequence.
[ NextStep                       Setup: Details / Direction ]
[ Make your next move clear.     | Tell us where you are.   ]
[ Context + career route diagram| Name / Course / Year      ]
[ Learn → Practise → Build      | Continue                  ]
The route shows what the product does, not fictional achievements. Small-screen intro is compact and the form appears quickly. Preserve existing profile logic, Boss, logo, and other pages. Motion draws a route once on entry, supports reduced motion, and focus responds to input.
