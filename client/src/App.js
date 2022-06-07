
import React from 'react';
import io from 'socket.io-client';
import shortid from 'shortid';


class App extends React.Component {

  componentExists = false;

  state = {
    tasks: [],
    taskName: ''
  };

  componentDidMount() {
    if (this.componentExists) {
      return
    };
    this.componentExists = true;

    this.socket = io.connect('http://localhost:8000', {
      transports: ['websocket'],
    });
    this.socket.on('addTask', (taskName) => this.addTask(taskName));
    this.socket.on('removeTask', (taskId) => this.removeTask(taskId));
    this.socket.on('updateData', (tasks) => this.updateTasks(tasks));
    // this.socket.on('connect', () => console.trace());
    // console.log('didmount');
  };

  removeTask = (id, localRequest) => {
    this.setState({ tasks: this.state.tasks.filter((item) => item.id !== id) });

    if (localRequest) {
      this.socket.emit('removeTask', id);
    };
    // console.log('removeTask from user')
  };

  updateTaskName = ({ target }) => {
    this.setState({ taskName: target.value });
    // console.log('task name updated')
  };

  addTask = (task) => {
    this.setState({ tasks: [...this.state.tasks, { id: shortid(), name: task }] })
    // console.log('addTask from user')
  };

  submitForm = (e) => {
    e.preventDefault();
    this.addTask(this.state.taskName);

    this.socket.emit('addTask', this.state.taskName);
    this.setState({ taskName: '' })
    // console.log('form submitted')
  };

  updateTasks = (tasksList) => {
    this.setState({ tasks: tasksList });
    // console.log('all tasks loaded from server')
  }


  render() {

    const { removeTask, updateTaskName, submitForm } = this;
    const { tasks, taskName } = this.state;

    return (
      <div className="App">

        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map((task) => (
              <li key={task.id} className="task">{task.name}<button className="btn btn--red" onClick={() => removeTask(task.id, true)}>Remove</button></li>
            ))}
          </ul>

          <form id="add-task-form" onSubmit={(e) => submitForm(e)}>
            <input className="text-input" autoComplete="off" type="text" placeholder="Type your description" id="task-name" value={taskName} onChange={updateTaskName}/>
            <button className="btn" type="submit">Add</button>
          </form>

        </section>
      </div>
    );
  };

};

export default App;
