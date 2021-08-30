const { ApolloServer } = require('apollo-server');
const fs = require("fs");
const path = require("path");

// 1
const typeDefs = fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8");

let links = [];

// 2
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    links: () => links
  },
  Link: {
    id: (parent) => "my_id: " + parent.id
  },
  Mutation: {
    post: (parent, args) => {
      console.log("parent: ", parent, "; args: ", args);
      let idCount = links.length

      const link = {
        id: `${idCount}`,
        description: args.description,
        url: args.url,
      };

      links.push(link);

      return link;
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
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );
