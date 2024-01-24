<template>
  <div>
    <h1>Customers</h1>
    <Spinner :isLoading="isLoading"/>
    <div v-if="!isLoading">
      <table>
        <thead>
          <tr>
            <th>type</th>
            <!-- <th>full</th> -->
            <th>ID</th>
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
            <td>{{ typeof customerData }}</td>
            <!-- <td>{{ customerData }}</td> -->
            <td>{{ customerData.id }}</td>
            <td>{{ customerData.firstname }}</td>
            <td>{{ customerData.lastname }}</td>
            <td>{{ customerData.email }}</td>
            <td>{{ customerData.phone }}</td>
            <td>{{ formatDate(customerData.birthdate) }}</td>
            <td class="centered-cell">
              <!-- <router-link :to="{ name: 'edit', params: { id: customerData.id}, query: { customerData: customerData } }"> -->
              <router-link :to="{ name: 'edit', params: { id: customerData.id}, query: {customerData: JSON.stringify(customerData) } }">
                <img
                  src="@/assets/icon_edit.svg"
                  alt="Edit Icon"
                  class="table-icon"
                />
              </router-link>
              <img
                @click="deleteCustomer(customerData.id)"
                src="@/assets/icon_delete.svg"
                alt="Delete Icon"
                class="table-icon"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Spinner from '@/components/Spinner.vue'

export default {
  name: "CustomersList",
  components: {
    Spinner
  },
  data () {
    return {
      isLoading: true
    }
  },
  mounted() {
    setTimeout(() => {
      if (this.customersData.length > 0) {
        this.isLoading = false;
      }
    }, 2000);
  },
  props: ["customersData"],
  methods: {
    formatDate(dateString) {
      const options = { year: "numeric", month: "2-digit" };
      return new Date(dateString).toLocaleDateString(options);
    },
    async deleteCustomer(id) {
      try {
        const response = await fetch(
          `${this.$config.serverUrl}/customers/delete/${id}`,
          {
            method: "PATCH",
          },
        );
        if (response.ok) {
          // Emit event to notify App.vs about the deletion
          this.$root.fetchCustomersData();
          console.log(`Customer with ID "${id}" deleted successfully.`);
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
