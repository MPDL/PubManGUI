describe('Mobile header search', () => {

  function openSearchField() {
    cy.viewport(375, 760)
    cy.intercept({ method: 'POST', url: '**/items/elasticsearch*' }, {
      statusCode: 200,
      body: { hits: { total: { value: 0 }, hits: [] }, aggregations: {} },
    }).as('search')
    cy.visit('/')
    cy.get('[data-test="mobile-search-toggle"]').click()
    cy.get('[data-test="mobile-search-row"]').should('be.visible')
  }

  it('keeps the search field open after submitting a term', () => {
    //Given
    openSearchField()
    //When
    cy.get('[data-test="mobile-search-row"] input').type('test{enter}')
    //Then the search runs but the field stays available for another search
    cy.location('pathname').should('eq', '/search')
    cy.get('[data-test="mobile-search-row"]').should('be.visible')
    cy.get('[data-test="mobile-search-row"] input').should('have.value', 'test')
  })

  it('keeps the search field open when no term was entered', () => {
    //Given
    openSearchField()
    //When
    cy.get('[data-test="mobile-search-row"] input').type('{enter}')
    //Then
    cy.location('pathname').should('eq', '/')
    cy.get('[data-test="mobile-search-row"]').should('be.visible')
  })

  it('paints the header background across the full width around the search field', () => {
    //Given
    cy.viewport(375, 760)
    cy.visit('/')
    cy.get('[data-test="mobile-search-toggle"]').click()
    cy.get('[data-test="mobile-search-row"]').should('be.visible')
    //Then the backdrop of the overflowing row must bleed past the header padding
    // so no page background shows in the strip below the header
    cy.get('#header').then($header => {
      const doc = $header[0].ownerDocument
      const container = doc.querySelector('#header_container') as HTMLElement
      const backdrop = getComputedStyle(container, '::before')
      expect(backdrop.content).to.not.eq('none')
      expect(backdrop.backgroundColor).to.eq(getComputedStyle($header[0]).backgroundColor)
      expect(parseFloat(backdrop.left)).to.be.lessThan(0)
      expect(parseFloat(backdrop.right)).to.be.lessThan(0)
    })
  })

  it('shifts the page content below the open search field', () => {
    //Given
    cy.viewport(375, 760)
    cy.intercept({ method: 'POST', url: '**/items/elasticsearch*' }, {
      statusCode: 200,
      body: { hits: { total: { value: 0 }, hits: [] }, aggregations: {} },
    })
    cy.visit('/cart')
    cy.get('pure-item-list').should('exist')
    cy.get('main#content').then($content => {
      const closedTop = Math.round($content[0].getBoundingClientRect().top)

      //When
      cy.get('[data-test="mobile-search-toggle"]').click()
      cy.get('[data-test="mobile-search-row"]').should('be.visible')

      //Then the content must move down instead of being covered
      cy.get('main#content').then($open => {
        const doc = $open[0].ownerDocument
        const row = doc.querySelector('[data-test="mobile-search-row"]')!.getBoundingClientRect()
        const openTop = Math.round($open[0].getBoundingClientRect().top)
        expect(openTop).to.be.greaterThan(closedTop)
        // same small gap below the search row as below the closed header
        expect(openTop - Math.round(row.bottom)).to.be.within(8, 24)
      })

      //When closing it again
      cy.get('[data-test="mobile-search-toggle"]').click()
      cy.get('[data-test="mobile-search-row"]').should('not.exist')

      //Then the content returns to its original position
      cy.get('main#content').then($closed => {
        expect(Math.round($closed[0].getBoundingClientRect().top)).to.eq(closedTop)
      })
    })
  })
})
