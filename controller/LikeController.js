const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
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

const addLike = (req, res) => {
  //좋아요 추가
  const { id: liked_book_id } = req.params;

  let decoded = authorization(req);
  if (decoded instanceof jwt.TokenExpiredError) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "로그인 세션이 만료되었습니다." });
  } else if (decoded instanceof jwt.JsonWebTokenError) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "잘못된 토큰입니다." });
  } else {
    let sql = "INSERT INTO likes (user_id, liked_book_id) VALUES(?,?);";
    let values = [decoded.id, liked_book_id];

    conn.query(sql, values, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      return res.status(StatusCodes.OK).json(results);
    });
  }
};
const subLike = (req, res) => {
  const { id: liked_book_id } = req.params;
  let decoded = authorization(req);
  if (decoded instanceof jwt.TokenExpiredError) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "로그인 세션이 만료되었습니다." });
  } else if (decoded instanceof jwt.JsonWebTokenError) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "잘못된 토큰입니다." });
  } else {
    let sql = "DELETE FROM likes WHERE user_id=? AND liked_book_id = ?";
    let values = [decoded.id, liked_book_id];

    conn.query(sql, values, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      return res.status(StatusCodes.OK).json(results);
    });
  }
};
module.exports = { addLike, subLike };
