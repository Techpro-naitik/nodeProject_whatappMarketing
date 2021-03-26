module.exports = (sequelize, Sequelize) => {
    const messagequeueModel = sequelize.define("message_queue", {
        message_id: {
            type: Sequelize.INTEGER
        },
        contact_id: {
            type: Sequelize.INTEGER
        },
        status: {
            type: Sequelize.STRING(20),
            defaultValue: "scheduled"
        },
        scheduled_date: {
            type: Sequelize.DATE
        },
        scheduled_time: {
            type: Sequelize.TIME
        }
    });

    return messagequeueModel;
};