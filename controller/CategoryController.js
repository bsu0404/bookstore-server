const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const allCategory = async (req, res) => {
  //카테고리  전체 조회
  let sql = "SELECT * FROM category";

  try {
    [results] = await (await conn).query(sql);
    console.log(results);
    return res.status(StatusCodes.OK).json(results);
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }
};

module.exports = { allCategory };
