const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB).then((con) => {
  console.log(con.connections);
  console.log(`DB connected to: ${con.connection.host}`);
  console.log(`DB connected on port: ${con.connection.port}`);
  console.log("DB Connection Successful");
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port.....${port}`);
});
