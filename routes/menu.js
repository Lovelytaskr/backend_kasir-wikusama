const express = require("express")
const app = express()
const auth = require("../auth")
app.use(express.json())

const md5 = require("md5")

const multer = require("multer")
const path = require("path")
const fs = require("fs")
const access = require("../utils/access")

const models = require("../models/index")
const menu = models.menu
 
const storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,"./gambar/menu")
    },
    filename: (req,file,cb) => {
        cb(null, "img-" + Date.now() + path.extname(file.originalname))
    }
})
let upload = multer({storage: storage})


app.get("/", (req, res) =>{
    menu.findAll()
        .then(result => {
            res.json({
                menu : result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })  
})

app.get("/:id_menu", (req, res) =>{
    menu.findOne({ where: {id_menu: req.params.id_menu}})
    .then(result => {
        res.json({
            menu: result
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.post("/", upload.single("gambar"), auth, async (req, res) =>{
    let granted = await access.admin(req)
    if(!granted.status){  // jika status tidak true
        return res.status(403).json(granted.message)
    }
    if (!req.file) {
        res.json({
            message: "No uploaded file"
        })
    } else {
        let data = {
            nama_menu: req.body.nama_menu,
            jenis: req.body.jenis,
            deskripsi: req.body. deskripsi,
            gambar: req.file.filename,
            harga: req.body. harga
        }
        menu.create(data)
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
    }
})

app.put("/:id", upload.single("gambar"), auth, async(req, res) =>{
    let granted = await access.admin(req)
    if(!granted.status){  // jika status tidak true
        return res.status(403).json(granted.message)
    }
    let param = { id_menu: req.params.id}
    let data = {
            nama_menu: req.body.nama_menu,
            jenis: req.body.jenis,
            deskripsi: req.body. deskripsi,
            gambar: req.file.filename,
            harga: req.body. harga
    }
    if (req.file) {
        // get data by id
        const row = menu.findOne({where: param})
        .then(result => {
            let oldFileName = result.gambar
           
            // delete old file
            let dir = path.join(__dirname,"../gambar/menu",oldFileName)
            fs.unlink(dir, err => console.log(err))
        })
        .catch(error => {
            console.log(error.message);
        })

        // set new filename
        data.gambar = req.file.filename
    }

    if(req.body.password){
        data.password = md5(req.body.password)
    }

    menu.update(data, {where: param})
        .then(result => {
            res.json({
                message: "change saved",
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

app.delete("/:id", auth, async (req, res) =>{
    let granted = await access.admin(req)
    if(!granted.status){  // jika status tidak true
        return res.status(403).json(granted.message)
    }
    try {
        let param = { id_menu: req.params.id}
        let result = await menu.findOne({where: param})
        let oldFileName = result.gambar
           
        // delete old file
        let dir = path.join(__dirname,"../gambar/menu",oldFileName)
        fs.unlink(dir, err => console.log(err))

        // delete data
        menu.destroy({where: param})
        .then(result => {
           
            res.json({
                message: "change saved",
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })

    } catch (error) {
        res.json({
            message: error.message
        })
    }
})

module.exports = app