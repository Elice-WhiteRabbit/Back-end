const {
  getAllUserSkills,
  getUserSkillsByUser,
  getUserSkillsBySkill,
  addUserSkill,
  removeUserSkill,
} = require("../services/user-skill-service");

const UserSkillController = {
  async add(req, res) {
    try {
      const newUserSkill = await addUserSkill(req.body);
      res.status(201).json(newUserSkill);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const userskills = await getAllUserSkills();
      res.status(200).json(userskills);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  //유저 받는거
  async getUser(req, res) {
    try {
      const userskill_user = await getUserSkillsByUser(req.body); //문서id 말고 해당 user의 아이디 ????
      if (!userskill_user) {
        return res.status(404).json({ error: "없는 유저입니다.." });
      }
      res.status(200).json(userskill_user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  //스킬 받는거
  async getSkill(req, res) {
    try {
      const userskill_skill = await getUserSkillsBySkill(req.params.id); //문서id 말고 해당 skill의 아이디 ????
      if (!userskill_skill) {
        return res.status(404).json({ error: "없는 스킬입니다.." });
      }
      res.status(200).json(userskill_skill);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // async update(req, res) {
  //   try {
  //     const updatedSkill = await modifySkill({
  //       id: req.params.id,
  //       skill: req.body.skill,
  //     });
  //     if (!updatedSkill) {
  //       return res.status(404).json({ error: "Skill not found" });
  //     }
  //     res.status(200).json(updatedSkill);
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // },

  async delete(req, res) {
    try {
      await removeUserSkill(req.params.id);
      res.status(200).json({ message: "Skill successfully deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = UserSkillController;
