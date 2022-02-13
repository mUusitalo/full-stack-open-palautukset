describe('Blog app', () => {
  beforeEach(() => {
    cy.resetDB()
    cy.visitIndex()
  })

  it('Login form is shown', () => {
    cy.contains('login')
    cy.get('#username')
    cy.get('#password')
  })
})