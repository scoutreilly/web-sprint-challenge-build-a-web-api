// Write your "actions" router here!
const express = require("express");
const router = express.Router();
const actionsModel = require("./actions-model");
const { validateActionId, validateAction } = require("./actions-middleware");

router.get("/", (req, res) => {
  actionsModel
    .get()
    .then((actions) => {
      res.status(200).json(actions);
    })
    .catch(() => {
      res.status(500).json({ message: "the actions could not be retrieved." });
    });
});

router.get("/:id", validateActionId, (req, res, next) => {
  try {
    res.status(200).json(req.params);
  } catch (e) {
    next(e);
  }
});

router.post("/", (req, res) => {
  const newAction = req.body;
  actionsModel
    .insert(newAction)
    .then(() => {
      if (!newAction.notes || !newAction.description) {
        res.status(400).json({
          message: "please provide a note and description for the project",
        });
      } else {
        res.status(200).json(newAction);
      }
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: "there was an error while saving to the database" });
    });
});

router.put("/:id", validateActionId, validateAction, async (req, res) => {
  const { actionChanges } = req.body;
  const updatedAction = await actionsModel.update(req.params.id, {
    project_id: actionChanges.project_id,
    description: actionChanges.description,
    notes: actionChanges.notes,
    completed: actionChanges.completed,
  });
  res.status(200).json(updatedAction);
});

router.delete("/:id", validateActionId, async (req, res, next) => {
  try {
    await actionsModel.remove(req.params.id);
    res.json(res.actionsModel);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
