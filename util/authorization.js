const jwt = require("jsonwebtoken");
let dotenv = require("dotenv");
dotenv.config();

const authorization = (req) => {
  try {
    let token = req.headers["authorization"];
    let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    console.log(decoded);

    return decoded;
  } catch (err) {
    return err;
  }
};

module.exports = { authorization };
