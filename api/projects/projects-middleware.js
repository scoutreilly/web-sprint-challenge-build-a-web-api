// add middlewares here related to projects
const projects = require("./projects-model");

async function validateProjectId(req, res, next) {
  try {
    const { id } = req.params;
    const project = await projects.get(id);
    if (project) {
      req.params = project;
      next();
    } else {
      next({
        status: 404,
        message: "project with given id could not be found",
      });
    }
  } catch {
    res.status(500).json({ message: "project could not be validated" });
  }
}

async function validateProject(req, res, next) {
  const { name, description, completed } = req.body;
  if (!name || !name.trim()) {
    res.status(400).json({ message: "please provide a name" });
  } else if (!description || !description.trim()) {
    res.status(400).json({ message: "please provide a description" });
  } else {
    req.name = name.trim();
    req.description = description.trim();
    req.completed = completed;
    next();
  }
}

module.exports = { validateProjectId, validateProject };
