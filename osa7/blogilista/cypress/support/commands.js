Cypress.Commands.add('resetDB', () => {
  cy.request('POST', 'http://localhost:3003/api/testing/reset');
});

Cypress.Commands.add('visitIndex', () => {
  cy.visit('http://localhost:3000');
});

Cypress.Commands.add('createUser', ({ name, username, password }) => {
  cy.request('POST', 'http://localhost:3003/api/users', {
    name,
    username,
    password,
  });
});

Cypress.Commands.add('createBlog', ({ title, author, url }) => {
  const authorization = `bearer ${
    JSON.parse(localStorage.getItem('loggedInUser')).token
  }`;
  cy.request({
    method: 'POST',
    url: 'http://localhost:3000/api/blogs',
    body: {
      title,
      author,
      url,
    },
    headers: {
      Authorization: authorization,
    },
  }).then(cy.visitIndex);
});

Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3003/api/login', {
    username,
    password,
  }).then(({ body }) => {
    localStorage.setItem('loggedInUser', JSON.stringify(body));
    cy.visitIndex();
  });
});
