const Form = require('../models/formModel')
const userController=require('../controllers/userController')

async function createForm(req, res) {
    try {
        const { createdById, assignedToId, message } = req.body
        if (typeof createdById == 'undefined' && typeof assignedToId == 'undefined' && typeof message == 'undefined' && typeof status == 'undefined') {
            throw new Error('Incomplete details to create Form Request')
        } else {
            let newFormRequest = new Form({
                createdById: createdById,
                assignedToId: assignedToId,
                message: message,

            })
            await newFormRequest.save((err, docs) => {
                if (err) {
                    res.status(500).send({
                        success: false,
                        message: 'DB Error'
                    })
                } else {
                    res.status(200).send({
                        success: true,
                        message: 'Form Requested!'
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


async function updateRequestStatus(req, res) {
    try {
        const { formId, status } = req.body
        if (typeof formId == 'undefined' && typeof status == 'undefined') {
            res.status(500).send({
                success: false,
                message: 'Incomplete details to update Form Request'
            })
        } else {
            await Form.findOneAndUpdate({ '_id': formId }, { $set: { 'status': status } }, (err, docs) => {
                if (err) {
                    res.status(500).send({
                        success: false,
                        message: 'DB Error'
                    })
                } else {
                    res.status(200).send({
                        success: true,
                        message: 'Status Updated'
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

async function getIndividualsFormRequests(req, res) {
    try {
        const { email, status } = req.params
        if (typeof email == 'undefined' && typeof status == 'undefined') {
            res.status(500).send({
                success: false,
                message: 'Bad Request!One of the field is missing!'
            })
        } else {
            await userController.getUserDetails(email,async function (docs) {
                await Form.find({ assignedToId:docs[0]._id,status: status }).exec((err, docs) => {
                    if (err) {
                        res.status(500).send({
                            success: false,
                            message: 'DB Error'
                        })
                    } else {
                        if(docs.length>0){
                            res.status(200).send({
                                success: true,
                                message: docs
                            })
                        }else{
                            res.status(204).send({
                                success: true,
                                message: 'No Data!'
                            }) 
                        }
                       
                    }
                })
            })

        }


    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'DB Error'
        })
    }
}

async function getRequestedForms(req,res){
    try {
        const { email} = req.params
        if (typeof email == 'undefined' && typeof status == 'undefined') {
            res.status(500).send({
                success: false,
                message: 'Bad Request!One of the field is missing!'
            })
        } else {
            await userController.getUserDetails(email,async function (docs) {
                await Form.find({ createdById:docs[0]._id,status:{$ne: 'Approved'} }).exec((err, docs) => {
                    if (err) {
                        res.status(500).send({
                            success: false,
                            message: 'DB Error'
                        })
                    } else {
                        if(docs.length>0){
                            res.status(200).send({
                                success: true,
                                message: docs
                            })
                        }else{
                            res.status(204).send({
                                success: true,
                                message: 'No Data!'
                            }) 
                        }
                       
                    }
                })
            })

        }
    } catch (error) {
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
    getRequestedForms
}