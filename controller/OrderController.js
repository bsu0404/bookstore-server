const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
/*
const handleQuery = async (sql, params, res, status) => {
  let insertId;
  conn.query(sql, params, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(status.fail).end();
    }
    insertId = results.insertId;
    console.log(`insertId: ${insertId} sql:${sql}`);
    return res.status(status.success).json(results);
  });
  return insertId;
};
*/
//결제하기
const order = async (req, res) => {
  const {
    items,
    delivery,
    total_qauntity,
    first_book_title,
    total_price,
    user_id,
  } = req.body;

  //배송정보 삽입
  let sql = `INSERT INTO delivery (address, receiver,contact) VALUES (?,?,?)`;
  let values = [delivery.address, delivery.receiver, delivery.contact];
  let delivery_id;
  const status = {
    success: StatusCodes.OK,
    fail: StatusCodes.BAD_REQUEST,
  };

  await conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(status.fail).end();
    }
    delivery_id = results.insertId;
  });
  console.log(`delivery_: ${delivery_id}`);

  //주문 정보 삽입
  sql = `INSERT INTO orders (user_id,delivery_id,total_price,book_title,total_quantity) 
  VALUES (?,?,?,?,?);`;
  values = [
    user_id,
    delivery_id,
    total_price,
    first_book_title,
    total_qauntity,
  ];
  let order_id;
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(status.fail).end();
    }
    order_id = results.insertId;
  });

  //주문 상세 삽입 ..items배열 => forEach
  sql = `INSERT INTO orderedBook (order_id,book_id,quantity) VALUES ?`;
  values = [];
  items.forEach((item) => {
    values.push([order_id, item.book_id, item.quantity]);
  });

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(status.fail).end();
    }
    return res.status(StatusCodes.Ok).json(results);
  });
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
