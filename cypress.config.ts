import { defineConfig } from 'cypress'

export default defineConfig({
  watchForFileChanges: false,
  //viewportWidth: mobile view < 1200, truncated username 1200 - 1400, desktop view >= 1200
  viewportWidth: 1400,
  e2e: {
    //baseUrl is set to 'http://localhost:4200/' by default by Angular, if Cypress is started with `ng e2e`
    baseUrl: 'http://localhost:4200',

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
