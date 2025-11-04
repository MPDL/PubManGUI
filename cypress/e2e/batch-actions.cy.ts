describe('Execute Batch Actions', () => {
  const loginName = Cypress.env('testUser').loginName
  const password = Cypress.env('testUser').password
  let itemId: string;
  let itemGenre: string;

  beforeEach(() => {
    cy.loginViaAPI(loginName, password)
    cy.fixture('itemMetadataMinimal').then((itemMetadata) => {
      itemGenre = itemMetadata.metadata.genre
      cy.createItemViaAPI(itemMetadata).then((response) => {
        itemId = response.body['objectId']
      })
    })
  })

  afterEach(() => {
    cy.deleteItemViaAPI(itemId)
    cy.logoutViaAPI()
  })

  it('Add ORCID', () => {
    //Given
    window.sessionStorage.setItem('batch-items', JSON.stringify(new Array(itemId)))
    cy.visit('/batch/actions')

    //When
    cy.get('#headingMetadata').find('button').click()
    cy.get('#headingORCID').find('button').click()
    cy.get('#changeOrcidForm').type('Test')

    //TODO: Finish the test as soon as the autosuggest and the go-button is fixed
    cy.get('.input-group').find('div').first().click()

    //Then
  })

  it('Change Genre', () => {
    //Given
    let newItemGenre: string = 'ARTICLE';
    window.sessionStorage.setItem('batch-items', JSON.stringify(new Array(itemId)))
    cy.intercept('PUT', '/rest/batchProcess/changeGenre?*').as('changeGenre')
    cy.intercept('GET', '/rest/batchProcess/*').as('batchProcess')

    cy.visit('/batch/actions')

    //When
    cy.get('#headingGenre').find('button').click()
    cy.get('[data-test="genre-to-be-replaced"]').select(itemGenre)
    cy.get('[data-test="replacing-genre"]').select(newItemGenre)

    cy.get('pure-batch-change-genre').find('button').contains('GO').click()

    //Then
    cy.wait('@changeGenre').then((interception) => {
      // @ts-ignore
      expect(interception.response.statusCode).to.equal(200)

      //TODO: Check the exact confirmation/empty-batch message is displayed
      cy.get('pure-notification').should('exist')
    })

    cy.repeatedWait('@batchProcess', 'state', ['FINISHED', 'FINISHED_WITH_ERROR'], 10000, 5).then((response) => {
      // @ts-ignore
      expect(response.statusCode).to.equal(200)
      // @ts-ignore
      expect(response.body['state']).to.equal('FINISHED')

      //TODO: Check the exact confirmation/empty-batch message is displayed
      cy.get('pure-notification').should('exist')

      cy.getItemViaAPI(itemId).then((response) => {
        expect(response.body.metadata.genre).to.equal(newItemGenre)
      })
    })
  })

  it('Add Local Tags', () => {
    //Given
    let newTag: string = 'NewTag';
    window.sessionStorage.setItem('batch-items', JSON.stringify(new Array(itemId)))
    cy.intercept('PUT', '/rest/batchProcess/addLocalTags').as('addLocalTags')
    cy.intercept('GET', '/rest/batchProcess/*').as('batchProcess')

    cy.visit('/batch/actions')

    //When
    cy.get('#headingTags').find('button').click()
    cy.get('pure-add-local-tags-form').find('input').type(newTag).type('{enter}')

    cy.get('pure-add-local-tags-form').find('button').contains('GO').click()

    //Then
    cy.wait('@addLocalTags').then((interception) => {
      // @ts-ignore
      expect(interception.response.statusCode).to.equal(200)

      //TODO: Check the exact confirmation/empty-batch message is displayed
      cy.get('pure-notification').should('exist')
    })

    cy.repeatedWait('@batchProcess', 'state', ['FINISHED', 'FINISHED_WITH_ERROR'], 10000, 5).then((response) => {
      // @ts-ignore
      expect(response.statusCode).to.equal(200)
      // @ts-ignore
      expect(response.body['state']).to.equal('FINISHED')

      //TODO: Should a message be displayed?
      //cy.get('pure-notification').should('exist')

      cy.getItemViaAPI(itemId).then((response) => {
        //TODO: Check why localTags is an Array?
        expect(response.body.localTags[0]).to.equal(newTag)
      })
    })
  })

})
