describe('Blog app', () => {
  beforeEach(() => {
    cy.resetDB();
    cy.createUser({ name: 'name', username: 'username', password: 'password' });
    cy.visitIndex();
  });

  it('Login form is shown', () => {
    cy.contains('login');
    cy.get('#username');
    cy.get('#password');
  });

  describe('Login', () => {
    it('should succeed with correct username and password', () => {
      cy.get('#username').type('username');
      cy.get('#password').type('password');
      cy.get('#login-button').click();
      cy.get('.notification').should('contain', 'Logged in as name');
      cy.get('#logout-button');
    });

    it('should fail with incorrect username and password', () => {
      cy.get('#username').type('username');
      cy.get('#password').type('wrongpassword');
      cy.get('#login-button').click();
      cy.get('.notification').should('contain', 'Invalid username or password');
      cy.get('#login-button');
    });
  });

  describe('When logged in', () => {
    beforeEach(() => {
      cy.login({ username: 'username', password: 'password' });
    });

    it('Should create blog', () => {
      cy.contains('create new blog').click();
      cy.get('#title').type('title');
      cy.get('#author').type('author');
      cy.get('#url').type('url');
      cy.contains('create').click();
      cy.get('.notification').should('contain', 'Created blog title by author');
      cy.get('.blog')
        .should('contain', 'title author')
        .and('contain', 'show details');
    });

    describe('Editing blog', () => {
      beforeEach(() => {
        cy.createBlog({ title: 'title', author: 'author', url: 'url' });
      });

      it('Should like blog', () => {
        cy.get('.blog').contains('show details').click();
        cy.get('.blog-details').contains('likes 0');
        cy.contains('like').click();
        cy.get('.blog-details').contains('likes 1');
      });

      it('Should delete blog', () => {
        cy.contains('show details').click();
        cy.get('.blog-details').contains('delete').click();
        cy.get('.blog').should('not.exist');
        cy.get('.notification').contains('Deleted blog title');
      });
    });

    it('Should sort blogs by likes', () => {
      cy.createBlog({ title: 'title1', author: 'author1', url: 'url1' });
      cy.createBlog({ title: 'title2', author: 'author2', url: 'url2' });
      cy.createBlog({ title: 'title3', author: 'author3', url: 'url3' });
      cy.get('.show-details-button').each(($button) =>
        cy.wrap($button).click()
      );
      cy.contains('title3 author3').contains('like').click();
      cy.get('.blog').should((blogs) => {
        expect(blogs[0]).to.contain.text('title3 author3');
      });
      cy.contains('title2 author2').contains('like').click();
      cy.contains('title2 author2')
        .contains('likes 1')
        .parent()
        .contains('like')
        .click();
      cy.get('.blog').should((blogs) => {
        expect(blogs[0]).to.contain.text('title2 author2');
        expect(blogs[1]).to.contain.text('title3 author3');
        expect(blogs[2]).to.contain.text('title1 author1');
      });
    });
  });
});
