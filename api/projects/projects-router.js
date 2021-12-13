// Write your "projects" router here!

const express = require("express");
const router = express.Router();
const projectsModel = require("./projects-model");
const { validateProjectId, validateProject } = require("./projects-middleware");

//get all projects
router.get("/", (req, res) => {
  projectsModel
    .get()
    .then((projects) => {
      res.status(200).json(projects);
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: "the projects information could not be retrieved" });
    });
});

//get project by id and validate
router.get("/:id", validateProjectId, (req, res, next) => {
  try {
    res.status(200).json(req.params);
  } catch (e) {
    next(e);
  }
});

//create a new project
router.post("/", (req, res) => {
  const newProject = req.body;
  projectsModel
    .insert(newProject)
    .then(() => {
      if (!newProject.name || !newProject.description) {
        res.status(400).json({
          message: "please provide a name and description for the project",
        });
      } else {
        res.status(200).json(newProject);
      }
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: "there was an error while saving to the database" });
    });
});

//update a current project with validation
router.put("/:id", validateProjectId, validateProject, (req, res) => {
  const { id } = req.params.id;
  const { projectChanges } = req.body;
  if (
    (!projectChanges.name || !projectChanges.description,
    !projectChanges.completed)
  ) {
    res
      .status(400)
      .json({ message: "the project with the specified id does not exist" });
  } else {
    projectsModel
      .update(id, projectChanges)
      .then(() => {
        return projectsModel.get(id);
      })
      .then((project) => {
        res.json(project);
      })
      .catch(() => {
        res
          .status(500)
          .json({ message: "The project information could not be modified" });
      });
  }
});

//delete project by id
router.delete("/:id", validateProjectId, async (req, res, next) => {
  const { id } = req.params.id;
  try {
    await projectsModel.remove(id);
    res.json(res.projectsModel);
  } catch (e) {
    next(e);
  }
});

//get project actions
router.get("/:id/actions", validateProjectId, async (req, res, next) => {
  const { id } = req.params.id;
  projectsModel
    .getProjectActions(id)
    .then((actions) => {
      if (actions.length > 0) {
        res.status(200).json(actions);
      } else {
        res.status(404).json(actions);
      }
    })
    .catch(next);
});

module.exports = router;
