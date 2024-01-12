const express = require("express");
const router = express.Router();
const {
  addCart,
  removeCart,
  getCart,
} = require("../controller/CartController");

router.use(express.json());

router.post("/", addCart); //장바구니 담기
router.get("/", getCart); //장바구니 목록 조회 or 선택한 주문 예상 상품 목록 조회(주문서)
router.delete("/:id", removeCart); //장바구니 삭제

module.exports = router;
