# PubManGUI

This is the new GUI for the MPG Publication Repository Software PubMan

## Description

This is the new GUI for the MPG Publication Repository Software PubMan. It is based on Angular and revers to the REST interface of the MPG Publication repository Software PubMan

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.6.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

PubManGUI uses [Cypress](https://www.cypress.io/) for end-to-end testing. The tests are located in the [cypress](https://github.com/MPDL/PubManGUI/tree/main/cypress) folder.

### Prerequisites

1. Backend Setup
   - As a precondition for the end-to-end tests a **User** and a **Context** must exist in the PubMan instance under test.
2. Environment Settings
   - Set the _baseUrl_ in [cypress.config.ts](https://github.com/MPDL/PubManGUI/blob/main/cypress.config.ts)
   - Set the values for the required _environment variables_ in [cypress.env.json](https://github.com/MPDL/PubManGUI/blob/main/cypress.env.json)
3. PubManGUI Project Setup
   - Checkout the main Branch: `git checkout main`
   - Build the project: `ng build`

### Execution

To execute the end-to-end tests open the PubManGUI project in the CLI, then run one of the following commands:
- `ng e2e` (Build & Serve the application + Open Cypress UI)
- `npm run cypress:run` (Run Cypress in CLI)
- `npm run cypress:open` (Open Cypress UI)

Use the CLI argument `CYPRESS_baseUrl=NEW_BASE_URL` to set a different baseUrl (default is `http://localhost:4200/` when executing `ng e2e`).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
