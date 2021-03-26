module.exports = (app) => {
  const addressBook = require("../controllers/address_book.controller.js");
  const messageAttachment = require("../controllers/message_attachment.controller.js");
  const messageDetail = require("../controllers/message_detail.controller.js");
  const messageQueue = require("../controllers/message_queue.controller.js");
  const messageScheduling = require("../controllers/message_scheduling.controller.js");
  const upload = require("../middlewares/upload");
  const { check } = require("express-validator");

  var router = require("express").Router();

  // Create a new Address
  router.post(
    "/addAdress",
    check("name", "invalid name").not().isEmpty(),
    check("email", "Invalid email").isEmail(),
    check("phoneno", "invalid phone").not().isEmpty().isNumeric(),
    addressBook.create
  );

  // Retrieve all Addresses
  router.get("/getAddresses", addressBook.findAll);

  // Retrieve a single Address with id
  router.get("/getAddress/:id", addressBook.findOne);

  // Update an Address with id
  router.put(
    "/updateAddress/:id",
    check("phoneno", "invalid phone").optional().isNumeric(),
    addressBook.update
  );

  // Add Addresses using file
  router.post(
    "/uploadAddresses",
    upload.csv.single("file"),
    addressBook.uploadAddresses
  );

  // Filter Address
  router.post(
    "/filterAddressBook",
    addressBook.filterAddressBook
  );

  // Create a new Message template
  router.post(
    "/addMessage",
    check("title", "invalid title").not().isEmpty(),
    upload.document.array("documents", 1),
    messageDetail.create
  );

  // Retrieve all Message templates
  router.get("/getMessages", messageDetail.findAll);

  // Retrieve a single Message template with id
  router.get("/getMessage/:id", messageDetail.findOne);

  // Update an Message template with id
  router.put(
    "/updateMessage/:id",
    upload.document.array("documents", 1),
    messageDetail.update
  );

  // Delete Message
  router.post(
    "/deleteMessage",
    check("id", "invalid Ids").not().isEmpty(),
    messageDetail.deleteMessage
  );

  // Delete Message Attachment
  router.post(
    "/deleteMessageAttchament",
    check("id", "invalid Ids").not().isEmpty(),
    messageDetail.delete
  );

  // Clone Message template
  router.post(
    "/messageClone",
    check("title", "invalid title").not().isEmpty(),
    messageDetail.clone
  );

  // Change Message Status
  router.post(
    "/messageStatusChange",
    messageDetail.statusChange
  );

  // Scheduled Messages Send
  router.get(
    "/messageScheduleSend",
    messageDetail.scheduleSend
  );

  // Scheduled Messages Send
  router.post(
    "/messageScheduleStop",
    messageDetail.scheduleStop
  );

  // // Create a new Message Schedule
  // router.post("/addSchedule", messageScheduling.create);

  // // Retrieve all Message Schedules
  // router.get("/getSchedules", messageScheduling.findAll);

  // // Retrieve a single Message schedule with id
  // router.get("/getSchedule/:id", messageScheduling.findOne);

  // // Update an Message template with id
  // router.put("/updateSchedule/:id", messageScheduling.update);

  // // Delete a single Message schedule with id
  // router.get("/deleteSchedule/:id", messageScheduling.delete);

  app.use("/api", router);
};
