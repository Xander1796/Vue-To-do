<script setup>
import { ref, computed, onMounted } from "vue";
//components
import AddToDoForm from "./components/AddToDoForm.vue";
//icons
import { TrashIcon } from "@heroicons/vue/solid";
import { CheckIcon } from "@heroicons/vue/outline";
import { PencilAltIcon } from "@heroicons/vue/solid";

let todoId = 1;
let isEditing = ref(false);

let todos = ref([]);
let hideChecked = ref("false");

onMounted(() => {
  if (localStorage?.getItem("todos")) {
    let localStorageTodos = JSON.parse(localStorage.getItem("todos"));

    if (localStorageTodos.length > 0) {
      localStorageTodos = localStorageTodos.map((item) => {
        return { ...item, isEditing: false };
      });
      todoId = Math.max(...localStorageTodos.map((item) => item.id)) + 1;
    }
    todos.value = localStorageTodos;
  } else {
    localStorage.setItem("todos", []);
  }
});

const updateLocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todos.value));
};

const visibleTodos = computed(() => {
  return hideChecked.value
    ? todos.value
    : todos.value.filter((item) => !item.isChecked);
});

const addTodo = (newTodo) => {
  if (!newTodo.trim()) {
    alert("Don't leave it empty, add something to do")
    return;
  };
  todos.value.push({
    id: todoId++,
    content: newTodo,
    isChecked: false,
    isEditing: false,
  });

  updateLocalStorage();
};

const deleteTodo = (todo) => {
  todos.value = todos.value.filter((item) => item.id !== todo.id);

  updateLocalStorage();
};

const deleteCompletedTodos = () => {
  todos.value = todos.value.filter((item) => !item.isChecked);

  updateLocalStorage();
};

const openEditing = (e, todo) => {
  todo.isEditing = true;
  isEditing.value = !isEditing.value;
  setTimeout(() => {
    e.target.closest("li").querySelector(".to-do-content").focus();
  }, 0);
};

const handleEditing = (e, todo) => {
  const targetedToDo = e.target.parentElement.querySelector(".to-do-content");
  todo.isEditing = false;
  todo.content = targetedToDo.textContent;
  isEditing.value = false;

  if (targetedToDo.textContent.length === 0) {
    deleteTodo(todo);
  }

  updateLocalStorage();
};
</script>

<template>
  <div v-if="isEditing" class="overlay"></div>
  <h1>Vue To Do App</h1>
  <AddToDoForm
    :addTodo="addTodo"
  />
  <h2 v-if="todos.length === 0">There is nothing to do :)</h2>

  <ul>
    <li v-for="todo in visibleTodos" :key="todo.id">
      <div class="to-do-content-wrapper">
        <div
          :class="{ completed: todo.isChecked, editing: todo.isEditing }"
          class="to-do-content"
          :contenteditable="todo.isEditing"
        >
          {{ todo.content }}
        </div>
        <button
          v-if="todo.isEditing"
          @click="(e) => handleEditing(e, todo)"
          class="btn"
        >
          <PencilAltIcon />
          Edit
        </button>
      </div>
      <div class="todo-btn-wrapper">
        <label
          :class="{ active: todo.isChecked }"
          class="todo-action-btn"
          :for="`todo-checkbox-${todo.id}`"
          data-name="completed"
          ><CheckIcon
        /></label>
        <input
          :id="`todo-checkbox-${todo.id}`"
          v-model="todo.isChecked"
          @change="checkTodo"
          type="checkbox"
        />
        <button
          class="todo-action-btn"
          @click="(e) => openEditing(e, todo)"
          data-name="edit"
        >
          <PencilAltIcon />
        </button>
        <button
          class="todo-action-btn"
          @click="deleteTodo(todo)"
          data-name="delete"
        >
          <TrashIcon />
        </button>
      </div>
    </li>
  </ul>

  <div class="actions-buttons-wrapper">
    <button
      class="btn btn-red delete-checked-todos"
      v-if="todos.some((item) => item.isChecked) && hideChecked"
      @click="deleteCompletedTodos"
    >
      Delete completed
    </button>

    <button
      class="btn btn-blue"
      v-if="todos.some((item) => item.isChecked)"
      @click="hideChecked = !hideChecked"
    >
      {{ hideChecked ? "Hide completed" : "Show completed" }}
    </button>
  </div>
</template>

<style>
* {
  font-family: "Montserrat", sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
  padding: 20px;
  margin: 20px auto 0 auto;
}

.overlay {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 40;
}

svg {
  width: 1em;
  height: 1em;
}

.btn {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #fff;
  font-size: 17px;
  font-weight: 600;
  padding: 12px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

.btn-green {
  background: #00784c;
}

.btn-red {
  background: #fff0f0;
  color: #8f5353;
}

.btn-blue {
  background: #f1f1ff;
  color: #4747ab;
}

.todo-action-btn {
  position: relative;
  display: grid;
  place-content: center;
  width: 33px;
  height: 33px;
  border-radius: 5px;
  border: none;
  font-size: 20px;
  cursor: pointer;
  background: none;
  transition: 0.2s ease background-color;
}

.todo-action-btn::after {
  content: attr(data-name);
  position: absolute;
  left: 50%;
  bottom: -110%;
  transform: translateX(-50%);
  background: white;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #dbdbdb;
  font-weight: 600;
  font-size: 14px;
  opacity: 0;
  z-index: 60;
  pointer-events: none;
}

.todo-action-btn:hover::after {
  opacity: 1;
}

.todo-action-btn.active {
  background: #e7e7ff;
  color: #4747ab;
}

.todo-action-btn:not(.active):hover {
  background: #eff0f1;
}

.delete-checked-todos {
  width: fit-content;
}

form {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

form input {
  display: inline-block;
  font-size: 20px;
  padding: 8px 5px;
  width: 100%;
  height: 40px;
  border: none;
  background: none;
}

form input:focus,
form input:focus-visible {
  border: none;
  outline: none;
}

form input:focus + label,
form input:focus-visible + label {
  border-color: black;
}

form label {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  border: 1px solid #d7d7d7;
  z-index: -1;
}

input[type="checkbox"] {
  position: absolute;
  visibility: hidden;
}

form button {
  display: flex;
  align-items: center;
  gap: 5px;
  height: 40px;
  margin: 5px;
}

form button svg {
  width: 1.2em;
  height: 1.2em;
}

ul {
  list-style-type: none;
  width: inherit;
}

li {
  font-size: 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 20px;
  width: inherit;
}

li:not(:last-of-type) {
  margin-bottom: 15px;
}

li .todo-btn-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #d7d7d7;
  border-radius: 5px;
  padding: 2px;
  gap: 3px;
}

.to-do-content-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
}

.to-do-content.editing {
  z-index: 50;
}

.to-do-content-wrapper button {
  position: absolute;
  left: 0;
  bottom: -110%;
  width: fit-content;
  background: #3273d5;
  z-index: 50;
}

.to-do-content {
  display: inline-block;
  overflow-wrap: anywhere;
  padding: 12px;
  border-radius: 5px;
  border: 2px solid transparent;
  outline: none;
}

.to-do-content:focus,
.to-do-content:focus-visible {
  border-color: rgb(111, 169, 255);
}

.to-do-content.editing {
  background: #fff;
}

.completed {
  text-decoration: line-through;
}

.actions-buttons-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

@media (min-width: 800px) {
  #app {
    width: 50rem;
    padding: 0;
  }

  form {
    width: 500px;
  }
}
</style>
