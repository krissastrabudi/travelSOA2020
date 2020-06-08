const express = require('express');
const router = express.Router();
const hotelModel = require('../models/hotel');
var request = require('request');

var token = "632a1f316b99823d608f5d40f70c36d3";

//api/hotel/getHotel?nama_hotel&id_hotel 
function getUrl(url){
    return new Promise(function (resolve,reject) {
        var option={
            "method":"GET",
            "url":url,
            "headers":{
                'Content-Type':'application/x-www-form-urlencoded'
            }
        };
        request(option,function (error,response) {
            if(error) reject(new Error(error));
            else resolve(JSON.parse(response.body));
        });
    })
}
router.get('/getHotel', async (req,res)=> {
    var nama_kota = req.query.nama_kota;
    if(!nama_kota) return res.status(400).send({
        "status":400,
        "message":"nama_kota tidak ada pada url anda"
    });
    var url = `http://engine.hotellook.com/api/v2/lookup.json?query=${nama_kota}&lookFor=hotel`;
    var lang = req.query.lang;
    if(!lang) {
        lang="en";
        url = url+`&lang=${lang}`;
    }
    var limit = req.query.limit;
    if(!limit) {
        limit=5;
        url=url+`&limit=${limit}`;
    }
    url = url+`&token=${token}`;
    var hasil = await getUrl(url);
    var arrResult=[];
    hasil["results"]["hotels"].forEach(row => {
        var temp = {
            "nama_hotel" : row["label"],
            "lokasi": row["locationName"],
            "longitude" : row["location"]["lon"],
            "latitude" : row["location"]["lat"],
            "full name":row["fullName"] 
        }
        arrResult.push(temp);
        if(arrResult.length==limit){
            res.status(200).send(arrResult);
        }
    });
});

// 1. /api/getPrice?start&end&id_hotel → get harga hotel bedasarkan nama/id, tanggal start dan end
router.get('/getPrice', async (req,res)=> {
    //location dan nama hotel
    var lokasi = req.query.lokasi;
    var nama_hotel = req.query.nama_hotel;
    if(!lokasi||!nama_hotel) return res.status(400).send({
        "status":400,
        "message":"nama_hotel atau lokasi tidak ada pada url anda"
    });
    var url = `http://engine.hotellook.com/api/v2/cache.json?location=${lokasi}&hotel=${nama_hotel}`;
    
    //tanggal check in dan check out
    var checkIn = req.query.checkIn;
    var checkOut = req.query.checkOut;
    if(!checkIn||!checkOut) return res.status(400).send({
        "status":400,
        "message":"checkOut atau checkIn tidak ada pada url anda"
    });
    var now = new Date().getFullYear()+"-";
    if(parseInt(new Date().getMonth())+1<10) now+='0';
    now+= (parseInt(new Date().getMonth())+1)+"-";
    if(new Date().getDate()<10) now+="0";
    now+=new Date().getDate();
    if(checkOut>checkIn&&checkOut>=now){
        url=url+`&checkIn=${checkIn}&checkOut=${checkOut}`;

        //currency nya bisa rub,usd,eur
        var currency = req.query.currency;
        if(!currency) {
            currency="usd";
            url = url+`&currency=${currency}`;
        }
        
        //limit keluarnya hotel
        var limit = req.query.limit;
        if(!limit) {
            limit=8;
            url=url+`&limit=${limit}`;
        }
        
        //jumlah org dewasa
        var adults = req.query.adults;
        if(!adults) {
            adults=2;
            url=url+`&adults=${adults}`;
        }

        //ada infants(0-2 tahun) atau tidak
        var infants = req.query.infants;
        if(infants) {
            url=url+`&infants=${infants}`;
        }
        
        //ada children (2-18 tahun) atau tidak
        var children  = req.query.children ;
        if(children) {
            url=url+`&children =${children }`;
        }

        url = url+`&token=${token}`;
        var hasil = await getUrl(url);
        res.status(200).send(hasil);
    }else{
        res.status(400).send({
            "status":400,
            "message":"tanggal hari ini harus lebih besar daripada checkin anda dan checkout tidak boleh lebih kecil daripada checkin anda"
        });
    }
});

// 3. /api/getRoom?nama_hotel&id_hotel → mendapatkan jenis kamar yang ada pada hotel tersebut
// 5. /api/settlementPayment → menyelesaikan pembayaran + upload bukti




module.exports = router