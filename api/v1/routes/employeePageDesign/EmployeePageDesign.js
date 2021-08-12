const express = require('express');
const router = express.Router();

const {
    addThemeColor,
    getThemeColor,
    editThemeColor,
    getThemeColorByGroupId
} = require("../../controllers/employeePageDesign/EmployeePageDesign");

router.route("/theme-color")
    .post(addThemeColor)
    .get(getThemeColor)
    .put(editThemeColor);

router.route("/theme-color/:group_id")
    .get(getThemeColorByGroupId);

module.exports = router;