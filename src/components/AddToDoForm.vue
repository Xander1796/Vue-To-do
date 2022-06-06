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
  <form action="">
    <input :value="newTodo" @input="updateValue" id="todo-input" />
    <label for="todo-input"></label>
    <button
      class="btn btn-green"
      @click.prevent="
        addTodo(newTodo);
        emptyInput();
      "
    >
      <PlusSmIcon /> Add
    </button>
  </form>
</template>
