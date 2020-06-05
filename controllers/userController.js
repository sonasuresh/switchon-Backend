const User = require('../models/userModel')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const logger = require('../lib/logger')

const salt = 10

async function addUser (req, res) {
  try {
    const { email, password, departmentId } = req.body
    if (typeof email === 'undefined' && typeof password === 'undefined' && typeof departmentId === 'undefined') {
      throw new Error('Incomplete details to add new User')
    } else {
      await User.find({ email: email }, async (err, docs) => {
        if (err) {
          logger.error('DB Error')
          res.status(500).send({
            success: false,
            message: 'DB Error'
          })
        } else {
          if (docs.length !== 0) {
            res.status(403).send({
              success: false,
              message: 'User with this Email Registered Already!'

            })
          } else {
            bcrypt.hash(password, salt, function (err, hash) {
              if (err) {
                logger.error('DB Error')
                throw err
              } else {
                const newUser = new User({
                  email: email,
                  password: hash,
                  departmentId: departmentId
                })
                newUser.save((err, docs) => {
                  if (err) {
                    logger.error('DB Error')
                    res.status(500).send({
                      success: false,
                      message: 'DB Error'
                    })
                  } else {
                    logger.info('New User Created!')
                    res.status(200).send({
                      success: true,
                      message: 'User Created!'
                    })
                  }
                })
              }
            })
          }
        }
      })
    }
  } catch (error) {
    logger.error(error.message)
    res.status(500).send({
      success: false,
      message: 'Server Error!'
    })
  }
}

async function login (req, res) {
  try {
    const { email, password } = req.body
    if (typeof email === 'undefined' && typeof password === 'undefined') {
      res.status(400).send({
        success: false,
        message: 'Bad Request!One or more fields are missing!'
      })
    } else {
      await User.findOne({ email: email }, (err, docs) => {
        if (err) {
          logger.error('DB Error')
          res.status(500).send({
            success: false,
            message: 'DB Error'
          })
        } else {
          if (!docs) {
            res.status(500).send({
              success: false,
              message: 'No matches'
            })
          } else {
            bcrypt.compare(password, docs.password, (err, isMatch) => {
              if (err) {
                logger.error('DB Error')
                res.status(500).send({
                  success: false,
                  message: 'DB Error'
                })
              } else if (isMatch) {
                jwt.sign({ docs }, 'secret', (err, token) => {
                  if (err) {
                    logger.error('DB Error')
                    res.status(500).send({
                      success: false,
                      message: 'DB Error'
                    })
                  } else {
                    logger.info('Token Generated')
                    res.status(200).send({
                      success: true,
                      email: docs.email,
                      id: docs._id,
                      jwttoken: token
                    })
                  }
                })
              } else {
                res.status(400).send({
                  success: false,
                  message: 'Wrong Password!'
                })
              }
            })
          }
        }
      })
    }
  } catch (error) {
    logger.error(error.message)
    res.status(500).send({
      success: false,
      message: 'Server Error!'
    })
  }
}

async function getAllUsers (req, res) {
  try {
    await User.find({}, (err, docs) => {
      if (err) {
        logger.error('DB Error')
        throw err
      } else {
        logger.info('Fetched All User Details')
        res.status(200).send({
          success: true,
          message: docs
        })
      }
    })
  } catch (error) {
    logger.error(error.message)
    res.status(500).send({
      success: false,
      message: 'Server Error!'
    })
  }
}
async function getUsersBasedOnDepartment (req, res) {
  try {
    const { departmentId } = req.params
    await User.find({ departmentId: departmentId }, { _id: 1, email: 1, departmentId: 1 }, (err, docs) => {
      if (docs.length < 0) {
        res.status(204).send({
          success: true,
          message: 'No data!'
        })
      } else if (err) {
        logger.error('DB Error')
        throw err
      } else {
        logger.info('Fetched Users Based On Department')
        res.status(200).send({
          success: true,
          message: docs
        })
      }
    })
  } catch (error) {
    logger.error(error.message)
    res.status(500).send({
      success: false,
      message: 'Server Error!'
    })
  }
}

function getUserDetails (userId, callback) {
  try {
    if (typeof userId === 'undefined') {
      throw new Error('Bad Request!userId missing!')
    } else {
      User.find({ _id: userId }, { departmentId: 1, _id: 1 }, (err, docs) => {
        if (err) {
          logger.error('DB Error')
          throw new Error('DB Error')
        } else {
          logger.info('Returned User Details to Calling function')
          callback(docs)
        }
      })
    }
  } catch (error) {
    logger.error(error.message)
    throw new Error(error)
  }
}

async function getUser (req, res) {
  try {
    const { userId } = req.body
    if (typeof userId === 'undefined') {
      res.status(400).send({
        success: false,
        message: 'Bad Request!'
      })
    } else {
      await User.find({ _id: userId }, { email: 1 }, (err, docs) => {
        if (err) {
          logger.error('DB Error')
          res.status(502).send({
            success: false,
            message: 'DB Error'
          })
        } else {
          logger.info('Fetched User Based on Id')
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
      message: 'Server Error!'
    })
  }
}
module.exports = {
  addUser,
  login,
  getAllUsers,
  getUsersBasedOnDepartment,
  getUserDetails,
  getUser
}
