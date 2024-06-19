const mongodb = require('mongodb');
require('dotenv').config();

const uri = process.env.URI;

const client = new mongodb.MongoClient(uri);

const db = client.db('document_editor_database');

module.exports = { client, db };