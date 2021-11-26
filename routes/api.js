const router = require("express").Router();
const Transaction = require("../models/transaction.js");

router.get("/", function (req, res) {
  res.json(path.join(__dirname, "public/index.html"));
});

router.post("/api/transaction", ({body}, res) => {
  console.log("==================")
  console.log(body)
  Transaction.create(body)
    .then(dbTransaction => {
      console.log("==================")
      console.log(dbTransaction)
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

router.post("/api/transaction/bulk", ({body}, res) => {
  Transaction.insertMany(body)
    .then(dbTransaction => {
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

router.get("/api/transaction", (req, res) => {
  console.log("~~~~~~~~~~~~~~")
  console.log(req)
  Transaction.find({}).sort({date: -1})
    .then(dbTransaction => {
      console.log("~~~~~~~~~~~~~~")
      console.log(dbTransaction)
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

router.get("*", function (req, res) {
  res.json(path.join(__dirname, "public/index.html"));
});

module.exports = router;