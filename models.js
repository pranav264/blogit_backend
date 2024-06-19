const { db } = require('./db');

const Users = db.collection("Users");
const Documents = db.collection("Documents");

module.exports = { Users, Documents };