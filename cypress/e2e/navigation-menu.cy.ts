describe('Navigation Menu', () => {

  const loginName = Cypress.env('testUser').loginName
  const password = Cypress.env('testUser').password
  const baseUrl = baseUrlWithoutTrailingSlashes()

  beforeEach(() => {
    cy.loginViaAPI(loginName, password)
  })

  afterEach(() => {
    cy.logoutViaAPI()
  })

  it('Entry', () => {
    //Given
    cy.visit('/')
    //When
    cy.get('[data-test="sidenav-entry"]').filter(':visible').click()
    //Then
    cy.url().should('eq', baseUrl + '/edit')
  })

  it('My datasets', () => {
    //Given
    cy.visit('/')
    //When
    cy.get('[data-test="sidenav-my-datasets"]').filter(':visible').click()
    //Then
    cy.url().should('eq', baseUrl + '/my')
  })

  it('QA Area', () => {
    //Given
    cy.visit('/')
    //When
    cy.get('[data-test="sidenav-qa-area"]').filter(':visible').click()
    //Then
    cy.url().should('eq', baseUrl + '/qa')
  })

  it('Import - New', () => {
    //Given
    cy.visit('/')
    //When
    cy.get('[data-test="sidenav-import"]').filter(':visible').click()
    cy.get('pure-imports-nav').filter(':visible').find('[data-test="sidenav-import-new"]').click({force: true})
    //Then
    cy.url().should('eq', baseUrl + '/imports/new')
  })

  it('Import - My imports', () => {
    //Given
    cy.visit('/')
    //When
    cy.get('[data-test="sidenav-import"]').filter(':visible').click()
    cy.get('pure-imports-nav').filter(':visible').find('[data-test="sidenav-import-myimports"]').click({force: true})
    //Then
    cy.url().should('eq', baseUrl + '/imports/myimports')
  })

  it('Batch - Datasets', () => {
    //Given
    window.sessionStorage.setItem('batch-items', JSON.stringify(new Array("itemId")))
    cy.visit('/')
    //When
    cy.get('[data-test="sidenav-batch"]').filter(':visible').click()
    cy.get('pure-batch-nav').filter(':visible').find('[data-test="sidenav-batch-datasets"]').click({force: true})
    //Then
    cy.url().should('eq', baseUrl + '/batch/datasets')
  })

  it('Batch - Actions', () => {
    //Given
    window.sessionStorage.setItem('batch-items', JSON.stringify(new Array("itemId")))
    cy.visit('/')
    //When
    cy.get('[data-test="sidenav-batch"]').filter(':visible').click()
    cy.get('pure-batch-nav').filter(':visible').find('[data-test="sidenav-batch-actions"]').click({force: true})
    //Then
    cy.url().should('eq', baseUrl + '/batch/actions')
  })

  it('Batch - Logs', () => {
    //Given
    cy.visit('/')
    //When
    cy.get('[data-test="sidenav-batch"]').filter(':visible').click()
    cy.get('pure-batch-nav').filter(':visible').find('[data-test="sidenav-batch-logs"]').click({force: true})
    //Then
    cy.url().should('eq', baseUrl + '/batch/logs')
  })

  it('Basket', () => {
    //Given
    cy.visit('/')
    //When
    cy.get('[data-test="sidenav-basket"]').filter(':visible').click()
    //Then
    cy.url().should('eq', baseUrl + '/cart')
  })

  it('Organizational Units', () => {
    //Given
    cy.visit('/')
    //When
    cy.get('[data-test="sidenav-organizational-units"]').filter(':visible').click()
    //Then
    cy.url().should('eq', baseUrl + '/ou_tree')
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
