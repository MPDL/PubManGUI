declare namespace Cypress {
  interface Chainable {
    /**
     * Login using the REST API & Setting the token in the Local Storage
     */
    loginViaAPI(username: string, password: string): void

    /**
     * Logout using the REST API
     */
    logoutViaAPI(): void

    /**
     * Logout by clearing the Local Storage
     */
    logoutByClearingLocalStorage(): void

    /**
     * Delete Item using the REST API
     */
    deleteItemViaAPI(itemId: string): void

    /**
     * Get Item using the REST API
     */
    getItemViaAPI(itemId: string):  Chainable<Cypress.Response<any>>

    /**
     * Create Item using the REST API
     */
    createItemViaAPI(itemMetadata: string):  Chainable<Cypress.Response<any>>
  }
}
