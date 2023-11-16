const {
  addSkill,
  getSkill,
  getAllSkills,
  modifySkill,
  removeSkill,
} = require("../services/skill-service");

const SkillController = {
  async add(req, res) {
    try {
      const newSkill = await addSkill(req.body);
      res.status(201).json(newSkill);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const skills = await getAllSkills();
      res.status(200).json(skills);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async get(req, res) {
    try {
      const skill = await getSkill(req.params.id);
      if (!skill) {
        return res.status(404).json({ error: "Skill not found" });
      }
      res.status(200).json(skill);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const updatedSkill = await modifySkill({
        id: req.params.id,
        skill: req.body.skill,
      });
      if (!updatedSkill) {
        return res.status(404).json({ error: "Skill not found" });
      }
      res.status(200).json(updatedSkill);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      await removeSkill(req.params.id);
      res.status(200).json({ message: "Skill successfully deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = SkillController;
