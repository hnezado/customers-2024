<template>
  <div>
    <div v-if="customerData === null">
      <Spinner :isLoading="customerData === null" />
    </div>
    <div v-else>
      <h2>Edit Customer</h2>
      <label for="firstname">First Name:</label>
      <input
        v-model="customerData.firstname"
        type="text"
        id="firstname"
        required
      />
      <button @click="saveEdit(this.customerData.id)">Save</button>
      <button @click="cancelEdit">Cancel</button>
    </div>
  </div>
</template>

<script>
import Spinner from '@/components/Spinner.vue'

export default {
  name: "CustomerEdit",
  components: {
    Spinner
  },
  data () {
    return {
      customerData: null
    }
  },
  // Mounted es asíncrono así que si en template se intenta acceder a un 
  // atributo de customerData, puede que éste sea null y de error
  mounted() {
    // TODO remove timeout y activar nextTick
    setTimeout(() => {
      this.customerData = JSON.parse(this.$route.query.customerData)
    }, 2000)
    // this.$nextTick(() => {
    //   this.customerData = JSON.parse(this.$route.query.customerData)
    //   console.log("CUSTOMERDATA!:", this.customerData)
    // })
  },
  methods: {
    async saveEdit(id) {
      try {
        const response = await fetch(
          `${this.$config.serverUrl}/customers/edit/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(this.editedCustomer)
          },
        );
        console.log(response);
        if (response.ok) {
          // Si la actualización fue exitosa, redirige a la lista de clientes
          this.$router.push("/customers");
          console.log(`Customer with id ${id} updated successfully.`);
        } else {
          // Si la actualización falló, muestra un mensaje de error
          console.error(`Failed to update customer with id ${id}.`);
        }
      } catch (error) {
        console.error("Error updating customer", error);
      }
    },
    cancelEdit() {
      this.$router.push("/customers");
    },
  },
};
</script>
