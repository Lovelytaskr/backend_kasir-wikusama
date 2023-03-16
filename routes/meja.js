const express = require('express');
const bodyParser = require('body-parser');
const access = require("../utils/access")
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const model = require('../models/index');
const meja = model.meja

app.get("/", (req,res) => {
   meja.findAll()
        .then(result => {
            res.json({
                meja : result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

app.post("/", auth, async (req,res) => {
    let granted = await access.admin(req)
    if(!granted.status){  // jika status tidak true
        return res.status(403).json(granted.message)
    }
    let data = {
        nomor_meja : req.body.nomor_meja,
        status : req.body.status 
    }

    meja.create(data)
        .then(result => {
            res.json({
                message: "change saved"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

app.put("/:id", auth, async (req,res) => {
    let granted = await access.admin(req)
    if(!granted.status){  // jika status tidak true
        return res.status(403).json(granted.message)
    }
    let param = {
        id_meja : req.params.id
    }
    let data = {
        nomor_meja : req.body.nomor_meja,
        status : req.body.status 
    }
    meja.update(data, {where: param})
        .then(result => {
            res.json({
                message: "change saved"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

app.delete("/:id", auth, async (req,res) => {
    let granted = await access.admin(req)
    if(!granted.status){  // jika status tidak true
        return res.status(403).json(granted.message)
    }
    let param = {
        id_meja : req.params.id
    }
    meja.destroy({where: param})
        .then(result => {
            res.json({
                message: "change saved"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

module.exports = app