const express = require('express')

const {AllGroup,addGroup,DeleteGroup,UpdateGroup} = require('../../controllers/group/group')
const router = express.Router()

router.route('/').post(addGroup)
router.route('/').get(AllGroup)
router.route('/update-group/:id').put(UpdateGroup)
router.route('/delete-group/:id').delete(DeleteGroup)





module.exports = router