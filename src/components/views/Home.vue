<script setup>
import { ref, computed, onMounted } from "vue";
//components
import AddToDoForm from "../AddToDoForm.vue";
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
    alert("Don't leave it empty, add something to do");
    return;
  }
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
  <div
    v-if="isEditing"
    class="overlay fixed left-0 top-0 w-[100%] h-[100%] bg-black opacity-30 z-40"
  ></div>
  <h1 class="text-[30px] font-bold">Vue To Do App</h1>
  <AddToDoForm :addTodo="addTodo" />
  <h2 v-if="todos.length === 0" class="text-[24px] font-bold">
    There is nothing to do :)
  </h2>

  <ul class="list-none w-[inherit]">
    <li
      v-for="todo in visibleTodos"
      :key="todo.id"
      class="flex flex-wrap items-center justify-center text-[20px] text-center gap-[20px] w-[inherit] mb-[15px] last-of-type:mb-0"
    >
      <div class="relative flex flex-col">
        <div
          :class="{
            'line-through': todo.isChecked,
            'bg-white z-50': todo.isEditing,
          }"
          class="to-do-content inline-block break-all p-[12px] rounded-md border-[2px] border-transparent outline-0 focus:border-blue-400 focus-visible:border-blue-400"
          :contenteditable="todo.isEditing"
        >
          {{ todo.content }}
        </div>
        <button
          v-if="todo.isEditing"
          @click="(e) => handleEditing(e, todo)"
          class="btn absolute left-0 bottom-[-110%] w-fit bg-blue-600 z-50"
        >
          <PencilAltIcon />
          Edit
        </button>
      </div>
      <div
        class="flex items-center gap-[5px] border-[1px] border-slate-200 border-solid rounded-[5px] p-[2px]"
      >
        <label
          :class="{ 'bg-blue-100 hover:!bg-blue-100': todo.isChecked }"
          class="todo-action-btn relative grid place-content-center w-[33px] h-[33px] rounded-[5px] border-0 font-[20px] cursor-pointer bg-none duration-200 transition-all ease hover:bg-gray-100"
          :for="`todo-checkbox-${todo.id}`"
          title="completed"
          ><CheckIcon
        /></label>
        <input
          :id="`todo-checkbox-${todo.id}`"
          class="absolute invisible"
          v-model="todo.isChecked"
          @change="checkTodo"
          type="checkbox"
        />
        <button
          class="relative grid place-content-center w-[33px] h-[33px] rounded-[5px] border-0 font-[20px] cursor-pointer bg-none duration-200 transition-all ease hover:bg-gray-100"
          @click="(e) => openEditing(e, todo)"
          data-name="edit"
          title="edit"
        >
          <PencilAltIcon />
        </button>
        <button
          class="todo-action-btn relative grid place-content-center w-[33px] h-[33px] rounded-[5px] border-0 font-[20px] cursor-pointer bg-none duration-200 transition-all ease hover:bg-gray-100"
          @click="deleteTodo(todo)"
          title="delete"
        >
          <TrashIcon />
        </button>
      </div>
    </li>
  </ul>

  <div class="flex flex-wrap gap-[10px]">
    <button
      class="btn bg-red-50 text-red-600"
      v-if="todos.some((item) => item.isChecked) && hideChecked"
      @click="deleteCompletedTodos"
    >
      Delete completed
    </button>

    <button
      class="btn bg-blue-50 text-sky-700"
      v-if="todos.some((item) => item.isChecked)"
      @click="hideChecked = !hideChecked"
    >
      {{ hideChecked ? "Hide completed" : "Show completed" }}
    </button>
  </div>
</template>
