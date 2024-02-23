<template>
  <div v-if="!noResponse" class="main-container">
    <div v-if="customerData && !editedOkMsg" id="customer-edit">
      <div class="edit-card">
        <h1>Edit Customer</h1>
        <hr />
        <form @submit.prevent="saveEdit(customerData.id)">
          <div class="label-input-groups">
            <label for="firstname">Firstname: </label>
            <input
              type="text"
              id="firstname"
              v-model="customerData.firstname"
              required
            />
            <label for="lastname">Lastname: </label>
            <input
              type="text"
              id="lastname"
              v-model="customerData.lastname"
              required
            />
            <label for="email">Email: </label>
            <input
              type="text"
              id="email"
              v-model="customerData.email"
              required
            />
            <label for="birthdate">Birthdate: </label>
            <input
              type="text"
              id="birthdate"
              v-model="customerData.birthdate"
              required
            />
            <label for="phone">Phone number: </label>
            <input
              type="text"
              id="phone"
              v-model="customerData.phone"
              required
            />
          </div>
          <button class="button" type="submit">Save</button>
          <button class="button" @click="cancelEdit">Cancel</button>
        </form>
      </div>
    </div>
    <div v-if="editedOkMsg" class="infoMsg">
      <p>Data updated Successfully</p>
      <p>{{ editedOkMsg }}</p>
    </div>
  </div>
  <div></div>
</template>

<script>
import "@/styles/components/CustomerEdit.css";
export default {
  name: "CustomerEdit",
  data() {
    return {
      noResponse: false,
      customerData: {},
      editedOkMsg: "",
    };
  },
  // Mounted es asíncrono así que si en template se intenta acceder a un
  // atributo de customerData, puede que éste sea undefined y de error, por eso usamos nextTick()
  mounted() {
    this.$eventBus.emit("loading", { status: true });
    this.$eventBus.emit("noResponse", { status: false });
    setTimeout(async () => {
      await this.fetchCustomerData(this.$route.params.id);
      this.$eventBus.emit("loading", { status: false });
    }, 1000);
    // this.$nextTick(() => {
    //   this.customerData = JSON.parse(this.$route.query.customerData);
    // });
  },
  methods: {
    async fetchCustomerData(id) {
      try {
        const res = await fetch(`${this.$config.serverUrl}/customer/${id}`);
        const data = await res.json();
        if (Array.isArray(data) && data.length && Object.keys(data[0]).length) {
          this.customerData = data[0];
        } else {
          this.noResponse = true;
          this.$eventBus.emit("noResponse", {
            status: true,
            pageName: this.$options.name,
            path: this.$route.path,
          });
        }
      } catch (error) {
        console.error("Error fetching data from server", error);
      }
    },
    async saveEdit(id) {
      try {
        const res = await fetch(
          `${this.$config.serverUrl}/customer/edit/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(this.customerData),
          }
        );
        if (res.ok) {
          this.redirectToList();
        } else {
          console.log("no response?");
          this.noResponse = true;
          this.$eventBus.emit("noResponse", {
            status: true,
            pageName: this.$options.name,
            path: this.$route.path,
          });
          // console.error(`Failed to update customer with id ${id}.`);
        }
      } catch (error) {
        console.error("Error updating customer", error);
      }
    },
    cancelEdit() {
      this.$router.push("/customers/list");
    },
    redirectToList() {
      this.editedOkMsg = "Redirecting in 3s...";
      let countdown = 3;
      const countdownInterval = setInterval(() => {
        countdown -= 1;
        console.log("editedOkMsg:", this.editedOkMsg);
        this.editedOkMsg = `Redirecting in ${countdown}s...`;
        if (countdown <= 0) {
          clearInterval(countdownInterval);
          this.$router.push("/customers/list");
        }
      }, 1000);
    },
  },
};
</script>
