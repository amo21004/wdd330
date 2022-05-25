import * as ls from "./ls.js";

import * as util from "./utilities.js";

class Todos {
  constructor(
    todo_list_element = "#todos-list",
    todo_add_input = "#add-text",
    todo_add_button = "#add-button",
    todo_list_key = "todos-list",
    todos_filter_count = "#tasks-count",
    todos_filter_toggle = "#todos-toggle"
  ) {
    // Storing the value of "this" in a const named "self" because the value of "this" will vary depending on where it is called from.
    // For example, the value of "this" inside an anonymous function won't point to this object
    const self = this;

    this.todo_list_element = util.qs(todo_list_element);

    this.todo_add_input = util.qs(todo_add_input);

    this.todo_add_button = util.qs(todo_add_button);

    this.todos_filter_count = util.qs(todos_filter_count);

    this.todos_filter_toggle = util.qs(todos_filter_toggle);

    this.todo_list_key = todo_list_key;

    this.display_only = "all";

    this.todoList = this.getTodos();

    this.todo_add_button.addEventListener("click", function () {
      self.addTodo();
    });

    this.todo_add_input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        self.addTodo();
      }
    });

    for (const i in Array.from(this.todos_filter_toggle.children)) {
      this.todos_filter_toggle.children[i].addEventListener(
        "click",
        function () {
          for (const j in Array.from(self.todos_filter_toggle.children)) {
            self.todos_filter_toggle.children[j].className = "";
          }

          this.className = "active";

          if (i == 1) {
            self.display_only = "active";
          } else if (i == 2) {
            self.display_only = "completed";
          } else {
            self.display_only = "all";
          }

          self.listTodos();
        }
      );
    }

    this.listTodos();
  }

  getTodos() {
    let list = ls.read(this.todo_list_key);

    if (!list) {
      list = [];
    } else {
      list = JSON.parse(list);
    }

    return list;
  }

  addTodo() {
    if (this.todo_add_input.value.trim() != "") {
      const task = {
        id: Date.now(),
        content: this.todo_add_input.value.trim(),
        completed: false,
      };

      this.todoList.push(task);

      ls.write(this.todo_list_key, JSON.stringify(this.todoList));

      this.listTodos();

      this.todo_add_input.value = "";
    } else {
      this.todo_add_input.reportValidity();
    }
  }

  listTodos() {
    const self = this;

    this.todo_list_element.innerHTML = "";

    if (this.todoList.length) {
      for (const index in this.todoList) {
        if (self.display_only == "active") {
          if (this.todoList[index].completed == 1) {
            continue;
          }
        } else if (self.display_only == "completed") {
          if (this.todoList[index].completed == 0) {
            continue;
          }
        }

        const li_element = util.ce("li");

        li_element.dataset.id = this.todoList[index].id;

        li_element.innerHTML = `<span class="status ${
          this.todoList[index].completed ? "complete" : "incomplete"
        }"><span>⬜</span><span>☑️</span></span> <span class="content ${
          this.todoList[index].completed ? "complete" : "incomplete"
        }">${
          this.todoList[index].content
        }</span> <span class="delete">❌</span>`;

        this.todo_list_element.append(li_element);
      }
    } else {
      this.todo_list_element.innerHTML =
        "<li>There are no tasks.&nbsp;<a href='#add-text'>Add</a>&nbsp;some maybe?</li>";
    }

    let active_count = 0;

    for (const index in this.todoList) {
      if (this.todoList[index].completed == 0) {
        active_count++;
      }
    }

    this.todos_filter_count.innerText = `${active_count} ${
      active_count == 1 ? "task" : "tasks"
    } left`;

    util.qsa("#todos-list .delete").forEach(function (task) {
      task.addEventListener("click", function (event) {
        const parent_li = event.target.parentElement;

        const task_id = parent_li.getAttribute("data-id");

        self.removeTodo(parent_li, task_id);
      });
    });

    util.qsa("#todos-list .status").forEach(function (task) {
      task.addEventListener("click", function (event) {
        const parent_li = event.target.parentElement;

        const grand_parent_li = parent_li.parentElement;

        const task_id = grand_parent_li.getAttribute("data-id");

        self.changeStatus(task_id);
      });
    });
  }

  removeTodo(parent_li, task_id) {
    const newtodoList = [];

    for (const index in this.todoList) {
      if (this.todoList[index].id == task_id) {
        continue;
      }

      newtodoList.push(this.todoList[index]);
    }

    parent_li.remove();

    this.todoList = newtodoList;

    ls.write(this.todo_list_key, JSON.stringify(this.todoList));

    this.listTodos();
  }

  changeStatus(task_id) {
    for (const index in this.todoList) {
      if (this.todoList[index].id == task_id) {
        if (this.todoList[index].completed == 0) {
          this.todoList[index].completed = 1;
        } else {
          this.todoList[index].completed = 0;
        }
      }
    }

    ls.write(this.todo_list_key, JSON.stringify(this.todoList));

    this.listTodos();
  }
}

export { Todos };
