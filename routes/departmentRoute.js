const router = require('express').Router()
const departmentController = require('../controllers/departmentController.js')
const middleware = require('../middleware/tokenValidation')

router.post('/', departmentController.addDepartment)
router.get('/other/:userId', middleware.isTokenPresent, departmentController.getOtherDepartments)
router.get('/', departmentController.getAllDepartments)

module.exports = router
