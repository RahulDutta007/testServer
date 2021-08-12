const express = require('express')

const {addGroupAssign,DeleteGroupAssign,AllGroupAssign,UpdateGroupAssign,checkByGroupOrLocation,UserGroupAssign,GroupInfoUser} = require('../../controllers/group/groupAssign')
const router = express.Router()

router.route('/').post(addGroupAssign)
router.route('/').get(AllGroupAssign)
router.route('/info/:id').get(GroupInfoUser)
router.route('/:user_id').get(UserGroupAssign)
router.route('/').put(UpdateGroupAssign)
router.route('/check/:level/:id').get(checkByGroupOrLocation)
router.route('/delete/:id').delete(DeleteGroupAssign)





module.exports = router