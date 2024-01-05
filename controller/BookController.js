const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

//좋아요와 like해결해야함.
const allBooks = (req, res) => {
  const { category_id, new_book, limit, current_page } = req.query;
  let offset = limit * (current_page - 1);

  let sql = "SELECT * FROM books LIMIT ? OFFSET ?";
  let values = [parseInt(limit), parseInt(offset)];
  if (category_id && new_book) {
    // 카테고리별 조회 추가
    sql +=
      " WHERE category_id= ? AND pub_date BETWEEN DATE_SUB(NOW(),INTERVAL 1 MONTH) AND NOW()";
    values = [...values, category_id];
  } else if (new_book) {
    sql += " WHERE pub_date BETWEEN DATE_SUB(NOW(),INTERVAL 1 MONTH) AND NOW()";
  } else if (category_id) {
    sql += " WHERE category_id= ?";
    values = [...values, category_id];
  }

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
//개별 도서 조회
const book = (req, res) => {
  const { id } = req.params;
  let sql = `SELECT * FROM books LEFT JOIN category ON books.category_id=category.id WHERE books.id= ?`;

  conn.query(sql, id, (err, results) => {
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

module.exports = {
  allBooks,
  book,
};
