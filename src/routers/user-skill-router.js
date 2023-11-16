const express = require("express");
const UserSkillController = require("../controllers/user-skill-controller");
const router = express.Router();

router.post("/userskills", UserSkillController.add);
router.get("/userskills", UserSkillController.getAll);
router.get("/userskills/:user", UserSkillController.getUser);
router.get("/userskills/:skill", UserSkillController.getSkill);
// router.put("/userskills/:id", UserSkillController.update);
router.delete("/userskills/:id", UserSkillController.delete);

module.exports = router;
