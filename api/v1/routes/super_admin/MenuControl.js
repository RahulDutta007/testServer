const express = require('express')

const {addDefaultMenu,findDefaultMenu,findDynamicMenu,addDynamicMenu,findMenu} = require('../../controllers/super-admin/MenuControl')
const router = express.Router()

router.route('/default/add-menu').post(addDefaultMenu)
router.route('/default/menu/:role').get(findDefaultMenu)

router.route('/group/add-menu').post(addDynamicMenu)
router.route('/group/menu/:group/:role').get(findDynamicMenu)

router.route('/:group/:role').get(findMenu)



module.exports = router