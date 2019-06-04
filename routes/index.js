var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Agencia de Viajes" });
});

router.get("/register", function(req, res, next) {
  res.render("register", { title: "Register" });
});

router.get("/login", function(req, res, next) {
res.render("login", {title: "Login"});
});

router.get("/prueba", function(req, res, next) {
  res.send("esto es una prueba");
  });  // router.get("/prueba", (req,res)=>res.send("esto es una prueba"))

module.exports = router;
