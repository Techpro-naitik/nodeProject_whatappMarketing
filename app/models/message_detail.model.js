module.exports = (sequelize, Sequelize) => {
    const messagedetailModel = sequelize.define("message_detail", {
      title: {
        type: Sequelize.STRING(50)
      },
      message: {
        type: Sequelize.TEXT
      },
      file_path: {
        type: Sequelize.TEXT
      },
      lat: {
        type: Sequelize.STRING(20)
      },
      lng: {
        type: Sequelize.STRING(20)
      },
      position_title: {
        type: Sequelize.STRING(20)
      },
      number: {
        type: Sequelize.STRING(20)
      },
      name: {
        type: Sequelize.STRING(20)
      },
      link_title: {
        type: Sequelize.STRING(20)
      },
      link: {
        type: Sequelize.TEXT
      },
      messagetype: {
        type: Sequelize.STRING(20)
      },
      save_as_draft: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      }
    });
  
    return messagedetailModel;
  };