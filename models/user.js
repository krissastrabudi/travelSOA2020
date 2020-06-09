
const dbase = require('../dbasehelper');

const addUser = async (email,no_hp,nama,password,foto_ktp,tipe_user)=> {
    dbase.start();
    const connection = await dbase.getConnection();
    const query = `insert into user values ('${email}','${no_hp}','${nama}','${password}','${foto_ktp}','${tipe_user}','1')`;
    const result = await dbase.executeQuery(query,connection);
    //connection.release();
    dbase.end();
    return "Berhasil Register User!";
}

const getUser = async(email,password) => {
    dbase.start();
    const connection = await dbase.getConnection();
    const query = `select * from user where email = '${email}' and password = '${password}'`;
    const result = await dbase.executeQuery(query,connection);
    //connection.release();
    dbase.end();
    return result;
}

const getUserOnly = async(email) => {
    dbase.start();
    const connection = await dbase.getConnection();
    const query = `select * from user where email = '${email}' and tipe_user=1`;
    const result = await dbase.executeQuery(query,connection);
    //connection.release();
    dbase.end();
    return result;
}

const deleteUser = async(email) =>{
    dbase.start();
    const connection = await dbase.getConnection();
    const query = `update user set status_user = '0' where email = '${email}'`;
    const result = await dbase.executeQuery(query,connection);
    //connection.release();
    dbase.end();
    return "Berhasil Nonaktifkan User!";
}

const updateUser = async(email,nohp,nama,password)=>{
    dbase.start();
    const connection = await dbase.getConnection();
    const query = `update user set nohp = '${nohp}', password = '${password}', nama = '${nama}' where email = '${email}'`;
    const result = await dbase.executeQuery(query,connection);
    //connection.release();
    dbase.end();
    return "Berhasil Update Data User!";
}

module.exports = {
    'insert': addUser,
    'update': updateUser,
    'getUser': getUser,
    'getUserOnly': getUserOnly,
    'deleteUser': deleteUser
}