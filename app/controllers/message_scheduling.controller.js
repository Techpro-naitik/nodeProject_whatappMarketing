const db = require("../models");
const messageScheduling = db.messageScheduling;
const messageQueue = db.messageQueue;
const addressBook = db.addressBook;
const Op = db.Sequelize.Op;
const { validationResult } = require("express-validator");

// Create and Save a new Address
exports.create = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(201).json({ errors: errors.array() });
  }
  const contacts = req.body.contacts;
  delete req.body.contacts;
  const schedule = req.body;

  // Save Schedule in the database
  messageScheduling
    .create(schedule)
    .then((data) => {
      contacts.forEach((element, index) => {
        contacts[index]["schedule_id"] = data.id;
      });
      messageQueue
        .bulkCreate(contacts)
        .then((resp) => {
          data.dataValues.message_queue = resp;
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while creating the Message Schedule.",
          });
        });
      //   res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Address.",
      });
    });
};

// Retrieve all Schedules from the database.
exports.findAll = (req, res) => {
  messageScheduling
    .findAll({
      order: [["id", "ASC"]],
      include: [
        {
          model: messageQueue,
          required: false,
        },
      ],
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Schedule.",
      });
    });
};

// Find a single Schedule with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  messageScheduling
    .findByPk(id, {
      include: [
        {
          model: messageQueue,
          required: false,
        },
      ],
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Schedule with id=" + id,
      });
    });
};

// Update a schedule by the id in the request
exports.update = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(201).json({ errors: errors.array() });
  }
  const id = req.params.id;
  const contacts = req.body.contacts;
  delete req.body.contacts;
  const schedule = req.body;

  messageScheduling
    .update(schedule, {
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        messageQueue
          .destroy({
            where: { schedule_id: id },
          })
          .then((numDestroy) => {
            if (numDestroy >= 1) {
              contacts.forEach((element, index) => {
                contacts[index]["schedule_id"] = id;
              });
              messageQueue
                .bulkCreate(contacts)
                .then((resp) => {
                  res.send({
                    message: "Schedule was updated successfully.",
                  });
                })
                .catch((err) => {
                  res.status(500).send({
                    message:
                      err.message ||
                      "Some error occurred while creating the Message Schedule.",
                  });
                });
            }
          })
          .catch((err) => {
            res.status(500).send({
              message: "Could not delete Queue" + err,
            });
          });
      } else {
        res.send({
          message: `Cannot update Schedule. Maybe Schedule was not found or request is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Schedule",
      });
    });
};

// Delete Schedule
exports.delete = (req, res) => {
  const id = req.params.id;
  messageScheduling
    .destroy({
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        messageQueue
          .destroy({
            where: { schedule_id: id },
          })
          .then((numDestroy) => {
              res.send({
                message: "Schedule deleted successfully.",
              });
          })
          .catch((err) => {
            res.status(500).send({
              message: "Could not delete Queue" + err,
            });
          });
      } else {
        res.send({
          message: `Cannot delete Schedule. Maybe Schedule was not found or request is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error deleting Schedule",
      });
    });
};
