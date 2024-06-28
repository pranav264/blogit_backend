const router = require("express").Router();
const { client, db } = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Users, Documents } = require("../models");
const { ObjectId } = require("mongodb");
require("dotenv").config();

router.post("/createDocument", async (req, res) => {
  try {
    const username = req.body.username;
    const sanity_document_id = req.body.sanity_document_id;
    const name = req.body.name;
    const jwt_secret_key = process.env.JWT_SECRET;
    const token = req.headers.authorization;

    const decoded = jwt.verify(token, jwt_secret_key);
    if (decoded.username === username) {
      await client.connect();

      const user = await Users.findOne({ username: username });
      await Documents.insertOne({
        createdBy: user._id.toString(),
        sanity_document_id: sanity_document_id,
        name: name,
      });

      res.status(res.statusCode).json("Blog was posted successfully");
    }
  } catch (err) {
    res.status(res.statusCode).json("Please Try Again");
  } finally {
    await client.close();
  }
});

router.get("/getDocuments/:username", async (req, res) => {
  const username = req.params.username;
  const token = req.headers.authorization;
  const jwt_secret_key = process.env.JWT_SECRET;

  const decoded = jwt.verify(token, jwt_secret_key);
  if (decoded.username === username) {
    await client.connect();

    const user = await Users.findOne({ username: username });
    const documents = Documents.find({ createdBy: user._id.toString() });
    let documents_arr = [];
    for await (const document of documents) {
      documents_arr.push(document);
    }

    await client.close();

    res.status(res.statusCode).json(documents_arr);
  }
});

router.get("/getDocument/:document_id", async (req, res) => {
  const document_id = req.params.document_id;

  await client.connect();

  const document = await Documents.findOne({ _id: new ObjectId(document_id) });
  const createdBy = document.createdBy;
  const user = await Users.findOne({ _id: new ObjectId(createdBy) });
  document["author"] = user.username;

  await client.close();

  res.status(res.statusCode).json(document);
});

router.post("/editDocument", async (req, res) => {
  try {
    const username = req.body.username;
    const name = req.body.name;
    const document_id = req.body.document_id;
    const jwt_secret_key = process.env.JWT_SECRET;
    const token = req.headers.authorization;

    const decoded = jwt.verify(token, jwt_secret_key);
    if (decoded.username === username) {
      await client.connect();

      const user = await Users.findOne({ username: username });
      await Documents.updateOne({ createdBy: user._id.toString(),
        _id: new ObjectId(document_id)
       }, {
        $set: {
          name: name
        }
       })

      res.status(res.statusCode).json("Blog was updated successfully");
    }
  } catch (err) {
    res.status(res.statusCode).json("Please Try Again");
  } finally {
    await client.close();
  }
});

router.delete("/deleteDocument/:username/:document_id", async (req, res) => {
  try {
    const username = req.params.username;
    const document_id = req.params.document_id;
    const jwt_secret_key = process.env.JWT_SECRET;
    const token = req.headers.authorization;

    const decoded = jwt.verify(token, jwt_secret_key);
    if (decoded.username === username) {
      await client.connect();
      await Documents.deleteOne({ _id: new ObjectId(document_id) });

      res.status(res.statusCode).json("Document deleted successfully");
    }
  } catch (err) {
    res.status(res.statusCode).json("Please Try Again");
  } finally {
    await client.close();
  }
})

module.exports = router;
