const mongoose = require('mongoose');

const LivroSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'O título é obrigatório.'],
  },
  autor: {
    type: String,
    required: [true, 'O autor é obrigatório.'],
  },
  editora: {
    type: String,
    required: [true, 'A editora é obrigatória.'],
  },
  anoPublicacao: {
    type: Number,
    required: [true, 'O ano de publicação é obrigatório.'],
  },
  numeroPaginas: {
    type: Number,
    required: [true, 'O número de páginas é obrigatório.'],
  },
});

const Livro = mongoose.model('Livro', LivroSchema);

module.exports = Livro;
