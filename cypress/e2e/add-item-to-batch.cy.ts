describe('Add Item to Batch', () => {
  const userName = Cypress.env('testUser').userName
  const password = Cypress.env('testUser').password
  let itemId: string;
  let itemTitle: string;

  beforeEach(() => {
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

  it('Add Item to Batch', () => {
    //Given
    cy.visit('/my')
    //Precondition: The created item is displayed in the 'My datasets' list

    //When
    cy.get('[data-test="item-title"]').contains(itemTitle).parents('[data-test="item-list-element"]').find('[type="checkbox"]').check()
    cy.get('[data-test="add-to-batch"]').click()

    //Then
    //TODO: Check the exact confirmation message is displayed
    cy.get('pure-messaging').should('exist')
    cy.get('[data-test="batch-badge"]').contains('1').should('be.visible')
    //TODO: Check items are correctly added to the list of batch items
  })

})
