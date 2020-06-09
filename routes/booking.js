const express = require('express');
const router = express.Router();
const userModel = require('../models/user');
const bookingModel = require('../models/booking');
var request = require('request');
const jwt = require('jsonwebtoken');

const Xendit = require('xendit-node');
const xendit = new Xendit({ secretKey: 'xnd_development_xWxeimRhb0VqnJOiM4dITHTh9zTN9k1Cv2ppccAouz108lFYhy5otKho6uS0HL' });
const { Invoice } = xendit;
const invoiceSpecificOptions = {};
const invoice = new Invoice(invoiceSpecificOptions);

function randomId(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// 4. /api/booking → booking pada hotel yang dipilih dengan parameter nama hotel, lokasi dan lainnya, lalu juga personal info seperti nomor KTP(dalam negeri) atau passport (Luar negeri)
router.post('/', async (req,res)=> {
    var lokasi = req.body.lokasi;
    var nama_hotel = req.body.nama_hotel;
    var customer_email = req.body.customer_email;
    var array = req.body.data;
    var check_in = req.body.check_in;
    var check_out = req.body.check_out;
    var token = req.header("x-auth-token");
    var temp = array.split("}");
    var data=[];
    var ctr=0;
    var total=0;
    temp.forEach(async element => {
        total += parseInt(element.split(",")[1])*parseInt(element.split(",")[2]);
        var temp2 = {
            "jenis_kamar":element.split(",")[0],
            "harga":element.split(",")[1],
            "quantity":element.split(",")[2],
            "subtotal":parseInt(element.split(",")[1])*parseInt(element.split(",")[2])
        }
        data.push(temp2);
        ctr+=1;
        if(ctr==temp.length){
            if(lokasi&&nama_hotel&&customer_email&&data&&check_in&&check_out){
                if(new Date(check_in)>new Date(check_out)){
                    return res.status(400).send({
                        "status":400,
                        "message":"tanggal check in lebih besar daripada check out"
                    });
                }
                else if(new Date(check_out)<new Date()){
                    return res.status(400).send({
                        "status":400,
                        "message":"tanggal check out sudah lewat dari hari ini"
                    });
                }
                if(!token){
                    res.status(401).send({
                        "status":401,
                        "message":"Token tidak ada"
                    });
                }else{
                    try{
                        user = jwt.verify(token,"proyekSOA");
                        var hasil = await userModel.getUserOnly(customer_email);
                        if(hasil.length!=0){
                            total = total * Math.ceil((new Date(check_out)-new Date(check_in))/60/60/24/1000);
                            var id_booking = await bookingModel.addBooking(nama_hotel,lokasi,customer_email,data,total,check_in,check_out);
                            res.status(200).send({
                                "status":200,
                                "message":"booking berhasil",
                                "id_booking":id_booking
                            });
                        }else{
                            res.status(404).send({
                                "status":404,
                                "message":"Customer tidak ada"
                            });
                        }
                    }catch(err){
                        console.log(err);
                        res.status(403).send({
                            "status":403,
                            "message":"User Not Authorized"
                        });
                    }
                }
            }else{
                res.status(400).send({
                    "status":400,
                    "message":"input ada yang kurang"
                });
            }
        }
    });
});

// 7. /api/statusBooking → (GET) melihat status booking
router.get("/status",async(req,res)=>{
    var id_booking = req.query.id_booking;
    var array=[];
    var token = req.header("x-auth-token");
    if(!token){
        res.status(401).send({
            "status":401,
            "message":"Token tidak ada"
        });
    }else{
        try{
            user = jwt.verify(token,"proyekSOA");
            var data = await bookingModel.searchBookingStatus(id_booking,user["email"],user["tipe_user"]);
            data.forEach(element => {
                var temp ={
                    "Booking ID" : element["booking_id"],
                    "Nama Hotel" : element["nama_hotel"],
                    "Lokasi" : element["lokasi"],
                    "Status Booking" : element["Status"]
                }
                array.push(temp);
                if(array.length==data.length){
                    res.status(200).send(array);
                }
            });
        }catch(err){
            res.status(403).send({
                "status":403,
                "message":"User Not Authorized"
            });
        }
    }
});

// 6. /api/statusBooking&status → mengganti status booking, kalau tidak disertakan status maka bertambah 1
router.post("/status",async (req,res)=>{
    var id_booking = req.body.id_booking;
    var status = req.body.status;
    if(id_booking){
        var array=[];
        var token = req.header("x-auth-token");
        if(!token){
            res.status(401).send({
                "status":401,
                "message":"Token tidak ada"
            });
        }else{
            try{
                user = jwt.verify(token,"proyekSOA");
                if(user["tipe_user"]==3){
                    var kembali = await bookingModel.changeBookingStatus(id_booking,status);
                    res.status(200).send({
                        "status":200,
                        "message":kembali
                    });
                }else{
                    res.status(403).send({
                        "status":403,
                        "message":"User Not Authorized"
                    });
                }
            }catch(err){
                console.log(err)
                res.status(403).send({
                    "status":403,
                    "message":"User Not Authorized"
                });
            }
        }
    }else{
        res.status(400).send({
            "status":400,
            "message":"input id_booking tidak ada"
        });
    }
});

// 8. /api/confirmBooking → dari pihak hotel
router.post("/confirm",async (req,res)=>{
    var id_booking = req.body.id_booking;
    if(id_booking){
        var array=[];
        var token = req.header("x-auth-token");
        if(!token){
            res.status(401).send({
                "status":401,
                "message":"Token tidak ada"
            });
        }else{
            try{
                user = jwt.verify(token,"proyekSOA");
                if(user["tipe_user"]==2){
                    await bookingModel.confirmBooking(id_booking);
                    res.status(200).send({
                        "status":200,
                        "message":"Booking id "+id_booking+" telah di setujui"
                    });
                }else{
                    res.status(403).send({
                        "status":403,
                        "message":"User Not Authorized"
                    });
                }
            }catch(err){
                console.log(err);
                res.status(403).send({
                    "status":403,
                    "message":"User Not Authorized"
                });
            }
        }
    }else{
        res.status(400).send({
            "status":400,
            "message":"input id_booking tidak ada"
        });
    }
});

router.post("/reject",async (req,res)=>{
    var id_booking = req.body.id_booking;
    if(id_booking){
        var array=[];
        var token = req.header("x-auth-token");
        if(!token){
            res.status(401).send({
                "status":401,
                "message":"Token tidak ada"
            });
        }else{
            try{
                user = jwt.verify(token,"proyekSOA");
                if(user["tipe_user"]==2){
                    await bookingModel.rejectBooking(id_booking);
                    res.status(200).send({
                        "status":200,
                        "message":"Booking id "+id_booking+" telah di tolak"
                    });
                }else{
                    res.status(403).send({
                        "status":403,
                        "message":"User Not Authorized"
                    });
                }
            }catch(err){
                res.status(403).send({
                    "status":403,
                    "message":"User Not Authorized"
                });
            }
        }
    }else{
        res.status(400).send({
            "status":400,
            "message":"input id_booking tidak ada"
        });
    }
});
var xendit_id ="";
router.post("/settlementPayment",async(req,res)=>{
    var id_booking = req.body.id_booking;
    if(id_booking){
        var detail = await bookingModel.searchBooking(id_booking);
        detail=detail[0];
        var token = req.header("x-auth-token");
        if(!token){
            res.status(401).send({
                "status":401,
                "message":"Token tidak ada"
            });
        }else{
            try{
                user = jwt.verify(token,"proyekSOA");
                var externalID = "payment_"+randomId(8);
                var total_harga = (parseInt(detail["total_harga"])*105/100)*15000;
                if(user["tipe_user"]==1){
                    var resp = await invoice.createInvoice({
                        externalID: externalID,
                        amount: total_harga,
                        payerEmail: user["email"],
                        description: "Payment Booking : "+id_booking+"\n Biaya Booking dikenai pajak 5%",
                        successRedirectURL: "https://proyek-soa-217116653.herokuapp.com/api/booking/payment/success/"+externalID+"/"+detail["total_harga"]+"/"+user["email"]+"/"+id_booking,
                        failureRedirectURL: "https://proyek-soa-217116653.herokuapp.com/api/booking/payment/error/"+externalID+"/"+detail["total_harga"]+"/"+user["email"]+"/"+id_booking
                    });
                    xendit_id=resp["id"];
                    res.status(200).send({
                        "invoice_url":resp["invoice_url"],
                        "data":resp
                    })
                }
                else{
                    res.status(403).send({
                        "status":403,
                        "message":"User Not Authorized"
                    });
                }
            }catch(err){
                console.log(err);
                res.status(403).send({
                    "status":403,
                    "message":"User Not Authorized"
                });
            }
        }
    }else{
        res.status(400).send({
            "status":400,
            "message":"input id_booking tidak ada"
        });
    }
});
router.get("/payment/check",async(req,res)=>{
    // var id = req.body.invoice_id;
    // const resp = await invoice.getInvoice({
    //     invoiceID: id,
    // });
    // status = resp.status;
    // console.log(status);
    // if(status=="SETTLED"){

    // }else if (status=="PENDING"){

    // }
    
    var booking_id= req.body.id_booking;
    var hasil = await bookingModel.changePaymentStatus(booking_id);
    if(hasil.length==0) {
        res.status(404).send({
            "status":404,
            "message":"pembayaran tidak berhasil atau tidak ada"
        })
    }else{
        await bookingModel.changeBookingStatus(booking_id);
        res.status(200).send({
            "status":200,
            "message":"pembayaran berhasil"
        })
    }
    
})
router.get("/payment/success/:external/:total/:email/:id_booking",async (req,res)=>{
    var id_booking = req.params.id_booking;
    var invoice_id=xendit_id;
    var external=req.params.external;
    var total=req.params.total;
    var email=req.params.email;
    var wait = await bookingModel.changeBookingStatus(id_booking).then(async function(){
        var hasil = await bookingModel.addPayment(invoice_id,external,total,email,id_booking).then(function(){
            return res.status(200).send({
                "status":"200",
                "message":"pembayaran berhasil"
            })
        });
    });
});
router.get("/payment/error/:external/:total/:email/:id_booking",async (req,res)=>{
    var id_booking = req.params.id_booking;
    var invoice_id=xendit_id;
    var external=req.params.external;
    var total=req.params.total;
    var email=req.params.email;
    await bookingModel.changeBookingStatus(id_booking,5);
    res.status(200).send({
        "status":"200",
        "message":"pembayaran tidak berhasil"
    })
});


module.exports = router