import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList, GraphQLNonNull } from "graphql"
// lodash helps with enums traversal
import axios from "axios"

// Initial example using hardcoded values
// const users = [
// 	{ id: "23", firstName: "Bill", age: 20 },
// 	{ id: "47", firstName: "Susan", age: 34 },
// ]

// Defining a node type (Company)
const CompanyType = new GraphQLObjectType({
	name: "Company",
	fields: () => ({
		id: { type: GraphQLString },
		name: { type: GraphQLString },
		description: { type: GraphQLString },
		users: {
			type: new GraphQLList(UserType),
			args: { id: { type: GraphQLString } },
			resolve(parentValue, args) {
				return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`).then(res => res.data)
			},
		},
	}),
})

// Defining a node type (User)
const UserType = new GraphQLObjectType({
	name: "User",
	fields: () => ({
		id: { type: GraphQLString },
		firstName: { type: GraphQLString },
		age: { type: GraphQLInt },
		company: {
			type: CompanyType,
			args: { id: { type: GraphQLString } },
			resolve(parentValue, args) {
				return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`).then(resp => resp.data)
			},
		},
	}),
})

// Root Query defines the entry point to the graph
// Resolve function uses args passed into original query (e.g. id of user) used to return piece of data from database
const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: {
		user: {
			type: UserType,
			args: { id: { type: GraphQLString } },
			resolve(_parentValue, args) {
				return axios.get(`http://localhost:3000/users/${args.id}`).then(resp => resp.data)
			},
		},
		company: {
			type: CompanyType,
			args: { id: { type: GraphQLString } },
			resolve(parentValue, args) {
				return axios.get(`http://localhost:3000/companies/${args.id}`).then(resp => resp.data)
			},
		},
	},
})

const mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		addUser: {
			type: UserType,
			args: {
				firstName: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) },
				companyId: { type: GraphQLString },
			},
			resolve(parentValue, { firstName, age, companyId }) {
				return axios.post(`http://localhost:3000/users`, { firstName, age, companyId }).then(res => res.data)
			},
		},
		deleteUser: {
			type: UserType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve(parentValue, { id }) {
				return axios.delete(`http://localhost:3000/users/${id}`).then(res => res.data)
			},
		},
		updateUser: {
			type: UserType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: GraphQLInt },
				firstName: { type: GraphQLString },
				companyId: { type: GraphQLString },
			},
			resolve(parentValue, { id, firstName, age, companyId }) {
				return axios.patch(`http://localhost:3000/users/${id}`, { id, firstName, age, companyId }).then(res => res.data)
			},
		},
	},
})

const schema = new GraphQLSchema({
	query: RootQuery,
	mutation,
})

export default schema
