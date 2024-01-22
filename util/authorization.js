const jwt = require("jsonwebtoken");
let dotenv = require("dotenv");
dotenv.config();

const authorization = (req) => {
  try {
    let token = req.headers["authorization"];
    if (token) {
      let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
      console.log(decoded);
      return decoded;
    } else {
      return undefined;
    }
  } catch (err) {
    console.log(err);
    return err;
  }
};

module.exports = authorization;
