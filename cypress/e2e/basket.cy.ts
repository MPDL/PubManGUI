describe('Add and Remove Item to/from Basket', () => {
  const loginName = Cypress.env('testUser').loginName
  const password = Cypress.env('testUser').password
  let itemId: string
  let itemVersionNumber: string
  let itemTitle: string

  beforeEach(() => {
    cy.loginViaAPI(loginName, password)
    cy.fixture('itemMetadataMinimal').then((itemMetadata) => {
      cy.createItemViaAPI(itemMetadata).then((response) => {
        itemId = response.body.objectId
        itemVersionNumber = response.body.versionNumber
        itemTitle = response.body.metadata.title
      })
    })
  })

  afterEach(() => {
    cy.deleteItemViaAPI(itemId)
    cy.logoutViaAPI()
  })

  it('Add Item to Basket', () => {
    // Given
    cy.visit('/my')

    // When
    cy.get('[data-test="item-title"]').contains(itemTitle).parents('pure-item-list-element').find('[type="checkbox"]').check()
    cy.get('[data-test="add-to-basket"]').click()

    // Then
    // TODO: Check the exact confirmation message is displayed
    cy.get('pure-notification').should('exist')
    cy.get('[data-test="sidenav-basket"]').find('.matBadge').should('exist')

    cy.visit('/cart')
    cy.get('[data-test="item-title"]').contains(itemTitle).parents('pure-item-list-element').should('be.visible')
    cy.get('pure-item-list-element').should('have.length', 1)
  })

  it('Remove Item from Basket', () => {
    // Given
    let itemIdWithVersionNumber = itemId + "_" + itemVersionNumber
    window.localStorage.setItem('cart-items', JSON.stringify(new Array(itemIdWithVersionNumber)))
    cy.visit('/cart')

    // When
    cy.get('[data-test="item-title"]').contains(itemTitle).parents('pure-item-list-element').find('[type="checkbox"]').check()
    cy.get('[data-test="remove-from-basket"]').click()

    // Then
    // TODO: Check the exact confirmation/empty-basket message is displayed
    cy.get('pure-notification').should('exist')
    cy.contains(itemTitle).should('not.exist')
  })
})
