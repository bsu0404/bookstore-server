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

//장바구니 담기
const addCart = (req, res) => {
  const { book_id, quantity } = req.body;
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
    let sql = " INSERT INTO cartItems(book_id,quantity,user_id) VALUES(?,?,?);";
    let values = [book_id, quantity, decoded.id];

    conn.query(sql, values, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      return res.status(StatusCodes.OK).json(results);
    });
  }
};
//장바구니 목록 조회
const getCart = (req, res) => {
  const { selected } = req.body;

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
    let sql = `SELECT cartItems.id,book_id,title,summary,quantity,price 
    FROM cartItems 
    LEFT JOIN books 
    ON books.id = cartItems.book_id
    WHERE user_id=? AND cartItems.id IN (?)`;

    let values = [decoded.id, selected];
    conn.query(sql, values, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }
      if (results.length > 0) {
        return res.status(StatusCodes.OK).json(results);
      } else {
        return res.status(StatusCodes.NOT_FOUND).json(results);
      }
    });
  }
};
//장바구니 도서 삭제
const removeCart = (req, res) => {
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
    let sql = "DELETE FROM cartItems WHERE id = ?;";

    conn.query(sql, decoded.id, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      return res.status(StatusCodes.OK).json(results);
    });
  }
};

module.exports = {
  addCart,
  getCart,
  removeCart,
};
