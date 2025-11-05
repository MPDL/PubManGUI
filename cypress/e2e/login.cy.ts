describe('Login', () => {

  afterEach(() => {
    cy.logoutByClearingCookies()
  })

  it('Login', () => {
    //Given
    cy.visit('/')
    cy.intercept('/rest/login').as('login')

    //When
    cy.get('a[data-test="user-login"]').click()
    cy.get('input[data-test="username"]').type(Cypress.env('testUser').loginName)
    cy.get('input[data-test="password"]').type(Cypress.env('testUser').password)
    cy.get('button[data-test="sign-in"]').click()

    //Then
    cy.wait('@login').its('response.statusCode').should('eq', 200)
    cy.get('span[data-test="username"]').should('have.text', Cypress.env('testUser').name)
  })

})
