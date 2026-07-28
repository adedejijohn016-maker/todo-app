// 1. STATE (Data Layer)
let todos = JSON.parse(localStorage.getItem('todos')) || []; 

// 2. DOM ELEMENTS
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const taskCount = document.getElementById('task-count');
const clearBtn = document.getElementById('clear-btn');


// 3. RENDER FUNCTION
function renderTodos() {
  // existing Items
  todoList.innerHTML = '';

  // render each item
  todos.forEach((todo) => {
    const li = document.createElement('li'); 
    if (todo.completed) li.classList.add('completed');


    li.innerHTML = `
    <input type="checkbox" ${todo.completed ? 'checked' : ''} data-id="${todo.id}">
    <span class="todo-text">${todo.text}</span>
    <button class="delete-btn" data-id="${todo.id}">x</button>`;

    todoList.appendChild(li);
  });

// UPDATE THE FOLDER STAT
const activeCount = todos.filter((t) => !t.completed).length; 
taskCount.textContent = `you have ${activeCount} task${activeCount !== 1? 's' : ''} left`;

// SAVE TO LOCAL STORAGE
localStorage.setItem('todos', JSON.stringify(todos));
}

// ACTIONS
const addTodo = (text) => {
  const newTodo = {
    id: Date.now(),
    text: text.trim(),
    completed: false,
  };
  todos.push(newTodo);
  renderTodos();  
}

const toggleTodo = (id) => {
  todos = todos.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo);
  renderTodos();
}

const deleteTodo = (id) => {
  todos = todos.filter((todo) => todo.id !== id);
  renderTodos();
}

function clearCompleted() {
  todos = todos.filter((todo) => !todo.completed);
  renderTodos();
}

// HELPER FOR HTML INJECTION ATTACKS
function escapeHTML(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

  // EVENT LISTENERS
  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!todoInput.value.trim()) return;
    addTodo(todoInput.value);
    todoInput.value = '';
  });


  // for delete and toggle
  todoList.addEventListener('click', (e) => {
   const id = Number(e.target.dataset.id);
   if (!id) return;

   if (e.target.matches('input[type="checkbox"]')) {
      toggleTodo(id);
    } else if (e.target.classList.contains('delete-btn')) {
      deleteTodo(id);
    }
  });

  clearBtn.addEventListener('click', clearCompleted);
