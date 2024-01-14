const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto"); //내장 암호화 모듈
//jwt 모듈
const jwt = require("jsonwebtoken");

const join = (req, res) => {
  const { email, name, password } = req.body;

  //비밀번호 암호화
  const salt = crypto.randomBytes(64).toString("base64");
  const hashPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 10, "sha512")
    .toString("base64");

  let sql = "INSERT INTO users (email,name,password,salt) VALUES (?,?,?,?)";
  let values = [email, name, hashPassword, salt];
  //암호화된 비밀번호와 salt값을 같이 db에 저장
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.CREATED).json(results);
  });
};
const login = (req, res) => {
  const { email, password } = req.body;

  let sql = "SELECT * FROM users WHERE email = ?";
  let values = [email];
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    const loginUser = results[0];

    //암호화
    const salt = loginUser.salt;
    const hashPassword = crypto
      .pbkdf2Sync(password, salt, 10000, 10, "sha512")
      .toString("base64");

    //해시 password 비교
    if (loginUser && loginUser.password == hashPassword) {
      //토큰 발급
      const token = jwt.sign(
        {
          email: loginUser.email,
          name: loginUser.name,
          id: loginUser.id,
        },
        process.env.PRIVATE_KEY,
        {
          expiresIn: "15m",
          issuer: "sungeun",
        }
      );
      console.log(token);

      res.cookie("token", token, {
        httpOnly: true,
      });
      return res
        .status(StatusCodes.OK)
        .json({ message: `${loginUser.name}님 환영합니다.` });
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "id 및 pw를 확인해주세요.",
      });
    }
  });
};
const PasswordResetrequest = (req, res) => {
  const { email } = req.body;

  let sql = "SELECT * FROM users WHERE email = ?";

  conn.query(sql, email, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    const user = results[0];
    if (user) {
      return res.status(StatusCodes.OK).json({ email: email });
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).end();
    }
  });
};
const passwordReset = (req, res) => {
  const { email, password } = req.body;
  let sql = "UPDATE users SET password = ?, salt=? WHERE email =?";

  //새로운 salt와 비밀번호
  const salt = crypto.randomBytes(64).toString("base64");
  const hashPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 10, "sha512")
    .toString("base64");

  let values = [hashPassword, salt, email];
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (results.affectedRows) {
      return res.status(StatusCodes.OK).end();
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json(results);
    }
  });
};

module.exports = { join, login, PasswordResetrequest, passwordReset };
