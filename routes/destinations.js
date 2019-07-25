const DestinationModel = require("../models/destination");
const router = require("express").Router();

router.get("/", (req, res) => {
    DestinationModel.findAll().then(destinations => {
        res.send(destinations);
    });
});

router.get("/add/:destination", (req, res) => {
    DestinationModel.create({
        destination:req.params.destination
    }).then(res.redirect("/destinations"))
})

module.exports = router;