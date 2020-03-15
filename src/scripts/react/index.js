import React from 'react';
import ReactDOM from "react-dom";

import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";

//Components
import App from "./App";

//Connection to graphql endpoint
const httpLink = createHttpLink({
  uri: "https://kaboomdev.myshopify.com/api/graphql"
});

//Authentication Middleware
const middlewareLink = setContext(() => ({
  headers: {
    "X-Shopify-Storefront-Access-Token": "dcf36b332a1cccfa87e773a828c6bdad"
  }
}));

//Creation of apollo client
const client = new ApolloClient({
  link: middlewareLink.concat(httpLink),
  cache: new InMemoryCache(),
})

//Rendering using apollo
ReactDOM.render(
  <ApolloProvider client={client}>
    <App></App>
  </ApolloProvider>,
  document.getElementById("root"),
);
