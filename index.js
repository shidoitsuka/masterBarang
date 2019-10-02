const path = require("path");
const express = require("express");
const mysql = require("mysql");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const app = express();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "masterBarang"
});
db.connect(err => {
  if (err) return console.log(`MySQL failed to connect : ${err}`);
  console.log("MySQL connected!");
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use("/assets", express.static(`${__dirname}/public`));

app.get("/", (req, res) => {
  let sql = "SELECT * FROM barang";
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.render("register", {
      results: results
    });
  });
});

app.post("/save", (req, res) => {
  res.set("Content-Type", "text/html");
  let data = {
    kodeBarang: req.body.kodeBarang,
    namaBarang: req.body.namaBarang,
    merkBarang: req.body.merkBarang,
    hargaBarang: req.body.hargaBarang,
    tanggalMasuk: req.body.tanggalMasuk
  };
  let sqlCheck = `SELECT kodeBarang
  FROM barang
  WHERE kodeBarang = '${req.body.kodeBarang}'
  `;
  let sql = "INSERT INTO barang SET ?";
  let query = db.query(sqlCheck, (err, results) => {
    if (results.length > 0) {
      res.send(
        `<h1>${req.body.kodeBarang} sudah tersedia!</h1>
        Klik <a href="/">disini</a> untuk kembali.`
      );
    } else {
      db.query(sql, data);
      res.redirect("/");
    }
  });
});

app.post("/update", (req, res) => {
  let sql = `UPDATE barang SET
  namaBarang='${req.body.namaBarang}',
  merkBarang='${req.body.merkBarang}',
  hargaBarang='${req.body.hargaBarang}',
  tanggalMasuk='${req.body.tanggalMasuk}'
  WHERE kodeBarang='${req.body.kodeBarang}'
  `;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect("/");
  });
});

app.post("/delete", (req, res) => {
  let sql = `DELETE FROM barang WHERE kodeBarang='${req.body.kodeBarang}'`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect("/");
  });
});

app.listen(3000, () => console.log("3000!"));
