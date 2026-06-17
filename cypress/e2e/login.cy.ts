describe('Login', () => {

  afterEach(() => {
    cy.logoutByClearingCookies()
  })

  it('Login', () => {
    //Given
    cy.visit('/')
    cy.intercept('/rest/login').as('login')

    //When
    cy.get('[data-test="user-login"]').filter(':visible').click()
    cy.get('[data-test="username"]').type(Cypress.env('testUser').loginName)
    cy.get('[data-test="password"]').type(Cypress.env('testUser').password)
    cy.get('[data-test="sign-in"]').click()

    //Then
    cy.wait('@login').its('response.statusCode').should('eq', 200)
    cy.get('[data-test="username"]').should('have.text', Cypress.env('testUser').name)
  })

})
