//Didn't find a use yet four router in this app. Is just for research purposes.

import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
