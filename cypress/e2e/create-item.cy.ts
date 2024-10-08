describe('Create Item', () => {
  const userName = Cypress.env('testUser').userName
  const password = Cypress.env('testUser').password
  const context = Cypress.env('testContext').name
  let itemId;

  beforeEach(() => {
    cy.loginViaAPI(userName, password)
  })

  afterEach(() => {
    cy.logoutViaAPI()
    //TODO: Delete Item via REST API using itemId
  })

  it('Create Item', () => {
    //Given
    cy.visit('/edit')
    cy.intercept('POST', '/rest/items').as('createItem')

    //When
    cy.get('select[data-test="context"]').select(context)
    cy.get('select[data-test="genre"]').select('ARTICLE')
    //cy.get('input[data-test="degree"]').type("The Degree")
    cy.get('input[data-test="title"]').type("Cypress Test Title 7")

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
    //cy.wait('@createItem').its('response.statusCode').should('eq', 201)
    cy.wait('@createItem').then((interception) => {
      // 'interception' is an object with properties
      // 'id', 'request' and 'response'
      // @ts-ignore
      expect(interception.response.statusCode).to.equal(201)
      // @ts-ignore
      itemId = interception.response.body['objectId']
    })
    //TODO: Check successful creation in the GUI
  })

})
