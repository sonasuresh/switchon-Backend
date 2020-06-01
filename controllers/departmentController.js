const Department = require('../models/departmentModel')
const userController = require('../controllers/userController')

async function addDepartment(req, res) {
    try {
        const { name } = req.body
        if (typeof name == 'undefined') {
            throw new Error('Incomplete details to create new Department')
        } else {
            let newDepartment = new Department({
                name: name
            })
            await newDepartment.save((err, docs) => {
                if (err) {
                    res.status(500).send({
                        success: false,
                        message: 'DB Error'
                    })
                } else {
                    res.status(200).send({
                        success: true,
                        message: 'Department Created!'
                    })
                }
            })
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        })
    }


}

async function getAllDepartments(req, res) {
    try {
        await Department.find({}).exec((err, docs) => {
            if (err) {
                res.status(500).send({
                    success: false,
                    message: 'DB Error'
                })
            } else {
                if (docs.length > 0) {
                    res.status(200).send({
                        success: true,
                        message: docs
                    })
                } else {
                    res.status(204).send({
                        success: true,
                        message: 'No Departments'
                    })
                }
            }
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        })
    }
}
async function getOtherDepartments(req, res,next) {
    try {
        const { email } = req.params
        if (typeof email == 'undefined') {
            res.status(400).send({
                success: false,
                message: 'Bad Request!Email missing!'
            })
            }
             await userController.getUserDetails(email,async function(docs){
             await Department.find({_id:{ $ne:docs[0].departmentId}}).exec((err, docs) => {
                if (err) {
                    res.status(500).send({
                        success: false,
                        message: 'DB Error'
                    })
                } else {

                        res.status(200).send({
                            success: true,
                            message: docs
                        })
                }
            })
        })
        } catch (error) {
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