Cypress.Commands.add('resetDB', () => {
  cy.request('POST', 'http://localhost:3003/api/testing/reset')
})

Cypress.Commands.add('visitIndex', () => {
  cy.visit('http://localhost:3000')
})