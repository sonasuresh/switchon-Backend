const router = require('express').Router()
const userController = require('../controllers/userController.js')
const middleware = require('../middleware/tokenValidation')

router.post('/login', userController.login)
router.post('/', userController.addUser)
router.get('/department/:departmentId', middleware.isTokenPresent, userController.getUsersBasedOnDepartment)
router.get('/:userId', middleware.isTokenPresent, userController.getUser)
router.get('/', middleware.isTokenPresent, userController.getAllUsers)

module.exports = router
