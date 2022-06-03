<script setup>
import { ref, computed, onMounted } from "vue";

let newTodo = ref("");
let todoId = 1;

let todos = ref([]);
let hideChecked = ref("false");

onMounted(() => {
  if (localStorage?.getItem("todos")) {
    const localStorageTodos = JSON.parse(localStorage.getItem("todos"));
    todos.value = localStorageTodos;

    if (localStorageTodos.length > 0) {
      todoId = Math.max(...localStorageTodos.map((item) => item.id)) + 1;
    }
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

const addTodo = () => {
  if (!newTodo.value.trim()) return;
  todos.value.push({ id: todoId++, content: newTodo.value, isChecked: false });
  newTodo.value = "";

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
</script>

<template>
  <h1>Vue To Do App</h1>
  <form action="">
    <input v-model="newTodo" />
    <button class="btn btn-green" @click.prevent="addTodo">Add</button>
  </form>

  <h2 v-if="todos.length === 0">There is nothing to do :)</h2>

  <ul>
    <li v-for="todo in visibleTodos" :key="todo.id">
      <span :class="{ checked: todo.isChecked }" class="to-do-content">{{
        todo.content
      }}</span>
      <button class="btn btn-red" @click="deleteTodo(todo)">Delete</button>
      <input v-model="todo.isChecked" @change="checkTodo" type="checkbox" />
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

.btn {
  color: #fff;
  font-size: 17px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

.btn-green {
  background: #00784c;
}

.btn-red {
  background: #ffe2e2;
  color: #8f5353;
}

.btn-blue {
  background: #d6d6ff;
  color: #4747ab;
}

.delete-checked-todos {
  width: fit-content;
}

form {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 40px;
  width: 100%;
}

form input {
  display: inline-block;
  font-size: 20px;
  padding: 8px 5px;
  width: 100%;
  height: 100%;
}

input[type="checkbox"] {
  width: 20px;
  height: 20px;
}

form button {
  height: 100%;
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
  gap: 10px;
  width: inherit;
}

li:not(:last-of-type) {
  margin-bottom: 15px;
}

.to-do-content {
  display: inline-block;
  overflow-wrap: anywhere;
}

.checked {
  text-decoration: line-through;
  text-decoration-color: white;
  background: #d3d3d3;
  padding: 5px 12px;
  border-radius: 5px;
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
