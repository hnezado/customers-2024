import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import SignUp from "@/views/Signup.vue";
import Login from "@/views/Login.vue";
import Profile from "@/views/Profile.vue";
import Locations from "@/views/Locations.vue";
import Contact from "@/views/Contact.vue";
import Catalog from "@/views/Catalog.vue";
import CustomersList from "@/views/CustomersList.vue";
import CustomerEdit from "@/views/CustomerEdit.vue";

const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/signup", name: "signup", component: SignUp },
  { path: "/login", name: "login", component: Login },
  { path: "/profile", name: "profile", component: Profile },
  { path: "/locations", name: "locations", component: Locations },
  { path: "/contact", name: "contact", component: Contact },
  { path: "/catalog", name: "catalog", component: Catalog },
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
