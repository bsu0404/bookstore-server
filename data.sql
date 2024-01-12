INSERT INTO books (title, form, category_id,isbn,summary, detail,author,pages,contents,price,pub_date)
VALUES("건우와 직녀", "종이책",2,5,"건우와 직녀","건우와 직녀 이야기", "생택쥐",170,"목차임",24000,"2023-12-23");

//좋아요 추가
INSERT INTO likes (user_id, liked_book_id) 
VALUES(1,1);

//좋아요 삭제
DELETE FROM likes WHERE user_id=1 AND liked_bood_id = 1;


//좋아요 수+book 테이블
SELECT * , (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes
 FROM Bookshop.books;

//장바구니 담기
 INSERT INTO cartItems(book_id,quantity,user_id) VALUES(1,1,1);

 //장바구니 목록 조회
SELECT cartItems.id, book_id,title,summary,quantity, price 
FROM cartItems 
LEFT JOIN books 
ON books.id = cartItems.book_id 

//장바구니 아이템 조회
DELETE FROM cartItems WHERE id = ?;

//선택한 주문 예상 상품 목록 조회(주문서)
SELECT * FROM cartItems WHERE user_id = ? AND id IN (1,3);

//주문하기
//-배달
INSERT INTO delivery (address, receiver,contact) VALUES ("서울 어딘가", "아무개","010-2222-6666");
//-주문 정보 입력
INSERT INTO orders (user_id,delivery_id,total_price,book_title,total_quantity) 
VALUES (3,1,50000,"어린왕자",3);
const ordered_id = SELECT max(id) FROM orders;
//-주문 상세정보 입력
INSERT INTO orderedBook VALUES (null,ordered_id,1,2);
INSERT INTO orderedBook VALUES (null,ordered_id,2,1);

//최신 
SELECT last_insert_id(); //
SELECT max(id) FROM Bookshop.orderedBook; 
SELECT id FROM orderedBook ORDER BY id DESC LIMIT 1