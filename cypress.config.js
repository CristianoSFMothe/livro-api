const { defineConfig } = require("cypress");
const { configurePlugin } = require("cypress-mongodb");

module.exports = defineConfig({
  env: {
    mongodb: {
      uri: "mongodb+srv://dbaLivroApi:livroApi123@livroapi.5bnzi.mongodb.net/?retryWrites=true&w=majority&appName=LivroApi",
      database: "test",
      collection: "livros",
    },
  },

  e2e: {
    setupNodeEvents(on, config) {
      configurePlugin(on);
    },
  },
});
