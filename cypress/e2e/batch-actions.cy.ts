describe('Execute Batch Actions', () => {
  const userName = Cypress.env('testUser').userName
  const password = Cypress.env('testUser').password
  let itemId: string;
  let itemGenre: string;

  beforeEach(() => {
    cy.loginViaAPI(userName, password)
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
    window.localStorage.setItem('dataset-list', JSON.stringify(new Array(itemId)))

    //cy.visit('/batch/actions')
    //TODO: Remove this workaround (Navigating to the actions via buttons). Use cy.visit('/batch/actions') as soon as it works.
    cy.visit('/batch/datasets')
    cy.get('pure-batch-nav li').eq(1).click({force: true})

    //When
    cy.get('#headingMetadata').find('button').click()
    cy.get('#headingORCID').find('button').click()
    cy.get('#changeOrcidForm').type('Test')

    //TODO: Finish the test as soon as the autosuggest and the go-button is fixed
    cy.get('.list-group').find('div').first().click()

    //Then
  })

  it('Change Genre', () => {
    //Given
    let newItemGenre: string = 'ARTICLE';
    window.localStorage.setItem('dataset-list', JSON.stringify(new Array(itemId)))
    cy.intercept('PUT', '/rest/batchProcess/changeGenre?*').as('changeGenre')
    cy.intercept('GET', '/rest/batchProcess/*').as('batchProcess')

    //cy.visit('/batch/actions')
    //TODO: Remove this workaround (Navigating to the actions via buttons). Use cy.visit('/batch/actions') as soon as it works.
    cy.visit('/batch/datasets')
    cy.get('pure-batch-nav li').eq(1).click({force: true})

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
      cy.get('pure-messaging').should('exist')
    })

    cy.repeatedWait('@batchProcess', 'state', ['FINISHED', 'FINISHED_WITH_ERROR'], 10000, 5).then((response) => {
      // @ts-ignore
      expect(response.statusCode).to.equal(200)
      // @ts-ignore
      expect(response.body['state']).to.equal('FINISHED')

      //TODO: Add the message check, as soon a message is displayed again
      //cy.get('pure-messaging').contains('Action finished!')

      cy.getItemViaAPI(itemId).then((response) => {
        expect(response.body.metadata.genre).to.equal(newItemGenre)
      })
    })
  })

  it('Add Local Tags', () => {
    //Given
    let newTag: string = 'NewTag';
    window.localStorage.setItem('dataset-list', JSON.stringify(new Array(itemId)))
    cy.intercept('PUT', '/rest/batchProcess/addLocalTags').as('addLocalTags')
    cy.intercept('GET', '/rest/batchProcess/*').as('batchProcess')

    //cy.visit('/batch/actions')
    //TODO: Remove this workaround (Navigating to the actions via buttons). Use cy.visit('/batch/actions') as soon as it works.
    cy.visit('/batch/datasets')
    cy.get('pure-batch-nav li').eq(1).click({force: true})

    //When
    cy.get('#headingTags').find('button').click()
    cy.get('pure-add-local-tags-form').find('input').type(newTag).type('{enter}')

    cy.get('pure-add-local-tags-form').find('button').contains('GO').click()

    //Then
    cy.wait('@addLocalTags').then((interception) => {
      // @ts-ignore
      expect(interception.response.statusCode).to.equal(200)

      //TODO: Check the exact confirmation/empty-batch message is displayed
      cy.get('pure-messaging').should('exist')
    })

    cy.repeatedWait('@batchProcess', 'state', ['FINISHED', 'FINISHED_WITH_ERROR'], 10000, 5).then((response) => {
      // @ts-ignore
      expect(response.statusCode).to.equal(200)
      // @ts-ignore
      expect(response.body['state']).to.equal('FINISHED')

      //TODO: Check the exact confirmation/empty-batch message is displayed
      cy.get('pure-messaging').should('exist')

      cy.getItemViaAPI(itemId).then((response) => {
        //TODO: Check why localTags is an Array?
        expect(response.body.localTags[0]).to.equal(newTag)
      })
    })
  })

})
