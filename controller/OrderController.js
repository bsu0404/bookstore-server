const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const mariadb = require("mysql2/promise");

//결제하기
const order = async (req, res) => {
  const {
    items,
    delivery,
    total_quantity,
    first_book_title,
    total_price,
    user_id,
  } = req.body;

  //배송정보 삽입
  let sql = `INSERT INTO delivery (address, receiver,contact) VALUES (?,?,?)`;
  let values = [delivery.address, delivery.receiver, delivery.contact];

  [results] = await (await conn).execute(sql, values);
  let delivery_id = results.insertId;
  console.log(delivery_id);

  //주문 정보 삽입
  sql = `INSERT INTO orders (user_id,delivery_id,total_price,book_title,total_quantity) 
  VALUES (?,?,?,?,?);`;
  values = [
    user_id,
    delivery_id,
    total_price,
    first_book_title,
    total_quantity,
  ];

  [results] = await (await conn).execute(sql, values);
  let order_id = results.insertId;
  console.log(order_id);

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
};

const deleteCartItems = async (items) => {
  sql = `DELETE FROM cartItems WHERE id IN (?)`;
  [results] = await (await conn).query(sql, items);
  return results;
};
//결제내역 조회
const getOrders = (req, res) => {
  res.json({ msg: "장바구니 조회" });
};
//주문상세
const orderDetail = (req, res) => {
  res.json({ msg: "장바구니 조회" });
};

module.exports = {
  order,
  getOrders,
  orderDetail,
};
