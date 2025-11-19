describe('Create Item', () => {
  const loginName = Cypress.env('testUser').loginName
  const password = Cypress.env('testUser').password
  const context = Cypress.env('testContext').name
  let itemId: string;

  beforeEach(() => {
    cy.loginViaAPI(loginName, password)
  })

  afterEach(() => {
    cy.deleteItemViaAPI(itemId)
    cy.logoutViaAPI()
  })

  //TODO: Adapt the test & Remove skip() as soon as the edit item view is finished
  it.skip('Create Item', () => {
    //Given
    cy.visit('/edit')
    cy.intercept('POST', '/rest/items').as('createItem')
    const title = "Cypress Test Create-Item"

    //When
    cy.get('select[data-test="context"]').select(context)
    cy.get('select[data-test="genre"]').select('ARTICLE')
    //cy.get('input[data-test="degree"]').type("The Degree")
    cy.get('input[data-test="title"]').type(title)

    cy.get('[data-test="add-remove-creators"]').find('button[name="add"]').click()
    cy.get('select[data-test="creator"]').select('AUTHOR')
    //TODO: Improve Selecting the Elements & Add test case without autocomplete
    //cy.get('[data-test="familyname-autosuggest"]').find('input').type("Family name")
    //cy.get('[data-test="givenname"]').type("Given name")
    //cy.get('[data-test="add-remove-organizations"]').find('button[name="add"]').click()
    cy.get('[data-test="familyname-autosuggest"]').find('input').type("Test")
    cy.get('[data-test="familyname-autosuggest"]').find('button').first().find('ngb-highlight').click()

    cy.get('input[data-test="date-created"]').type("2024-09-26")

    cy.get('button[data-test="save"]').click()

    //Then
    cy.wait('@createItem').then((interception) => {
      // @ts-ignore
      expect(interception.response.statusCode).to.equal(201)
      // @ts-ignore
      itemId = interception.response.body['objectId']
      //TODO: Check creation message in the GUI
      cy.getItemViaAPI(itemId).then((response) => {
        //TODO: Check more item metadata
        expect(response.body.metadata.title).to.equal(title)
      })

    })
  })

})
