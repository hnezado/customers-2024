<template>
  <div v-if="!noResponse" class="main-container">
    <div id="customers-list">
      <h1>Customers list</h1>
      <div class="infoMsg">{{ infoMsg }}</div>
      <div v-if="customersData" class="table-container">
        <div
          :class="['confirm-win', { 'confirm-win-show': confirmWinEnabled }]"
        >
          <p>Are you sure you want to delete this user?</p>
          <div class="options-container">
            <button
              @click="deleteCustomer(cachedCustomerId)"
              type="button"
              class="button"
            >
              Accept
            </button>
            <button
              @click="toggleConfirmWindow(null, false)"
              type="button"
              class="button"
            >
              Cancel
            </button>
          </div>
        </div>
        <table class="table-data">
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
                  <svg
                    @click="editCustomer(customerData.id)"
                    width="20px"
                    height="20px"
                    viewBox="0 0 1000 1000"
                    aria-label="icon-edit"
                  >
                    <path
                      d="M968.161,31.839c36.456,36.456,36.396,95.547,0,132.003l-43.991,43.991L792.138,75.83l43.991-43.991
	C872.583-4.586,931.704-4.617,968.161,31.839z M308.238,559.79l-43.96,175.963l175.963-43.991l439.938-439.938L748.147,119.821
	L308.238,559.79z M746.627,473.387v402.175H124.438V253.373h402.204l124.407-124.438H0V1000h871.064V348.918L746.627,473.387z"
                    />
                  </svg>
                  <svg
                    @click="toggleConfirmWindow(customerData.id, true)"
                    width="20px"
                    height="20px"
                    viewBox="0 0 482.428 482.429"
                    aria-label="icon-delete"
                  >
                    <path
                      d="M381.163,57.799h-75.094C302.323,25.316,274.686,0,241.214,0c-33.471,0-61.104,25.315-64.85,57.799h-75.098
                    c-30.39,0-55.111,24.728-55.111,55.117v2.828c0,23.223,14.46,43.1,34.83,51.199v260.369c0,30.39,24.724,55.117,55.112,55.117
                    h210.236c30.389,0,55.111-24.729,55.111-55.117V166.944c20.369-8.1,34.83-27.977,34.83-51.199v-2.828
                    C436.274,82.527,411.551,57.799,381.163,57.799z M241.214,26.139c19.037,0,34.927,13.645,38.443,31.66h-76.879
                    C206.293,39.783,222.184,26.139,241.214,26.139z M375.305,427.312c0,15.978-13,28.979-28.973,28.979H136.096
                    c-15.973,0-28.973-13.002-28.973-28.979V170.861h268.182V427.312z M410.135,115.744c0,15.978-13,28.979-28.973,28.979H101.266
                    c-15.973,0-28.973-13.001-28.973-28.979v-2.828c0-15.978,13-28.979,28.973-28.979h279.897c15.973,0,28.973,13.001,28.973,28.979
                    V115.744z"
                    />
                    <path
                      d="M171.144,422.863c7.218,0,13.069-5.853,13.069-13.068V262.641c0-7.216-5.852-13.07-13.069-13.07
                    c-7.217,0-13.069,5.854-13.069,13.07v147.154C158.074,417.012,163.926,422.863,171.144,422.863z"
                    />
                    <path
                      d="M241.214,422.863c7.218,0,13.07-5.853,13.07-13.068V262.641c0-7.216-5.854-13.07-13.07-13.07
                    c-7.217,0-13.069,5.854-13.069,13.07v147.154C228.145,417.012,233.996,422.863,241.214,422.863z"
                    />
                    <path
                      d="M311.284,422.863c7.217,0,13.068-5.853,13.068-13.068V262.641c0-7.216-5.852-13.07-13.068-13.07
                    c-7.219,0-13.07,5.854-13.07,13.07v147.154C298.213,417.012,304.067,422.863,311.284,422.863z"
                    />
                  </svg>
                </div>
              </td>
            </tr>
            <!-- <tr>
              <td>asdfasdf</td>
              <td>
                asdfasdfasdfasdfadsfadsfadsfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfadsfadsfadsfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfadsfa
                dsfadsfasdfasdfasdfasdfasdfasdfasdfasdfasdf
              </td>
            </tr> -->
          </tbody>
        </table>
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
import "@/styles/components/CustomersList.css";
export default {
  name: "CustomersList",
  data() {
    return {
      session: {},
      noResponse: false,
      infoMsg: "",
      customersData: null,
      cachedCustomerId: null,
      confirmWinEnabled: false,
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
      }, 2000);
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

        if (Array.isArray(data) && data.length) {
          this.customersData = data;
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
    editCustomer(id) {
      this.$router.push({
        name: "edit",
        params: { id: id },
      });
    },
    toggleConfirmWindow(cachedCustomerId, opened) {
      this.cachedCustomerId = cachedCustomerId;
      this.confirmWinEnabled = opened;
      this.$eventBus.emit("togglePopup", {
        opened: opened,
      });
    },
    async deleteCustomer(id) {
      this.toggleConfirmWindow(null, false);
      try {
        const res = await fetch(
          `${this.$config.serverUrl}/customers/delete/${id}`,
          {
            method: "PATCH",
          }
        );
        if (res.ok) {
          this.infoMsg = "Customer deleted successfully";
          this.fetchCustomersData();
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
