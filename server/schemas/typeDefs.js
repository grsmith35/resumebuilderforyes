const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Apps {
        name: String
        email: String
        date: String
    }

    type Query {
        applications(date: String): [Apps]
    }

    type Mutation {
        addApp(name: String!, email: String!, date: String!): Apps
    }
`;

module.exports = typeDefs;