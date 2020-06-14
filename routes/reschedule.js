const express = require('express');
const router = express.Router();
const userModel = require('../models/user');
const rescheduleModel = require('../models/reschedule');
var request = require('request');
const jwt = require('jsonwebtoken');
var dateFormat = require('dateformat');

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

router.get('/getSchedule',async(req,res)=>{
    var token = req.header("x-auth-token");
    var array=[];
    if(!token){
        res.status(401).send({
            "status":401,
            "message":"Token tidak ada"
        });
    }else{
        try{
            user = jwt.verify(token,"proyekSOA");
            if(user["tipe_user"] != 1){
                return res.status(404).send({
                    "status": 404,
                    "message": "User Not Authorized"
                })
            }
            var id = "";
            if(req.query.id_booking){
                id = req.query.id_booking;
            }
            var data = await rescheduleModel.searchBookings(id,user["email"],user["tipe_user"]);
            if(data.length == 0){
                return res.status(200).send("Anda Sedang Tidak Memiliki Schedule");
            }
            data.forEach(element => {
                var temp ={
                    "Booking ID" : element["booking_id"],
                    "Nama Hotel" : element["nama_hotel"],
                    "Lokasi" : element["lokasi"],
                    "Check In": element["check_in"],
                    "Check Out": element["check_out"],
                    "Status Booking" : element["Status"],
                    "Request ID": element["request_id"]
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
})
router.get('/getScheduleRefund',async(req,res)=>{
    var token = req.header("x-auth-token");
    var array=[];
    if(!token){
        res.status(401).send({
            "status":401,
            "message":"Token tidak ada"
        });
    }else{
        try{
            user = jwt.verify(token,"proyekSOA");
            if(user["tipe_user"] != 2){
                return res.status(404).send({
                    "status": 404,
                    "message": "User Not Authorized"
                })
            }
            var id = "";
            var data = await rescheduleModel.cariBookingRefund();
            if(data.length == 0){
                return res.status(200).send("Tidak Ada Schedule Yang Perlu Di Refund")
            }
            data.forEach(element => {
                var temp ={
                    "Booking ID" : element["booking_id"],
                    "Nama Hotel" : element["nama_hotel"],
                    "Lokasi" : element["lokasi"],
                    "Status Booking" : element["Status"],
                    "Total Harga": element["total_harga"]
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
})
router.get('/getScheduleWithVariable',async(req,res)=>{
    var token = req.header("x-auth-token");
    var array=[];
    if(!token){
        res.status(401).send({
            "status":401,
            "message":"Token tidak ada"
        });
    }else{
        try{
            user = jwt.verify(token,"proyekSOA");
            if(user["tipe_user"] != 1){
                return res.status(404).send({
                    "status": 404,
                    "message": "User Not Authorized"
                })
            }
            var id = "";
            if(req.query.id_booking){
                id = req.query.id_booking;
            }
            if(!req.query.id_booking){
                res.status(403).send({
                    "status":403,
                    "message":"ID Booking Harus Ada"
                });
            }
            var data = await rescheduleModel.searchBookings(id,user["email"],user["tipe_user"]);
            data.forEach(element => {
                var temp ={
                    "Booking ID" : element["booking_id"],
                    "Nama Hotel" : element["nama_hotel"],
                    "Lokasi" : element["lokasi"],
                    "Status Booking" : element["Status"],
                    "Request ID": element["request_id"]
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
})
router.post('/cancelBooking',async(req,res)=>{
    var token = req.header("x-auth-token");
    var id = req.query.id_booking;
    if(!token){
        res.status(401).send({
            "status":401,
            "message":"Token tidak ada"
        });
    }else{
        try{
            user = jwt.verify(token,"proyekSOA");
            if(user["tipe_user"] != 1){
                return res.status(404).send({
                    "status": 404,
                    "message": "User Not Authorized"
                })
            }
            var data = await rescheduleModel.cocokkanEmail(id,user["email"]);
            if(data.length == 1){
                if(data[0].status_booking >= 4 && data[0].status_booking != 8 && data[0].request_id == "0"){
                    data = await rescheduleModel.counterRequest(id);
                    var belakang = "";
                    if(data.length < 10){
                        belakang = "0"
                    }
                    var request_id = 'R'+id+belakang+(data.length + 1);
                    data = await rescheduleModel.doRequest(id,request_id,7);
                    data = await rescheduleModel.addRequest(id,'Cancel',request_id);
                    data = await rescheduleModel.searchBookings(id,user["email"]);
                    res.status(200).send(data);
                }else if(data[0].status_booking == 8){
                    res.status(403).send({
                        "status":403,
                        "message":"Booking Anda Sudah Tercancel"
                    });
                }else if(data[0].request_id != "0"){
                    res.status(403).send({
                        "status":403,
                        "message":"Selesaikan Request Sebelumnya Terlebih Dahulu"
                    });
                }
                else{
                    res.status(403).send({
                        "status":403,
                        "message":"Selesaikan Booking Terlebih Dahulu"
                    });
                }
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
})
router.get('/checkRequest',async(req,res)=>{
    var token = req.header("x-auth-token");
    var array = [];
    if(!token){
        res.status(401).send({
            "status":401,
            "message":"Token tidak ada"
        });
    }else{
        try{
            user = jwt.verify(token,"proyekSOA");
            if(user["tipe_user"] != 1){
                return res.status(404).send({
                    "status": 404,
                    "message": "User Not Authorized"
                })
            }
            var data = await rescheduleModel.getRequestByEmail(user["email"]);
            if(data.length == 0){
                return res.status(200).send({
                    "status": 200,
                    "message": "Tidak Ada Request"
                })
            }
            for (const element of data){
                var temp = "";
                var data1 = await rescheduleModel.cocokkanEmail(element["booking_id"],user["email"]);
                if(element["request_name"] == "Cancel" && data1.length > 0){
                    temp ={
                        "Request ID" : element["request_id"],
                        "Booking ID" : element["booking_id"],
                        "Request Name" : element["request_name"],
                        "Deskripsi" : element["deskripsi"],
                        "Status": element["Status"]
                    }
                }else if(element["request_name"] == "Reschedule" && data1.length > 0){
                    temp ={
                        "Request ID" : element["request_id"],
                        "Booking ID" : element["booking_id"],
                        "Request Name" : element["request_name"],
                        "New Check-in": element["request_start"],
                        "New Check-out": element["request_end"],
                        "Deskripsi" : element["Deskripsi"],
                        "Status": element["Status"]
                    }
                }
                array.push(temp);
                if(array.length==data.length){
                    res.status(200).send(array);
                }
            }
        }catch(err){
            res.status(403).send({
                "status":403,
                "message":"User Not Authorized"
            });
        }
    }
})
router.get('/getRequest',async(req,res)=>{
    var token = req.header("x-auth-token");
    var array = [];
    if(!token){
        res.status(401).send({
            "status":401,
            "message":"Token tidak ada"
        });
    }else{
        try{
            user = jwt.verify(token,"proyekSOA");
            if(user["tipe_user"] != 2){
                return res.status(404).send({
                    "status": 404,
                    "message": "User Not Authorized"
                })
            }
            var data = await rescheduleModel.getRequest();
            if(req.query.request_id){
                data = await rescheduleModel.getRequest(req.query.request_id);
            }
            if(data.length == 0){
                res.status(200).send({
                    "status":200,
                    "message":"Tidak Ada Request Terhadap Hotel"
                });
            }
            if(data.length > 0){
                data.forEach(element => {
                    var temp = "";
                    if(element["request_name"] == "Cancel"){
                        temp ={
                            "Request ID" : element["request_id"],
                            "Booking ID" : element["booking_id"],
                            "Request Name" : element["request_name"],
                            "Deskripsi" : element["deskripsi"]
                        }
                    }else{
                        temp ={
                            "Request ID" : element["request_id"],
                            "Booking ID" : element["booking_id"],
                            "Request Name" : element["request_name"],
                            "New Check-in": element["request_start"],
                            "New Check-out": element["request_end"],
                            "Deskripsi" : element["deskripsi"]
                        }
                    }
                    array.push(temp);
                    if(array.length==data.length){
                        res.status(200).send(array);
                    }
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
})
router.get('/getRequestWithVariable',async(req,res)=>{
    var token = req.header("x-auth-token");
    var array = [];
    if(!req.query.request_id){
        res.status(401).send({
            "status":400,
            "message":"Request ID tidak ada"
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
            if(user["tipe_user"] != 2){
                return res.status(404).send({
                    "status": 404,
                    "message": "User Not Authorized"
                })
            }
            var data = await rescheduleModel.getRequest();
            if(req.query.request_id){
                data = await rescheduleModel.getRequest(req.query.request_id);
            }
            if(data.length == 0){
                res.status(200).send({
                    "status":200,
                    "message":"Tidak Ada Request Terhadap Hotel"
                });
            }
            if(data.length > 0){
                data.forEach(element => {
                    var temp = "";
                    if(element["request_name"] == "Cancel"){
                        temp ={
                            "Request ID" : element["request_id"],
                            "Booking ID" : element["booking_id"],
                            "Request Name" : element["request_name"],
                            "Deskripsi" : element["deskripsi"]
                        }
                    }else{
                        temp ={
                            "Request ID" : element["request_id"],
                            "Booking ID" : element["booking_id"],
                            "Request Name" : element["request_name"],
                            "New Check-in": element["request_start"],
                            "New Check-out": element["request_end"],
                            "Deskripsi" : element["deskripsi"]
                        }
                    }
                    array.push(temp);
                    if(array.length==data.length){
                        res.status(200).send(array);
                    }
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
})
router.put('/confirmCancel',async(req,res)=>{
    var status = 3;
    var id = req.query.request_id;
    var deskripsi = "";
    if(req.body.deskripsi){
        deskripsi = req.body.deskripsi;
    }
    var token = req.header("x-auth-token");
    if(!token){
        res.status(401).send({
            "status":401,
            "message":"Token tidak ada"
        });
    }else{
        try{
            user = jwt.verify(token,"proyekSOA");
            if(user["tipe_user"] != 2){
                return res.status(404).send({
                    "status": 404,
                    "message": "User Not Authorized"
                })
            }
            var data = await rescheduleModel.updateRequest(id,status,deskripsi);
            if(status == 4){
                data = await rescheduleModel.updateStatus(id,4);
            }else if(status == 3){
                data = await rescheduleModel.updateStatus(id,8);
            }
            data = await rescheduleModel.getRequest(id);
            res.status(200).send({
                "status":200,
                "data":data
            })
        }catch(err){
            res.status(403).send({
                "status":403,
                "message":"User Not Authorized"
            });
        }
    }
})
router.put('/rejectCancel',async(req,res)=>{
    var status = 4;
    var id = req.query.request_id;
    var deskripsi = "";
    if(req.body.deskripsi){
        deskripsi = req.body.deskripsi;
    }
    var token = req.header("x-auth-token");
    if(!token){
        res.status(401).send({
            "status":401,
            "message":"Token tidak ada"
        });
    }else{
        try{
            user = jwt.verify(token,"proyekSOA");
            if(user["tipe_user"] != 2){
                return res.status(404).send({
                    "status": 404,
                    "message": "User Not Authorized"
                })
            }
            var data = await rescheduleModel.updateRequest(id,status,deskripsi);
            if(status == 4){
                data = await rescheduleModel.updateStatus(id,4);
            }else if(status == 3){
                data = await rescheduleModel.updateStatus(id,8);
            }
            data = await rescheduleModel.getRequest(id);
            res.status(200).send({
                "status":200,
                "data":data
            })
        }catch(err){
            res.status(403).send({
                "status":403,
                "message":"User Not Authorized"
            });
        }
    }
})
router.put('/cancelRequest',async(req,res)=>{
    var token = req.header("x-auth-token");
    var id = req.query.id_booking;
    if(!token){
        res.status(401).send({
            "status":401,
            "message":"Token tidak ada"
        });
    }else{
        try{
            user = jwt.verify(token,"proyekSOA");
            if(user["tipe_user"] != 1){
                return res.status(404).send({
                    "status": 404,
                    "message": "User Not Authorized"
                })
            }
            var data = await rescheduleModel.cocokkanEmail(id,user["email"]);
            if(data.length == 1){
                if(data[0].request_id == "0"){
                    res.status(400).send({
                        "status":400,
                        "message":"Anda Sedang Tidak Melakukan Request"
                    });
                }else{
                    var data1 = await rescheduleModel.updateStatusWithBookingID(id,4);
                    data1 = await rescheduleModel.updateRequest(data[0].request_id,7);
                    data1 = await rescheduleModel.searchBookings(id,user["email"]);
                    res.status(200).send({
                        "status":200,
                        "message":"Suksess Cancel Request",
                        "data":data1
                    });
                }
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
})
router.post('/rescheduleBooking',async(req,res)=>{
    var token = req.header("x-auth-token");
    var id = req.query.id_booking;
    var new_checkin = req.body.new_checkin;
    var new_checkout = req.body.new_checkout;
    if(!token){
        res.status(401).send({
            "status":401,
            "message":"Token tidak ada"
        });
    }else{
        try{
            user = jwt.verify(token,"proyekSOA");
            if(user["tipe_user"] != 1){
                return res.status(404).send({
                    "status": 404,
                    "message": "User Not Authorized"
                })
            }
            var data = await rescheduleModel.cocokkanEmail(id,user["email"]);
            if(data.length == 1){
                if(data[0].status_booking >= 4 && data[0].status_booking != 8 && data[0].request_id == "0"){
                    data = await rescheduleModel.counterRequest(id);
                    var belakang = "";
                    console.log(data.length);
                    if(data.length < 9){
                        belakang = "0"
                    }
                    var request_id = 'R'+id+belakang+(data.length + 1);
                    data = await rescheduleModel.doRequest(id,request_id,6);
                    console.log("asd");
                    data = await rescheduleModel.addRequest(id,'Reschedule',request_id,new_checkin,new_checkout);
                    data = await rescheduleModel.searchBookings(id,user["email"]);
                    res.status(200).send(data);
                }else if(data[0].status_booking == 8){
                    res.status(403).send({
                        "status":403,
                        "message":"Booking Anda Sudah Tercancel"
                    });
                }else if(data[0].request_id != "0"){
                    res.status(400).send({
                        "status":400,
                        "message":"Selesaikan Request Sebelumnya Terlebih Dahulu"
                    });
                }
                else{
                    res.status(403).send({
                        "status":403,
                        "message":"Selesaikan Booking Terlebih Dahulu"
                    });
                }
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
})
router.put('/confirmReschedule',async(req,res)=>{
    var status = 5;
    var id = req.query.request_id;
    var deskripsi = "";
    if(req.body.deskripsi){
        deskripsi = req.body.deskripsi;
    }
    var token = req.header("x-auth-token");
    if(!token){
        res.status(401).send({
            "status":401,
            "message":"Token tidak ada"
        });
    }else{
        try{
            user = jwt.verify(token,"proyekSOA");
            if(user["tipe_user"] != 2){
                return res.status(404).send({
                    "status": 404,
                    "message": "User Not Authorized"
                })
            }
            var data = await rescheduleModel.updateRequest(id,status,deskripsi);
            var data1 = await rescheduleModel.getRequest(id);
            res.status(200).send({
                "status":200,
                "data":data1
            })
        }catch(err){
            res.status(403).send({
                "status":403,
                "message":"User Not Authorized"
            });
        }
    }
})
router.put('/rejectReschedule',async(req,res)=>{
    var status = 2;
    var id = req.query.request_id;
    var deskripsi = "";
    if(req.body.deskripsi){
        deskripsi = req.body.deskripsi;
    }
    var token = req.header("x-auth-token");
    if(!token){
        res.status(401).send({
            "status":401,
            "message":"Token tidak ada"
        });
    }else{
        try{
            user = jwt.verify(token,"proyekSOA");
            if(user["tipe_user"] != 2){
                return res.status(404).send({
                    "status": 404,
                    "message": "User Not Authorized"
                })
            }
            var data = await rescheduleModel.updateRequest(id,status,deskripsi);
            data = await rescheduleModel.updateStatus(id,4);
            var data1 = await rescheduleModel.getRequest(id);
            res.status(200).send({
                "status":200,
                "data":data1
            })
        }catch(err){
            res.status(403).send({
                "status":403,
                "message":"User Not Authorized"
            });
        }
    }
})
router.get("/getBiaya",async(req,res)=>{
    var request_id = req.query.request_id;
    var token = req.header("x-auth-token");
    if(!token){
        res.status(401).send({
            "status":401,
            "message":"Token tidak ada"
        });
    }else{
        try{
            user = jwt.verify(token,"proyekSOA");
            if(user["tipe_user"] != 2){
                return res.status(404).send({
                    "status": 404,
                    "message": "User Not Authorized"
                })
            }
            var data = await rescheduleModel.getRequest(request_id);
            res.status(200).send("Total Biaya: "+data[0].totalBayar);
        }catch(err){
            res.status(403).send({
                "status":403,
                "message":"User Not Authorized"
            });
        }
    }
})
router.post("/settlementPaymentCanceled",async(req,res)=>{
    var booking_id = req.body.booking_id;
    if(booking_id){
        var detailBooking = await rescheduleModel.cariBooking(booking_id);
        var total = detailBooking[0].total_harga * 0.9;
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
                if(user["tipe_user"]==2){
                    var resp = await invoice.createInvoice({
                        externalID: externalID,
                        amount: total,
                        payerEmail: user["email"],
                        description: "Payment Booking : "+booking_id,
                        success_redirect_url: "https://proyek-soa-217116653.herokuapp.com/api/request/payment/successCancel/"+booking_id,
                        failure_redirect_url: "https://proyek-soa-217116653.herokuapp.com/api/request/payment/errorCancel/"+booking_id,
                        successRedirectURL: "https://proyek-soa-217116653.herokuapp.com/api/request/payment/successCancel/"+booking_id,
                        failureRedirectURL: "https://proyek-soa-217116653.herokuapp.com/api/request/payment/errorCancel/"+booking_id
                    });
                    var date = dateFormat(new Date(),"yyyy-mm-dd HH:MM:ss");
                    await rescheduleModel.addPayment(resp["id"],externalID,total,user["email"],booking_id,date);
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
            "message":"input booking_id tidak ada"
        });
    }
});
router.get("/payment/successCancel/:booking_id",async (req,res)=>{
    var booking_id = req.params.booking_id;
    await rescheduleModel.updateStatusWithBookingID(booking_id,9);
    res.status(200).send({
        "status":"200",
        "message":"pembayaran berhasil"
    })
});
router.get("/payment/errorCancel/:booking_id",async(req,res)=>{
    var booking_id = req.params.booking_id;
    console.log("masuk");
    res.status(400).send({
        "status":"400",
        "message":"pembayaran tidak berhasil"
    })
});
router.post("/settlementPayment",async(req,res)=>{
    var request_id = req.body.request_id;
    if(request_id){
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
                if(user["tipe_user"]==1){
                    var detail = await rescheduleModel.getRequest(request_id);
                    var detailBooking = await rescheduleModel.cariBooking(detail[0].booking_id);
                    var totalHariRequest = Math.abs((detail[0].request_start - detail[0].request_end)/(1000*60*60*24));
                    var data = await rescheduleModel.getTotalHotel(detail[0].booking_id);
                    var total = 0;
                    data.forEach(element => {
                        total = total + parseInt(element["subtotal"]);
                    });
                    var biayaTambahan = total;
                    console.log(total + "-" + totalHariRequest);
                    total = ((total * totalHariRequest)*105/100) * 15000;
                    var totalHarga = total;
                    console.log(total + "-" + detailBooking[0].total_harga);
                    total = total - (detailBooking[0].total_harga);
                    if(total <= 0){
                        await rescheduleModel.changeRequestStatus(request_id,1);
                        var data1 = await rescheduleModel.getRequest(request_id);
                        var checkin = dateFormat(new Date(data1[0].request_start),"yyyy-mm-dd HH:MM:ss");
                        var checkout = dateFormat(new Date(data1[0].request_end),"yyyy-mm-dd HH:MM:ss")
                        await rescheduleModel.updateStatus(request_id,4,checkin,checkout);
                        await rescheduleModel.updateTotal(totalHarga,detail[0].booking_id);
                        return res.status(200).send({
                            "status":"200",
                            "message":"Reschedule Berhasil"
                        })
                    }
                    var resp = await invoice.createInvoice({
                        externalID: externalID,
                        amount: total,
                        payerEmail: user["email"],
                        description: "Payment Booking : "+request_id,
                        success_redirect_url: "https://proyek-soa-217116653.herokuapp.com/api/request/payment/success/"+request_id+"/"+totalHarga+"/"+detail[0].booking_id,
                        failure_redirect_url: "https://proyek-soa-217116653.herokuapp.com/api/request/payment/error/"+request_id,
                        successRedirectURL: "https://proyek-soa-217116653.herokuapp.com/api/request/payment/success/"+request_id+"/"+totalHarga+"/"+detail[0].booking_id,
                        failureRedirectURL: "https://proyek-soa-217116653.herokuapp.com/api/request/payment/error/"+request_id
                    });
                    var date = dateFormat(new Date(),"yyyy-mm-dd HH:MM:ss");
                    await rescheduleModel.addPayment(resp["id"],externalID,total,user["email"],request_id,date);
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
            "message":"input request_id tidak ada"
        });
    }
});
/*router.get("/payment/check",async(req,res)=>{
    // var id = req.body.payment_id;
    var request_id= req.body.request_id;
    var hasil = await rescheduleModel.changePaymentStatus(booking_id);
    if(hasil.length==0) {
        res.status(404).send({
            "status":404,
            "message":"pembayaran tidak berhasil atau tidak ada"
        })
    }else{
        await rescheduleModel.changeBookingStatus(booking_id);
        res.status(200).send({
            "status":200,
            "message":"pembayaran berhasil"
        })
    }
})*/
router.get("/payment/success/:request_id/:totalHarga/:booking_id",async (req,res)=>{
    var request_id = req.params.request_id;
    var totalHarga = req.params.totalHarga;
    var booking_id = req.params.booking_id;
    await rescheduleModel.updateTotal(totalHarga,booking_id);
    await rescheduleModel.changeRequestStatus(request_id,1);
    var data1 = await rescheduleModel.getRequest(request_id);
    var checkin = dateFormat(new Date(data1[0].request_start),"yyyy-mm-dd HH:MM:ss");
    var checkout = dateFormat(new Date(data1[0].request_end),"yyyy-mm-dd HH:MM:ss")
    await rescheduleModel.updateStatus(request_id,4,checkin,checkout);
    console.log("masuk");
    res.status(200).send({
        "status":"200",
        "message":"pembayaran berhasil"
    })
});
router.get("/payment/error/:request_id",async(req,res)=>{
    var request_id = req.params.request_id;
    await rescheduleModel.changeRequestStatus(request_id,7);
    await rescheduleModel.updateStatus(request_id,4);
    console.log("masuk");
    res.status(200).send({
        "status":"200",
        "message":"pembayaran tidak berhasil"
    })
});
module.exports = router