const express = require("express");
const router = express.Router();

router.use(express.json);
//장바구니 담기
router.post("/", (req, res) => {
  res.json({ msg: "장바구니 담기" });
});
//장바구니 조회
router.get("/", (req, res) => {
  res.json({ msg: "장바구니 조회" });
});
//장바구니 삭제
router.delete("/:id", (req, res) => {
  res.json({ msg: "장바구니 삭제" });
});
//주문서에서 선택된 장바구니 조회
// router.get("/carts", (req, res) => {
//     res.json({ msg: "장바구니 조회" });
//   });
module.exports = router;
