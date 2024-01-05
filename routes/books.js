const express = require("express");
const router = express.Router();
const conn = require("../mariadb");
const { allBooks, book } = require("../controller/bookController");

router.use(express.json());
//전체 도서 조회 & 카테고리 조회
router.get("/", allBooks);
//개별 도서 조회
router.get("/:id", book);

module.exports = router;
