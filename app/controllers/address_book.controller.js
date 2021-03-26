const db = require("../models");
const addressBook = db.addressBook;
const Op = db.Sequelize.Op;
const { validationResult } = require("express-validator");
const fs = require("fs");
const csv = require("fast-csv");

// Create and Save a new Address
exports.create = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(201).json({ errors: errors.array() });
  }

  const tutorial = req.body;

  addressBook
    .findOne({
      where: {
        phoneno: JSON.stringify(req.body.phoneno),
      },
    })
    .then((data) => {
      if (data) {
        return res
          .status(201)
          .json({ errors: [{ msg: "phone already exist" }] });
        // res.status(201).send("phone already exist");
      } else {
        // Save Tutorial in the database
        addressBook
          .create(tutorial)
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while creating the Address.",
            });
          });
      }
    });
};

//  Upload Address to the database.
exports.uploadAddresses = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload a CSV file!");
    }

    let address = [];
    let path = __basedir + "/uploads/" + req.file.filename;

    var stream = fs
      .createReadStream(path)
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => {
        throw error.message;
      })
      .on("data", (row) => {
        console.log(row.name);
        if (row.name == "" || row.phoneno == "") {
          stream.destroy();
          return res.status(201).send("Please fill mandatory fields!");
        }
        address.push(row);
      })
      .on("end", () => {
        addressBook
          .bulkCreate(address)
          .then(() => {
            res.status(200).send({
              message:
                "Uploaded the file successfully: " + req.file.originalname,
            });
            fs.unlink(path, (err) => {
              if (err) console.log(err);
            });
          })
          .catch((error) => {
            res.status(500).send({
              message: "Fail to import data into database!",
              error: error.message,
            });
          });
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};

// Retrieve all Address from the database.
exports.findAll = (req, res) => {
  addressBook
    .findAll({
      where: {
        status: 1,
      },
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Address.",
      });
    });
};

// Find a single Address with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  addressBook
    .findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Address with id=" + id,
      });
    });
};

// Update a Address by the id in the request
exports.update = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(201).json({ errors: errors.array() });
  }
  const id = req.params.id;

  addressBook
    .update(req.body, {
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Address was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Address. Maybe Address was not found or request is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Address",
      });
    });
};

// Filter
exports.filterAddressBook = (req, res) => {
  // res.send(req.body);
  const address = req.body;
  let operator;
  switch (address.operator) {
    case "or":
      operator = Op.or;
      break;
    case "and":
      operator = Op.and;
      break;
    // case "xor":
    //   operator = Op.xor;
    //   break;
  }
  let whereCond = [];
  address.conditions.forEach((element, index) => {
    let cond;
    switch (element.cond) {
      case "eq":
        cond = "$eq";
        break;
      case "ne":
        cond = "$ne";
        break;
      case "lt":
        cond = "$lt";
        break;
      case "gt":
        cond = "$gt";
        break;
      case "like":
        cond = "$like";
        break;
      case "notLike":
        cond = "$notLike";
        break;
    }
    whereCond[index] = {};
    whereCond[index][element.field] = {};
    if (cond == "$like" || cond == "$notLike") {
      whereCond[index][element.field][cond] = "%" + element.value + "%";
    } else {
      whereCond[index][element.field][cond] = element.value;
    }
  });
  
  addressBook
    .findAll({
      where: {
        id: address.ids,
        [operator]: whereCond
      },
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Address.",
      });
    });
};
