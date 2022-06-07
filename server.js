const express = require('express');
const socket = require('socket.io');
const cors = require('cors');


const app = express();
app.use(cors());
const server = app.listen(8000, () => {
  // console.log('Server is running on port: 8000');
});
const io = socket(server);


const tasks = [
  { id: '1', name: 'Shopping' },
  { id: '2', name: 'Gym' }
];


io.on('connection', (socket) => {

  socket.emit('updateData', tasks);
  // console.log('new user' + socket.id);

  socket.on('addTask', (taskData) => {
    tasks.push(taskData);
    socket.broadcast.emit('addTask', taskData);
    // console.log('addTask from server');
  });

  socket.on('removeTask', (taskId) => {
    tasks.filter(item => item.id !== taskId);
    socket.broadcast.emit('removeTask', taskId);
    // console.log('removeTask from server');
  });
});


app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});
