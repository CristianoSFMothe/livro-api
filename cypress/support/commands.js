Cypress.Commands.add("postLivro", (livro) => {
  cy.api({
    url: "http://localhost:5000/api/livros",
    method: "POST",
    body: livro,
    failOnStatusCode: false,
  }).then((response) => {
    return response;
  });
});