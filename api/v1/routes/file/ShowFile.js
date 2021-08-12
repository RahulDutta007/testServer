const express = require('express');

const router = express.Router();

const {ShowFile} = require('../../controllers/file/ShowFile');

router.route("/:filename")
.get(ShowFile)




module.exports = router;