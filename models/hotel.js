
const dbase = require('../dbasehelper');

const addUser = async (email,no_hp,nama,password,foto_ktp,tipe_user)=> {
    const connection = await dbase.getConnection();
    const query = `insert into user values ('${email}','${no_hp}','${nama}','${password}','${foto_ktp}','${tipe_user}')`;
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

module.exports = {
    'insert': addUser,
    'getUser': getUser
}