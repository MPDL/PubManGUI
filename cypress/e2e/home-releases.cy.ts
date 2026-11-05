describe('Home page recent full-texts', () => {

  const titles = [
    'Short title',
    'A somewhat longer publication title about magnetic resonance imaging',
    'Very long publication title that keeps going and going across several lines to show how the card layout behaves with realistic research article titles',
    'Another title of medium length',
    'A study on quantum phenomena in condensed matter systems',
  ]

  function openHome(width: number) {
    cy.viewport(width, 760)
    cy.intercept({ method: 'POST', url: '**/items/elasticsearch*' }, {
      statusCode: 200,
      body: {
        hits: {
          total: { value: titles.length },
          hits: titles.map((title, i) => ({
            _source: {
              objectId: 'item-' + i,
              latestRelease: { modificationDate: `2026-10-0${i + 1}T10:00:00Z` },
              metadata: { title },
              files: [
                {
                  visibility: 'PUBLIC',
                  mimeType: 'application/pdf',
                  storage: 'INTERNAL_MANAGED',
                  content: '/assets/images/newimback4.jpg',
                },
              ],
            },
          })),
        },
      },
    }).as('search')
    cy.intercept('GET', '**/pureblogfeed*', { statusCode: 200, body: [] })
    cy.visit('/')
    cy.wait('@search')
    cy.get('#releases-section .card').should('have.length', titles.length)
  }

  it('clamps long titles and keeps all cards the same height', () => {
    //Given
    openHome(1400)
    //Then
    cy.get('#releases-section .card').then($cards => {
      const heights = Array.from($cards).map(card => Math.round(card.getBoundingClientRect().height))
      expect(new Set(heights).size).to.eq(1)

      const longTitle = $cards[2].querySelector('.card-title-clamp') as HTMLElement
      const cs = longTitle.ownerDocument.defaultView!.getComputedStyle(longTitle)
      expect(cs.webkitLineClamp).to.eq('3')
      const lineHeight = parseFloat(cs.lineHeight)
      expect(longTitle.getBoundingClientRect().height).to.be.at.most(lineHeight * 3 + 1)
      // the visible box is smaller than the full text, i.e. it is truncated
      expect(longTitle.scrollHeight).to.be.greaterThan(longTitle.clientHeight)
    })
  })

  it('keeps the tall preview thumbnail', () => {
    //Given
    openHome(1400)
    //Then
    cy.get('#releases-section .card-img-top').first().then($img => {
      const rect = $img[0].getBoundingClientRect()
      // the preview must not shrink below the former 150px minimum
      expect(rect.height).to.be.at.least(150)
      expect(rect.height).to.be.greaterThan(150)
      expect(getComputedStyle($img[0]).objectFit).to.eq('cover')
    })
  })
})
