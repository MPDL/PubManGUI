describe('Check Batch Logs', () => {
  const userName = Cypress.env('testUser').userName
  const password = Cypress.env('testUser').password
  let itemId: string;
  let itemTitle: string;

  beforeEach(() => {
    cy.setLanguage('en')
    cy.loginViaAPI(userName, password)
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
    window.localStorage.setItem('dataset-list', JSON.stringify(new Array(itemId)))
    cy.fixture('localTags').then((localTags) => {
      localTags.itemIds = new Array(itemId)
      localTags.localTags = new Array(newTag)
      cy.addLocalTagsViaAPI(localTags).as('addLocalTags')
    })

    //cy.visit('/batch/logs')
    //TODO: Remove this workaround (Navigating to the logs via buttons). Use cy.visit('/batch/logs') as soon as it works.
    cy.visit('/batch/datasets')
    cy.get('pure-batch-nav li').eq(2).click({force: true})

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
