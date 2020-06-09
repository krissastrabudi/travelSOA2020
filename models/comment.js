
const dbase = require('../dbasehelper');

const addComment = async (id,email,judul,isi,star,tglpost,nama_hotel,lokasi)=> {
    const connection = await dbase.getConnection();
    const query = `insert into comment values (${id},'${email}','${nama_hotel}','${lokasi}','${judul}','${isi}','${star}','${tglpost}','')`;
    const result = await dbase.executeQuery(query,connection);
    connection.destroy();
    return "Berhasil Memberi Review";
}
const addCommentTes = async ()=> {
    const connection = await dbase.getConnection();
    const query = `insert into comment values ('1','sastrabudi@gmail.com','xxx','xxx','xxx','xxx',5,'1000-01-01','')`;
    const result = await dbase.executeQuery(query,connection);
    connection.destroy();
    return "Berhasil Memberi Review";
}

const getCommentById = async(id) => {
    const connection = await dbase.getConnection();
    const query = `select * from comment where id_comment = '${id}'`;
    const result = await dbase.executeQuery(query,connection);
    connection.destroy();
    return result;
}

const getCommentByUser = async(user) => {
    const connection = await dbase.getConnection();
    const query = `select * from comment where email_comment = '${user}'`;
    const result = await dbase.executeQuery(query,connection);
    connection.destroy();
    return result;
}

const getCommentByStars = async(star,nama,lokasi) => {
    const connection = await dbase.getConnection();
    const query = `select * from comment where stars = '${star}' and nama_hotel = '${nama}'
        and lokasi = '${lokasi}' `;
    const result = await dbase.executeQuery(query,connection);
    connection.destroy();
    return result;
}

const getCommentByidAndEmail = async(id,email) => {
    const connection = await dbase.getConnection();
    const query = `select * from comment where id_comment = '${id}' and email_comment='${email}'`;
    const result = await dbase.executeQuery(query,connection);
    connection.destroy();
    return result;
}

const getAllComment = async()=>{
    const connection = await dbase.getConnection();
    const query = `select * from comment`;
    const result = await dbase.executeQuery(query,connection);
    connection.destroy();
    return result;
}

const updateComment = async(id,judul,isi,tgl,star)=>{
    const connection = await dbase.getConnection();
    const query = `update comment set judul_comment = '${judul}', 
        isi_comment = '${isi}', date_edited = '${tgl}', stars = '${star}'
        where id_comment = '${id}'`;
    const result = await dbase.executeQuery(query,connection);
    connection.destroy();;
    return "Berhasil Melakukan Update pada Review";
}

const deleteComment = async(id) =>{
    const connection = await dbase.getConnection();
    const query = `delete from comment where id_comment = '${id}'`;
    const result = await dbase.executeQuery(query,connection);
    connection.destroy();
    return "Berhasil Menghapus Review";
}

module.exports = {
    'addComment': addComment,
    'updateComment': updateComment,
    'getCommentById' : getCommentById,
    'getCommentByUser' : getCommentByUser,
    'getCommentByStars' : getCommentByStars,
    'getAllComment' : getAllComment,
    'deleteComment': deleteComment,
    'getCommentToDelete' : getCommentByidAndEmail,
    'addCommentTes' : addCommentTes
}