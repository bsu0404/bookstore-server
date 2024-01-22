const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const jwt = require("jsonwebtoken");
const authorization = require("../util/authorization");

//결제하기
const order = async (req, res) => {
  const { items, delivery, total_quantity, first_book_title, total_price } =
    req.body;

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
    //배송정보 삽입
    let sql = `INSERT INTO delivery (address, receiver,contact) VALUES (?,?,?)`;
    let values = [delivery.address, delivery.receiver, delivery.contact];

    [results] = await (await conn).execute(sql, values);
    let delivery_id = results.insertId;
    console.log(`delivery_id: ${delivery_id}`);

    //주문 정보 삽입
    sql = `INSERT INTO orders (user_id,delivery_id,total_price,book_title,total_quantity) 
  VALUES (?,?,?,?,?);`;
    values = [
      decoded.id,
      delivery_id,
      total_price,
      first_book_title,
      total_quantity,
    ];

    try {
      [results] = await (await conn).execute(sql, values);
      let order_id = results.insertId;
      console.log(`order_id: ${order_id}`);

      //items의 cart_item_id로 book_id, quantity 조회
      sql = `SELECT book_id, quantity FROM cartItems WHERE id IN (?)`;
      let [orderItems, fields] = await (await conn).query(sql, [items]);

      //주문 상세 삽입

      sql = `INSERT INTO orderedBook (order_id,book_id,quantity) VALUES ?`;
      values = [];
      orderItems.forEach((item) => {
        values.push([order_id, item.book_id, item.quantity]);
      });

      [results] = await (await conn).query(sql, [values]);
      console.log(results);

      let result = deleteCartItems(items);

      return res.status(StatusCodes.OK).json(result);
    } catch (error) {
      console.log(error);
      return res.status(StatusCodes.BAD_REQUEST).json(error);
    }
  }
};

const deleteCartItems = async (items) => {
  sql = `DELETE FROM cartItems WHERE id IN (?)`;
  try {
    [results] = await (await conn).query(sql, items);
    return results;
  } catch (error) {
    console.log(error);
    return error;
  }
};
//결제내역 조회 - 회원 아이디 추가해야함
const getOrders = async (req, res) => {
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
    let sql = `SELECT orders.id,ordered_at, address, receiver,contact,book_title, total_quantity,total_price
    FROM orders 
    LEFT JOIN delivery
    ON orders.delivery_id = delivery.id
    WHERE user_id = ?`;
    value = decoded.id;
    try {
      let [rows, fields] = await (await conn).query(sql, value);
      res.status(StatusCodes.OK).json(rows);
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json(error);
    }
  }
};
//주문 상세 조회
const orderDetail = async (req, res) => {
  const { id: order_id } = req.params;
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
    let sql = `SELECT book_id, title ,author,price, quantity
    FROM orderedBook 
    LEFT JOIN books
    ON orderedBook.book_id = books.id
    WHERE order_id = ?`;
    let values = order_id;
    try {
      let [rows, fields] = await (await conn).query(sql, values);
      res.status(StatusCodes.OK).json(rows);
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json(error);
    }
  }
};

module.exports = {
  order,
  getOrders,
  orderDetail,
};
