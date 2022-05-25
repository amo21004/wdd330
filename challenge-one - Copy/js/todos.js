import * as ls from './ls.js';

import * as util from './utilities.js';

let todoList = null;

class Todos {
    constructor(todo_list_element, todo_add_input, todo_add_button, todo_list_key) {
        const that = this;

        this.todo_list_element = util.qs(todo_list_element);

        this.todo_add_input = util.qs(todo_add_input);

        this.todo_add_button = util.qs(todo_add_button);

        this.todo_list_key = todo_list_key;
        
        todoList = getTodos(this.todo_list_key);

        this.todo_add_button.addEventListener('click', function() {
            that.addTodo();
        });

        this.listTodos();
    }

    addTodo() {
        if(this.todo_add_input.value.trim() != '') {
            const task = {
                id : Date.now(),
                content: this.todo_add_input.value.trim(),
                completed: false
            };

            saveTodo(task, this.todo_list_key);

            this.listTodos();
        }
    }

    listTodos() {
        renderTodoList(todoList, this.todo_list_element);
    }
}

function saveTodo(task, key) {
    todoList.push(task);

    ls.write(key, JSON.stringify(todoList));
}

function getTodos(key) {
    let list = ls.read(key);

    if(!list) {
        list = [];
    }
    else {
        list = JSON.parse(list);
    }

    return list;
}

function renderTodoList(list, element) {
    element.innerHTML = '';

    for(const index in list) {
        const li_element = util.ce('li');

        li_element.dataset.id = list[index].id;

        li_element.innerHTML = `<span class="status"><span>⬜</span><span>☑️</span></span> <span class="content">${list[index].content}</span> <span class="delete">❌</span>`;

        element.append(li_element);
    }

    util.qsa('#todos-list .delete').forEach(function(element) {
        element.addEventListener('click', function(event) {
            let parent_li = event.target.parentElement;
    
            parent_li.remove();
        });
    });
}

export {
    Todos,
    ls,
    util
}