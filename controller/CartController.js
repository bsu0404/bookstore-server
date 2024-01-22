const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const authorization = require("../util/authorization");

//장바구니 담기
const addCart = async (req, res) => {
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
    let sql = ` INSERT INTO cartItems(book_id,quantity,user_id) 
    VALUES (?,?,?) on duplicate key update quantity = ?;`;
    let values = [book_id, quantity, decoded.id, quantity];

    try {
      [results] = await (await conn).query(sql, values);
      if (results.affectedRows) {
        return res.status(StatusCodes.OK).json(results);
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json(results);
      }
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json(error);
    }
  }
};
//장바구니 목록 조회
const getCart = async (req, res) => {
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
    WHERE user_id=?`;
    let values = [decoded.id];

    if (selected) {
      //주문서 작성 시 장바구니 목록 조회
      sql += ` AND cartItems.id IN (?)`;
      values.push(selected);
    }
    try {
      [results] = await (await conn).query(sql, values);
      return res.status(StatusCodes.OK).json(results);
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json(results);
    }
  }
};
//장바구니 도서 삭제
const removeCart = async (req, res) => {
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
    try {
      [results] = await (await conn).query(sql, decoded.id);
      if (results.affectedRows == 0) {
        return res.status(StatusCodes.OK).json(results);
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json(results);
      }
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json(error);
    }
  }
};

module.exports = {
  addCart,
  getCart,
  removeCart,
};
