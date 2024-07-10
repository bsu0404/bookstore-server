const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
  allowedHeaders: ["content-type", "Authorization", "Content-Type"],
};

app.use(cors(corsOptions));

app.listen(process.env.PORT);

const userRouter = require("./routes/users");
const booksRouter = require("./routes/books");
const likesRouter = require("./routes/likes");
const cartsRouter = require("./routes/carts");
const ordersRouter = require("./routes/orders");
const categoryRouter = require("./routes/category");

app.use("/users", userRouter);
app.use("/books", booksRouter);
app.use("/categories", categoryRouter);
app.use("/likes", likesRouter);
app.use("/carts", cartsRouter);
app.use("/orders", ordersRouter);
