# Boss assistant

Boss is an additive overlay. Existing pages, learning progress, project notes, and resume data are not modified by the assistant.

## Connect live AI

1. Choose Groq or OpenAI and create an API key in your own account. Provider requests may incur usage charges.
2. Copy `.env.example` to `.env` in this project folder, if `.env` does not already exist.
3. For Groq, set `AI_PROVIDER=groq`, `GROQ_API_KEY`, and `GROQ_MODEL=openai/gpt-oss-120b`. For OpenAI, set `AI_PROVIDER=openai`, `OPENAI_API_KEY`, and `OPENAI_MODEL=gpt-5-mini`. Enter the selected provider’s key in that private local file. Never paste it into chat, browser code, screenshots, or a commit. `.env` is ignored by Git and is outside the static web root.
4. Optionally choose a supported model available to your provider account. The server uses Groq Chat Completions or OpenAI Responses according to the provider setting.
5. Restart the local Node server, then use **Check connection again** in Boss. A configured key does not guarantee provider access or sufficient quota; the first real request verifies those.

Official references: [Groq quickstart](https://console.groq.com/docs/quickstart), [OpenAI quickstart](https://developers.openai.com/api/docs/quickstart), [GPT-5 mini](https://developers.openai.com/api/docs/models/gpt-5-mini).

Without a key, Boss explicitly displays that live AI is not connected. Its greeting and built-in site guide work, but arbitrary question answering is unavailable. No canned answer is presented as a generated AI response.

## Open Boss

- Click **Ask Boss**, or press **Alt+B**.
- With a supporting browser, open Voice controls, read the disclosure, and enable listening for **Boss**. Microphone permission must be granted in the browser. A visible microphone indicator stays on while listening. Wake listening transitions to conversation mode after activation. Close Boss, stop the microphone, hide the tab, or leave the page to end the session. No-speech retries are bounded.
- Recognition is best-effort browser speech recognition, not an offline wake-word engine. Saying “Hey Boss” plus a question submits the question directly; saying only the wake phrase gives a short spoken acknowledgement and listens for the question. Browser service support, network, language availability, and permission policies affect it. [MDN speech recognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition).
- Talk to Boss is conversation mode: recognised questions are submitted automatically. After the spoken answer finishes, it listens again. The separate “Dictate text without sending” option puts recognised text in the composer for review.
- Spoken replies are on by default unless explicitly muted. Use the speaker button to mute/unmute and Play last answer to retry browser audio. Spoken answers are not verified more accurately than text answers. Large code blocks are kept in the visual chat.

## Data and boundaries

- Conversations live in tab memory only. A new conversation clears them from this interface. Messages and up to six prior turns are sent to the configured provider on submission. OpenAI Responses requests use `store: false`. Groq requests use its Chat Completions API. These settings are not a claim of zero provider retention.
- Optional learning context contains course area, year, selected direction, technology preference, page, and current lesson title. The server adds relevant introductory catalog content. Names, contact details, resume text, project notes, and private files are not automatically included. Anything the user types into chat is part of their submitted message.
- No live web tools or code execution are attached. The assistant must state uncertainty about current facts and must not invent credentials, job listings, fees, deadlines, or achievements. It cannot change student progress or guarantee career outcomes.
- The local server uses same-origin checks, body/history limits, an upstream timeout, bounded concurrency, and rate limiting. This loopback development server is not a multi-user production deployment. A hosted version needs authenticated users, per-user quotas, secret management, logging/privacy decisions, and evaluation with teachers and students.

## Verification

`npm run check` checks syntax. `npm run test:boss` runs tests with a simulated provider; it does not validate real AI quality, microphone recognition, or provider credentials. Evaluate real answers and voice behaviour after connecting an account and explicitly enabling the microphone.
