const dbase = require('../dbasehelper');

async function addBooking(nama_hotel,lokasi,customer_email,data,total,check_in,check_out){
    var booking_id = await insertHBooking(nama_hotel,lokasi,customer_email,total,check_in,check_out);
    var ctr2 = 0;
    data.forEach(async element => {
        await insertDBooking(booking_id[0]["booking_id"],element["jenis_kamar"],element["harga"],element["quantity"]);
        ctr2+=1;
        if(data.length==ctr2){
            return booking_id[0]["booking_id"];
        }
    });
}

async function insertDBooking(booking_id,jenis_kamar,harga,quantity){
    var subtotal = parseInt(harga)*parseInt(quantity);
    const sql = `INSERT INTO dbooking VALUES('${booking_id}','${jenis_kamar}','${harga}','${quantity}','${subtotal}')`;
    await dbase.query(sql);
}

async function insertHBooking(nama_hotel,lokasi,customer_email,total,check_in,check_out){
    var sql =`INSERT INTO hbooking (nama_hotel,lokasi,total_harga,customer_email,status_booking,check_in,check_out) values ('${nama_hotel}','${lokasi}',${total},'${customer_email}',1,'${check_in}','${check_out}')`;
    await dbase.query(sql);
    sql = "SELECT IFNULL(MAX(booking_id),1) as \"booking_id\" from hbooking";
    var booking_id = await dbase.query(sql);
    return booking_id;
}

async function searchBookingStatus(booking_id,customer_email,tipe_user){
    var sql =`SELECT booking_id,nama_hotel,lokasi,(CASE WHEN status_booking=1 THEN 'Pembayaran belum selesai' WHEN status_booking=2 THEN 'Booking sedang diproses' WHEN status_booking=3 THEN 'Booking telah dipesan pada hotel' WHEN status_booking=4 THEN 'Booking berhasil' ELSE 'Booking Gagal' END) as \"Status\" FROM hbooking WHERE customer_email ='${customer_email}'`;
    if(booking_id!=""&&booking_id){
        sql = sql+ ` and booking_id='${booking_id}'`; 
    }
    var data = await dbase.query(sql);
    return data;
}

async function searchBooking(booking_id){
    var sql =`SELECT * FROM hbooking where booking_id='${booking_id}'`;
    var data = await dbase.query(sql);
    return data;
}

async function changeBookingStatus(booking_id,status){
    if(status){
        var sql =`UPDATE hbooking SET status_booking='${status}' WHERE booking_id='${booking_id}'`;
        status=status;
    }
    else {
        var sql = `SELECT status_booking+1 as \"status_booking\" from hbooking where booking_id='${booking_id}'`;
        status = await dbase.query(sql);
        status = parseInt(status[0]["status_booking"]);
        sql =`UPDATE hbooking SET status_booking=${status} WHERE booking_id='${booking_id}'`;
    }
    await dbase.query(sql);
    var kembali="";
    if(status==1) kembali="Pembayaran belum selesai";
    else if(status==2) kembali="Booking sedang diproses";
    else if(status==3) kembali="Booking telah dipesan pada hotel";
    else if(status==4) kembali="Booking berhasil";
    else kembali="Booking gagal";
    return kembali;
}
async function confirmBooking(id_booking){
    var sql =`UPDATE hbooking SET status_booking=4 WHERE booking_id='${id_booking}'`;
    await dbase.query(sql);
}
async function rejectBooking(id_booking){
    var sql =`UPDATE hbooking SET status_booking=5 WHERE booking_id='${id_booking}'`;
    await dbase.query(sql);
}

async function addPayment(xendit_id,payment_id,total_harga,user_email,id_booking){
    var sql =`INSERT INTO payment(xendit_id,payment_id,booking_id,payment_by,amount) VALUES('${xendit_id}','${payment_id}','${id_booking}','${user_email}','${total_harga}')`;
    var hasil = await dbase.query(sql);
    return hasil;
}

async function changePaymentStatus(id_booking){
    var sql = `SELECT * FROM payment WHERE booking_id='${id_booking}'`;
    return await dbase.query(sql);
}

module.exports = {
    'addBooking': addBooking,
    "insertHBooking":insertHBooking,
    "insertDBooking":insertDBooking,
    "searchBookingStatus":searchBookingStatus,
    "changeBookingStatus":changeBookingStatus,
    "confirmBooking":confirmBooking,
    "rejectBooking":rejectBooking,
    "searchBooking":searchBooking,
    "addPayment":addPayment,
    "changePaymentStatus":changePaymentStatus
}