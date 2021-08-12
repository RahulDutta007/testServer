const express = require('express')

const {add,view,edit,Delete} = require('../../controllers/super-admin/UploadAdministration')

const router = express.Router()


router.route('/')
.post(add)
.get(view)

router.route('/:id')
.put(edit)

router.route('/:field')
.delete(Delete)




module.exports = router