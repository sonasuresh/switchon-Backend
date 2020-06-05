const Notification = require('../models/NotificationModel')

const logger = require('../lib/logger')

async function getNotifications(req, res) {
  try {
    const { userId } = req.params
    if (userId) {
      Notification.find({ requestedId: userId }, (err, docs) => {
        if (err) {
          logger.error('DB Error')
          res.status(500).send({
            success: false,
            message: 'DB Error'
          })
        } else {
          logger.info('Fetched Notifications')
          res.status(200).send({
            success: true,
            message: docs
          })
        }
      })
    } else {
      res.status(400).send({
        success: false,
        message: 'Bad Request!'
      })
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error
    })
  }
}

module.exports = {
  getNotifications
}
