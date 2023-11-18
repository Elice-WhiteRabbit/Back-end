const {
  addSkill,
  findSkill,
  findAllSkills,
  modifySkill,
  removeSkill,
} = require("../services/skill-service");

const SkillController = {
  async addSkill(req, res) {
    try {
      const newSkill = await addSkill(req.body);
      res.status(201).json(newSkill);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async findAllSkill(req, res) {
    try {
      const skills = await findAllSkills();
      res.status(200).json(skills);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async findSkill(req, res) {
    try {
      const skill = await findSkill(req.query.id);
      if (!skill) {
        return res.status(404).json({ error: "Skill not found" });
      }
      res.status(200).json(skill);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateSkill(req, res) {
    try {
      const updatedSkill = await modifySkill({
        id: req.query.id,
        skill: req.query.skill,
      });
      if (!updatedSkill) {
        return res.status(404).json({ error: "Skill not found" });
      }
      res.status(200).json(updatedSkill);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteSkill(req, res) {
    try {
      await removeSkill(req.query.id);
      if (!skill) {
        return res.status(404).json({ error: "Skill not found" });
      }
      res.status(200).json({ message: "Skill successfully deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = SkillController;
