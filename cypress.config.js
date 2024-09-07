const { defineConfig } = require("cypress");
require('dotenv').config(); 
const { configurePlugin } = require("cypress-mongodb");

module.exports = defineConfig({
  env: {
    mongodb: {
      uri: process.env.MONGO_URL,
      database: process.env.DATABASE,
      collection: process.env.COLLECTION,
    },
  },

  e2e: {
    setupNodeEvents(on, config) {
      configurePlugin(on);
      return config;
    },
    baseUrl: process.env.BASE_URL || 'http://localhost:5000', 
  },
});
