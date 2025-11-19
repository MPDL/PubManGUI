describe('New Item', () => {
  const loginName = Cypress.env('testUser').loginName
  const password = Cypress.env('testUser').password
  let itemId: string;
  let itemData: any;

  beforeEach(() => {
    cy.loginViaAPI(loginName, password)
    cy.fixture('itemMetadataArticleRequiredFields').then((data) => {
      itemData = data
    })
  })

  afterEach(() => {
    if (itemId) {
      cy.deleteItemViaAPI(itemId)
    }
    cy.logoutViaAPI()
  })

  it('Create a new item via the edit page with genre Article and only required fields', () => {
    //Given
    cy.visit('/edit')
    cy.intercept('POST', '/rest/items').as('createItem')

    const context = itemData.context.name
    const title = itemData.metadata.title
    const familyName = itemData.metadata.creators[0].person.familyName
    const affiliation = itemData.metadata.creators[0].person.organizations[0].name
    const dateCreated = itemData.metadata.dateCreated
    const sourceGenre = itemData.metadata.sources[0].genre
    const sourceTitle = itemData.metadata.sources[0].title
    const genre = itemData.metadata.genre

    //When
    cy.get('select[data-test="context"]').select(context)

    cy.get('select[data-test="genre"]').select(genre)
    cy.get('textarea[data-test="title"]').type(title)

    cy.get('#familyName').find('input').type(familyName)
    cy.get('[data-test="add-remove-organizations"]').find('button[name="add"]').click()
    cy.get('#personOu1').find('input').type(affiliation)

    cy.get('input[data-test="date-created"]').type(dateCreated)

    cy.get('#sources-metadata').click()
    cy.get('pure-source-form #genre').select(sourceGenre)
    cy.get('#source_title').type(sourceTitle)

    cy.get('button[data-test="save"]').click()

    //Then
    cy.wait('@createItem').then((interception) => {
      // @ts-ignore
      expect(interception.response.statusCode).to.equal(201)
      // @ts-ignore
      itemId = interception.response.body['objectId']

      // Verify the item was created with correct metadata
      cy.getItemViaAPI(itemId).then((response) => {
        expect(response.body.metadata).to.deep.include(itemData.metadata)
      })

      cy.get('pure-notification').should('exist')
    })
  })
})
