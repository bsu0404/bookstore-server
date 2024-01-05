const express = require("express");
const router = express.Router();

router.use(express.json);
//주문하기
router.post("/", (req, res) => {
  res.json({ msg: "주문 성공" });
});
//주문목록 조회
router.get("/", (req, res) => {
  res.json({ msg: "장바구니 조회" });
});
//주문 상세 조회
router.get("/:id", (req, res) => {
  res.json({ msg: "주문 상세 조회" });
});

module.exports = router;
