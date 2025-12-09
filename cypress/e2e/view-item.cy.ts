describe('View Item', () => {
  const loginName = Cypress.env('testUser').loginName
  const password = Cypress.env('testUser').password
  let itemId: string
  let itemData: any

  beforeEach(() => {
    cy.loginViaAPI(loginName, password)
    cy.fixture('itemMetadataArticleRequiredFields').then((data) => {
      itemData = data
      cy.createItemViaAPI(data).then((response) => {
        itemId = response.body['objectId']
      })
    })
  })

  afterEach(() => {
    if (itemId) {
      cy.deleteItemViaAPI(itemId)
    }
    cy.logoutViaAPI()
  })

  it('Read an item via the view page with genre Article and only required fields', () => {
    //Given
    const genre = itemData.metadata.genre
    const publicState = itemData.publicState
    const title = itemData.metadata.title
    const familyName = itemData.metadata.creators[0].person.familyName
    const affiliation = itemData.metadata.creators[0].person.organizations[0].name
    const dateCreated = itemData.metadata.dateCreated
    const sourceTitle = itemData.metadata.sources[0].title
    const sourceGenre = itemData.metadata.sources[0].genre

    // When
    cy.visit('/view/' + itemId)

    // Then
    cy.get('pure-item-badges').contains(genre, { matchCase: false }).should('exist')
    cy.get('pure-item-badges').contains(publicState, { matchCase: false }).should('exist')

    cy.get('[data-test="item-title"]').should('have.text', title)

    cy.get('[data-test="view-metadata-tab"]').click()

    cy.get('[data-test="metadata-creators"]').should('contain', familyName)
    cy.get('[data-test="metadata-creators"]').should('contain', affiliation)

    cy.get('[data-test="metadata-dateCreated"]').should('contain', dateCreated)

    cy.get('[data-test="metadata-sources"]').should('contain', sourceTitle)
    cy.get('[data-test="metadata-sources"]').contains(sourceGenre, { matchCase: false }).should('exist')
  })
})

