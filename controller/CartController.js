const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

//장바구니 담기
const addCart = (req, res) => {
  const { book_id, quantity, user_id } = req.body;

  let sql = " INSERT INTO cartItems(book_id,quantity,user_id) VALUES(?,?,?);";
  let values = [book_id, quantity, user_id];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    return res.status(StatusCodes.OK).json(results);
  });
};
//장바구니 목록 조회
const getCart = (req, res) => {
  const { user_id, selected } = req.body;

  let sql = `SELECT cartItems.id,book_id,title,summary,quantity,price 
  FROM cartItems 
  LEFT JOIN books 
  ON books.id = cartItems.book_id
  WHERE user_id=? AND cartItems.id IN (?)`;
  let values = [user_id, selected];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (results.length > 0) {
      return res.status(StatusCodes.OK).json(results);
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  });
};
//장바구니 도서 삭제
const removeCart = (req, res) => {
  const { user_id } = req.body;

  let sql = "DELETE FROM cartItems WHERE id = ?;";

  conn.query(sql, user_id, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = {
  addCart,
  getCart,
  removeCart,
};
