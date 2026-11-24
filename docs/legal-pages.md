# Per-game legal pages

Adding a new game to `imprfct.dev` generates three static pages automatically:

- `/<slug>/privacy` (Privacy Policy for Google Play, App Store, and in-game links)
- `/<slug>/delete` (Public Account and Data Deletion page for Google Play App content)
- `/<slug>/terms` (Terms of Use)

## How to add a new game

1. Copy `src/data/games/cap-duel.ts` to `src/data/games/<slug>.ts`.
2. Fill in the game's real store IDs (`packageId` / `bundleId`), active processors from `src/data/legal/processors.ts`, actual data categories, consent controls, and deletion scope.
3. Import and add the config object to `GAMES` in `src/data/games/index.ts`.
4. Run `npm run build` and check `/<slug>/privacy`, `/<slug>/delete`, and `/<slug>/terms`.

Studio-wide defaults live in `src/data/legal/studio.ts`.

## Cap Duel release status

Completed in code:
- `imprfct-gg` `main` (`7c49b79445612662688aa382650491ebef55bccb`): Unity SDK consent gating (`RequireTelemetryConsent`, `SetTelemetryConsent`), `410 player_deleted` rejection on `POST /v1/events`, `LiveObject` erasure on account deletion, and 7-day analytics catalog snapshot expiry in provisioning.
- `cap-duel` (`edc394e1`): pinned `com.imprfct.gg`, fixed startup `LifetimeScope` registration, shows first-launch consent dialog right after splash on both Android (without server region lookup) and iOS, wired `gg` + Adjust + GameAnalytics + Voodoo consent and withdrawal, removed Meta SDK and dependencies, aligned both mobile IDs to `com.imprfct.capduel`, added `Home > Settings > Delete Account` and `Home > Settings > Privacy Policy` across all 6 languages.

Remaining steps before sending builds to players:
1. Deploy `landing` so `https://imprfct.dev/cap-duel/privacy`, `/cap-duel/delete`, and `/cap-duel/terms` return HTTP 200 publicly.
2. Deploy the latest `imprfct-gg` Worker and apply provisioning so `410 player_deleted`, `LiveObject` cleanup, and 7-day catalog snapshot expiry are live.
3. Package native Android AAB and iOS IPA and verify consent, withdrawal, in-game deletion, and `Privacy Policy` links on real devices.
4. Fill Google Play Data Safety (Privacy Policy URL: `https://imprfct.dev/cap-duel/privacy`, Account Deletion URL: `https://imprfct.dev/cap-duel/delete`) and Apple App Privacy from the final packaged builds.
