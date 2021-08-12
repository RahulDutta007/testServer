const express = require('express')

const {deleteLocation} = require('../../controllers/group/deleteLocation')
const router = express.Router()

router.route('/:id').delete(deleteLocation)




module.exports = router