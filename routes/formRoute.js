const router = require('express').Router()
const formController = require('../controllers/formController.js')
const middleware = require('../middleware/tokenValidation')

router.post('/', formController.createForm);
router.put('/',formController.updateRequestStatus);
router.get('/requested/:email',formController.getRequestedForms)
router.get('/:email/:status',formController.getIndividualsFormRequests)
//router.get('/',formController.getAllFormRequests);
// router.get('/',formController.getPermissionFlag);
// router.post('/', userController.addUser);
// router.get('/', userController.getAllUsers);
// router.get('/department',userController.getUsersBasedOnDepartment);




module.exports = router