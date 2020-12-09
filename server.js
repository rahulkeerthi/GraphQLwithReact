import express from "express"

// middleware function to plug into express
import { graphqlHTTP } from "express-graphql"

// schema
import schema from "./schema/schema.js"

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
