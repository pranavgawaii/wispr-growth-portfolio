# Wispr Growth Portfolio

An independent portfolio by **Pranav Gawai**, combining engineering projects, voice experiments and a proposed first-month growth plan for Wispr.

## What’s included

- **Selected projects:** case studies for Auren, Mnemo, Travio, PlacePro and fahh alert, covering the problem, implementation, decisions and results.
- **Voice Lab:** recorded voice examples, prepared text comparisons and input through installed Wispr Flow or supported browser speech recognition.
- **One Breath:** a voice practice game with timed missions, local profiles, replay examples, friendly challenge invitations and an optional shared leaderboard.
- **Growth proposal:** an interactive first-month journey and campaign research, clearly presented as proposed work rather than measured results.
- **Portfolio details:** GitHub activity, technical stack, contact links, light and dark themes, and responsive layouts.

## One Breath

Choose a nickname, select a team update, interview introduction or read-back mission, then practise for 30, 60 or 120 seconds. Use your installed Wispr Flow app, a supported browser microphone or your keyboard. Review the text and result, then share a challenge with a friend.

Scoring uses explicit keyword, word-budget and ordered text-matching rules. It does not assess pronunciation or meaning with an AI model. Replay Studio uses prepared examples. Shared scores are honor-system practice scores, with no prizes or Wispr credits.

## Local development

Requires **Node.js 22** and npm.

```sh
npm ci
npm run dev
```

Open [localhost:5173](http://localhost:5173). Local practice does not require an external database.

| Command          | Purpose                                              |
| ---------------- | ---------------------------------------------------- |
| `npm run dev`    | Start the local frontend and API                     |
| `npm run check`  | Build, test, lint, unused-code and formatting checks |
| `npm run build`  | Generate the production build in `dist/`             |
| `npm start`      | Serve the production build locally                   |
| `npm run format` | Format source and configuration files                |

## Repository structure

```text
src/       Portfolio UI, One Breath and project case studies
api/       Serverless API entry point
server/    Local HTTP server, scoring API and Redis adapter
shared/    Public routes and social metadata
public/    Images, recordings, icons and WebP share banners
tests/     Scoring, API, storage and metadata tests
config/    Lint configuration and formatting exclusions
licenses/  Third-party attribution
.github/   Automated repository checks
```

## Routes

The portfolio opens at `/`. Section paths include `/projects/`, `/experiment/`, `/voice-lab/`, `/tech-stack/`, `/growth-plan/`, `/contact/` and `/footer/`.

Project case studies use `/projects/<slug>/`, with dedicated section paths such as `/projects/auren/problem/`. The complete collection is at `/projects/all/`.

One Breath opens at `/one-breath/`, with separate `/challenge/`, `/leaderboard/`, `/how-to-play/` and `/settings/` pages beneath that path.

## Configuration and privacy

See `.env.example` for supported variables. Export local server variables through your shell or pass them with Node’s `--env-file` option. Never commit credentials or expose database tokens with a `VITE_` prefix.

Profiles, photos, preferences and practice history stay in browser storage. Local server scores use `.data/`. A deployed shared leaderboard requires Redis and stores submitted nicknames and score summaries, not transcripts, photos or audio. Invitation URLs contain the nickname and score included in the invitation.

Vercel Analytics is optional and disabled unless `VITE_ANALYTICS_ENABLED=true`. Query strings and hashes are removed before analytics events are sent.

## Deployment and share previews

`vercel.json` provides hosting configuration for the static frontend and serverless API. Configure `SITE_URL` with your public HTTPS origin and connect a dedicated Redis database using the server-only variables in `.env.example`.

The build creates route-specific HTML metadata and WebP banners for portfolio, project and product links. Public previews require a working domain; social platforms may cache older cards.

Dependencies, build output, credentials and local player data are excluded from Git. This is an independent project and is not affiliated with or endorsed by Wispr.
