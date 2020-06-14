const dbase = require('../dbasehelper');


async function cocokkanEmail(booking_id,customer_email){
    var sql =`SELECT * FROM hbooking WHERE customer_email ='${customer_email}' and booking_id = '${booking_id}'`;
    var data = await dbase.query(sql);
    return data;
}
async function cariBooking(booking_id){
    var sql =`SELECT * FROM hbooking WHERE booking_id = '${booking_id}'`;
    var data = await dbase.query(sql);
    return data;
}
async function searchBookings(booking_id,customer_email,tipe_user){
    var sql =`SELECT booking_id,nama_hotel,lokasi,(CASE WHEN status_booking=1 THEN 'Pembayaran belum selesai' WHEN status_booking=2 THEN 'Booking sedang diproses' WHEN status_booking=3 THEN 'Booking telah dipesan pada hotel' WHEN status_booking=4 THEN 'Booking berhasil' WHEN status_booking=6 THEN 'Request Reschedule' WHEN status_booking=7 THEN 'Request Cancel'  WHEN status_booking=8 THEN 'Canceled' WHEN status_booking=9 THEN 'Dana Berhasil Di Refund' ELSE 'Booking Gagal' END) as \"Status\", request_id FROM hbooking WHERE customer_email ='${customer_email}'`;
    if(booking_id!=""&&booking_id){
        sql = sql+ ` and booking_id='${booking_id}'`; 
    }
    var data = await dbase.query(sql);
    return data;
}
async function cariBookingRefund(){
    var sql =`SELECT booking_id,nama_hotel,lokasi,total_harga,(CASE WHEN status_booking=1 THEN 'Pembayaran belum selesai' WHEN status_booking=2 THEN 'Booking sedang diproses' WHEN status_booking=3 THEN 'Booking telah dipesan pada hotel' WHEN status_booking=4 THEN 'Booking berhasil' WHEN status_booking=6 THEN 'Request Reschedule' WHEN status_booking=7 THEN 'Request Cancel'  WHEN status_booking=8 THEN 'Canceled' WHEN status_booking=9 THEN 'Dana Berhasil Di Refund' ELSE 'Booking Gagal' END) as \"Status\", request_id FROM hbooking WHERE status_booking = '8'`;
    var data = await dbase.query(sql);
    return data;
}
async function doRequest(booking_id,request_id,status){
    var sql =`Update hbooking set status_booking = '${status}'`;
    if(request_id!=""&&request_id){
        sql = sql + `,request_id = '${request_id}'`
    }
    sql = sql + ` where booking_id = '${booking_id}'`
    var data = await dbase.query(sql);
    return data;
}
async function addRequest(booking_id,request_name,request_id,new_checkin,new_checkout){
    var sql =`Insert into request values('${request_id}',${booking_id},'${request_name}','','','',0)`;
    if(request_name=="Cancel"){
        sql =`Insert into request values('${request_id}',${booking_id},'${request_name}','','','',0)`;
    }
    if(request_name=="Reschedule"){
        sql =`Insert into request values('${request_id}',${booking_id},'${request_name}','${new_checkin}','${new_checkout}','',0)`;
    }
    console.log(sql);
    var data = await dbase.query(sql);
    return data;
}
async function counterRequest(booking_id){
    var sql =`select * from request where booking_id = '${booking_id}'`;
    var data = await dbase.query(sql);
    return data;
}
async function getRequest(request_id){
    var sql = "";
    if(request_id!=""&&request_id){
        sql = `select request_id, booking_id, request_name, deskripsi, request_start, request_end,(CASE WHEN status=0 THEN 'Menunggu Konfirmasi Dari Pihak Hotel' WHEN status=1 THEN 'Reschedule Sukses' WHEN status=2 THEN 'Reschedule Ditolak' WHEN status=3 THEN 'Cancel Sukses' WHEN status=5 THEN 'Menunggu Pembayaran' WHEN status=6 THEN 'Pembayaran Gagal' WHEN status=7 THEN 'Request Canceled' ELSE 'Cancel Ditolak' END) as \"Status\"  from request where request_id = '${request_id}'`;
    }else{
        sql = `select request_id, booking_id, request_name, deskripsi, request_start, request_end,(CASE WHEN status=0 THEN 'Menunggu Konfirmasi Dari Pihak Hotel' WHEN status=1 THEN 'Reschedule Sukses' WHEN status=2 THEN 'Reschedule Ditolak' WHEN status=3 THEN 'Cancel Sukses' WHEN status=5 THEN 'Menunggu Pembayaran' WHEN status=6 THEN 'Pembayaran Gagal' WHEN status=7 THEN 'Request Canceled' ELSE 'Cancel Ditolak' END) as \"Status\"  from request where status = 0`;
    }
    var data = await dbase.query(sql);
    return data;
}
async function getRequestByEmail(email){
    var sql = `select request_id, booking_id, request_name, deskripsi, request_start, request_end,(CASE WHEN status=0 THEN 'Menunggu Konfirmasi Dari Pihak Hotel' WHEN status=1 THEN 'Reschedule Sukses' WHEN status=2 THEN 'Reschedule Ditolak' WHEN status=3 THEN 'Cancel Sukses' ELSE 'Cancel Ditolak' END) as \"Status\"  from request`
    var data = await dbase.query(sql);
    return data;
}
async function updateRequest(request_id,status,deskripsi){
    var sql =`Update request set status = '${status}', deskripsi = '${deskripsi}' where request_id = '${request_id}'`;
    var data = await dbase.query(sql);
    return data;
}
async function updateStatusWithBookingID(booking_id,status){
    var sql =`Update hbooking set status_booking = '${status}', request_id='0' where booking_id = '${booking_id}'`;
    var data = await dbase.query(sql);
    return data;
}
async function updateStatus(request_id,status,new_checkin,new_checkout){
    var sql =`Update hbooking set status_booking = '${status}', request_id='0'`;
    if(new_checkin!=""&&new_checkin){
        sql = sql + `, check_in = '${new_checkin}' `
    }
    if(new_checkout!=""&&new_checkout){
        sql = sql + `, check_out = '${new_checkout}' `
    }
    sql = sql + ` where request_id = '${request_id}'`;
    var data = await dbase.query(sql);
    return data;
}
async function getTotalHotel(booking_id){
    var sql = `select subtotal from dbooking where booking_id='${booking_id}'`;
    var data = await dbase.query(sql);
    return data;
}
async function addPayment(xendit_id,payment_id,total_harga,user_email,request_id,date){
    var sql =`INSERT INTO payment VALUES('${payment_id}','','${request_id}','${xendit_id}','${user_email}','${total_harga}','${date}')`;
    console.log(sql);
    await dbase.query(sql);
}
async function changeRequestStatus(request_id,status){
    var sql = `update request set status = ${status} where request_id = '${request_id}'`;
    await dbase.query(sql);
}
async function editBiaya(total,request_id){
    var sql = `update request set totalBayar = ${total} where request_id = '${request_id}'`;
    await dbase.query(sql);
}
async function updateTotal(total,id_booking){
    var sql =`UPDATE hbooking SET total_harga = ${total} WHERE booking_id='${id_booking}'`;
    await dbase.query(sql);
}
module.exports = {
    "cocokkanEmail":cocokkanEmail,
    "doRequest":doRequest,
    "searchBookings":searchBookings,
    "addRequest":addRequest,
    "counterRequest":counterRequest,
    "getRequest":getRequest,
    "updateRequest":updateRequest,
    "updateStatus":updateStatus,
    "getRequestByEmail":getRequestByEmail,
    "getTotalHotel":getTotalHotel,
    "addPayment":addPayment,
    "changeRequestStatus":changeRequestStatus,
    "updateStatusWithBookingID":updateStatusWithBookingID,
    "cariBooking":cariBooking,
    "editBiaya":editBiaya,
    "cariBookingRefund":cariBookingRefund,
    "updateTotal":updateTotal
}