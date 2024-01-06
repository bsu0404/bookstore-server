INSERT INTO books (title, form, category_id,isbn,summary, detail,author,pages,contents,price,pub_date)
VALUES("건우와 직녀", "종이책",2,5,"건우와 직녀","건우와 직녀 이야기", "생택쥐",170,"목차임",24000,"2023-12-23");

<좋아요 추가>
INSERT INTO likes (user_id, liked_book_id) 
VALUES(1,1);
<좋아요 삭제>
DELETE FROM likes WHERE user_id=1 AND liked_bood_id = 1;
<select 좋아요 수+book 테이블>
SELECT * , (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes
 FROM Bookshop.books;