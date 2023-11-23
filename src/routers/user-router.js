const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const userSkillController = require('../controllers/user-skill-controller');
const asyncHandler = require('../utils/async-handler');
const { auth, checkAdmin } = require('../middlewares/verify-token');

const linkController = require('../controllers/link-controller');
const generationController = require('../controllers/generation-controller');

router.post('/', asyncHandler(userController.addUser));
router.get('/', auth, asyncHandler(userController.findUserByToken));

router.get('/:id', auth, asyncHandler(userController.findUserById));
router.get('/:id/public', asyncHandler(userController.findPublicUserInfoById));
router.patch('/:id', auth, asyncHandler(userController.modifyUser));
router.delete('/:id', auth, asyncHandler(userController.removeUser));
router.post('/login', asyncHandler(userController.login));

router.post('/password', asyncHandler(userController.sendCode));
router.post('/password/code', asyncHandler(userController.checkCode));
router.post('/password/reset', asyncHandler(userController.resetPassword));

// 팔로우 관련
router.get('/:id/follow', asyncHandler(userController.findAllFollowList));
router.post('/:id/follow', auth, asyncHandler(userController.addFollow));
router.delete('/:id/follow', auth, asyncHandler(userController.removeFollower));
router.get('/:id/follow/number', asyncHandler(userController.findAllFollowNumber));


//유저스킬 관련
router.patch('/skill/add/:id', asyncHandler(userSkillController.add));
router.patch('/skill/remove/:id', asyncHandler(userSkillController.delete));
//유저 내부 어레이에 적용하니까 patch로 구현

//유저 테이블 전체에서 이 스킬이 [유저 스킬즈 배열]에 들어있는 유저 목록 가져오기

router.get('/skill/:id', asyncHandler(userSkillController.getUsersBySkill));

//유저 링크 관련 (프로필에 올라갈 깃허브 주소 등의 링크)
router.put('/links/:id', asyncHandler(linkController.updateLinks)); //링크 추가
router.delete('/links/:id', asyncHandler(linkController.deleteLink)); // 링크 삭제
router.get('/links/:id', asyncHandler(linkController.getLinks)); //특정 사용자의 모든 링크 조회

//유저 기수 관련
router.get(
  '/generation/:id',
  asyncHandler(generationController.getGenerationInfo)
); //특정 사용자의 트랙,기수 조회

router.get(
  '/generation/:generationType/:generationNumber',
  asyncHandler(generationController.findUsersByGeneration)
); //특정 트랙,기수의 사용자 전체조회

// 기수 추가 라우트
router.put(
  '/generation-number/:id',
  asyncHandler(generationController.addGenerationNumber)
);

router.patch(
  '/generation-number/:id',
  asyncHandler(generationController.modifyGenerationNumber)
); //특정 사용자의 기수 수정
router.delete(
  '/generation-number/:id',
  asyncHandler(generationController.deleteGenerationNumber)
); //특정 사용자의 기수 삭제

// 트랙 생성 라우트
router.put(
  '/generation-type/:id',
  asyncHandler(generationController.addGenerationType)
);

// 트랙 수정 라우트
router.patch(
  '/generation-type/:id',
  asyncHandler(generationController.modifyGenerationType)
);

// 트랙 삭제 라우트
router.delete(
  '/generation-type/:id',
  asyncHandler(generationController.deleteGenerationType)
);

module.exports = router;
