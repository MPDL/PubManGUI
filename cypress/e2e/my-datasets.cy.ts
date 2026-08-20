describe('My Datasets', () => {

  const loginName = Cypress.env('testUser').loginName
  const password = Cypress.env('testUser').password
  const baseUrl = baseUrlWithoutTrailingSlashes()

  let itemIds: string[]
  let itemTitles: string[]
  let itemStates: string[]
  let authorGivenName: string
  let authorFamilyName: string
  let labels: any
  let publicationYear: string

  beforeEach(() => {
    itemIds = []
    itemTitles = []
    itemStates = []

    cy.loginViaAPI(loginName, password)
    cy.setLanguage('en')
    cy.readLabelsFile().then(i18nFile => {
      labels = i18nFile
    })

    cy.fixture('itemMetadataMinimal').then((baseMetadata) => {
      const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19)
      authorGivenName = baseMetadata.metadata.creators[0].person.givenName
      authorFamilyName = baseMetadata.metadata.creators[0].person.familyName
      publicationYear = baseMetadata.metadata.datePublishedInPrint.slice(0, 4)
      const firstItemMetadata = {...baseMetadata, metadata: {...baseMetadata.metadata, title: `Cypress My Datasets ${timestamp} A`} }
      const secondItemMetadata = {...baseMetadata, metadata: {...baseMetadata.metadata, title: `Cypress My Datasets ${timestamp} B`} }

      cy.createItemViaAPI(firstItemMetadata).then((response) => {
        itemIds.push(response.body.objectId)
        itemTitles.push(response.body.metadata.title)
        itemStates.push(response.body.versionState)
      })

      cy.createItemViaAPI(secondItemMetadata).then((response) => {
        itemIds.push(response.body.objectId)
        itemTitles.push(response.body.metadata.title)
        itemStates.push(response.body.versionState)
      })
    })
  })

  afterEach(() => {
    if (itemIds.length > 0) {
      cy.deleteItemsViaAPI(itemIds)
    }
    cy.logoutViaAPI()
  })

  it('Datasets created by current user are listed and correctly displayed', () => {
    // Given
    cy.intercept('POST', '**/rest/items/elasticsearch').as('itemsSearch')

    // When
    cy.visit('/my')
    cy.wait('@itemsSearch').its('response.statusCode').should('eq', 200)

    // Then
    const expectedGenreLabel = labels.MdsPublicationGenre.REPORT
    const expectedPublicationStateLabel = labels.PublicationState['published-in-print']

    itemTitles.forEach((title, index) => {
      cy.get('[data-test="item-title"]').contains(title)
      cy.get('[data-test="item-badge-genre"]').should('contain', expectedGenreLabel)
      cy.get('[data-test="item-badge-publication-state"]').should('contain', expectedPublicationStateLabel)
      cy.get('[data-test="item-badge-publication-state"]').should('contain', publicationYear)
      cy.get('[data-test="item-badge-state"]').should('contain', labels.ItemState[itemStates[index]])
      cy.get('[data-test="item-authors"]').should('contain', authorFamilyName).and('contain', authorGivenName)
    })
  })

  it('Open item view when clicking a title in My Datasets', () => {
    // Given
    cy.intercept('POST', '**/rest/items/elasticsearch').as('itemsSearch')
    cy.visit('/my')
    cy.wait('@itemsSearch').its('response.statusCode').should('eq', 200)

    // When
    cy.get('[data-test="item-title"]').contains(itemTitles[0]).click()

    // Then
    cy.url().should('contain', baseUrl + '/view/' + itemIds[0])
    cy.get('[data-test="item-title"]').should('contain', itemTitles[0])
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
