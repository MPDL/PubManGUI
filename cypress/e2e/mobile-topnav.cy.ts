describe('Mobile top navigation', () => {

  /**
   * Opens the search result list with a mocked elasticsearch response, so the
   * paginator is rendered without a backend.
   */
  function openSearchResults(totalNumberOfItems = 12345678) {
    cy.intercept({ method: 'POST', url: '**/items/elasticsearch*' }, {
      statusCode: 200,
      body: {
        hits: { total: { value: totalNumberOfItems }, hits: [] },
        aggregations: {},
      },
    }).as('search')

    cy.visit('/search', {
      onBeforeLoad(win) {
        win.localStorage.setItem('last_search_query', JSON.stringify({ match_all: {} }))
      },
    })
    cy.wait('@search')
    cy.get('.top_nav_pos .mpdl-pagination').should('exist')
  }

  it('aligns the paginator with the action icons on a narrow phone', () => {
    //Given
    cy.viewport(320, 760)
    openSearchResults()
    //Then
    cy.get('.top_nav_pos').then($topnav => {
      const icons = $topnav[0].querySelector('.navbar-nav')!.getBoundingClientRect()
      const paginator = $topnav[0].querySelector('.mpdl-pagination')!.getBoundingClientRect()
      const select = $topnav[0].querySelector('.mpdl-pagination select')!.getBoundingClientRect()

      // both rows start at the same left edge
      expect(paginator.left).to.be.closeTo(icons.left, 1)
      // when the page-size select wraps, it stays grouped with the controls on
      // the left instead of jumping to the right edge
      expect(select.left - paginator.left).to.be.lessThan(20)
      expect(select.left).to.be.lessThan(320 / 2)
      // the paginator lays out as a flex row instead of an inline text flow
      expect(getComputedStyle($topnav[0].querySelector('.mpdl-pagination')!).display).to.eq('flex')
    })
  })

  it('keeps the page-size select grouped with the controls', () => {
    ;[375, 900].forEach(width => {
      //Given
      cy.viewport(width, 760)
      openSearchResults(4939)
      //Then
      cy.get('.top_nav_pos .mpdl-pagination').then($p => {
        expect($p[0].getBoundingClientRect().height).to.be.lessThan(40)
        const buttons = $p[0].querySelectorAll('button')
        const lastPageButton = buttons[buttons.length - 1].getBoundingClientRect()
        const select = $p[0].querySelector('select')!.getBoundingClientRect()
        expect(select.right).to.be.at.most(width)
        // the select sits right after the navigation buttons instead of being
        // pushed to the far right edge
        expect(select.left - lastPageButton.right).to.be.lessThan(16)
        expect(select.right).to.be.lessThan(width - 30)

        // the verbose "Page 1 of 198" is reduced to "1 / 198"
        expect(getComputedStyle($p[0].querySelector('.page-label')!).display).to.eq('none')
        expect(getComputedStyle($p[0].querySelector('.page-of')!).display).to.eq('none')
        expect(getComputedStyle($p[0].querySelector('.page-total')!, '::before').content).to.contain('/')
      })
    })
  })

  it('sticks below the mobile header instead of leaving a gap', () => {
    ;[375, 900].forEach(width => {
      cy.viewport(width, 760)
      openSearchResults()
      cy.get('#header').then($header => {
        cy.get('.top_nav_pos').then($topnav => {
          const headerHeight = $header[0].getBoundingClientRect().height
          const stickyTop = parseFloat(getComputedStyle($topnav[0]).top)
          expect(stickyTop).to.eq(headerHeight)
        })
      })
    })
  })
})
