describe('Desktop tier', () => {

  function openCart(width: number) {
    cy.viewport(width, 800)
    cy.intercept({ method: 'POST', url: '**/items/elasticsearch*' }, {
      statusCode: 200,
      body: { hits: { total: { value: 0 }, hits: [] }, aggregations: {} },
    })
    cy.visit('/cart')
    cy.get('pure-item-list', { timeout: 10000 }).should('exist')
  }

  function contentWidth(width: number) {
    return cy.document().then(doc => {
      const content = doc.querySelector('main#content') as HTMLElement
      return content.getBoundingClientRect().width
    })
  }

  it('shows the sort/filter column on small desktop widths', () => {
    ;[992, 1100, 1199].forEach(width => {
      //Given
      openCart(width)
      //Then
      cy.get('pure-item-list aside').should('be.visible')
      cy.get('pure-item-list .col-lg-8').then($list => {
        const list = $list[0].getBoundingClientRect()
        // the list and the aside share the row, so the list must be narrower
        // than the whole content area
        contentWidth(width).then(total => {
          expect(list.width).to.be.lessThan(total)
        })
      })
    })
  })

  it('hides the sort/filter column below the desktop breakpoint', () => {
    //Given
    openCart(991)
    //Then
    cy.get('pure-item-list aside').should('not.be.visible')
  })

  it('keeps the desktop header actions inside the viewport', () => {
    ;[992, 1024, 1199].forEach(width => {
      //Given
      cy.viewport(width, 800)
      cy.visit('/')
      //Then
      cy.get('.header-desktop-actions').should('be.visible')
      cy.get('.header-desktop-search').should('be.visible')
      cy.get('.header-desktop-actions').then($actions => {
        const children = Array.from($actions[0].children)
          .filter(child => getComputedStyle(child).display !== 'none')
        const last = children[children.length - 1].getBoundingClientRect()
        expect(last.right).to.be.at.most(width)
      })
    })
  })
})
