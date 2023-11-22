const express = require('express');
const SkillController = require('../controllers/skill-controller');
const router = express.Router();

router.post('/', SkillController.addSkill);
router.get('/find-all', SkillController.findAllSkill);
router.get('/find/:id', SkillController.findSkill);
router.put('/', SkillController.updateSkill);
router.delete('/:id', SkillController.deleteSkill);

//스킬검색 (스킬을 검색해 보세요.)
router.get('/search/:skill', SkillController.searchSkill);

module.exports = router;
