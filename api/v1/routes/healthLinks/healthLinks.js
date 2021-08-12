const express = require('express')
const router = express.Router()
const { upload } = require("../../../../config/Multer");
const { 
    addHealthLink, 
    getHealthLinks,
    editHealthLink,
    deleteHealthLinkById,
    getHealthLinkByGroupId 
} = require ('../../controllers/healthLinks/healthLinks.js')

router.route('/').post(upload.fields([
    { name: "image", maxCount: 1 }
]), addHealthLink);
router.route('/').put(upload.fields([
    { name: "image", maxCount: 1 }
]), editHealthLink);
router.route('/').get(getHealthLinks);
router.route('/:_id').delete(deleteHealthLinkById);
router.route('/group/:group_id').get(getHealthLinkByGroupId);
//router.route('/').get(controller.allGroups);

module.exports = router;