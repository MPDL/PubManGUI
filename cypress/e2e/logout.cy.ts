describe('Logout', () => {

  const userName = Cypress.env('testUser').userName
  const password = Cypress.env('testUser').password

  beforeEach(() => {
    cy.loginViaAPI(userName, password)
  })

  it('Logout', () => {
    //Given
    cy.visit('/')

    //When
    cy.get('a[data-test="user"]').click()
    cy.get('a[data-test="sign-out"]').click()

    //Then
    cy.get('a[data-test="user-login"]').should("be.visible").then(() => {
      expect(localStorage.getItem("token")).to.be.a("null")
    })
  })

})
