const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "frontendapp/build")));

mongoose
  .connect("mongodb+srv://Ivan:qazwsx12@cluster0.cnkhk.mongodb.net/graphgl", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("db connected");
  })
  .catch((error) => console.log(error));

app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

const dbConnection = mongoose.connection;
dbConnection.on("error", (err) => console.log(`connection error: ${err}`));
dbConnection.once("open", () => console.log("Connected to DB"));

// Anything that doesn't match the above, send back the index.html file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/frontendapp/build/index.html"));
});

app.listen(PORT, (err) => {
  err ? console.log(err) : console.log("Server started!");
});
