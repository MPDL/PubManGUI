declare namespace Cypress {
  interface Chainable {
    /**
     * Set the language in the Local Storage (set locale to "en" or "de")
     */
    setLanguage(locale: string): void

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
     * Delete multiple Items using the REST API
     */
    deleteItemsViaAPI(itemIds: string[]): void

    /**
     * Get Item using the REST API
     */
    getItemViaAPI(itemId: string): Chainable<Cypress.Response<any>>

    /**
     * Create Item using the REST API
     */
    createItemViaAPI(itemMetadata: string): Chainable<Cypress.Response<any>>

    /**
     * Repeat cy.wait until the response of a request for the given alias contains one of the given responseBodyValues
     */
    repeatedWait(
      alias: string,
      responseBodyKey: string,
      responseBodyValues: string[],
      waitTimeout: number,
      maxNumberOfWaits: number
    ): Chainable<Cypress.Response<any>>

    /**
     * Repeatedly sends a request until the response contains one of the given responseBodyValues or max attempts are reached
     */
    repeatedRequest(
      method: string,
      url: string,
      body: any,
      responseBodyKey: string,
      responseBodyValues: string[],
      maxNumberOfWaits: number,
      waitTimeBetweenRequests: number
    ): Chainable<Cypress.Response<any>>

    /**
     * Add Local Tags via Batch using the REST API
     */
    addLocalTagsViaAPI(itemMetadata: string): Chainable<Cypress.Response<any>>

    /**
     * Get all successfully processed item IDs from the importLogItems request
     */
    getImportLogItemIdsViaAPI(importLogId: string): Chainable<string[]>

    /**
     * Delete an import log via API
     */
    deleteImportLogViaAPI(importLogId: string): void

    /**
     * Start an import via API
     */
    createImportViaAPI(importName: string, contextId: string, format: string, importFileContent: string): Chainable<Cypress.Response<any>>
  }
}
