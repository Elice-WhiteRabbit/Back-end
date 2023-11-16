const express = require("express");
const SkillController = require("../controllers/skill-controller");
const router = express.Router();

router.post("/skills", SkillController.add);
router.get("/skills", SkillController.getAll);
router.get("/skills/:id", SkillController.get);
router.put("/skills/:id", SkillController.update);
router.delete("/skills/:id", SkillController.delete);

module.exports = router;
