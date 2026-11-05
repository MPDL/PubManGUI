describe('Breadcrumb', () => {

  function openSearch(width: number) {
    cy.viewport(width, 800)
    cy.intercept({ method: 'POST', url: '**/items/elasticsearch*' }, {
      statusCode: 200,
      body: { hits: { total: { value: 1 }, hits: [] }, aggregations: {} },
    })
    cy.visit('/search', {
      onBeforeLoad(win) {
        win.localStorage.setItem('last_search_query', JSON.stringify({ match_all: {} }))
      },
    })
    cy.get('#header').should('be.visible')
  }

  it('stays visible on smaller desktop widths', () => {
    ;[992, 1100, 1199].forEach(width => {
      //Given
      openSearch(width)
      //Then
      cy.get('pure-breadcrumb').should('be.visible')
      cy.get('#header').then($header => {
        const doc = $header[0].ownerDocument
        const headerHeight = Math.round($header[0].getBoundingClientRect().height)
        const subheader = doc.querySelector('pure-info-subheader .row')!.getBoundingClientRect()
        // the breadcrumb row must sit immediately below the full-height header
        expect(Math.round(subheader.top)).to.eq(headerHeight)
      })
    })
  })

  it('is hidden below the desktop breakpoint', () => {
    //Given
    openSearch(991)
    //Then
    cy.get('pure-breadcrumb').should('not.be.visible')
  })

  it('does not reserve the empty breadcrumb bar on mobile', () => {
    ;[375, 768, 991].forEach(width => {
      //Given
      openSearch(width)
      //Then
      cy.get('pure-breadcrumb').should('not.be.visible')
      cy.get('main#content').should('exist')
      cy.get('#header').then($header => {
        const doc = $header[0].ownerDocument
        const headerBottom = Math.round($header[0].getBoundingClientRect().bottom)
        const subheader = doc.querySelector('pure-info-subheader .row')!.getBoundingClientRect()
        const content = doc.querySelector('main#content')!.getBoundingClientRect()
        // the hidden breadcrumb must not leave an empty fixed strip behind
        expect(Math.round(subheader.height)).to.eq(0)
        // and the content should start just below the compact header
        expect(Math.round(content.top) - headerBottom).to.be.within(8, 24)
      })
    })
  })
})
