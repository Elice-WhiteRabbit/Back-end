const express = require("express");
const SkillController = require("../controllers/skill-controller");
const router = express.Router();

router.post("/", SkillController.addSkill);
router.get("/find-all", SkillController.findAllSkill);
router.get("/find", SkillController.findSkill);
router.put("/", SkillController.updateSkill);
router.delete("/", SkillController.deleteSkill);

module.exports = router;
