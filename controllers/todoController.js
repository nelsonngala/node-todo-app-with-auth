const Todo = require('../model/Todo');

const getAllTodos = async(req, res) => {
    const user = req.user.userId;
   const todos = await Todo.find({createdBy: user});

   return res.status(200).json({ todos });
}

const getTodo = async(req, res) => {
    const {
        user: { userId },
        query: { id: todoId },
      } = req
      const todo = await Todo.findOne({_id: todoId, createdBy: userId});
      if (!todo) {
        return res.status(404).json({ error: `No todo with id ${todoId}` });
      }
      res.status(200).json({ todo });
}

const createTodo = async(req, res) => {
    req.body.createdBy = req.user.userId;
    const todo = await Todo.create(req.body);

    return res.status(201).json({ todo });
}

const updateTodo = async(req, res) => {
    const {id : todoId} = req.query;
    const todo = await Todo.findByIdAndUpdate({ _id: todoId, createdBy: req.user.userId}, req.body, { new: true, runValidators: true });

    if(!todo) {
        return res.status(404).json({ error: `No todo with id ${todoId}` });
    }
    res.status(200).json({ todo });
}

const deleteTodo = async(req, res) => {
    const {id : todoId} = req.query;
    const todo = await Todo.findByIdAndRemove({_id: todoId, createdBy: req.user.userId});
    if (!todo) {
        return res.status(404).json({ error: `No todo with id ${todoId}` });  
    }
    res.status(200).send();
}

module.exports = { getAllTodos, getTodo, createTodo, updateTodo, deleteTodo }
