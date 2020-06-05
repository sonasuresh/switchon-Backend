const Department = require('../models/departmentModel')
const userController = require('../controllers/userController')
const logger = require('../lib/logger')

async function addDepartment (req, res) {
  try {
    const { name } = req.body
    if (typeof name === 'undefined') {
      throw new Error('Incomplete details to create new Department')
    } else {
      const newDepartment = new Department({
        name: name
      })
      await newDepartment.save((err, docs) => {
        if (err) {
          logger.error('DB Error')
          res.status(500).send({
            success: false,
            message: 'DB Error'
          })
        } else {
          logger.info('New Department Created!')
          res.status(200).send({
            success: true,
            message: 'Department Created!'
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

async function getAllDepartments (req, res) {
  try {
    await Department.find({}).exec((err, docs) => {
      if (err) {
        logger.error('DB Error')
        res.status(500).send({
          success: false,
          message: 'DB Error'
        })
      } else {
        if (docs.length > 0) {
          logger.info('Fetched All Department Details')
          res.status(200).send({
            success: true,
            message: docs
          })
        } else {
          logger.warn('Attempt to fetch empty array of Departments!')
          res.status(204).send({
            success: true,
            message: 'No Departments'
          })
        }
      }
    })
  } catch (error) {
    logger.error(error.message)
    res.status(500).send({
      success: false,
      message: error
    })
  }
}
async function getOtherDepartments (req, res, next) {
  try {
    const { userId } = req.params
    if (typeof userId === 'undefined') {
      res.status(400).send({
        success: false,
        message: 'Bad Request!Email missing!'
      })
    }
    await userController.getUserDetails(userId, async function (docs) {
      await Department.find({ _id: { $ne: docs[0].departmentId } }).exec((err, docs) => {
        if (err) {
          logger.error('DB Error')
          res.status(500).send({
            success: false,
            message: 'DB Error'
          })
        } else {
          logger.info('Fetched Other Departments')
          res.status(200).send({
            success: true,
            message: docs
          })
        }
      })
    })
  } catch (error) {
    logger.error(error.message)
    res.status(500).send({
      success: false,
      message: error
    })
  }
}
module.exports = {
  addDepartment,
  getOtherDepartments,
  getAllDepartments
}
