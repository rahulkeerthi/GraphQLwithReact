import express from "express"
import { graphqlHTTP } from "express-graphql"
// GraphQL is the convention

const app = express()

app.use(
	"/graphql",
	graphqlHTTP({
		schema: schema,
		graphiql: true,
	})
)

app.listen(4000, () => {
	console.log("listening...")
})