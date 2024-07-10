const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const authorization = require("../util/authorization");

const allBooks = async (req, res) => {
  let allBooksRes = {};
  const { category_id, new_book, limit, current_page } = req.query;
  let offset = limit * (current_page - 1);

  let sql =
    "SELECT SQL_CALC_FOUND_ROWS *, (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes FROM books";
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
  sql += " LIMIT ? OFFSET ?";
  values.push(parseInt(limit), parseInt(offset));
  try {
    [results] = await (await conn).query(sql, values);

    if (results.length > 0) {
      allBooksRes.books = results;
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }

  sql = "SELECT found_rows()";
  try {
    [results] = await (await conn).query(sql);

    let pagination = {};
    pagination.current_page = parseInt(current_page);
    pagination.total_count = results[0];

    allBooksRes.pagination = pagination;

    return res.status(StatusCodes.OK).json(allBooksRes);
  } catch (error) {
    console.log(error);

    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};
//개별 도서 조회
const book = async (req, res) => {
  const { id: book_id } = req.params;

  let decoded = authorization(req);

  let sql =
    decoded != undefined
      ? `SELECT * , 
  (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes,
  (SELECT count(*) FROM likes WHERE user_id=? AND liked_book_id=?) AS liked
   FROM Bookshop.books 
   LEFT JOIN category 
   ON books.category_id=category.category_id
   WHERE books.id=?;`
      : `SELECT * , 
   (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes
    FROM Bookshop.books 
    LEFT JOIN category 
    ON books.category_id=category.category_id
    WHERE books.id=?;`;
  let values = decoded != undefined ? [decoded.id, book_id, book_id] : book_id;

  try {
    [results] = await (await conn).query(sql, values);
    if (results.length > 0) {
      return res.status(StatusCodes.OK).json(results[0]);
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

module.exports = {
  allBooks,
  book,
};
