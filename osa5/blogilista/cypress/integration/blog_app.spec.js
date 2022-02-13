describe('Blog app', () => {
  beforeEach(() => {
    cy.resetDB()
    cy.createUser({name: 'name', username: 'username', password: 'password'})
    cy.visitIndex()
  })

  it('Login form is shown', () => {
    cy.contains('login')
    cy.get('#username')
    cy.get('#password')
  })

  describe('Login', () => {
    it('should succeed with correct username and password', () => {
      cy.get('#username').type('username')  
      cy.get('#password').type('password')
      cy.get('#login-button').click()
      cy.get('.notification').should('contain', 'Logged in as name')
      cy.get('#logout-button')
    })

    it('should fail with incorrect username and password', () => {
      cy.get('#username').type('username')  
      cy.get('#password').type('wrongpassword')
      cy.get('#login-button').click()
      cy.get('.notification').should('contain', 'Invalid username or password')
      cy.get('#login-button')
    })
  })
})