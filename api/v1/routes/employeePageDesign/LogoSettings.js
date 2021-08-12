const express = require('express');
const router = express.Router();
const { upload } = require("../../../../config/Multer");
const {
    addLogoSettings,
    getLogoSettings,
    getLogoSettingsByGroupId,
    editLogoSettings
} = require("../../controllers/employeePageDesign/LogoSettings");

router.route("/logo-settings")
    .post(upload.fields([
        { name: "logo_attachment", maxCount: 1 },
        { name: "favicon", maxCount: 1 },
    ]), addLogoSettings)
    .put(upload.fields([
        { name: "logo_attachment", maxCount: 1 },
        { name: "favicon", maxCount: 1 },
    ]), editLogoSettings)
    .get(getLogoSettings);

router.route("/logo-settings/:group_id")
    .get(getLogoSettingsByGroupId);
    
module.exports = router;