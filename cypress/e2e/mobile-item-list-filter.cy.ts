describe('Item list filter panel', () => {

  beforeEach(() => {
    cy.intercept({ method: 'POST', url: '**/items/elasticsearch*' }, {
      statusCode: 200,
      body: { hits: { total: { value: 0 }, hits: [] }, aggregations: {} },
    }).as('search')
  })

  it('slides in from the right on mobile and can be closed', () => {
    cy.viewport(375, 760)
    cy.visit('/search?q=test')
    cy.get('[data-test="item-list-filter-toggle"]').should('be.visible')
    cy.get('[data-test="item-list-filter-panel"]').should('not.be.visible')
    cy.get('[data-test="item-list-filter-toggle"]').click()
    cy.get('[data-test="item-list-filter-panel"]').should('be.visible')
    cy.get('[data-test="item-list-filter-close"]').click()
    cy.get('[data-test="item-list-filter-panel"]').should('not.be.visible')
    cy.get('[data-test="item-list-filter-toggle"]').click()
    cy.get('[data-test="item-list-filter-backdrop"]').click({ force: true, position: 'left' })
    cy.get('[data-test="item-list-filter-panel"]').should('not.be.visible')
  })

  it('is always visible on desktop without toggle', () => {
    cy.viewport(1400, 900)
    cy.visit('/search?q=test')
    cy.get('[data-test="item-list-filter-toggle"]').should('not.be.visible')
    cy.get('[data-test="item-list-filter-panel"]').should('be.visible')
  })
})
