module.exports = (sequelize, Sequelize) => {
  const addressbookModel = sequelize.define("address_book", {
    name: {
      type: Sequelize.STRING(50),
    },
    phoneno: {
      type: Sequelize.STRING(15),
    },
    email: {
      type: Sequelize.STRING(50),
    },
    tag1: {
      type: Sequelize.STRING(50),
    },
    tag2: {
      type: Sequelize.STRING(50),
    },
    tag3: {
      type: Sequelize.STRING(50),
    },
    tag4: {
      type: Sequelize.STRING(50),
    },
    tag5: {
      type: Sequelize.STRING(50),
    },
    blacklist: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
  });

  return addressbookModel;
};