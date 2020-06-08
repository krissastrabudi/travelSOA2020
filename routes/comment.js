const express = require('express');
const router = express.Router();
const commentModel = require('../models/comment');
const jwt = require('jsonwebtoken');

router.post('/', async (req,res)=> {
    let email = req.body.email_user;
    let judul = req.body.judul_comment;
    let isi = req.body.isi_comment;
    let star = req.body.jumlah_bintang;
    let hotel = req.body.nama_hotel;
    let lokasi = req.body.lokasi;
    let tglposting = req.body.tgl_posting;
    let valid = false;
    if(email!='' && judul!='' && isi!='' && star!='' &&tglposting!='') {
        const token = req.header("x-auth-token");
        let user={};
        if(!token) {
            return res.status(404).send("Token Tidak Ada!");
        }
        else {
            try{
                user = jwt.verify(token,"proyekSOA");
                valid = true;
            }catch(err){
                res.status(401).send("Token Invalid/Expired");
            }
            if(valid){
                const updatekomen = await commentModel.getAllComment();
                var id = (updatekomen[updatekomen.length-1].id_comment) +1;
                const tambahkomen = await commentModel.addComment(id,email,judul,isi,star,tglposting,hotel,lokasi);
                res.status(200).send(tambahkomen);
            }
        }
    }
    else {
        res.status(400).send("Semua Field Harus Diisi!");
    }
});

router.post('/tesinsert', async (req,res)=> {
    const tambahkomen = await commentModel.addCommentTes();
    res.status(200).send(tambahkomen);
});

router.put('/update', async (req,res)=> {
    let id = req.body.id_comment;
    let judul = req.body.judul_comment;
    let isi = req.body.isi_comment;
    let star = req.body.jumlah_bintang;
    let tglupdate = req.body.tgl_update;
    let valid = false;
    if(id!='' && judul!='' && isi!='' && star!='') {
        const token = req.header("x-auth-token");
        let user={};
        if(!token) {
            return res.status(404).send("Token Tidak Ada!");
        }
        else {
            try{
                user = jwt.verify(token,"proyekSOA");
                valid = true;
            }catch(err){
                res.status(401).send("Token Invalid/Expired");
            }
            if(valid){
                const updatekomen = await commentModel.updateComment(id,judul,isi,tglupdate,star);
                res.status(200).send(updatekomen);
            }
        }
    }
    else {
        res.status(400).send("Semua Field Harus Diisi!");
    }
});

router.delete('/delete', async (req,res)=> {
    let id = req.body.id_comment;
    let valid = false;
    if(id!='') {
        const token = req.header("x-auth-token");
        let user={};
        if(!token) {
            return res.status(404).send("Token Tidak Ada!");
        }
        else {
            try{
                user = jwt.verify(token,"proyekSOA");
                valid = true;
            }catch(err){
                res.status(401).send("Token Invalid/Expired");
            }
            if(valid){
                const getkomen = await commentModel.getCommentById(id);
                if (getkomen.length>0){
                    const getkomen2 = await commentModel.getCommentToDelete(id,user.email);
                    if(getkomen2.length>0){
                        const hapuskomen = await commentModel.deleteComment(id);
                        res.status(200).send(hapuskomen);
                    }
                    else{
                        res.status(404).send("Hanya user yang bersangkutan yang bisa menghapus");
                    }
                }
                else{
                    res.status(404).send("Comment Tidak ditemukan");
                }
            }
        }
    }
    else {
        res.status(400).send("Semua Field Harus Diisi!");
    }
});

router.get('/all', async (req,res)=> {
    const updatekomen = await commentModel.getAllComment();
    res.status(200).send(updatekomen);
});

router.get('/mycomment', async (req,res)=> {
    const token = req.header("x-auth-token");
    let valid = false;
    let user={};
    if(!token) {
        return res.status(404).send("Token Tidak Ada!");
    }
    else {
        try{
            user = jwt.verify(token,"proyekSOA");
            valid = true;
        }catch(err){
            res.status(401).send("Token Invalid/Expired");
        }
        if(valid){
            const updatekomen = await commentModel.getCommentByUser(user.email);
            res.status(200).send(updatekomen);
        }
    }
});

router.get('/bystar', async (req,res)=> {
    const token = req.header("x-auth-token");
    const star = req.query.star;
    const nama = req.query.name;
    const kota = req.query.loc;
    let valid = false;
    let user={};
    if(!token) {
        return res.status(404).send("Token Tidak Ada!");
    }
    else {
        try{
            user = jwt.verify(token,"proyekSOA");
            valid = true;
        }catch(err){
            res.status(401).send("Token Invalid/Expired");
        }
        if(valid){
            if(star&&nama&&kota){
                const updatekomen = await commentModel.getCommentByStars(star,nama,kota);
                res.status(200).send(updatekomen);
            }
            else{
                res.status(400).send("pastikan lokasi,nama hotel, dan bintang terdapat pada url");
            }
        }
    }
});
module.exports = router