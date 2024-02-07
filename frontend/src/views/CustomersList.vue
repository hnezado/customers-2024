<template>
  <NoResponse :noResponse="noResponse" :pageName="pageName" :path="path" />
  <Spinner :isLoading="isLoading" />
  <div class="main-container">
    <div v-if="!isLoading && !noResponse">
      <h1>Customers</h1>
      <div class="table-container">
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
import NoResponse from "@/components/NoResponse.vue";
import Spinner from "@/components/Spinner.vue";

export default {
  name: "CustomersList",
  components: {
    NoResponse,
    Spinner,
  },
  data() {
    return {
      noResponse: false,
      isLoading: true,
      pageName: this.$options.name,
      path: this.$route.path,
      customersData: [],
    };
  },
  async mounted() {
    await this.fetchCustomersData();
    setTimeout(() => {
      if (this.customersData.length > 0) {
        this.noResponse = false;
        this.isLoading = false;
      } else {
        this.noResponse = true;
        this.isLoading = false;
      }
    }, 1000);
  },
  methods: {
    async fetchCustomersData() {
      try {
        const res = await fetch(`${this.$config.serverUrl}/customers/list`);
        this.customersData = await res.json();
      } catch (error) {
        console.error("Error fetching data from server", error);
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
