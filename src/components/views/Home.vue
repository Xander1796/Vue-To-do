<script setup>
import { ref, computed, onMounted } from "vue";
//components
import AddToDoForm from "../AddToDoForm.vue";
//icons
import { TrashIcon } from "@heroicons/vue/solid";
import { CheckIcon } from "@heroicons/vue/outline";
import { PencilAltIcon } from "@heroicons/vue/solid";
import { SunIcon } from "@heroicons/vue/solid";
import { MoonIcon } from "@heroicons/vue/solid";

let todoId = 1;
let isEditing = ref(false);

let todos = ref([]);
let hideChecked = ref("false");
let isDarkModeOn = ref(false);

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

  if (localStorage?.getItem("todosDarkMode")) {
    const getDarkModeValue = JSON.parse(localStorage.getItem("todosDarkMode"));
    isDarkModeOn.value = getDarkModeValue;
    if (getDarkModeValue === true)
      document.documentElement.classList.add("dark");
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
const toggleDarkMode = () => {
  document.documentElement.classList.toggle("dark");
  isDarkModeOn.value = !isDarkModeOn.value;
  localStorage.setItem("todosDarkMode", JSON.stringify(isDarkModeOn.value));
};
</script>

<template>
  <nav class="flex justify-end w-full md:w-[500px]">
    <button
      @click="toggleDarkMode"
      class="p-[3px] rounded-full border w-[60px] bg-emerald-200 dark:bg-slate-500 dark:border-slate-700"
    >
      <span
        :class="{ 'translate-x-[26px]': isDarkModeOn }"
        class="relative grid place-content-center text-[17px] w-[26px] h-[26px] rounded-[50%] bg-emerald-700 text-white transition-transform duration-200 ease dark:bg-slate-300 dark:text-slate-900"
      >
        <MoonIcon v-if="isDarkModeOn" />
        <SunIcon v-else />
      </span>
    </button>
  </nav>
  <div
    v-if="isEditing"
    class="overlay fixed left-0 top-0 w-[100%] h-[100%] bg-black opacity-40 z-40"
  ></div>
  <h1 class="text-[30px] text-slate-700 font-bold dark:text-slate-100">
    Vue To Do App
  </h1>
  <AddToDoForm :addTodo="addTodo" />
  <h2
    v-if="todos.length === 0"
    class="text-[24px] text-slate-700 font-bold dark:text-slate-100"
  >
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
            'bg-white z-50 dark:bg-slate-600': todo.isEditing,
          }"
          class="to-do-content inline-block text-slate-700 break-all p-[12px] rounded-md border-[2px] border-transparent outline-0 focus:border-blue-400 focus-visible:border-blue-400 dark:text-slate-100"
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
        class="flex items-center gap-[5px] border-[1px] border-slate-200 border-solid rounded-[5px] p-[2px] dark:border-slate-500"
      >
        <label
          :class="{
            'bg-blue-100 hover:!bg-blue-100 dark:bg-slate-400 dark:hover:!bg-slate-400 dark:!text-slate-900':
              todo.isChecked,
          }"
          class="todo-action-btn relative grid place-content-center text-slate-700 w-[33px] h-[33px] rounded-[5px] border-0 font-[20px] cursor-pointer bg-none duration-200 transition-all ease hover:bg-gray-100 dark:text-slate-100 dark:hover:bg-slate-700"
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
          class="relative grid place-content-center text-slate-700 w-[33px] h-[33px] rounded-[5px] border-0 font-[20px] cursor-pointer bg-none duration-200 transition-all ease hover:bg-gray-100 dark:text-slate-100 dark:hover:bg-slate-700"
          @click="(e) => openEditing(e, todo)"
          data-name="edit"
          title="edit"
        >
          <PencilAltIcon />
        </button>
        <button
          class="todo-action-btn relative grid place-content-center text-slate-700 w-[33px] h-[33px] rounded-[5px] border-0 font-[20px] cursor-pointer bg-none duration-200 transition-all ease hover:bg-gray-100 dark:text-slate-100 dark:hover:bg-slate-700"
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
      class="btn bg-red-50 text-red-600 dark:bg-red-500 dark:text-white"
      v-if="todos.some((item) => item.isChecked) && hideChecked"
      @click="deleteCompletedTodos"
    >
      Delete completed
    </button>

    <button
      class="btn bg-blue-50 text-sky-700 dark:bg-blue-300 dark:text-sky-900"
      v-if="todos.some((item) => item.isChecked)"
      @click="hideChecked = !hideChecked"
    >
      {{ hideChecked ? "Hide completed" : "Show completed" }}
    </button>
  </div>
</template>
