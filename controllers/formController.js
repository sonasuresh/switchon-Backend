const Form = require('../models/formModel')
const Notification = require('../models/NotificationModel')
const User = require('../models/userModel')
const logger = require('../lib/logger')

async function createForm (req, res) {
  try {
    const { createdById, assignedToId, message } = req.body
    if (typeof createdById === 'undefined' && typeof assignedToId === 'undefined' && typeof message === 'undefined' && typeof status === 'undefined') {
      throw new Error('Incomplete details to create Form Request')
    } else {
      const newFormRequest = new Form({
        createdById: createdById,
        assignedToId: assignedToId,
        message: message

      })
      await newFormRequest.save((err, docs) => {
        if (err) {
          logger.error('DB Error')
          res.status(500).send({
            success: false,
            message: 'DB Error'
          })
        } else {
          logger.info('Form Requested!')
          res.status(200).send({
            success: true,
            message: 'Form Requested!'
          })
        }
      })
    }
  } catch (error) {
    logger.error(error.message)
    res.status(500).send({
      success: false,
      message: error
    })
  }
}

async function updateRequestStatus (req, res) {
  try {
    const { formId, status } = req.body
    if (typeof formId === 'undefined' && typeof status === 'undefined') {
      logger.error('DB Error')
      res.status(500).send({
        success: false,
        message: 'Incomplete details to update Form Request'
      })
    } else {
      Form.findOneAndUpdate({ _id: formId }, { $set: { status: status } }, { new: true }, (err, docs) => {
        if (err) {
          logger.error('DB Error')
          res.status(500).send({
            success: false,
            message: 'DB Error'
          })
        } else {
          User.find({ _id: docs.createdById }, { email: 1 }, (err, userdocs) => {
            if (err) {
              logger.error('DB Error')
              res.status(500).send({
                success: false,
                message: 'DB Error'
              })
            } else {
              const newNotification = new Notification({
                requestedId: docs.createdById,
                assignedId: docs.assignedToId,
                message: `${userdocs[0].email} has ${status} Your Request`,
                form: docs

              })
              newNotification.save((err, docs) => {
                if (err) {
                  logger.error('DB Error')
                  res.status(500).send({
                    success: false,
                    message: 'DB Error'
                  })
                } else {
                  logger.info('Notification Sent!!')
                  res.status(200).send({
                    success: true,
                    message: 'Notification Sent!'
                  })
                }
              })
            }
          })
        }
      })
    }
  } catch (error) {
    logger.error(error.message)
    res.status(500).send({
      success: false,
      message: error
    })
  }
}

async function getIndividualsFormRequests (req, res) {
  try {
    const { userId, status } = req.params
    if (typeof userId === 'undefined' && typeof status === 'undefined') {
      logger.error('DB Error')
      res.status(500).send({
        success: false,
        message: 'Bad Request!One of the field is missing!'
      })
    } else {
      Form.aggregate([
        { $match: { assignedToId: userId, status: status } },
        { $addFields: { createdById: { $toObjectId: '$createdById' } } },
        {
          $lookup: {
            from: 'users',
            localField: 'createdById',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' }
      ]).exec((err, docs) => {
        if (err) {
          logger.error('DB Error')
          res.status(500).send({
            success: false,
            message: 'DB Error'
          })
        }
        if (docs) {
          logger.info('Fetched Individual Form Reuquests!!')
          res.status(200).send({
            success: true,
            message: docs
          })
        }
      })
    }
  } catch (error) {
    logger.error(error.message)
    res.status(500).send({
      success: false,
      message: 'DB Error'
    })
  }
}

async function getRequestedForms (req, res) {
  try {
    const { userId } = req.params
    if (typeof userId === 'undefined') {
      res.status(500).send({
        success: false,
        message: 'Bad Request!One of the field is missing!'
      })
    } else {
      Form.aggregate([
        { $match: { createdById: userId, status: { $ne: 'Approved' } } },
        { $addFields: { assignedToId: { $toObjectId: '$assignedToId' } } },
        {
          $lookup: {
            from: 'users',
            localField: 'assignedToId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' }
      ]).exec((err, docs) => {
        if (err) {
          logger.error('DB Error')
          res.status(500).send({
            success: false,
            message: 'DB Error'
          })
        }
        if (docs) {
          logger.info('Fetched Requested Forms!')
          res.status(200).send({
            success: true,
            message: docs
          })
        }
      })
    }
  } catch (error) {
    logger.error(error.message)
    res.status(500).send({
      success: false,
      message: 'DB Error'
    })
  }
}

async function getFormsBasedOnDepartments (req, res) {
  try {
    const { userId, status } = req.params
    if (!userId) {
      res.status(400).send({
        success: false,
        message: 'Bad Request! Email missing!'
      })
    }
    await User.findOne({ _id: userId }, { departmentId: 1, _id: 1 }, async (err, deptdocs) => {
      if (err) {
        logger.error('DB Error')
        res.status(500).send({
          success: false,
          message: 'DB Error'
        })
      } else {
        if (deptdocs.departmentId != null) {
          Form.aggregate([
            { $match: { status: status } },
            { $addFields: { assignedToId: { $toObjectId: '$assignedToId' } } },
            {
              $lookup: {
                from: 'users',
                localField: 'assignedToId',
                foreignField: '_id',
                as: 'user'
              }
            },
            { $unwind: '$user' },
            { $match: { 'user.departmentId': { $eq: deptdocs.departmentId } } }

          ]).exec((err, docs) => {
            if (err) {
              logger.error('DB Error')
              res.status(500).send({
                success: false,
                message: 'DB Error'
              })
            }
            if (docs) {
              logger.info('Fetched Forms Based On departments')
              res.status(200).send({
                success: true,
                message: docs
              })
            }
          })
        } else {
          logger.warn('Attempt to fetch forms with invalid Department Id')
          res.status(204).send({
            success: false,
            message: 'Department Id Is Null!'
          })
        }
      }
    })
  } catch (error) {
    logger.error(error.message)
    res.status(500).send({
      success: false,
      message: 'DB Error'
    })
  }
}
module.exports = {
  createForm,
  updateRequestStatus,
  getIndividualsFormRequests,
  getRequestedForms,
  getFormsBasedOnDepartments
}
