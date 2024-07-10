const jwt = require("jsonwebtoken");
let dotenv = require("dotenv");
const { error } = require("console");
dotenv.config();

const authorization = (req) => {
  let token = req.headers["authorization"];
  if (token) {
    try {
      let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
      return decoded;
    } catch (err) {
      console.log(err);
      return err;
    }
  } else {
    return undefined;
  }
};

module.exports = authorization;
