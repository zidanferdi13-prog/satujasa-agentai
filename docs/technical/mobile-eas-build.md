# Mobile EAS Android APK Build

Last verified successful APK build:

- Platform: Android
- EAS profile: `preview`
- Build ID: `cf8a478d-164f-4647-9336-2660a3ed2b80`
- Build logs: https://expo.dev/accounts/zidanferdi13/projects/stnk-jasa/builds/cf8a478d-164f-4647-9336-2660a3ed2b80
- APK artifact: https://expo.dev/artifacts/eas/38KE0hlRcJAi-cTSAQArs2TxcUG__eMVSsAXbK9UB94.apk

## Why standalone build folder is used

The mobile app lives inside the project monorepo at `apps/mobile`. EAS Build repeatedly detected `apps/mobile` as an npm workspace and failed during dependency installation with npm internal errors. A standalone mobile export/folder avoids the monorepo root lockfiles and workspace detection.

For repeatable APK builds, use a clean standalone folder that contains only the mobile app files and uses Yarn 1 lockfile resolution.

## Known pitfalls fixed

- Do not build directly from monorepo root or `apps/mobile` while EAS detects it as workspace.
- Use `yarn.lock` for the standalone mobile build; do not include `package-lock.json` in the standalone build folder.
- `yarn.lock` must not reference unavailable registry mirrors such as `mirrors.tencentyun.com`; use npm registry URLs.
- Expo SDK 56 config must not include unsupported top-level `splash` or `schemes` fields; use valid config fields.
- Asset paths must point to existing files:
  - `./assets/splash-icon.png`
  - `./assets/android-icon-foreground.png`
  - `./assets/android-icon-background.png`
- `tabBarIcon` color typing must accept React Native `ColorValue`, not only `string`.

## Verification before build

From the standalone mobile folder:

```bash
npx yarn@1.22.22 install --frozen-lockfile --production false --registry https://registry.npmjs.org --ignore-scripts
npm run typecheck
npx expo-doctor
npx expo prebuild --clean --no-install --platform android
rm -rf android
```

Expected result:

- Yarn install succeeds.
- TypeScript typecheck succeeds.
- Expo Doctor reports all checks passed in the standalone folder.
- Expo prebuild succeeds.

## Build command

From the standalone mobile folder:

```bash
set -a && . ./.env.local && set +a
npx eas-cli build --platform android --profile preview --non-interactive --clear-cache
```

`.env.local` must provide the EAS/Expo token locally. Do not commit or print token values.

## UAT smoke test checklist

Install the APK on an Android device and verify:

- App opens without crashing.
- Splash/login screen renders.
- Login succeeds with a valid account.
- Dashboard opens after login.
- Tabs open without crashing:
  - Dashboard
  - Berkas
  - Harga
  - Pengaturan
- API calls target `https://satujasa.my.id/api/v1`.
- Logout/session behavior is acceptable for preview testing.

## Rollback notes

If APK build breaks again:

1. Check EAS failed phase and logs first.
2. If dependency install fails, verify the standalone folder contains `yarn.lock` and no `package-lock.json`.
3. If app config/prebuild fails, run `npx expo-doctor` and `npx expo prebuild --clean --no-install --platform android` locally in the standalone folder.
4. If Gradle/native build fails, inspect EAS Gradle logs and avoid changing unrelated API/frontend code.
