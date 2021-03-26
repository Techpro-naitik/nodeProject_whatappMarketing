const db = require("../models");
const messageDetail = db.messageDetail;
const messageAttachment = db.messageAttachment;
const messageQueue = db.messageQueue;
const Op = db.Sequelize.Op;
const { validationResult } = require("express-validator");
const fs = require("fs");
const http = require("follow-redirects").https;

// Create and Save a new Message
exports.create = (req, res) => {
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    return res.status(201).json({ errors: errors.array() });
  }

  const messagedata = req.body;

  let message;
  if (req.body.messagetype == "text") {
    message = {
      title: req.body.title,
      message: req.body.message,
      status: req.body.status,
      messagetype: req.body.messagetype,
    };
  } else if (req.body.messagetype == "doc") {
    message = {
      title: req.body.title,
      status: req.body.status,
      messagetype: req.body.messagetype,
    };
  } else if (req.body.messagetype == "position") {
    message = {
      title: req.body.title,
      lat: req.body.lat,
      lng: req.body.lng,
      position_title: req.body.position_title,
      status: req.body.status,
      messagetype: req.body.messagetype,
    };
  } else if (req.body.messagetype == "contact") {
    message = {
      title: req.body.title,
      number: req.body.number,
      name: req.body.name,
      status: req.body.status,
      messagetype: req.body.messagetype,
    };
  } else if (req.body.messagetype == "link") {
    message = {
      title: req.body.title,
      link: req.body.link,
      link_title: req.body.link_title,
      status: req.body.status,
      messagetype: req.body.messagetype,
    };
  }

  // Save Message in the database
  messageDetail
    .create(message)
    .then((data) => {
      req.body.contactData = JSON.parse(req.body.contactData);
      console.log(req.body);
      req.body.contactData.forEach((contact, index) => {
        if (req.body.status == 0) {
          req.body.contactData[index].status = "sent";
        } else if (req.body.status == 1) {
          req.body.contactData[index].status = "schedule";
        } else {
          req.body.contactData[index].status = "draft";
        }
        req.body.contactData[index].scheduled_date = req.body.scheduled_date;
        req.body.contactData[index].scheduled_time = req.body.scheduled_time;
        req.body.contactData[index].message_id = data.id;
        req.body.contactData[index].contact_id = contact.id;
        delete req.body.contactData[index].id;
      });
      const contactData = req.body.contactData;

      let docArray = [];
      if (messagedata.messagetype == "doc" && req.files) {
        req.files.forEach((element) => {
          docArray.push({
            message_id: data.id,
            attachment: "uploads/" + element.filename,
            directorypath: element.path,
            caption: req.body.caption,
          });
        });
        messageAttachment
          .bulkCreate(docArray)
          .then((resp) => {
            data.dataValues.message_attachments = resp;
            // res.send(data);
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while creating the Message template.",
            });
          });
      }
      console.log(req.body.status);
      if (req.body.status == 0) {
        data.dataValues.contactData = [];
        var response = [];
        contactData.forEach((element) => {
          if (messagedata.messagetype == "doc") {
            var options = {
              method: "POST",
              hostname: "localhost",
              port: "3000",
              path: "/send-image/10000000",
              headers: {
                "content-type": "application/json",
                "cache-control": "no-cache",
              },
            };

            var httpreq = http.request(options, function (httpres) {
              var chunks = [];

              httpres.on("data", function (chunk) {
                chunks.push(chunk);
              });

              httpres.on("end", function () {
                var body = Buffer.concat(chunks);
                console.log(body.toString());
              });
            });

            httpreq.write(
              JSON.stringify({
                to: element.phoneno,
                message: docArray[0].caption,
                name: "label",
                img: fs.readFileSync(docArray[0].directorypath, {
                  encoding: "base64",
                }),
              })
            );
            httpreq.end();
          } else if (messagedata.messagetype == "text") {
            var options = {
              method: "POST",
              hostname: "wa.dev.pienissimo.com",
              path: "/send-message/10000000",
              headers: {
                "content-type": "application/json",
                "cache-control": "no-cache",
              },
            };
            var httpreq = http.request(options, function (httpres) {
              var chunks = [];

              httpres.on("data", function (chunk) {
                chunks.push(chunk);
              });

              httpres.on("end", function () {
                var body = Buffer.concat(chunks);
                console.log(body.toString());
              });
            });

            httpreq.write(
              JSON.stringify({
                to: element.phoneno,
                message: messagedata.message,
              })
            );

            httpreq.on("error", function (err) {
              console.log(err);
            });

            httpreq.end();
          } else if (messagedata.messagetype == "position") {
            var options = {
              method: "POST",
              hostname: "wa.dev.pienissimo.com",
              path: "/send-message/10000000",
              headers: {
                "content-type": "application/json",
                "cache-control": "no-cache",
              },
            };
            var httpreq = http.request(options, function (httpres) {
              var chunks = [];

              httpres.on("data", function (chunk) {
                chunks.push(chunk);
              });

              httpres.on("end", function () {
                var body = Buffer.concat(chunks);
                console.log(body.toString());
              });
            });

            httpreq.write(
              JSON.stringify({
                to: element.phoneno,
                latitude: messagedata.lat,
                longitude: messagedata.lng,
                title: messagedata.position_title,
              })
            );

            httpreq.on("error", function (err) {
              console.log(err);
            });

            httpreq.end();
          } else if (messagedata.messagetype == "contact") {
            var options = {
              method: "POST",
              hostname: "wa.dev.pienissimo.com",
              path: "/send-message/10000000",
              headers: {
                "content-type": "application/json",
                "cache-control": "no-cache",
              },
            };
            var httpreq = http.request(options, function (httpres) {
              var chunks = [];

              httpres.on("data", function (chunk) {
                chunks.push(chunk);
              });

              httpres.on("end", function () {
                var body = Buffer.concat(chunks);
                console.log(body.toString());
              });
            });

            httpreq.write(
              JSON.stringify({
                to: element.phoneno,
                number: messagedata.number,
                name: messagedata.name,
              })
            );

            httpreq.on("error", function (err) {
              console.log(err);
            });

            httpreq.end();
          } else if (messagedata.messagetype == "link") {
            var options = {
              method: "POST",
              hostname: "wa.dev.pienissimo.com",
              path: "/send-message/10000000",
              headers: {
                "content-type": "application/json",
                "cache-control": "no-cache",
              },
            };
            var httpreq = http.request(options, function (httpres) {
              var chunks = [];

              httpres.on("data", function (chunk) {
                chunks.push(chunk);
              });

              httpres.on("end", function () {
                var body = Buffer.concat(chunks);
                console.log(body.toString());
              });
            });

            httpreq.write(
              JSON.stringify({
                to: element.phoneno,
                url: messagedata.link,
                title: messagedata.link_title,
              })
            );

            httpreq.on("error", function (err) {
              console.log(err);
            });

            httpreq.end();
          }
          messageQueue
            .create(element)
            .then((respCont) => {
              response.push(respCont);
              data.dataValues.contactData.push(respCont);
              if (response.length === contactData.length) {
                res.send(data);
              }
            })
            .catch((err) => {
              console.log("a1");
              res.status(500).send({
                message:
                  err.message ||
                  "Some error occurred while creating the Message template.",
              });
            });
        });
      } else {
        console.log(contactData);
        if (contactData) {
          messageQueue
            .bulkCreate(contactData)
            .then((respCont) => {
              data.dataValues.contactData = respCont;
              res.send(data);
            })
            .catch((err) => {
              res.status(500).send({
                message:
                  err.message ||
                  "Some error occurred while creating the Message template.",
              });
            });
        } else {
          res.send(data);
        }
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the Message template.",
      });
    });
};

