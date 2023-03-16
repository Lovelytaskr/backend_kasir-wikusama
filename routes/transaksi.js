const express = require("express")
const app = express()
app.use(express.json())

const models = require("../models/index")
const transaksi = models.transaksi
const detail_transaksi = models.detail_transaksi
const meja = models.meja
const access = require("../utils/access")

const auth = require("../auth")
const moment = require("moment")
app.use(auth)
const{Op} = require("sequelize");

app.get("/", async (req, res) =>{
    let result = await transaksi.findAll({
        // include: [
        //     "menu",
        //     {
        //         model: models.detail_transaksi,
        //         as : "detail_transaksi",
        //         include: ["menu"]
        //     }
        // ]
    }) 
    res.json(result)
})

// filtering data transaksi berdasarkan id transaksi
app.get('/transaksi/:id_transaksi', (req,res) => {
    let indicator = {id_transaksi: req.params.id_transaksi}
    detail_transaksi.findAll({
        where: indicator,
        order: [
          ["id_menu","DESC"]
        ],
    })
        .then(result => {
            res.json(result)
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
  })

// filtering data transaksi berdasarkan id user
app.get('/user/:id_user', (req,res) => {
    let indicator = {id_user: req.params.id_user}
    transaksi.findAll({
        where: indicator,
        order: [
            ["tgl_transaksi", "DESC"]
        ],
    })
        .then(result => {
            res.json(result) 
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

app.post("/", auth, async (req, res) => {
  let granted = await access.kasir(req)
    if(!granted.status){  // jika status tidak true
        return res.status(403).json(granted.message)
    }
  let tgl = new Date();
  let now = moment(tgl).format("YYYY-MM-DD");
  let data = {
    tgl_transaksi: req.body.tgl_transaksi,
    id_user: req.body.id_user,
    id_meja : req.body.id_meja,
    nama_pelanggan : req.body.nama_pelanggan,
    status: req.body.status,
    total: req.body.total,
  };
  transaksi.create(data)
    .then(result => {
      let lastID = result.id_transaksi;
      detail = req.body.detail_transaksi;
      detail.forEach(element => {
        element.id_transaksi = lastID;
        console.log(element.id_transaksi)
      });
      console.log(detail)
      detail_transaksi
        .bulkCreate(detail, {individualHooks:true})
        .then(result => {
          res.json({
            message: "Data has been inserted",
            detail: result
          });
        })
        .catch(error => {
          res.json({
            message: error.message,
          });
        });
        // update status meja
      meja.update({ status: "terisi" }, { where: { id_meja: req.body.id_meja } }); // mengubah status meja menjadi dipesan
    })
    .catch(error => {
      res.json({
        message: error.message,
      });
    });
});

//filtering berdasarkan tanggal_bayar
app.post("/filter", async (req, res) => {
    let tgl_transaksi_awal = req.body.tgl_transaksi_awal;
    let tgl_transaksi_akhir = req.body.tgl_transaksi_akhir;
    let result = await transaksi.findAll({
      where: {
          tgl_transaksi: {
              [Op.between]: [tgl_transaksi_awal, tgl_transaksi_akhir],
            },
          },
          order: [["tgl_transaksi", "DESC"]],
        });
        return res.status(200).json({
          data: result,
        });
        then(data => {
         res.json({})
         })
        .catch(error => {
             res.json({
                 message: error.message
           })
         })
      });

app.put("/:id_transaksi", auth, async (req, res) => {
    let granted = await access.kasir(req)
    if(!granted.status){  // jika status tidak true
        return res.status(403).json(granted.message)
    }
    let current = new Date();
    let now = moment(current).format("YYYY-MM-DD");
    let param = {
      id_transaksi: req.params.id_transaksi
    }
    let data = {
        id_meja : req.body.id_meja,
        status: req.body.status,
    };
    if (data.status === "lunas") {
      (data.tanggal_bayar = now);
    }
    transaksi
      .update(data, { where: param })
      .then((result) => {
        return res.json({
          message: "data updated",
          transaksi : result
        });
      })
      .catch((err) => {
        return res.json({
          message: err.message,
        });
      });
  });

app.delete("/:id_transaksi", auth, async (req, res) =>{
    let granted = await access.kasir(req)
    if(!granted.status){  // jika status tidak true
        return res.status(403).json(granted.message)
    }
    let param = { id_transaksi: req.params.id_transaksi}
    try {
        await detail_transaksi.destroy({where: param})
        await transaksi.destroy({where: param})
        res.json({
            message : "data has been deleted"
        })
    } catch (error) {
        res.json({
            message: error
        })
    }
})

module.exports = app