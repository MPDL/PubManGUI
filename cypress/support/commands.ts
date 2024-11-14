// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
// declare namespace Cypress {
//   interface Chainable<Subject = any> {
//     customCommand(param: any): typeof customCommand;
//   }
// }
//
// function customCommand(param: any): void {
//   console.warn(param);
// }
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import Chainable = Cypress.Chainable;

Cypress.Commands.add('loginViaAPI', (userName, password) => {
  cy.request({
    'method': 'POST',
    'url': Cypress.env('restUrl') + '/login',
    'body': userName + ':' + password
  }).then((response) => {
    expect(response.status).to.eq(200)
    let responseToken = response.headers['token'] as string
    expect(responseToken).to.exist

    //Cookies from the response are automatically used for further requests
    //For a successful authentication the response token must be set as 'token' in the Local Storage
    window.localStorage.setItem('token', responseToken)
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
