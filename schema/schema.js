import { GraphQLObjectType, GraphQLString, GraphQLInt } from "graphql"
import { _ } from "lodash"
// const {
//   GraphQLObjectType
// } = graphql

const users = [
	{ id: "23", firstName: "Bill", age: 20 },
	{ id: "47", firstName: "Susan", age: 34 },
]

// Defining a node type
const UserType = new GraphQLObjectType({
	name: "User",
	fields: {
		id: { type: GraphQLString },
		firstName: { type: GraphQLString },
		age: { type: GraphQLInt },
	},
})

// Root Query defines the entry point to the graph
// Resolve function uses args passed into original query (e.g. id of user) used to return piece of data from database
const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: {
		user: {
			type: UserType,
			args: { id: { type: GraphQLString } },
			resolve(parentValue, args) {
				return _.find(users, { id: args.id })
			},
		},
	},
})
