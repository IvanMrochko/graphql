const graphql = require("graphql");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
} = graphql;

const Movies = require("../models/movie");
const Directors = require("../models/director");

const MovieType = new GraphQLObjectType({
  name: "Movie",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    genre: { type: new GraphQLNonNull(GraphQLString) },
    watched: { type: new GraphQLNonNull(GraphQLBoolean) },
    rate: { type: GraphQLInt },
    director: {
      type: DirectorType,
      resolve(parent, args) {
        return Directors.findById(parent.directorId);
      },
    },
  }),
});

const DirectorType = new GraphQLObjectType({
  name: "Director",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: new GraphQLNonNull(GraphQLInt) },
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent, args) {
        return Movies.find({ directorId: parent.id });
      },
    },
  }),
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addDirector: {
      type: DirectorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        const director = new Directors({
          name: args.name,
          age: args.age,
        });
        return director.save();
      },
    },
    addMovie: {
      type: MovieType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        watched: { type: new GraphQLNonNull(GraphQLBoolean) },
        rate: { type: GraphQLInt },
        directorId: { type: GraphQLID },
      },
      resolve(parent, args) {
        const movie = new Movies({
          name: args.name,
          genre: args.genre,
          directorId: args.directorId,
          watched: args.watched,
          rate: args.rate,
        });
        return movie.save();
      },
    },
    deleteDirector: {
      type: DirectorType,
      args: {
        id: {
          type: GraphQLID,
        },
      },
      resolve(partner, args) {
        return Directors.findByIdAndDelete(args.id);
      },
    },
    deleteMovie: {
      type: MovieType,
      args: {
        id: {
          type: GraphQLID,
        },
      },
      resolve(partner, args) {
        return Movies.findByIdAndDelete(args.id);
      },
    },
  },
  updateDirector: {
    type: DirectorType,
    args: {
      id: { type: GraphQLID },
      name: { type: new GraphQLNonNull(GraphQLString) },
      age: { type: new GraphQLNonNull(GraphQLInt) },
      watched: { type: new GraphQLNonNull(GraphQLBoolean) },
      rate: { type: GraphQLInt },
    },
    resolve(parent, args) {
      return Directors.findByIdAndUpdate(
        args.id,
        {
          $set: {
            name: args.name,
            age: args.name,
            watched: args.watched,
            rate: args.rate,
          },
        },
        { new: true }
      );
    },
  },
  updateMovie: {
    type: MovieType,
    args: {
      id: { type: GraphQLID },
      name: { type: new GraphQLNonNull(GraphQLString) },
      genre: { type: new GraphQLNonNull(GraphQLString) },
      directorId: { type: GraphQLID },
    },
    resolve(parent, args) {
      return Movies.findByIdAndUpdate(
        args.id,
        {
          $set: {
            name: args.name,
            genre: args.genre,
            directorId: args.directorId,
          },
        },
        { new: true }
      );
    },
  },
});

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Movies.findById(args.id);
      },
    },
    director: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Directors.findById(args.id);
      },
    },
    movies: {
      type: new GraphQLList(MovieType),
      resolve() {
        return Movies.find({});
      },
    },
    directors: {
      type: new GraphQLList(DirectorType),
      resolve() {
        return Directors.find({});
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
