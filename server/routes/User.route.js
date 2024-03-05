
const router = require('express').Router();
const userController = require('../controllers/User.controller');
const verifyToken = require('../utils/verifyUser');

router.put('/update/:userId', verifyToken,
  userController.updateUser);
router.delete('/delete/:userId', verifyToken,
  userController.deleteUser);
router.post('/signout', userController.signOut);
router.get('/getusers', verifyToken, userController.getUsers)

module.exports = router