const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const authorization = require("../util/authorization");

const allBooks = async (req, res) => {
  const { category_id, new_book, limit, current_page } = req.query;
  let offset = limit * (current_page - 1);

  let sql =
    "SELECT *, (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes FROM books";
  let values = [];
  if (category_id && new_book) {
    sql +=
      " WHERE category_id=? AND pub_date BETWEEN DATE_SUB(NOW(),INTERVAL 1 MONTH) AND NOW()";
    values.push(category_id);
  } else if (new_book) {
    sql += " WHERE pub_date BETWEEN DATE_SUB(NOW(),INTERVAL 1 MONTH) AND NOW()";
  } else if (category_id) {
    sql += " WHERE category_id=?";
    values.push(category_id);
  }
  sql += "LIMIT ? OFFSET ?";
  values.push(parseInt(limit), parseInt(offset));
  try {
    [results] = await (await conn).query(sql, values);

    if (results.length > 0) {
      return res.status(StatusCodes.OK).json(results);
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};
//개별 도서 조회
const book = async (req, res) => {
  const { id: book_id } = req.params;

  //로그인 상태x: liked 추가
  //로그인 상태o: liked 없이
  let sql = `SELECT * , 
  (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes,
  (SELECT count(*) FROM likes WHERE user_id=? AND liked_book_id=?) AS liked
   FROM Bookshop.books 
   LEFT JOIN category 
   ON books.category_id=category.category_id
   WHERE books.id=?;`;
  let values = [user_id, book_id, book_id];

  try {
    [results] = await (await conn).query(sql, values);
    if (results.length > 0) {
      return res.status(StatusCodes.OK).json(results);
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

module.exports = {
  allBooks,
  book,
};
