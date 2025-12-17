describe('View Item', () => {
  const loginName = Cypress.env('testUser').loginName
  const password = Cypress.env('testUser').password
  let itemId: string
  let itemData: any
  let translations: any

  beforeEach(() => {
    cy.setLanguage('en')
    cy.loginViaAPI(loginName, password)
    cy.fixture('itemMetadataArticleRequiredFields').then((data) => {
      itemData = data
      cy.createItemViaAPI(data).then((response) => {
        itemId = response.body['objectId']
      })
    })
    cy.readFile('src/assets/i18n/en.json').then((i18n: any) => {
      translations = i18n
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
    const genreLabel = translations.MdsPublicationGenre[itemData.metadata.genre]
    const publicStateLabel = translations.ItemState[itemData.publicState]
    const sourceGenreLabel = translations.SourceGenre[itemData.metadata.sources[0].genre]
    const title = itemData.metadata.title
    const familyName = itemData.metadata.creators[0].person.familyName
    const affiliation = itemData.metadata.creators[0].person.organizations[0].name
    const dateCreated = itemData.metadata.dateCreated
    const sourceTitle = itemData.metadata.sources[0].title

    // When
    cy.visit('/view/' + itemId)

    // Then
    cy.get('pure-item-badges').should('contain', genreLabel)
    cy.get('pure-item-badges').should('contain', publicStateLabel)

    cy.get('[data-test="item-title"]').should('have.text', title)

    cy.get('[data-test="view-metadata-tab"]').click()

    cy.get('[data-test="metadata-creators"]').should('contain', familyName)
    cy.get('[data-test="metadata-creators"]').should('contain', affiliation)

    cy.get('[data-test="metadata-dateCreated"]').should('contain', dateCreated)

    cy.get('[data-test="metadata-sources"]').should('contain', sourceTitle)
    cy.get('[data-test="metadata-sources"]').should('contain', sourceGenreLabel)
  })
})

