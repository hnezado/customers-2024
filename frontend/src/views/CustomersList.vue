<template>
  <div v-if="!noResponse && session.logged" class="main-container">
    <div id="customers-list">
      <div class="content-container">
        <h1>Customers list</h1>
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
                      src="media/icon_edit.svg"
                      alt="Edit Icon"
                    />
                    <img
                      @click="deleteCustomer(customerData.id)"
                      src="media/icon_delete.svg"
                      alt="Delete Icon"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- <div v-else>
            <br />
            <p>Retrieved no data</p>
            <a @click="refreshPage" class="link">Refresh</a>
          </div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomersList",
  data() {
    return {
      session: {},
      noResponse: false,
      customersData: null,
    };
  },
  mounted() {
    this.$eventBus.emit("viewActive", { view: this.$route.path });
    this.$eventBus.on("session", this.handleSession);
    const [userData, logged] = this.checkSession();
    if (logged) {
      this.updateSession(userData, logged);
      this.$eventBus.emit("loading", { status: true });
      setTimeout(() => {
        this.fetchCustomersData();
        this.$eventBus.emit("loading", { status: false });
      }, 5000);
    } else {
      this.$router.push("/login");
    }
  },
  beforeUnmount() {
    this.$eventBus.emit("loading", { status: false });
  },
  methods: {
    handleSession(status) {
      if (!status.logged) {
        this.$router.push("/login");
      }
    },
    checkSession() {
      const userData = sessionStorage.getItem("userData") || {};
      const logged = Boolean(Object.keys(userData).length);
      return [JSON.parse(userData), logged];
    },
    updateSession(userData, logged) {
      this.session.userData = userData;
      this.session.logged = logged;
    },
    async fetchCustomersData() {
      try {
        const res = await fetch(`${this.$config.serverUrl}/customers/list`);
        // const res = await fetch(`${this.$config.serverUrl}/test`);
        const data = await res.json();

        if (Array.isArray(data)) {
          if (data.length > 0) this.customersData = data;
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
