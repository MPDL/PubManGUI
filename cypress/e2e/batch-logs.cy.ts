describe('Check Batch Logs', () => {
  const loginName = Cypress.env('testUser').loginName
  const password = Cypress.env('testUser').password
  let itemId: string;
  let itemTitle: string;

  beforeEach(() => {
    cy.setLanguage('en')
    cy.loginViaAPI(loginName, password)
    cy.fixture('itemMetadataMinimal').then((itemMetadata) => {
      cy.createItemViaAPI(itemMetadata).then((response) => {
        itemId = response.body['objectId']
        itemTitle = response.body.metadata.title
      })
    })
  })

  afterEach(() => {
    cy.deleteItemViaAPI(itemId)
    cy.logoutViaAPI()
  })

  it('Read Batch Log (Add Local Tags)', () => {
    //Given
    let newTag: string = 'NewCypressTag';
    cy.fixture('localTags').then((localTags) => {
      localTags.itemIds = new Array(itemId)
      localTags.localTags = new Array(newTag)
      cy.addLocalTagsViaAPI(localTags).as('addLocalTags')
    })

    cy.visit('/batch/logs')

    //When
    cy.get('@addLocalTags').then(response => {
      // @ts-ignore
      let batchLogUrl = "/batch/logs/" + response.body.batchLogHeaderId
      cy.get('a[href="' + batchLogUrl + '"]').as('logDetails').closest('tr').as('logRow')
    })
    cy.get('@logRow').children().first().should('contain.text', 'Finished')
    cy.get('@logDetails').click()

    //Then
    cy.get('pure-batch-action-dataset-log').should('have.length', 1)
      .should('contain.text', 'Success').should('contain.text', itemTitle)
    //TODO: Check 'Message' Column
  })

})
