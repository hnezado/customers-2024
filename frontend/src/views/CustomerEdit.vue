<template>
  <div>
    <Spinner :isLoading="isLoading" />
    <div v-if="!isLoading">
      <h2>Edit Customer</h2>
      <label for="firstname">First Name:</label>
      <input
        v-model="customerData.firstname"
        type="text"
        id="firstname"
        required
        @input="handleInputChange('firstname')"
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
      customerData: null,
      isLoading: true
    }
  },
  // Mounted es asíncrono así que si en template se intenta acceder a un 
  // atributo de customerData, puede que éste sea null y de error
  mounted() {
    // TODO remove timeout y activar nextTick
    setTimeout(() => {
      this.customerData = JSON.parse(this.$route.query.customerData)
      this.isLoading = false
    }, 500)
    // this.$nextTick(() => {
    //   this.customerData = JSON.parse(this.$route.query.customerData)
    // })
  },
  methods: {
    handleInputChange(propertyName) {
      console.log(`Input value: ${this.customerData[propertyName]}`)
    },
    async saveEdit(id) {
      // const updatedData = JSON.stringify(this.customerData)
      // console.log(`updatedData: ${updatedData}`)
      try {
        const response = await fetch(
          `${this.$config.serverUrl}/customers/edit/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: this.customerData
          },
        );
        console.log(response);
        if (response.ok) {
          // Si se actualiza correctamente, redirigirá a la lista de clientes
          this.$router.push("/customers");
          console.log(`Customer with id ${id} updated successfully.`);
        } else {
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
