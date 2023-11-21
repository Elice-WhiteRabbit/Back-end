const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const userSkillController = require('../controllers/user-skill-controller');
const asyncHandler = require('../utils/async-handler');
const { auth, checkAdmin } = require('../middlewares/verify-token');
const skillController = require('../controllers/skill-controller');
const linkController = require('../controllers/link-controller');

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

//유저 링크 관련 (프로필에 올라갈 깃허브 주소 등의 링크)
router.put('/links/:id', asyncHandler(linkController.updateLinks));
router.delete('/links/:id', asyncHandler(linkController.delete));
router.patch('/links/:id', asyncHandler(linkController.modify));

//유저 기수 관련

module.exports = router;
