const express = require('express')

const {addLocation,updateLocation,viewLocationByGroup,viewAllLocationDetails} = require('../../controllers/group/locations')
const router = express.Router()

router.route('/').post(addLocation)
router.route('/').get(viewAllLocationDetails)
router.route('/by-group/:grp_id').get(viewLocationByGroup)
router.route('/update/:id').put(updateLocation)



// router.route('/delete/:id').delete(DeleteGroupAssign)





module.exports = router