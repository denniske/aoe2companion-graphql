import React from 'react'
import Head from 'next/head'
import { ApolloProvider } from '@apollo/react-hooks'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import {ApolloLink} from "@apollo/client";
import {withScalars} from "apollo-link-scalars";
import gql from "graphql-tag";
import {GraphQLScalarType} from "graphql";
import {makeExecutableSchema} from "@graphql-tools/schema";

let apolloClient = null

/**
 * Creates and provides the apolloContext
 * to a next.js PageTree. Use it by wrapping
 * your PageComponent via HOC pattern.
 * @param {Function|Class} PageComponent
 * @param {Object} [config]
 * @param {Boolean} [config.ssr=true]
 */
export function withApollo(PageComponent, { ssr = true } = {}) {
  const WithApollo = ({ apolloClient, apolloState, ...pageProps }) => {
    const client = apolloClient || initApolloClient(apolloState)
    return (
      <ApolloProvider client={client}>
        <PageComponent {...pageProps} />
      </ApolloProvider>
    )
  }

  // Set the correct displayName in development
  if (process.env.NODE_ENV !== 'production') {
    const displayName =
      PageComponent.displayName || PageComponent.name || 'Component'

    if (displayName === 'App') {
      console.warn('This withApollo HOC only works with PageComponents.')
    }

    WithApollo.displayName = `withApollo(${displayName})`
  }

  if (ssr || PageComponent.getInitialProps) {
    WithApollo.getInitialProps = async ctx => {
      const { AppTree } = ctx

      // Initialize ApolloClient, add it to the ctx object so
      // we can use it in `PageComponent.getInitialProp`.
      const apolloClient = (ctx.apolloClient = initApolloClient())

      // Run wrapped getInitialProps methods
      let pageProps = {}
      if (PageComponent.getInitialProps) {
        pageProps = await PageComponent.getInitialProps(ctx)
      }

      // Only on the server:
      if (typeof window === 'undefined') {
        // When redirecting, the response is finished.
        // No point in continuing to render
        if (ctx.res && ctx.res.finished) {
          return pageProps
        }

        // Only if ssr is enabled
        if (ssr) {
          try {
            // Run all GraphQL queries
            const { getDataFromTree } = await import('@apollo/react-ssr')
            await getDataFromTree(
              <AppTree
                pageProps={{
                  ...pageProps,
                  apolloClient,
                }}
              />
            )
          } catch (error) {
            // Prevent Apollo Client GraphQL errors from crashing SSR.
            // Handle them in components via the data.error prop:
            // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
            console.error('Error while running `getDataFromTree`', error)
          }

          // getDataFromTree does not call componentWillUnmount
          // head side effect therefore need to be cleared manually
          Head.rewind()
        }
      }

      // Extract query data from the Apollo store
      const apolloState = apolloClient.cache.extract()
      return {
        ...pageProps,
        apolloState,
      }
    }
  }

  return WithApollo
}

/**
 * Always creates a new apollo client on the server
 * Creates or reuses apollo client in the browser.
 * @param  {Object} initialState
 */
function initApolloClient(initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (typeof window === 'undefined') {
    return createApolloClient(initialState)
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = createApolloClient(initialState)
  }

  return apolloClient
}

/**
 * Creates and configures the ApolloClient
 * @param  {Object} [initialState={}]
 */
function createApolloClient(initialState = {}) {
  const ssrMode = typeof window === 'undefined'
  const cache = new InMemoryCache();//.restore(initialState)

  return new ApolloClient({
    ssrMode,
    link: createIsomorphLink(),
    cache,
  })
}

// we can also pass a custom map of functions. These will have priority over the GraphQLTypes parsing and serializing functions from the Schema.
const typesMap = {
  DateTime: {
    serialize: (parsed) => parsed.toString(),
    parseValue: (raw) => {
      // console.log('parseValue', raw);
      return raw ? new Date(raw) : null;
    }
  }
};

const typeDefs = gql`
"""
A date string, such as 2007-12-03, compliant with the \`full-date\` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
"""
scalar Date

"""
A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the \`date-time\` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
"""
scalar DateTime

type Match {
  leaderboard_id: Int!
  match_id: String!
  name: String!
  players: [Player!]!
  started: DateTime!
  finished: DateTime
}

type Player {
  match: Match!
  match_id: String!
  name: String!
  profile_id: Int!
  rating: Int!
}

type Query {
  match(matchId: String!): Match!
  matches(count: Int!, leaderboard_id: Int, profile_id: Int, start: Int!): [Match!]!
}

`;

const resolvers = {
  // example of scalar type, which will parse the string into a custom class CustomDate which receives a Date object
  // Date: new GraphQLScalarType({
  //   name: "Date",
  //   serialize: (parsed) => parsed && parsed.toISOString(),
  //   parseValue: (raw) => raw && new Date(raw),
  //   parseLiteral(ast) {
  //     if (ast.kind === Kind.STRING || ast.kind === Kind.INT) {
  //       return new Date(ast.value);
  //     }
  //     return null;
  //   }
  // })
};

// GraphQL Schema, required to use the link
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

function createIsomorphLink() {
  const { HttpLink } = require('apollo-link-http')
  return ApolloLink.from([
    withScalars({ schema, typesMap }),
    new HttpLink({
      uri: 'http://localhost:4000/api',
      credentials: 'same-origin',
    })
  ]);
}

// function createIsomorphLink() {
//   const { HttpLink } = require('apollo-link-http')
//   return new HttpLink({
//     uri: 'http://localhost:4000/api',
//     credentials: 'same-origin',
//   })
// }
