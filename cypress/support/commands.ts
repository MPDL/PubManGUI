import Chainable = Cypress.Chainable;

// Utility function to extract domain from baseUrl
function getBaseDomain(): string {
  const baseUrl = Cypress.config().baseUrl;
  // @ts-ignore
  return baseUrl.replace(/^https?:\/\//, '').replace(/:.*/, '');
}

Cypress.Commands.add('setLanguage', (locale: string) => {
  window.localStorage.setItem('locale', locale)
})

Cypress.Commands.add('loginViaAPI', (userName, password) => {
  cy.request({
    'method': 'POST',
    'url': Cypress.env('restUrl') + '/login',
    'body': userName + ':' + password
  }).then((response) => {
    expect(response.status).to.eq(200)
    let responseToken = response.headers['token'] as string
    expect(responseToken).to.exist

    //Cookies from the response are automatically used for further requests (but have the restUrl as domain)
    //Set an additional login-cookie with baseUrl as domain (because the restUrl may be different to the baseUrl)
    cy.setCookie('inge_auth_token', responseToken, {
      domain: getBaseDomain()
    })
  })
})

Cypress.Commands.add('logoutViaAPI', () => {
  cy.request({
    'method': 'GET',
    'url': Cypress.env('restUrl') + '/logout'
  }).then((response) => {
    expect(response.status).to.eq(200)
  })
})

Cypress.Commands.add('logoutByClearingLocalStorage', () => {
  window.localStorage.clear()
})

Cypress.Commands.add('deleteItemViaAPI', (itemId) => {
  cy.request({
    'method': 'DELETE',
    'url': Cypress.env('restUrl') + '/items/' + itemId,
    //Existing (authentication) cookies are automatically send with requests
    'body': {
      lastModificationDate: ""
    }
  }).then((response) => {
    expect(response.status).to.eq(200)
  })
})

Cypress.Commands.add('getItemViaAPI', (itemId):  Chainable<Cypress.Response<any>> => {
  return cy.request({
    'method': 'GET',
    'url': Cypress.env('restUrl') + '/items/' + itemId
    //Existing (authentication) cookies are automatically send with requests
  }).then((response) => {
    expect(response.status).to.eq(200)
  })
})

Cypress.Commands.add('createItemViaAPI', (itemMetadata):  Chainable<Cypress.Response<any>> => {
  return cy.request({
    'method': 'POST',
    'url': Cypress.env('restUrl') + '/items',
    //Existing (authentication) cookies are automatically send with requests
    'body': itemMetadata
  }).then((response) => {
    expect(response.status).to.eq(201)
  })
})

Cypress.Commands.add('repeatedWait', (alias, responseBodyKey, responseBodyValues: string[], waitTimeout, maxNumberOfWaits): Chainable<Cypress.Response<any>> => {
  // @ts-ignore
  function recursiveWait () {
    maxNumberOfWaits--
    return cy.wait(alias, {timeout: waitTimeout}).then((interception): any => {
      // @ts-ignore
      const value = interception.response.body[responseBodyKey];
      if (responseBodyValues.includes(value) || maxNumberOfWaits <= 0) {
        return interception.response;
      } else {
        return recursiveWait();
      }
    });
  }

  if(maxNumberOfWaits >= 1){
    return recursiveWait();
  } else {
    throw new Error('maxNumberOfWaits < 1')
  }
})

Cypress.Commands.add('addLocalTagsViaAPI', (localTags):  Chainable<Cypress.Response<any>> => {
  return cy.request({
    'method': 'PUT',
    'url': Cypress.env('restUrl') + '/batchProcess/addLocalTags',
    //Existing (authentication) cookies are automatically send with requests
    'body': localTags
  }).then((response) => {
    expect(response.status).to.eq(200)
  })
})
