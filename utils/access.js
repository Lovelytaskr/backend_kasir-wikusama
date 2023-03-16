const deniedMessage = {
    message: "Access Denied",
    err: null
}

const admin = async (req) => {
    console.log(req.userData)
    const role = req.userData.role;
    if(role === "admin"){
        return ({
            status: true,
            message: "granted"
        })
    }
    return ({
        status: false,
        message: deniedMessage
    })
}

const kasir = async (req) => {
    console.log(req.body)
    const role = req.userData.role;
    if(role === "kasir"){
        return ({
            status: true,
            message: "granted"
        })
    }
    return ({
        status: false,
        message: deniedMessage
    })
}

const manajer = async (req) => {
    console.log(req.userData)
    const role = req.userData.role;
    if(role === "manajer"){
        return ({
            status: true,
            message: "granted"
        })
    }
    return ({
        status: false,
        message: deniedMessage
    })
}

const kasirManajer =
module.exports = {
    admin,
    kasir,
    manajer
}