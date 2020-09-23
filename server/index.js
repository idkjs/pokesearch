const path = require("path");
require("dotenv").config();
require("apollo-cache-control");
const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");

const app = express();
const pathgql = "/graphql";

const Pokemon = require("./models/Pokemon.js");
const Ability = require("./models/Ability.js");
const UserPreferences = require("./models/UserPreferences.js");

const PokeApiConnector = require("./PokeApiConnector.js");
const userPreferencesConnector = require("./UserPreferencesConnector.js");

const typeDefs = require("./schema.graphql");
const resolvers = require("./resolvers.js");

const __PROD__ = process.env.NODE_ENV === "production";
const __CACHE__ = !process.env.NO_CACHE;
console.log("ENV:");
console.log("PROD", __PROD__);
console.log("CACHE", __CACHE__);

const pokeApiConnector = new PokeApiConnector();

const context = {
  Pokemon: new Pokemon({ connector: pokeApiConnector }),
  Ability: new Ability({ connector: pokeApiConnector }),
  UserPreferences: UserPreferences({ connector: userPreferencesConnector }),
};
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  tracing: true,
  cacheControl: { defaultMaxAge: 5 },
  introspection: true,
});
const updateContext = (user_token) => {
  if (!user_token || user_token === context.user_token) {
    return context;
  }
  return Object.assign(context, {
    user_token,
  });
};

app.use((req, res, next) => {
  let token = req.get("user_token");
  if (token) {
    req.user_token = token;
  }
  next();
});

server.applyMiddleware({ app, path: pathgql });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
