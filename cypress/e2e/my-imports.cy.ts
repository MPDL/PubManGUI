describe('My Imports', () => {
  const userName = Cypress.env('testUser').userName
  const password = Cypress.env('testUser').password
  let importName = 'Cypress Test Import ' + new Date().toISOString()
  let importLogId: string

  beforeEach(() => {
    cy.loginViaAPI(userName, password)
    cy.fixture('BibTeXSample.bib').then((importFileContent) => {
      cy.createImportViaAPI(importName, Cypress.env('testContext').contextId, 'BIBTEX_STRING', importFileContent).then(response => {
        importLogId = response.body.id
        // Wait for import to finish
        cy.repeatedRequest('GET', Cypress.env('restUrl') + '/import/importLog/' + importLogId, null, 'status',
          ['FINISHED'], 10, 1000).then((response) => {
            // @ts-ignore
            expect(response.status).to.equal(200)
            // @ts-ignore
            expect(response.body['status']).to.equal('FINISHED')
        })
      })
    })
  })

  afterEach(() => {
    cy.getImportLogItemIdsViaAPI(importLogId).then((itemIdsResponse) => {
      cy.deleteItemsViaAPI(itemIdsResponse)
    })
    cy.deleteImportLogViaAPI(importLogId)
    cy.logoutViaAPI()
  })

  it('Check import entry in My Imports list', () => {
    // Given
    cy.visit('/imports/myimports')

    // Then
    cy.get('pure-import-log').contains(importName).parents('tr').within(() => {
      cy.get('td').first().should('contain.text', 'Finished').and('contain.text', 'check_circle')
      cy.get('td').eq(2).should('contain.text', 'BibTeX')
      cy.get('td').eq(4).find('.mat-badge-content').should('contain.text', '3')
    })
  })
})
