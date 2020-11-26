const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("../schema/schema");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 3005;

mongoose
  .connect("mongodb+srv://Ivan:qazwsx12@cluster0.cnkhk.mongodb.net/graphgl", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("db connected");
  })
  .catch((error) => console.log(error));

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.use(cors());

const dbConnection = mongoose.connection;
dbConnection.on("error", (err) => console.log(`connection error: ${err}`));
dbConnection.once("open", () => console.log("Connected to DB"));

app.listen(PORT, (err) => {
  err ? console.log(err) : console.log("Server started!");
});
