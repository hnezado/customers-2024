import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import SignUp from "@/views/Signup.vue";
import Login from "@/views/Login.vue";
import Profile from "@/views/Profile.vue";
import About from "@/views/About.vue";
import Contact from "@/views/Contact.vue";
import CustomersList from "@/views/CustomersList.vue";
import CustomerEdit from "@/views/CustomerEdit.vue";

const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/signup", name: "signup", component: SignUp },
  { path: "/login", name: "login", component: Login },
  { path: "/profile", name: "profile", component: Profile },
  { path: "/about", name: "about", component: About },
  { path: "/contact", name: "contact", component: Contact },
  { path: "/customers/list", name: "customers-list", component: CustomersList },
  {
    path: "/edit/:id",
    name: "edit",
    component: CustomerEdit,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
