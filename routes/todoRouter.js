const express = require('express');
const router = express.Router();
const  { getAllTodos, getTodo, createTodo, updateTodo, deleteTodo } = require('../controllers/todoController');


router.post('/createTodo', createTodo);
router.patch('/updateTodo', updateTodo);
router.delete('/deleteTodo', deleteTodo);
router.get('/getTodo', getTodo);
router.get('/getAllTodos', getAllTodos);


module.exports = router;