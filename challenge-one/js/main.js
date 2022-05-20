import { Todos, ls, util } from './todos.js';

const todos = new Todos('#todos-list', '#add-text', 'add-button', 'test1-todos')

const add_button = util.qs('#add-button');

add_button.addEventListener('click', function() {
    todos.addTodo();
});

todos.listTodos();