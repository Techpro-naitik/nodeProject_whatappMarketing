module.exports = (sequelize, Sequelize) => {
    const amessageattachmentModel = sequelize.define("message_attachment", {
      message_id: {
        type: Sequelize.INTEGER
      },
      caption: {
        type: Sequelize.STRING(50)
      },
      attachment: {
        type: Sequelize.TEXT
      },
      directorypath: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.INTEGER
      }
    });
  
    return amessageattachmentModel;
  };