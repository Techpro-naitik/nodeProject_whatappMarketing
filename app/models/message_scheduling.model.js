module.exports = (sequelize, Sequelize) => {
    const messagescheduleModel = sequelize.define("message_scheduling", {
        message_id: {
            type: Sequelize.INTEGER
        },
        scheduled_date: {
            type: Sequelize.DATE
        },
        scheduled_time: {
            type: Sequelize.TIME
        },
        status: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }
    });

    return messagescheduleModel;
};