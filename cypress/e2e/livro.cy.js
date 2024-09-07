describe("/livros POST", () => {
  before(() => {
    cy.dropCollection("livros", {
      database: "test",
      failSilently: "true",
    }).then((result) => {
      cy.log(result);
    });
  });
  it("Deve cadastrar um novo livro", () => {
    const livro = {
      titulo: "O Senhor dos Anéis",
      autor: "J.R.R. Tolkien",
      editora: "HarperCollins",
      anoPublicacao: 1954,
      numeroPaginas: 1178,
    };

    cy.postLivro(livro).then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body.titulo).to.equal(livro.titulo);
      expect(response.body.autor).to.equal(livro.autor);
      expect(response.body.editora).to.equal(livro.editora);
      expect(response.body.anoPublicacao).to.equal(livro.anoPublicacao);
      expect(response.body.numeroPaginas).to.equal(livro.numeroPaginas);
      expect(response.body._id).to.not.be.empty;
    });
  });

  it("Não deve cadastrar um novo livro", () => {
    const livro = {
      titulo: "Clean Code",
      autor: "Robert C. Martin",
      editora: "Prentice Hall",
      anoPublicacao: 2008,
      numeroPaginas: 464,
    };

    cy.postLivro(livro).then((response) => {
      expect(response.status).to.equal(201);
    });

    cy.postLivro(livro).then((response) => {
      expect(response.status).to.equal(409);
      expect(response.body.erro).to.eql("O título do livro já foi cadastrado.");
    });
  });
});
