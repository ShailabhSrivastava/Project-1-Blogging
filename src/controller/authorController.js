const authorModel = require("../Model/authorModel")

const createAuthor = async function (req, res) {
    try {
        let data = req.body
        let savedData = await authorModel.create(data)
        return res.send({ msg: savedData })
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({ msg: err.message })
    }
}


 module.exports.createAuthor=createAuthor