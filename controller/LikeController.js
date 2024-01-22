const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const authorization = require("../util/authorization");

const addLike = async (req, res) => {
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

    try {
      const results = await (await conn).query(sql, values);

      if (results[0].affectedRows) {
        return res.status(StatusCodes.OK).json(results);
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json("잘못된 요청입니다.");
      }
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json(error);
    }
  }
};

const subLike = async (req, res) => {
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

    try {
      const results = await (await conn).query(sql, values);

      if (results[0].affectedRows) {
        return res.status(StatusCodes.OK).json(results);
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json("잘못된 요청입니다.");
      }
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json(error);
    }
  }
};
module.exports = { addLike, subLike };
