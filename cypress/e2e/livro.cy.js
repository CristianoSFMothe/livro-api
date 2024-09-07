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

describe("/livros GET por ID", () => {
  let livroId;
  const livro = {
    titulo: "O Senhor dos Anéis",
    autor: "J.R.R. Tolkien",
    editora: "HarperCollins",
    anoPublicacao: 1954,
    numeroPaginas: 1178,
  };

  before(() => {
    // Limpar a coleção antes dos testes
    cy.dropCollection("livros", {
      database: "test",
      failSilently: true,
    }).then((result) => {
      cy.log(result);
    });

    // Criar um livro e armazenar o ID
    cy.postLivro(livro).then((response) => {
      expect(response.status).to.equal(201);
      livroId = response.body._id;
    });
  });

  it("Deve consultar um livro com ID válido", () => {
    cy.request({
      method: "GET",
      url: `/api/livros/${livroId}`,
    }).then((response) => {
      // Adiciona log para debugging
      cy.log('Resposta GET por ID válido:', response);

      expect(response.status).to.equal(200);
      expect(response.body._id).to.equal(livroId);
      expect(response.body.titulo).to.eql(livro.titulo);
      expect(response.body.autor).to.eql(livro.autor);
      expect(response.body.editora).to.eql(livro.editora);
      expect(response.body.anoPublicacao).to.eql(livro.anoPublicacao);
      expect(response.body.numeroPaginas).to.eql(livro.numeroPaginas);
    });
  });

  it("Deve consultar um livro com ID inválido", () => {
    cy.request({
      method: "GET",
      url: `/api/livros/66dca827f1ad584c46cfd5d8`,
      failOnStatusCode: false,
    }).then((response) => {
      // Adiciona log para debugging
      cy.log('Resposta GET por ID inválido:', response);

      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal("Livro não encontrado");
    });
  });
});

describe("/livros GET todos", () => {
  const livros = [
    {
      titulo: "O Senhor dos Anéis",
      autor: "J.R.R. Tolkien",
      editora: "HarperCollins",
      anoPublicacao: 1954,
      numeroPaginas: 1178,
    },
    {
      titulo: "Clean Code",
      autor: "Robert C. Martin",
      editora: "Prentice Hall",
      anoPublicacao: 2008,
      numeroPaginas: 464,
    }
  ];

  before(() => {
    // Limpar a coleção antes dos testes
    cy.dropCollection("livros", {
      database: "test",
      failSilently: true,
    }).then((result) => {
      cy.log(result);
    });

    // Criar livros
    livros.forEach((livro) => {
      cy.postLivro(livro).then((response) => {
        expect(response.status).to.equal(201);
      });
    });
  });

  it("Deve listar todos os livros", () => {
    cy.request({
      method: "GET",
      url: "/api/livros",
    }).then((response) => {
      // Adiciona log para debugging
      cy.log('Resposta GET todos os livros:', response);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.lengthOf(livros.length);
      
      // Verificar se todos os livros estão na resposta
      livros.forEach((livro) => {
        const found = response.body.find(item => item.titulo === livro.titulo);
        expect(found).to.not.be.undefined;
        expect(found.autor).to.eql(livro.autor);
        expect(found.editora).to.eql(livro.editora);
        expect(found.anoPublicacao).to.eql(livro.anoPublicacao);
        expect(found.numeroPaginas).to.eql(livro.numeroPaginas);
      });
    });
  });
});

describe("/livros DELETE", () => {
  let livroId;
  const livro = {
    titulo: "O Senhor dos Anéis",
    autor: "J.R.R. Tolkien",
    editora: "HarperCollins",
    anoPublicacao: 1954,
    numeroPaginas: 1178,
  };

  before(() => {
    // Limpar a coleção antes dos testes
    cy.dropCollection("livros", {
      database: "test",
      failSilently: true,
    }).then((result) => {
      cy.log(result);
    });

    // Criar um livro e armazenar o ID
    cy.postLivro(livro).then((response) => {
      expect(response.status).to.equal(201);
      livroId = response.body._id;
    });
  });

  it("Deve excluir um livro existente", () => {
    cy.request({
      method: "DELETE",
      url: `/api/livros/${livroId}`,
    }).then((response) => {
      // Adiciona log para debugging
      cy.log('Resposta DELETE livro:', response);

      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Livro removido com sucesso");

      // Verificar se o livro foi realmente excluído
      cy.request({
        method: "GET",
        url: `/api/livros/${livroId}`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("Livro não encontrado");
      });
    });
  });

  it("Não deve excluir um livro com ID inválido", () => {
    cy.request({
      method: "DELETE",
      url: `/api/livros/66dcd57bd42e5ea1e8f927b7`,
      failOnStatusCode: false,
    }).then((response) => {
      // Adiciona log para debugging
      cy.log('Resposta DELETE livro com ID inválido:', response);

      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal("Livro não encontrado");
    });
  });
});
