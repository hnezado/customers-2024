<template>
  <div v-if="!noResponse" class="main-container">
    <div>
      <h1>Customers list</h1>
      <div v-if="noData">
        <br />
        <p>Retrieved no data</p>
        <a @click="refreshPage" class="link">Refresh</a>
      </div>
      <div v-if="customersData" class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Birthdate</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="customerData in customersData" :key="customerData.id">
              <td>{{ customerData.firstname }}</td>
              <td>{{ customerData.lastname }}</td>
              <td>{{ customerData.email }}</td>
              <td>{{ customerData.phone }}</td>
              <td>{{ customerData.birthdate }}</td>
              <td>
                <div class="table-actions">
                  <img
                    @click="editCustomer(customerData.id, customerData)"
                    src="@/assets/icon_edit.svg"
                    alt="Edit Icon"
                  />
                  <img
                    @click="deleteCustomer(customerData.id)"
                    src="@/assets/icon_delete.svg"
                    alt="Delete Icon"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomersList",
  data() {
    return {
      noResponse: false,
      noData: false,
      customersData: null,
    };
  },
  mounted() {
    this.$eventBus.emit("loading", { status: true });
    this.$eventBus.emit("noResponse", { status: false });
    this.fetchCustomersData();
  },
  methods: {
    async fetchCustomersData() {
      try {
        const res = await fetch(`${this.$config.serverUrl}/customers/list`);
        // const res = await fetch(`${this.$config.serverUrl}/test`);
        const data = await res.json();
        setTimeout(() => {
          if (Array.isArray(data)) {
            if (data.length > 0) {
              this.customersData = data;
            } else {
              this.noData = true;
            }
          } else {
            this.noResponse = true;
            this.$eventBus.emit("noResponse", {
              status: true,
              pageName: this.$options.name,
              path: this.$route.path,
            });
          }
          this.$eventBus.emit("loading", { status: false });
        }, 5000);
      } catch (error) {
        console.error("Error fetching data from server", error);
      }
    },
    refreshPage() {
      if (typeof window !== "undefined") {
        window.location.reload();
      } else {
        console.error("The page cannot refresh");
      }
    },
    editCustomer(id, customerData) {
      this.$router.push({
        name: "edit",
        params: { id: id },
        query: { customerData: JSON.stringify(customerData) },
      });
    },
    async deleteCustomer(id) {
      try {
        const res = await fetch(
          `${this.$config.serverUrl}/customers/delete/${id}`,
          {
            method: "PATCH",
          }
        );
        if (res.ok) {
          // Emit event to notify App.vs about the deletion
          this.fetchCustomersData();
          // console.log(`Customer with ID "${id}" deleted successfully.`);
        } else {
          console.error(`Failed to delete customer with ID "${id}".`);
        }
      } catch (error) {
        console.error("Error deleting customer.", error);
      }
    },
  },
};
</script>