// Retrieve all Message from the database.
exports.findAll = (req, res) => {
  messageDetail
    .findAll({
      // where: {
      //   status: 1,
      // },
      order: [["id", "ASC"]],
      // include: [
      //   {
      //     model: messageAttachment,
      //     required: false,
      //   },
      // ],
      include: { all: true, nested: true },
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving Message templates.",
      });
    });
};

// Find a single Message with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  messageDetail
    .findByPk(id, {
      include: [
        {
          model: messageAttachment,
          required: false,
        },
      ],
    })
    .then((data) => {
      if (data === null) {
        res.status(201).send({
          message: "Some error occurred while retrieving Message template.",
        });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Message template with id=" + id,
      });
    });
};

// Update a Message by the id in the request
exports.update = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(201).json({ errors: errors.array() });
  }
  const id = req.params.id;
  const contactData = req.body.contactData;
  delete req.body.contactData;

  messageDetail
    .update(req.body, {
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        let docArray = [];
        messageQueue
          .bulkCreate(contactData)
          .then((respCont) => {
            // data.dataValues.contactData = respCont;
            if (req.files) {
              req.files.forEach((element) => {
                docArray.push({
                  message_id: id,
                  attachment: "uploads/" + element.filename,
                  directorypath: element.path,
                });
              });
              messageAttachment
                .bulkCreate(docArray)
                .then((resp) => {
                  res.send({
                    message: "Message template was updated successfully.",
                  });
                })
                .catch((err) => {
                  res.status(500).send({
                    message:
                      err.message ||
                      "Some error occurred while updating the Message template.",
                  });
                });
            } else {
              res.send({
                message: "Message template was updated successfully.",
              });
            }
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while creating the Message template.",
            });
          });
      } else {
        res.send({
          message: `Cannot update Message template. Maybe Message template was not found or request is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Message",
      });
    });
};

//Delete Message
exports.deleteMessage = (req, res) => {
  const id = req.body.id;
  messageDetail
    .findAll({
      where: { id: id },
    })
    .then((data) => {
      if (data.length > 0) {
        messageDetail
          .destroy({
            where: { id: id },
          })
          .then((num) => {
            if (num >= 1) {
              messageAttachment
                .findAll({
                  where: { message_id: id },
                })
                .then((dataAttach) => {
                  if (dataAttach.length > 0) {
                    messageAttachment
                      .destroy({
                        where: { message_id: id },
                      })
                      .then((numAttach) => {
                        if (numAttach >= 1) {
                          // data.forEach((element) => {
                          //   fs.unlink(element.directorypath, (err) => {
                          //     if (err) {
                          //       console.log(
                          //         "failed to delete local image:" + err
                          //       );
                          //     } else {
                          //       console.log("successfully deleted local image");
                          //     }
                          //   });
                          // });
                          res.send({
                            message: "Message deleted successfully!",
                          });
                        } else {
                          res.send({
                            message: `Cannot delete Message.`,
                          });
                        }
                      })
                      .catch((err) => {
                        res.status(500).send({
                          message: "Cannot delete Message",
                        });
                      });
                  } else {
                    res.send({
                      message: "Message deleted successfully!",
                    });
                  }
                })
                .catch((err) => {});
            }
          })
          .catch((err) => {
            res.status(500).send({
              message: "Cannot delete Message",
            });
          });
      } else {
        res.send({
          message: `Cannot find Message.`,
        });
      }
    })
    .catch((err) => {
      res.send({
        message: `Cannot find Message.`,
      });
    });
};

//Delete Message Attachment
exports.delete = (req, res) => {
  const id = req.body.id;
  messageAttachment
    .findAll({
      where: { id: id },
    })
    .then((data) => {
      messageAttachment
        .destroy({
          where: { id: id },
        })
        .then((num) => {
          if (num >= 1) {
            // data.forEach((element) => {
            //   fs.unlink(element.directorypath, (err) => {
            //     if (err) {
            //       console.log("failed to delete local image:" + err);
            //     } else {
            //       console.log("successfully deleted local image");
            //     }
            //   });
            // });
            res.send({
              message: "Attachments deleted successfully!",
            });
          } else {
            res.send({
              message: `Cannot delete Attachment. Maybe Attachment was not found!`,
            });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: "Could not delete Attachment",
          });
        });
    })
    .catch((err) => {});
};

// Clone a Message
exports.clone = (req, res) => {
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    return res.status(201).json({ errors: errors.array() });
  }

  const docs = req.body.documents;
  
  let contactData = req.body.contactData;
  delete req.body.documents;
  delete req.body.contactData;
  const message = req.body;

  // Save Message in the database
  messageDetail
    .create(message)
    .then((data) => {
      contactData.forEach((element, index) => {
        contactData[index].message_id = data.id;
      });
      let docArray = [];
      messageQueue
        .bulkCreate(contactData)
        .then((respCont) => {
          data.dataValues.contactData = respCont;
          if (docs) {
            docs.forEach((element) => {
              docArray.push({
                message_id: data.id,
                attachment: element.attachment,
                directorypath: element.directorypath,
              });
            });
            messageAttachment
              .bulkCreate(docArray)
              .then((resp) => {
                data.dataValues.message_attachments = resp;
                res.send(data);
              })
              .catch((err) => {
                res.status(500).send({
                  message:
                    err.message ||
                    "Some error occurred while creating the Message template.",
                });
              });
          } else {
            res.send(data);
          }
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while creating the Message template.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the Message template.",
      });
    });
};

// Change Message Status
exports.statusChange = (req, res) => {
  const id = req.body.id;
  delete req.body.id;

  messageDetail
    .update(req.body, {
      where: { id: id },
    })
    .then((num) => {
      res.send({
        message: "Message status was updated successfully.",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error changing Message status",
      });
    });
};

// Scheduled Messages Send
exports.scheduleSend = (req, res) => {
  messageQueue
    .findAll({
      where: {
        status: "schedule",
      },
      order: [["id", "ASC"]],
      include: { all: true, nested: true },
    })
    .then((data) => {
      data.forEach((element) => {
        messageDetail
          .findAll({
            where: {
              id: element.message_id,
            },
            include: { all: true, nested: true },
          })
          .then((messagedata) => {
            if (messagedata.messagetype == "doc") {
              var options = {
                method: "POST",
                hostname: "localhost",
                port: "3000",
                path: "/send-image/10000000",
                headers: {
                  "content-type": "application/json",
                  "cache-control": "no-cache",
                },
              };

              var httpreq = http.request(options, function (httpres) {
                var chunks = [];

                httpres.on("data", function (chunk) {
                  chunks.push(chunk);
                });

                httpres.on("end", function () {
                  var body = Buffer.concat(chunks);
                  console.log(body.toString());
                });
              });

              httpreq.write(
                JSON.stringify({
                  to: element.address_book.phoneno,
                  message: messagedata.message_attachments[0].caption,
                  name: "label",
                  img: fs.readFileSync(
                    messagedata.message_attachments[0].directorypath,
                    {
                      encoding: "base64",
                    }
                  ),
                })
              );
              httpreq.end();
            } else if (messagedata.messagetype == "text") {
              var options = {
                method: "POST",
                hostname: "wa.dev.pienissimo.com",
                path: "/send-message/10000000",
                headers: {
                  "content-type": "application/json",
                  "cache-control": "no-cache",
                },
              };
              var httpreq = http.request(options, function (httpres) {
                var chunks = [];

                httpres.on("data", function (chunk) {
                  chunks.push(chunk);
                });

                httpres.on("end", function () {
                  var body = Buffer.concat(chunks);
                  console.log(body.toString());
                });
              });

              httpreq.write(
                JSON.stringify({
                  to: element.address_book.phoneno,
                  message: messagedata.message_attachments[0].message,
                })
              );

              httpreq.on("error", function (err) {
                console.log(err);
              });

              httpreq.end();
            } else {
            }
          });

        messageQueue
          .update(
            { status: "sent" },
            {
              where: { id: element.id },
            }
          )
          .then((num) => {
            res.send("done");
          })
          .catch((err) => {
            res.status(500).send({
              message: err,
            });
          });
      });
      // res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err,
      });
    });
};

// Stop Schedule
exports.scheduleStop = (req, res) => {
  const id = req.body.id;
  messageQueue
    .findAndCountAll({
      where: { message_id: id, status: "sent" },
    })
    .then((data) => {
      if (!data.count) {
        messageQueue
          .update(
            { status: "draft" },
            {
              where: { message_id: id },
            }
          )
          .then((num) => {
            messageDetail
              .update(
                { status: 2 },
                {
                  where: { id: id },
                }
              )
              .then((num) => {
                res.send({
                  message: "Stopped Successfully!",
                });
              })
              .catch((err) => {
                res.status(500).send({
                  message: err,
                });
              });
          })
          .catch((err) => {
            res.status(500).send({
              message: err,
            });
          });
      } else {
        res.status(201).send({
          message: "schedule has started",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err,
      });
    });
};
