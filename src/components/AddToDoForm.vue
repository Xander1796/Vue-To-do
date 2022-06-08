<script setup>
import { ref } from "vue";

import { PlusSmIcon } from "@heroicons/vue/solid";

const props = defineProps({
  addTodo: Function,
});

const newTodo = ref("");

const updateValue = (e) => {
  newTodo.value = e.target.value;
};

const emptyInput = () => {
  newTodo.value = "";
};
</script>

<template>
  <form class="relative items-center flex w-full md:w-[500px]" action="">
    <input
      :value="newTodo"
      @input="updateValue"
      class="peer inline-block bg-transparent text-[20px] text-slate-700 py-[8px] px-[5px] w-full h-[40px] border-0 focus:border-0 focus:outline-0 focus-visible:border-0 focus-visible:outline-0 dark:text-slate-100"
      id="todo-input"
    />
    <label
      for="todo-input"
      class="absolute left-0 top-0 rounded-[5px] border border-solid border-gray-300 w-full h-full peer-focus:border-black peer-focus-visible:border-black dark:border-slate-500 dark:peer-focus:border-slate-400 dark:peer-focus-visible:border-slate-400"
    ></label>
    <button
      class="flex items-center gap-[5px] h-[40px] m-[5px] btn bg-emerald-700 z-10 dark:bg-slate-400 dark:text-slate-900"
      @click.prevent="
        addTodo(newTodo);
        emptyInput();
      "
    >
      <PlusSmIcon class="w-[1.2em] h-[1.2em]" /> Add
    </button>
  </form>
</template>
