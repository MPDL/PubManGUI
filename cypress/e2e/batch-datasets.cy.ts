describe('Add and Remove Item to/from Batch', () => {
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
    cy.get('[data-test="item-title"]').contains(itemTitle).parents('pure-item-list-element').find('[type="checkbox"]').check()
    cy.get('[data-test="add-to-batch"]').click()

    //Then
    //TODO: Check the exact confirmation message is displayed
    cy.get('pure-messaging').should('exist')
    cy.get('[data-test="batch-badge"]').contains('1').should('be.visible')

    cy.visit('batch/datasets')
    cy.get('[data-test="item-title"]').contains(itemTitle).parents('pure-item-list-element').should('be.visible')
    cy.get('pure-item-list-element').should('have.length', 1)
  })

  it('Remove Item from Batch', () => {
    //Given
    window.localStorage.setItem('dataset-list', JSON.stringify(new Array(itemId)))
    cy.visit('/batch/datasets')

    //When
    cy.get('[data-test="item-title"]').contains(itemTitle).parents('pure-item-list-element').find('[type="checkbox"]').check()
    cy.get('[data-test="remove-from-batch"]').click()

    //Then
    //TODO: Check the exact confirmation/empty-batch message is displayed
    cy.get('pure-messaging').should('exist')
    cy.contains(itemTitle).should('not.exist');
  })

})
