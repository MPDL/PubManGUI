describe('Edit Item', () => {
  const loginName = Cypress.env('testUser').loginName
  const password = Cypress.env('testUser').password
  let itemId: string;
  let itemData: any;

  beforeEach(() => {
    cy.loginViaAPI(loginName, password)
    cy.fixture('itemMetadataArticleRequiredFields').then((data) => {
      cy.createItemViaAPI(data).then((response) => {
        itemId = response.body['objectId']
      })
    })
    cy.fixture('itemMetadataArticleEdited').then((data) => {
      itemData = data
    })
  })

  afterEach(() => {
    cy.deleteItemViaAPI(itemId)
    cy.logoutViaAPI()
  })

  it('Edit an existing Item (Edit Title + Add Alternative Title)', () => {
    //Given
    cy.visit('/edit/' + itemId)
    cy.intercept('PUT', '/rest/items/*').as('editItem')

    const title = itemData.metadata.title
    const alternativeTitleType = itemData.metadata.alternativeTitles[0].type
    const alternativeTitleValue = itemData.metadata.alternativeTitles[0].value

    //When
    cy.get('textarea[data-test="title"]').clear()
    cy.get('textarea[data-test="title"]').type(title)

    cy.get('[data-test="alternativeTitles-add-remove-buttons"]').find('button[name="add"]').click({force: true})
    cy.get('select[id="alt_title_type"]').select('5: ' + alternativeTitleType)
    cy.get('input[id="alt_title_value"]').type(alternativeTitleValue)

    cy.get('button[data-test="save"]').click()

    //Then
    cy.wait('@editItem').then((interception) => {
      // @ts-ignore
      expect(interception.response.statusCode).to.equal(200)
      // @ts-ignore
      itemId = interception.response.body['objectId']

      // Verify the item was created with correct metadata
      cy.getItemViaAPI(itemId).then((response) => {
        expect(response.body.metadata).to.deep.equal(itemData.metadata)
      })

      //TODO: Getting the pure-notification fails from time to time: Check when exactly the notification is displayed
      //cy.get('pure-notification', {timeout: 10000}).should('exist')
    })
  })

})
