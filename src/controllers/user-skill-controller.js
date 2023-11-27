const {
  getUsersBySkill,
  updateUserSkills,
} = require('../services/user-skill-service');

const userSkillController = {
  // 스킬 업데이트
  async update(req, res) {
    try {
      const id = req.params.id; // 사용자 ID
      const skills = req.body.skills; // 업데이트할 스킬들의 배열

      if (!Array.isArray(skills)) {
        return res
          .status(400)
          .json({ message: 'Invalid skills format, expected an array.' });
      }

      const updatedUser = await updateUserSkills({ userId: id, skills });
      res.status(200).json(updatedUser);
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  },
  // 스킬보유 유저 검색
  async getUsersBySkill(req, res) {
    try {
      const id = req.params.id; // 여기서 id는 스킬의 아이디

      const userList = await getUsersBySkill(id);

      // 위의 기능 200 OK [](빈 배열)를 리턴함. 프론트에서 검색 결과가 없다는 안내 문구를 띄워주셔야 함.
      res.status(200).json(userList);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = userSkillController;
