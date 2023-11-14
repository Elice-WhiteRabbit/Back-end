const User = require("../models/User");
const bcrypt = require("bcrypt");

//login user
const loginUser = async (req, res) => {
  res.json({ mssg: "login user" });
};

//signup user
const signupUser = async (req, res) => {
  res.json({ mssg: "signup user" });
};

//유저이름 중복검사
const duplicate = await User.findOne({ username: user }).exec();
if (duplicate) return res.sendStatus(409);

try {
  //비밀번호 암호화
  const hashedPwd = await bcrypt.hash(pwd, 10);

  //유저 생성,저장
  const result = await User.create({
    username: user,
    password: hashedPwd,
  });

  console.log(result);

  res.status(201).json({ 성공: `새로운 ${user}가 만들어졌다!` });
} catch (err) {
  res.status(500).json({ message: err.message });
}

module.exports = { signupUser, loginUser };
