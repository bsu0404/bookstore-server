const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

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
