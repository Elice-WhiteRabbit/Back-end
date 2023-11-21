const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const userSkillController = require('../controllers/user-skill-controller');
const asyncHandler = require('../utils/async-handler');
const { auth, checkAdmin } = require('../middlewares/verify-token');
const skillController = require('../controllers/skill-controller');

router.post('/', asyncHandler(userController.addUser));
router.get('/:id', auth, asyncHandler(userController.findUserById));
router.patch('/:id', auth, asyncHandler(userController.modifyUser));
router.delete('/:id', auth, asyncHandler(userController.removeUser));
router.post('/login', asyncHandler(userController.login));
//유저스킬 관련
router.patch('/skill/add/:id', asyncHandler(userSkillController.add));
router.patch('/skill/remove/:id', asyncHandler(userSkillController.delete));
//유저 내부 어레이에 적용하니까 patch로 구현

//유저 테이블 전체에서 이 스킬이 [유저 스킬즈 배열]에 들어있는 유저 목록 가져오기
router.get('/skill/:id', asyncHandler(userSkillController.getUsersBySkill));

module.exports = router;
