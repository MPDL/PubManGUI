# Copilot instructions for PubManGUI

This file contains short, focused guidance for an AI coding agent to be immediately productive in this repository.

- Repository type: Angular application (Angular CLI, Angular 20.x). Source root: `src/`.
- Project name (angular.json): `PubManGUI`. Components are organized under `src/app/components/`.

Quick start commands
- Run dev server: `npm start` or `ng serve` (default configuration `development` with `src/proxy.conf.json`).
- Build: `npm run build` or `ng build` (use `--configuration` for `gui-inge`, `gui-inge-external`, or `development`).
- Unit tests: `npm test` (Karma configured via `angular.json` / `tsconfig.spec.json`).
- E2E / Cypress: `npm run cypress:open`, `npm run cypress:run`, or `ng e2e` (see `cypress.config.ts`).
- Bundle analysis: `npm run analyze-bundle` (runs `ng build --configuration=analyze-bundle` then `source-map-explorer`).

Important files & places to inspect
- App entry: `src/main.ts`, `src/index.html`.
- Routing: `src/app/app.routes.ts`.
- Shared UI: `src/app/components/shared/` (example: `person-autosuggest` component).
- Services: `src/app/services/` (REST integration and business logic live here).
- Environments: `src/environments/*.ts` (see `angular.json` file replacements for `gui-inge` / `gui-inge-external`).
- Styles: `src/scss/` (project-wide SCSS, partials under `abstract/`, `components/`, `themes/`).
- Cypress tests: `cypress/e2e/`, fixtures in `cypress/fixtures/`, config at `cypress.config.ts`.

Conventions and patterns specific to this codebase
- Components: generated as standalone by default (schematics configured in `angular.json`). SCSS is the default style language.
- File organization: feature folders under `src/app/components/` with `shared`, `pages`, `pipes`, `directives`, `services` directories.
- Prefix: Angular component selector prefix is `pure` (see `angular.json` -> `prefix`).
- i18n: uses `@ngx-translate` and `src/assets/i18n` for translations.
- REST endpoints: services read `restUrl` from the environment files (check `src/environments/environment*.ts`).

E2E testing specifics
- E2E tests require an existing backend user & context (documented in `README.md`).
- Local `cypress.env.json` should contain `restUrl`, `testUser`, and `testContext` fields (see README example).
- To change baseUrl on the fly use `CYPRESS_baseUrl=... npm run cypress:run` or pass `CYPRESS_baseUrl` when invoking `ng e2e`.
- Firefox-specific preference for localhost/proxy is set in `cypress.config.ts` (keep when updating launch logic).

Development notes for code edits
- When adding new components prefer `ng generate component <name>` (schematics already set to create standalone SCSS components).
- Put shared utilities in `src/app/utils/`, pipes in `src/app/pipes/`, and common services in `src/app/services/`.
- Environment-specific builds use Angular file replacements described in `angular.json` (use `--configuration` to select).

Where to look for examples
- Authentication/login flows: check `src/app/components/shared` and any `services/*auth*` files.
- Item editing and selection flows: `src/app/components/item-edit/`, `src/app/services/item-selection.service.ts`.
- E2E tests that exercise common flows: `cypress/e2e/login.cy.ts`, `cypress/e2e/new-item.cy.ts`.

If you need clarification
- Ask which environment to target (local backend, gui-inge, or gui-inge-external).
- Ask for sample credentials/fixtures for E2E runs if required.

Notes
- No existing `.github/copilot-instructions.md` or AGENT.md variants were found — this file is additive.
- Avoid changing global Angular configuration unless necessary; follow existing schematics and styles.

Please review and tell me which sections need more details or examples.
