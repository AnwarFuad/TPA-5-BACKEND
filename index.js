const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

const companyModel = require('./models').company;

// get config vars
dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = 3000;
const usersStatic = [
  {
    id: '1',
    nama: 'asep',
    email: 'asep@gmail.com',
    password: '459395'
  },
  {
    id: '2',
    nama: 'udin',
    email: 'udin@gmail.com',
    password: '352355'
  },
  {
    id: '3',
    nama: 'raul',
    email: 'raul@gmail.com',
    password: '5457765'
  },
  {
    id: '4',
    nama: 'rabani',
    email: 'rabani@gmail.com',
    password: '3454546'
  },
  {
    id: '5',
    nama: 'parlay',
    email: 'parlay@gmail.com',
    password: '1232444'
  }
];

const dataUsers = [
  {
    user_id: '1',
    email: 'johan@gmail.com',
    password: '459395'
  },
  {
    user_id: '2',
    nama: 'sahara',
    email: 'sahara@gmail.com',
    password: '352355'
  },
  {
    user_id: '3',
    nama: 'raul',
    email: 'raul@gmail.com',
    password: '5457765'
  },
  {
    user_id: '4',
    nama: 'rabani',
    email: 'rabani@gmail.com',
    password: '3454546'
  },
  {
    user_id: '5',
    nama: 'parlay',
    email: 'parlay@gmail.com',
    password: '1232444'
  }
];

let checkUser = (req, res, next) => {
  let response = {};
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    response = {
      status: 'ERROR',
      message: 'Authorization Failed'
    };
    res.status(401).json(response);
    return;
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => {
    console.log(error);
    if (error) {
      response = {
        status: 'ERROR',
        message: error
      };
      res.status(401).json(response);
      return;
    }
    req.user = user;
    next();
  });
};

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello Nakama Skilvul, Ini Adalah Root');
});

app.get('/users', (req, res) => {
  res.json(usersStatic);
});

app.get('/users/:id', (req, res) => {
  let response = usersStatic[req.params.id - 1];
  res.json(response);
});

app.post('/users', (req, res) => {
  let response = {
    id: usersStatic.length + 1,
    nama: req.body.nama,
    email: req.body.email,
    password: req.body.password,
  };
  usersStatic.push(response);
  res.json(response);
});

app.put('/users/:id', (req, res) => {
  let incomingUpdateData = {
    id: req.params.id,
    nama: req.body.nama,
    email: req.body.email,
    password: req.body.password,
  };
  usersStatic[req.params.id - 1] = incomingUpdateData;

  res.json(usersStatic[req.params.id - 1]);
});

app.delete('/users/:id', (req, res) => {
  usersStatic.splice(req.params.id - 1, 1);
  res.sendStatus(204);
});

app.get("/todos/:id", async (req, res) => {
  let response = {};
  const todo = await todoModel.findAll({
    where: {
      id: req.params.id
    }
  });

  if (todo.length == 0) {
    response = {
      status: "SUCCESS",
      message: "Data not Found"
    };
  } else {
    response = {
      status: "SUCCESS",
      message: "Get Detail todo",
      data: todo
    };
  }

  res.status(200).json(response);
  return;
});

app.delete("/users/:id", (req, res) => {
  usersStatic.splice(req.params.id - 1, 1);
  res.status(204);
  res.send();
});

app.get("/todos", async (req, res) => {
  const todos = await todoModel.findAll();
  const response = {
    status: "SUCCESS",
    message: "Get All todo",
    meta: {
      total: todos.length
    },
    data: todos
  };

  res.status(200).json(response);
  return;
});

app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  let response = {};
  let foundUser = {};

  for (let i = 0; i < dataUsers.length; i++) {
    if (dataUsers[i].email == email) {
      foundUser = dataUsers[i];
    }
  }

  if (Object.keys(foundUser).length == 0) {
    response = {
      status: "ERROR",
      message: "User not Found"
    };
    res.status(401).json(response);
    return;
  }

  if (foundUser.password != password) {
    response = {
      status: "ERROR",
      message: "Combination Email and Password not Match"
    };
    res.status(401).json(response);
    return;
  }

  let jwt_payload = {
    user_id: foundUser.user_id
  };

  let access_token = jwt.sign(jwt_payload, process.env.TOKEN_SECRET, {
    expiresIn: "1800s"
  });
  response = {
    status: "SUCCESS",
    access_token: access_token
  };
  res.json(response);
});

app.use(checkUser);

app.get("/todos", async function (req, res) {
  try {
    const todos = await todoModel.findAll();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({
      message: error.message || "internal server error"
    });
  }
});

app.get("/todos/:todoId", async function (req, res) {
  try {
    const { todoId } = req.params;
    const todo = await todoModel.findOne({ id: Number(todoId) });

    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({
      message: error.message || "internal server error"
    });
  }
});

app.post("/todos", async function (req, res) {
  try {
    const { title, deskripsi } = req.body;

    const newTodoData = {
      title: title,
      deskripsi: deskripsi
    };
    const newTodo = await todoModel.create(newTodoData);

    res.status(201).json({
      message: "new todo create",
      todo: newTodo
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "internal server error"
    });
  }
});

app.delete("/todos/:id", async (req, res) => {
  let response = {};
  let code = 200;
  try {
    const newTodo = await todoModel.create({
      title: req.body.title,
      deskripsi: req.body.deskripsi
    });

    response = {
      status: "SUCCESS",
      message: "Create todo",
      data: newTodo
    };
  } catch (error) {
    code = 422;
    response = {
      status: "ERROR",
      message: error.parent.sqlMessage
    };
  }

  res.status(code).json(response);
  return;
});

app.put("/todos/:id", async (req, res) => {
  let response = {};
  let code = 200;
  if (req.body.title == "" || req.body.title == undefined) {
    code = 422;
    response = {
      status: "SUCCESS",
      message: "title cannot be blank"
    };
  }
  if (req.body.deskripsi == "" || req.body.deskripsi == undefined) {
    code = 422;
    response = {
      status: "SUCCESS",
      message: "deskripsi cannot be blank"
    };
  }

  const todos = await todoModel.findOne({
    where: {
      id: req.params.id
    }
  });

  if (!todos) {
    response = {
      status: "SUCCESS",
      message: "Data not Found"
    };
  } else {
    todos.title = req.body.title;
    todos.deskripsi = req.body.deskripsi;
    todos.save();
    response = {
      status: "SUCCESS",
      message: "Update Todo",
      data: todos
    };
  }

  res.status(code).json(response);
  return;
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
