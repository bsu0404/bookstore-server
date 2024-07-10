const express = require("express");
const router = express.Router();
const { addLike, subLike } = require("../controller/LikeController");

router.use(express.json());
//좋아요 추가
router.post("/:id", addLike);
//좋아요 삭제
router.delete("/:id", subLike);

module.exports = router;
