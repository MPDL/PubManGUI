describe('New Import', () => {
  let itemIds: string[] = [];

  beforeEach(() => {
    cy.loginViaAPI(Cypress.env('testUser').userName, Cypress.env('testUser').password)
    cy.visit('/imports/new')
  })

  afterEach(() => {
    if(itemIds.length > 0){
      cy.deleteItemsViaAPI(itemIds)
    }
    cy.logoutViaAPI()
  })

  const iDfetchTestCases = [
    {
      description: 'ID Fetch from Crossref',
      source: 'crossref',
      identifier: '10.1038/d41586-025-01269-8'
    },
    {
      description: 'ID Fetch from arXiv',
      source: 'arxiv',
      identifier: 'arXiv:2301.00460'
    }
  ];

  iDfetchTestCases.forEach(({ description, source, identifier }) => {
    it(description, () => {
      // Given
      cy.intercept('GET', '/rest/dataFetch/*').as('fetch')

      // When
      //TODO: Move the select of the source behind the context selection. As soon as the Context select error is fixed
      cy.get('select[formcontrolname="source"]').select(source)
      //FIXME: Sometimes no context can be selected! After some time it can be selected?
      cy.get('select[data-test=fetch-context]').select(Cypress.env('testContext').name)
      //TODO: Use other test IDs?
      cy.get('input[formcontrolname="identifier"]').type(identifier)
      cy.get('button[data-test=fetch-button]').click()

      // Then
      cy.wait('@fetch').its('response.statusCode').should('eq', 200)
      cy.url().should('contains', 'edit_import')
      //TODO : Check attributes of the fetched item
    })
  })

  const fileImportTestCases = [
    {
      description: 'File Import of a BibTeX file',
      fileName: 'BibTeXSample.bib',
      format: 'BIBTEX_STRING',
      formatConfigValue: undefined,
      expectedItemCount: 3
    },
    {
      description: 'File Import of a Web os Science file',
      fileName: 'WOSSample.txt',
      format: 'WOS_STRING',
      formatConfigValue: 'OTHER',
      expectedItemCount: 3
    }
  ];

  fileImportTestCases.forEach(({ description, fileName, format, formatConfigValue, expectedItemCount }) => {
    it(description, () => {
      //Given
      cy.intercept('POST', '/rest/import/import*').as('import')

      //When
      cy.get('[data-test=file-upload-input]').selectFile({contents: 'cypress/fixtures/' + fileName,}, {force: true})
      cy.get('#fileName').invoke('val').should('contain', fileName)
      cy.get('#selectedFile').invoke('text').should('contain', fileName)

      cy.get('select[data-test=import-context]').select(Cypress.env('testContext').name)
      cy.get('select[formControlName="format"]').select(format)
      cy.get('input[formControlName="importName"]').type('Cypress Test Import ' + new Date().toISOString())

      if (formatConfigValue !== undefined) {
        cy.get('select[formcontrolname="formatConfig"]').should('have.value', formatConfigValue)
      }

      cy.get('[data-test=import-button]').click()

      //Then
      cy.wait('@import').then((interception) => {
        // @ts-ignore
        expect(interception.response.statusCode).to.equal(200)

        // @ts-ignore
        let importId = interception.response.body['id'];

        cy.repeatedRequest('GET', Cypress.env('restUrl') + '/import/importLog/' + importId, null,
          'status', ['FINISHED'], 10, 1000).then((response) => {
          // @ts-ignore
          expect(response.status).to.equal(200)
          // @ts-ignore
          expect(response.body['status']).to.equal('FINISHED')

          cy.getImportLogItemIdsViaAPI(importId).then((itemIdsResponse) => {
            itemIds = itemIdsResponse;
            cy.log('Imported Item IDs: ' + itemIds.join(', '))
            expect(itemIdsResponse.length).to.be.equal(expectedItemCount)

            //TODO: Check the imported items via REST
          })
        })
      })
    })
  })

})
