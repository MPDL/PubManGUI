import { defineConfig } from 'cypress'

export default defineConfig({
  watchForFileChanges: false,
  e2e: {
    baseUrl: 'https://localhost:4200',

    // To consider connections to localhost as secure even when they are routed through a (Cypress) proxy,
    // we need to set the Firefox preference 'network.proxy.testing_localhost_is_secure_when_hijacked' to true.
    // This is necessary for Firefox to handle login cookies with Secure:true in combination with the Cypress proxy correctly.
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'firefox') {
          launchOptions.preferences['network.proxy.testing_localhost_is_secure_when_hijacked'] = true
        }
        return launchOptions
      })
    }
  },
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: '**/*.cy.ts'
  }
})
