<template>
  <Spinner :isLoading="isLoading" />
  <div class="main-container">
    <div v-if="!isLoading && !editedOkMsg">
      <h1>Edit Customer</h1>
      <div class="table-container">
        <table class="table">
          <tbody>
            <tr v-for="key in editableKeys" :key="key">
              <td>
                <label :for="key">{{
                  key.replace(/^[a-z]/, (match) => match.toUpperCase())
                }}</label>
              </td>
              <td>
                <input
                  v-model="customerData[key]"
                  :type="
                    typeof customerData[key] === 'number' ? 'number' : 'text'
                  "
                  :id="key"
                  required
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div class="button-container">
          <button class="button" @click="saveEdit(this.customerData.id)">
            Save
          </button>
          <button class="button" @click="cancelEdit">Cancel</button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="editedOkMsg" class="info">
    <p>Data updated Successfully</p>
    <p>{{ editedOkMsg }}</p>
  </div>
  <div></div>
</template>

<script>
import Spinner from "@/components/Spinner.vue";
import "@/styles/components/CustomerEdit.css";

export default {
  name: "CustomerEdit",
  components: {
    Spinner,
  },
  data() {
    return {
      customerData: undefined,
      isLoading: true,
      editableKeys: ["firstname", "lastname", "email", "birthdate", "phone"],
      editedOkMsg: "",
    };
  },
  // Mounted es asíncrono así que si en template se intenta acceder a un
  // atributo de customerData, puede que éste sea undefined y de error
  mounted() {
    // setTimeout(() => {
    //   this.customerData = JSON.parse(this.$route.query.customerData);
    //   this.isLoading = false;
    // }, 500);
    this.$nextTick(() => {
      this.customerData = JSON.parse(this.$route.query.customerData);
      this.checkLoading();
    });
  },
  methods: {
    checkLoading() {
      this.isLoading = !(
        this.customerData && Object.keys(this.customerData).length
      );
    },
    handleInputChange(propertyName) {
      console.log(`Input value: ${this.customerData[propertyName]}`);
    },
    async saveEdit(id) {
      try {
        const res = await fetch(
          `${this.$config.serverUrl}/customers/edit/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(this.customerData),
          }
        );
        if (res.ok) {
          // console.log(`Customer with id ${id} updated successfully.`);
          this.redirectToList();
        } else {
          console.error(`Failed to update customer with id ${id}.`);
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
