const { ApolloServer } = require('apollo-server');
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require('@prisma/client')

// 1
const typeDefs = fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8");

let links = [];

// 2
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    links: async (parent, args, context) => {
      return context.prisma.link.findMany()
    }
  },
  Link: {
    id: (parent) => "my_id: " + parent.id
  },
  Mutation: {
    post: (parent, args, context, info) => {
      const newLink = context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description,
        },
      })
      return newLink;
    },
    updateLink: (parent, args) => {
      const link = links.filter(link => link.id === args.id).pop();
      link.description = args.description;
      link.url = args.url;
      return link;
    },
    deleteLink: (parent, args) => {
      const deletedLink = links.filter(link => link.id === args.id).pop();
      links = links.filter(link => link.id !== args.id);

      return deletedLink;
    }
  }
}

// 3
const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    prisma,
  }
});

server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );
