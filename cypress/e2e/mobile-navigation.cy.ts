describe('Mobile Navigation', () => {

  const loginName = Cypress.env('testUser').loginName
  const password = Cypress.env('testUser').password
  const baseUrl = baseUrlWithoutTrailingSlashes()

  beforeEach(() => {
    cy.viewport(375, 667)
    cy.loginViaAPI(loginName, password)
  })

  afterEach(() => {
    cy.logoutViaAPI()
  })

  it('Burger opens drawer and shows navigation entries', () => {
    //Given
    cy.visit('/')
    //When
    cy.get('[data-test="mobile-nav-toggle"]').should('be.visible')
      .should('have.attr', 'aria-expanded', 'false')
      .click()
    //Then
    cy.get('ngb-offcanvas-panel').should('exist')
    cy.get('[data-test="mobile-nav-toggle"]').should('have.attr', 'aria-expanded', 'true')
    cy.get('ngb-offcanvas-panel').find('[data-test="sidenav-my-datasets"]').should('be.visible')
    cy.get('ngb-offcanvas-panel').find('[data-test="sidenav-basket"]').should('be.visible')
    cy.get('ngb-offcanvas-panel').find('[data-test="sidenav-organizational-units"]').should('be.visible')
  })

  it('Close button dismisses drawer', () => {
    //Given
    cy.visit('/')
    cy.get('[data-test="mobile-nav-toggle"]').click()
    cy.get('ngb-offcanvas-panel').should('exist')
    //When
    cy.get('[data-test="mobile-nav-close"]').click()
    //Then
    cy.get('ngb-offcanvas-panel').should('not.exist')
    cy.get('[data-test="mobile-nav-toggle"]').should('have.attr', 'aria-expanded', 'false')
  })

  it('Backdrop tap dismisses drawer', () => {
    //Given
    cy.visit('/')
    cy.get('[data-test="mobile-nav-toggle"]').click()
    cy.get('ngb-offcanvas-panel').should('exist')
    //When
    cy.get('ngb-offcanvas-backdrop').click(20, 300, { force: true })
    //Then
    cy.get('ngb-offcanvas-panel').should('not.exist')
  })

  it('Backdrop is shown behind the drawer', () => {
    //Given
    cy.visit('/')
    //When
    cy.get('[data-test="mobile-nav-toggle"]').click()
    //Then
    cy.get('ngb-offcanvas-backdrop').should('exist')
    cy.get('ngb-offcanvas-panel').should('have.class', 'sidenav-mobile')
    cy.get('ngb-offcanvas-panel').should('have.class', 'offcanvas-start')
  })

  it('Navigation closes drawer and changes URL', () => {
    //Given
    cy.visit('/')
    cy.get('[data-test="mobile-nav-toggle"]').click()
    //When
    cy.get('ngb-offcanvas-panel').find('[data-test="sidenav-basket"]').click()
    //Then
    cy.url().should('eq', baseUrl + '/cart')
    cy.get('ngb-offcanvas-panel').should('not.exist')
  })

  it('Search toggle expands and collapses mobile search row', () => {
    //Given
    cy.visit('/')
    cy.get('[data-test="mobile-search-row"]').should('not.exist')
    //When
    cy.get('[data-test="mobile-search-toggle"]').click()
    //Then
    cy.get('[data-test="mobile-search-row"]').should('be.visible')
    //When
    cy.get('[data-test="mobile-search-toggle"]').click()
    //Then
    cy.get('[data-test="mobile-search-row"]').should('not.exist')
  })

  it('Tools dropdown expands inline without clipping', () => {
    //Given
    cy.visit('/')
    cy.get('[data-test="mobile-nav-toggle"]').click()
    //When
    cy.get('[data-test="sidenav-tools"]').should('be.visible').click()
    //Then
    cy.get('[data-test="sidenav-tools"]').should('have.attr', 'aria-expanded', 'true')
    cy.get('ngb-offcanvas-panel pure-toolsnav .dropdown-menu')
      .should('be.visible')
      .should($menu => {
        // an inline menu cannot be clipped by the scrollable drawer body
        expect(getComputedStyle($menu[0]).position).to.eq('static')
      })
    cy.get('ngb-offcanvas-panel pure-toolsnav .dropdown-menu li').last()
      .scrollIntoView()
      .should('be.visible')
  })

  it('Language switch stays compact and aligned in the header', () => {
    //Given
    cy.visit('/')
    //Then
    cy.get('.header-mobile-actions pure-lang-switch').should('be.visible').then($el => {
      const host = $el[0].getBoundingClientRect()
      // the 44px mobile action hit area must not wrap the short en/de labels
      expect(host.width).to.be.lessThan(60)

      // "en", "|" and "de" share one baseline
      const centers: number[] = []
      const walker = document.createTreeWalker($el[0], NodeFilter.SHOW_TEXT)
      let node = walker.nextNode()
      while (node) {
        if ((node.textContent || '').trim().length) {
          const range = document.createRange()
          range.selectNodeContents(node)
          const rect = range.getBoundingClientRect()
          centers.push((rect.top + rect.bottom) / 2)
        }
        node = walker.nextNode()
      }
      expect(centers.length).to.eq(3)
      centers.forEach(center => expect(Math.abs(center - centers[0])).to.be.lessThan(1))
    })
    cy.get('.header-mobile-actions pure-lang-switch .nav-link').should($btn => {
      const cs = getComputedStyle($btn[0])
      expect(parseFloat(cs.minWidth)).to.eq(0)
    })
  })

  it('Keeps search, language switch and account comfortably apart', () => {
    //Given
    cy.visit('/')
    //Then
    cy.get('.header-mobile-actions').should('be.visible').then($actions => {
      const search = $actions[0].querySelector('button')!.getBoundingClientRect()
      const lang = $actions[0].querySelector('pure-lang-switch')!.getBoundingClientRect()
      const account = $actions[0].querySelector('pure-aa')!.getBoundingClientRect()
      // each action should have a visible gap instead of touching the next one
      expect(lang.left - search.right).to.be.at.least(8)
      expect(account.left - lang.right).to.be.at.least(8)
    })
  })

  it('Keeps the brand size when the mobile header is scrolled', () => {
    //Given
    cy.viewport(768, 900)
    cy.visit('/')
    cy.get('#header').should('be.visible')
    cy.get('#header').then($header => {
      const brand = $header[0].ownerDocument.querySelector('#brand_name')!
      const logo = $header[0].ownerDocument.querySelector('#logo')!
      const before = {
        logo: Math.round(logo.getBoundingClientRect().width),
        font: getComputedStyle(brand).fontSize,
        header: Math.round($header[0].getBoundingClientRect().height),
      }
      //When
      $header[0].classList.add('scrolled')
      //Then
      cy.wait(250).then(() => {
        expect(Math.round(logo.getBoundingClientRect().width)).to.eq(before.logo)
        expect(getComputedStyle(brand).fontSize).to.eq(before.font)
        expect(Math.round($header[0].getBoundingClientRect().height)).to.eq(before.header)
      })
    })
  })

  it('Keeps the account dropdown inside the mobile viewport', () => {
    //Given
    cy.visit('/')
    //When
    cy.get('[data-test="user"]').filter(':visible').click()
    //Then
    cy.get('.header-mobile-actions .dropdown-menu').should('be.visible').then($menu => {
      const menu = $menu[0].getBoundingClientRect()
      expect(menu.left).to.be.at.least(0)
      expect(menu.right).to.be.at.most(375)
    })
  })

  it('Shows the help tooltip above the icon inside the viewport', () => {
    //Given
    cy.visit('/')
    cy.get('[data-test="mobile-nav-toggle"]').click()
    cy.get('ngb-offcanvas-panel').should('be.visible')
    //When
    cy.get('.sidenav-mobile-meta a.nav-link').first().trigger('mouseenter')
    //Then
    cy.get('ngb-tooltip-window').should('be.visible').then($tooltip => {
      const tooltip = $tooltip[0].getBoundingClientRect()
      // the tooltip must not be clipped by the scrollable drawer body, which
      // happened when it was placed below the icon at the bottom of the drawer
      expect(tooltip.top).to.be.at.least(0)
      expect(tooltip.bottom).to.be.at.most(667)
    })
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
