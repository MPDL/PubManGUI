describe('Navigation Menu', () => {

  const userName = Cypress.env('testUser').userName
  const password = Cypress.env('testUser').password
  const baseUrl = baseUrlWithoutTrailingSlashes()

  beforeEach(() => {
    cy.loginViaAPI(userName, password)
  })

  afterEach(() => {
    cy.logoutViaAPI()
  })

  it('Entry', () => {
    //Given
    cy.visit('/')
    //When
    cy.get('[data-test="sidenav-entry"]').click()
    //Then
    cy.url().should('eq', baseUrl + '/edit')
  })

  it('My datasets', () => {
    //Given
    cy.visit('/')
    //When
    cy.get('[data-test="sidenav-my-datasets"]').click()
    //Then
    cy.url().should('eq', baseUrl + '/my')
  })

  it('QA Area', () => {
    //Given
    cy.visit('/')
    //When
    cy.get('[data-test="sidenav-qa-area"]').click()
    //Then
    cy.url().should('eq', baseUrl + '/qa')
  })

  it('Imports', () => {
    //Given
    cy.visit('/')
    //When
    cy.get('[data-test="sidenav-qa-area"]').click()
    //Then
    cy.url().should('eq', baseUrl + '/qa')
  })

  //TODO: Add Tests for: New & My Imports

  it('Batch', () => {
    //Given
    cy.visit('/')
    //When
    cy.get('[data-test="sidenav-batch"]').click()
    //Then
    cy.url().should('eq', baseUrl + '/batch/logs')
  })

  //TODO: Add Tests for: Batch Datasets, Batch Actions & Batch Logs

  it('Basket', () => {
    //Given
    cy.visit('/')
    //When
    cy.get('[data-test="sidenav-basket"]').click()
    //Then
    cy.url().should('eq', baseUrl + '/cart')
  })

  it('Organizational Units', () => {
    //Given
    cy.visit('/')
    //When
    cy.get('[data-test="sidenav-organizational-units"]').click()
    //Then
    cy.url().should('eq', baseUrl + '/ou_tree')
  })

  //TODO: Edit this Test if "place" feature is implemented
  it('Place', () => {
    //Given
    cy.visit('/')
    //When
    cy.get('[data-test="sidenav-place"]').click()
    //Then
    cy.url().should('eq', baseUrl + '/home')
  })

  /**
   * Remove trailing forward slashes from baseUrl (Angulars default baseUrl http://localhost:4200/ has a trailing slash)
   */
  function baseUrlWithoutTrailingSlashes() {
    // @ts-ignore
    return Cypress.config().baseUrl.replace(/\/+$/, '')
  }

})
