describe('Logout', () => {

  const loginName = Cypress.env('testUser').loginName
  const password = Cypress.env('testUser').password

  beforeEach(() => {
    cy.loginViaAPI(loginName, password)
  })

  it('Logout', () => {
    //Given
    cy.visit('/')

    //When
    cy.get('[data-test="user"]').click()
    cy.get('[data-test="sign-out"]').click()

    //Then
    cy.get('[data-test="user-login"]').should("be.visible").then(() => {
      expect(localStorage.getItem("token")).to.be.a("null")
    })
  })

})
