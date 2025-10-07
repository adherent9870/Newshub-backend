const express = require("express");
const router = express();
const profileController = require("../controllers/profilesController");

router.get("/:id", profileController.getAllUsersExceptRequester);
module.exports = router;
