const router = require('express').Router()
const formController = require('../controllers/formController.js')
const middleware = require('../middleware/tokenValidation')

router.post('/', middleware.isTokenPresent, formController.createForm)
router.put('/', middleware.isTokenPresent, formController.updateRequestStatus)
router.get('/overallForms/:userId/:status', middleware.isTokenPresent, formController.getFormsBasedOnDepartments)
router.get('/requested/:userId', middleware.isTokenPresent, formController.getRequestedForms)
router.get('/:userId/:status', middleware.isTokenPresent, formController.getIndividualsFormRequests)

module.exports = router
