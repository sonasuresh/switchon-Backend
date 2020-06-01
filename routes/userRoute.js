const router = require('express').Router()
const userController = require('../controllers/userController.js')
const middleware = require('../middleware/tokenValidation')

router.post('/login', userController.login);
router.post('/', userController.addUser);
router.get('/', userController.getAllUsers);
router.get('/department',userController.getUsersBasedOnDepartment);




module.exports = router