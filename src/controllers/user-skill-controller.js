const {
  getUsersBySkill,
  addUserSkill,
  removeUserSkill,
} = require("../services/user-skill-service");

const { findUserById } = require("../services/user-service");

const userSkillController = {
  //스킬 추가
  async add(req, res) {
    try {
      const id = String(req.params.id);
      const skill = req.body.skill;

      const newUserSkill = await addUserSkill({ userid: id, skill });

      res.status(201).json(newUserSkill);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  //스킬 삭제
  async delete(req, res) {
    try {
      const id = String(req.params.id);
      const skill = req.body.skill;

      const newUserSkill = await removeUserSkill({ userid: id, skill });

      res.status(201).json(newUserSkill);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  //스킬보유 유저검색

  async getUsersBySkill(req, res) {
    try {
      const id = req.params.id; //여기서 id는 스킬의 아이디

      const userList = await getUsersBySkill(id);

      //위의 기능 200ok [](빈배열)를 리턴함. 프론트에서 검색 결과가 없다는 안내 문구를 띄워주셔야 함.

      res.status(200).json(userList);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = userSkillController;
