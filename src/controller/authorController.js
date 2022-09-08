const authorModel = require("../Model/authorModel")
const jwt = require("jsonwebtoken")

const createAuthor = async function (req, res) {
  try {


    let data = req.body
    if (!(/^[a-z0-9_]{3,}@[a-z]{3,}.[a-z]{3,6}$/).test(data.emailId)) {
      return res.status(400).send({ status: false, message: `Email should be a valid email address` });
    }
    let savedData = await authorModel.create(data)
    return res.status(201).send({ msg: savedData })
  }
  catch (err) {
    console.log(err.message)
    res.status(500).send({ msg: err.message })
  }
}

const loginUser = async function (req, res) {
  try {
    let userName = req.body.emailId;
    let password = req.body.password;
    let user = await authorModel.findOne({ emailId: userName, password: password });
    if (!user)
      return res.status(404).send({ msg: "username or the password is not corerct", status: false, })
    let token = jwt.sign({ userId: user._id.toString(), batch: "plutonium", organisation: "FunctionUp", }, "P1@roject");
    res.status(202).send({ status: true, token: token });
  } catch (err) {
    res.status(500).send({ msg: "ERROR", error: err.message })
  }
};


module.exports.createAuthor = createAuthor
module.exports.loginUser = loginUser