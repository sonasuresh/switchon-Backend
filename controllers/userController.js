const User = require('../models/userModel')

const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');

const salt = 10

async function addUser(req, res) {
    try {
        const { email, password,departmentId } = req.body
        if (typeof email == 'undefined' && typeof password == 'undefined' && typeof departmentId == 'undefined') {

            throw new Error('Incomplete details to add new User')
        }
        else {

            await User.find({ email: email }, async (err, docs) => {
                if (docs.length != 0) {
                    res.status(403).send({
                        success: false,
                        message: 'User with this Email Registered Already!'

                    })
                } else {
                    bcrypt.hash(password, salt, function (err, hash) {
                        if (err) {
                            throw err
                        } else {

                            let newUser = new User({
                                email: email,
                                password: hash,
                                departmentId:departmentId
                            })
                            newUser.save((err, docs) => {
                                if (err) {
                                    res.status(500).send({
                                        success: false,
                                        message: 'DB Error'
                                    })
                                } else {
                                    res.status(200).send({
                                        success: true,
                                        message: 'User Created!'
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: 'Server Error!'
        })
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body
        if (typeof email == 'undefined' && typeof password == 'undefined') {
            res.status(400).send({
                success: false,
                message: 'Bad Request!One or more fields are missing!'
            })
        } else {
            await User.findOne({ email: email }, (err, docs) => {
                if (!docs) {
                    res.status(204).send({
                        success: true,
                        message: 'No matches'
                    })
                } else {
                    bcrypt.compare(password, docs.password, (err, isMatch) => {
                        if (err) {
                            throw err;
                        }
                        else if (isMatch) {
                            jwt.sign({ docs }, 'secret', (err, token) => {
                                res.status(200).send({
                                    success: true,
                                    email: docs.email,
                                    jwttoken: token
                                });
                            });
                        } else {
                            res.status(400).send({
                                success: false,
                                message: 'Wrong Password!'
                            });
                        }
                    })
                }
            })
        }

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Server Error!'
        })
    }
}



async function getAllUsers(req, res) {
    try {
        await User.find({}, (err, docs) => {
            if (docs.length == 0) {
                res.status(204).send({
                    success: true,
                    message: 'No data!'
                })
            }
            else if (err) {
                throw err;
            }
            else {
                res.status(200).send({
                    success: true,
                    message: docs
                })
            }

        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Server Error!'
        })
    }
}
async function getUsersBasedOnDepartment(req,res){
    try {
        const{departmentId}=req.body
        await User.find({departmentId:departmentId},{_id:1,email:1,departmentId:1}, (err, docs) => {
            if (docs.length == 0) {
                res.status(204).send({
                    success: true,
                    message: 'No data!'
                })
            }
            else if (err) {
                throw err;
            }
            else {
                
                res.status(200).send({
                    success: true,
                    message: docs
                })
            }

        })  
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Server Error!'
        })
    }
}

async function getDepartment(email,callback){
    try {
        if(typeof email =='undefined'){
               throw new Error('Bad Request!Email missing!')
        }else{
             await User.find({email:email},{departmentId:1}, (err, docs) => {
                 if (err) {
                    throw new Error('DB Error');
                }
                else {
                     callback(docs[0].departmentId)
                }
    
            }) 
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Server Error!'
        })
    }
}

async function getUserDetails(email,callback){
    try {
        if(typeof email =='undefined'){
               throw new Error('Bad Request!Email missing!')
        }else{
             await User.find({email:email},{departmentId:1,_id:1}, (err, docs) => {
                 if (err) {
                    throw new Error('DB Error');
                }
                else {
                     callback(docs)
                }
    
            }) 
        }
    } catch (error) {
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
    getUserDetails
}