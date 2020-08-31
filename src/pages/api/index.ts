import {makeSchema, asNexusMethod} from '@nexus/schema'
import { GraphQLDate, GraphQLDateTime } from 'graphql-iso-date'
import { ApolloServer } from 'apollo-server-micro'
import path from 'path'
import Cors from 'cors'
import {Query} from "../../backend/queries";
import {Match} from "../../backend/match";
import {Player} from "../../backend/player";
import {Mutation} from "../../backend/mutations";

const cors = Cors({
  methods: ['GET', 'HEAD'],
})

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

export const GQLDate = asNexusMethod(GraphQLDate, 'date')
export const GQLDateTime = asNexusMethod(GraphQLDateTime, 'datetime')

export const schema = makeSchema({
  // plugins: [nexusPluginPrisma({
  //   scalars: {
  //     DateTime: DateTime
  //   }
  // })],
  types: [Query, Match, Player, Mutation, GQLDate, GQLDateTime],
  outputs: {
    typegen: path.join(process.cwd(), 'pages', 'api', 'nexus-typegen.ts'),
    schema: path.join(process.cwd(), 'pages', 'api', 'schema.graphql')
  },
})

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler2 = new ApolloServer({
  schema,
  tracing: true,
  // engine: {
  //   reportSchema: true,
  //   graphVariant: 'current',
  //   apiKey: 'service:my-test-graph-01231231:v4d02oQWpa-q8R6bMFpxxQ'
  // }
}).createHandler({
  path: '/api',
});

async function handler(req, res) {
  // Run the middleware
  await runMiddleware(req, res, cors)
  return handler2(req, res);

  // Rest of the API logic
  // res.json({ message: 'Hello Everyone!' })
}

export default handler
