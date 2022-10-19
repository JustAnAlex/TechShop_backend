const Router = require('express')
const router = new Router()

const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/check', authMiddleware, userController.check)
// router.get('/allUsers', checkRoleMiddleware('ADMIN'), userController.getAll)
router.get('/allUsers', userController.getAll)

module.exports = router

