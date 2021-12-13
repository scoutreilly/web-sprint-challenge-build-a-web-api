// add middlewares here related to actions
const actionsModel = require("./actions-model");

async function validateActionId(req, res, next) {
  try {
    const action = await actionsModel.get(req.params.id);
    if (!action) {
      res
        .status(404)
        .json({ message: "action with give id could not be found" });
    } else {
      req.action = action;
      next();
    }
  } catch {
    res.status(500).json({ message: "action could not be validated" });
  }
}

async function validateAction(req, res, next) {
  const { project_id, description, notes, completed } = req.body;
  if (!project_id) {
    res.status(400).json({ message: "action with give id could not be found" });
  }
  if (!notes || !notes.trim) {
    res.status(400).json({ message: "please provide action notes" });
  } else {
    req.project_id = project_id;
    req.description = description.trim();
    req.notes = notes.trim();
    req.completed = completed;
    next();
  }
}

module.exports = { validateActionId, validateAction };
