describe('My Imports', () => {
  const loginName = Cypress.env('testUser').loginName
  const password = Cypress.env('testUser').password
  let importName = 'Cypress Test Import ' + new Date().toISOString()
  let importLogId: string
  let itemIds: string[] = []
  let itemNames: string[] = []
  const baseUrl = baseUrlWithoutTrailingSlashes()

  beforeEach(() => {
    window.localStorage.setItem('locale', 'en')
    cy.loginViaAPI(loginName, password)

    // Create import
    cy.fixture('BibTeXSample.bib').then(importFileContent => {
      cy.createImportViaAPI(importName, Cypress.env('testContext').contextId, 'BIBTEX_STRING', importFileContent)
    }).then(response => {
      importLogId = response.body.id

      // Wait for import to finish
      cy.repeatedRequest('GET', Cypress.env('restUrl') + '/import/importLog/' + importLogId, null, 'status',
        ['FINISHED'], 10, 1000
      ).then(response => {
        expect(response.status).to.equal(200)
        expect(response.body['status']).to.equal('FINISHED')

        // Get item IDs and item Names
        cy.getImportLogItemIdsViaAPI(importLogId).then(itemIdsResponse => {
          itemIds = itemIdsResponse
          cy.wrap(itemIds).each(itemId => {
            // @ts-ignore
            cy.getItemViaAPI(itemId).then(response => {
              itemNames.push(response.body.metadata.title)
            })
          })
        })
      })
    })
  })

  afterEach(() => {
    cy.deleteItemsViaAPI(itemIds)
    cy.deleteImportLogViaAPI(importLogId)
    cy.logoutViaAPI()
  })

  it('My Imports: Check the entry of the test import', () => {
    // Given
    cy.visit('/imports/myimports')

    // Then
    cy.get('pure-import-log').contains(importName).parents('tr').within(() => {
      cy.get('td').first().should('contain.text', 'Finished').and('contain.text', 'check_circle')
      cy.get('td').eq(2).should('contain.text', 'BibTeX')
      cy.get('td').eq(4).find('.mat-badge-content').should('contain.text', '3')
    })
  })

  it('My Imports > Details > Datasets: Check the list of imported items', () => {
    // Given
    cy.visit('/imports/myimports')

    //When
    cy.get('pure-import-log').contains(importName).click()

    // Then
    cy.url().should('eq', baseUrl + '/imports/myimports/' + importLogId + '/datasets')

    let itemTitles = cy.get('[data-test="item-title"]')
    itemTitles.should('have.length', 3);
    itemTitles.should('contain', itemNames[0]).and('contain', itemNames[1]).and('contain', itemNames[2])
  })

  it('My Imports > Details: Check the import details list', () => {
    // Given
    cy.visit('/imports/myimports')

    //When
    cy.get(`pure-import-log:contains("${importName}") [data-test="import-details-link"]`).click()

    // Then
    cy.url().should('eq', baseUrl + '/imports/myimports/' + importLogId)

    cy.get('pure-detail-log').each(detail => {
      cy.wrap(detail).should('contain.text', 'Finished').and('contain.text', 'Success')
    })
  })

  it('My Imports > Details > Log: Check the import details log list', () => {
    // Given
    cy.visit('/imports/myimports/' + importLogId)

    //When
    cy.get(`pure-detail-log:contains("${itemIds[0]}") [data-test="import-details-item-log-link"]`).click()

    // Then
    cy.url().should('eq', baseUrl + '/imports/myimports/' + importLogId + "/log")

    cy.get('[data-test="item-id"]').contains(itemIds[0])

    cy.get('pure-import-item-log').each(log => {
      cy.wrap(log).should('contain.text', 'Finished').and('contain.text', 'Success')
    })
  })

  /**
   * Remove trailing forward slashes from baseUrl
   * (Angulars default baseUrl http://localhost:4200/ has a trailing slash, the baseUrl configured in cypress.config.ts has none)
   */
  function baseUrlWithoutTrailingSlashes() {
    // @ts-ignore
    return Cypress.config().baseUrl.replace(/\/+$/, '')
  }

})
