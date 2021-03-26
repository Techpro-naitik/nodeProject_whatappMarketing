const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col
};
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.addressBook = require("./address_book.model.js")(sequelize, Sequelize);
db.messageDetail = require("./message_detail.model.js")(sequelize, Sequelize);
db.messageAttachment = require("./message_attachment.model.js")(sequelize, Sequelize);
// db.messageScheduling = require("./message_scheduling.model.js")(sequelize, Sequelize);
db.messageQueue = require("./message_queue.model.js")(sequelize, Sequelize);

db.messageDetail.hasMany(db.messageAttachment, {foreignKey: 'message_id'});
// db.messageDetail.hasMany(db.messageScheduling, {foreignKey: 'message_id'});
db.messageDetail.hasMany(db.messageQueue, {foreignKey: 'message_id'});
db.messageQueue.belongsTo(db.addressBook, {foreignKey: 'contact_id', targetKey: 'id'});
// db.messageScheduling.hasMany(db.messageDetail, {
//   foreignKey: "schedule_id",
// });
module.exports = db;