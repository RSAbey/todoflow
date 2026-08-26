const express = require('express');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  toggleTaskCompletion,
  deleteTask,
  deleteCompletedTasks,
} = require('../controllers/taskController');

const router = express.Router();

router.post('/', createTask);
router.get('/', getTasks);

// Static path must be registered before "/:id" routes
router.delete('/completed', deleteCompletedTasks);

router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.patch('/:id/complete', toggleTaskCompletion);
router.delete('/:id', deleteTask);

module.exports = router;
