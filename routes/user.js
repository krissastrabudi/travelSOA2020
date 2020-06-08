const express = require('express');
const router = express.Router();
const userModel = require('../models/user');
const jwt = require('jsonwebtoken');
const multer = require('multer');

router.use(express.static('public'));

const storage=multer.diskStorage({
    destination:function(req,file,callback){
        callback(null,'./public/uploads');
    },
    filename:function(req,file,callback){
        const filename = file.originalname;
        const extension = filename.split('.')[filename.split('.').length-1];
        callback(null,Date.now()+'.'+extension);
    }
});
const upload=multer({
    storage:storage,
    fileFilter: function(req,file,cb){
        checkFileType(file,cb);
    }
});
function checkFileType(file,cb){
    const filetypes= /jpeg|jpg|png|gif/;
    const extname=filetypes.test(file.originalname.split('.')[file.originalname.split('.').length-1]);
    const mimetype=filetypes.test(file.mimetype);
    if(mimetype && extname){
        return cb(null,true);
    }else{
        cb('Error: Image Only!');
        // error = 'Error : Image Only!';
    }
}

router.post('/register',upload.single('ktp'), async (req,res)=> {
    let email = req.body.email_user;
    let nohp = req.body.no_hp_user;
    let nama = req.body.nama_user;
    let password = req.body.password;
    let confirmPass = req.body.confirm_password;
    let tipe_user = req.body.tipe_user;
    
    if(email && nohp && nama && password && confirmPass&&tipe_user) {
        if(password ==confirmPass) {
            let result = await userModel.getUser(email,password);
            if(result.length==0) {
                if(req.file!=undefined){
                    var image = "./public/uploads/"+req.file.filename;
                    const resInsert = await userModel.insert(email,nohp,nama,password,image,tipe_user);
                    res.status(200).send("Berhasil Mendaftar!");
                }
                else{
                    res.status(400).send("KTP tidak benar");
                }
            }
            else {
                res.status(400).send("User dengan email tersebut sudah terdaftar sebelumnya");
            }
        }
        else {
            res.status(400).send("Password & Confirm Password Harus Sama!");
        }
    }
    else {
        res.status(400).send("Semua Field Harus Diisi!");
    }
});

router.post('/login', async(req,res)=> {
    let email = req.body.email_user;
    let password = req.body.password;
    if(email && password) {
        let result = await userModel.getUser(email,password);
        if(result.length>0) {
            const token = jwt.sign({    
                "email":result[0].email,
                "tipe_user":result[0].tipe_user
                }   ,"proyekSOA", {
                expiresIn: "90m"
            });
            res.status(200).send({
                "email": result[0].email,
                "tipe_user":result[0].tipe_user,
                "token JWT": token
            });
        }
        else {
            res.status(404).send("Gagal Login! User tidak ditemukan atau password salah");
        }
    }
    else {
        res.status(400).send("Semua Field Harus Diisi!");
    }
});

router.put('/deleteUser', async (req,res)=> {
    const token = req.header("x-auth-token");
    let user={};
    if(!token) {
        return res.status(404).send("Token Tidak Ada!");
    }
    else {
        try {
            user = jwt.verify(token,"proyekSOA");
        } catch (error) {
            return res.status(401).send("Token Invalid!");
        }
        if((new Date().getTime()/1000)-user.iat>(60*60)) {
            return res.status(401).send("Token Kadaluarsa!");
        }
        else {
            const resDelete = await userModel.deleteUser(user.email);
            res.status(200).send("Berhasil Nonaktifkan User!");
        }
    }
})

router.put('/updateUser', async (req,res)=> {
    const token = req.header("x-auth-token");
    let user={};
    if(!token) {
        return res.status(404).send("Token Tidak Ada!");
    }
    else {
        try {
            user = jwt.verify(token,"proyekSOA");
        } catch (error) {
            return res.status(401).send("Token Invalid!");
        }
        if((new Date().getTime()/1000)-user.iat>(60*60)) {
            return res.status(401).send("Token Kadaluarsa!");
        }
        else {
            let email = req.body.email_user
            let nohp = req.body.no_hp_user;
            let nama = req.body.nama_user;
            let password = req.body.password;
            let confirmPass = req.body.confirm_password;
            if(nohp && nama && password && confirmPass && email) {
                if(password == confirmPass) {
                    const resUpdate = await userModel.update(email,nohp,nama,password);
                    res.status(200).send("Berhasil Ubah Data User!");
                }
                else {
                    res.status(400).send("Password & Confirm Password Harus Sama!");
                }
            }
            else{
                res.status(400).send("Semua Field Harus Diisi!");
            }
        }
    }
});

module.exports = router