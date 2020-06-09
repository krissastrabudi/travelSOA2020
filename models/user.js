
const dbase = require('../dbasehelper');

const addUser = async (email,no_hp,nama,password,foto_ktp,tipe_user)=> {
    const connection = await dbase.getConnection();
    const query = `insert into user values ('${email}','${no_hp}','${nama}','${password}','${foto_ktp}','${tipe_user}','1')`;
    const result = await dbase.executeQuery(query,connection);
    connection.destroy();
    return "Berhasil Register User!";
}

const getUser = async(email,password) => {
    const connection = await dbase.getConnection();
    const query = `select * from user where email = '${email}' and password = '${password}'`;
    const result = await dbase.executeQuery(query,connection);
    connection.destroy();
    return result;
}

const getUserOnly = async(email) => {
    const connection = await dbase.getConnection();
    const query = `select * from user where email = '${email}' and tipe_user=1`;
    const result = await dbase.executeQuery(query,connection);
    connection.destroy();
    return result;
}

const deleteUser = async(email) =>{
    const connection = await dbase.getConnection();
    const query = `update user set status_user = '0' where email = '${email}'`;
    const result = await dbase.executeQuery(query,connection);
    connection.destroy();
    return "Berhasil Nonaktifkan User!";
}

const updateUser = async(email,nohp,nama,password)=>{
    const connection = await dbase.getConnection();
    const query = `update user set nohp = '${nohp}', password = '${password}', nama = '${nama}' where email = '${email}'`;
    const result = await dbase.executeQuery(query,connection);
    connection.destroy();
    return "Update Data User Berhasil!";
}

module.exports = {
    'insert': addUser,
    'update': updateUser,
    'getUser': getUser,
    'getUserOnly': getUserOnly,
    'deleteUser': deleteUser
}