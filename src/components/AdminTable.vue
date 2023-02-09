<template>
  <div v-if="isUsers" >
    <EasyDataTable
        class="my-table"
        table-class-name="customize-table"
        rows-per-page-message="Users per page:"
        rows-per-page="10"
        :theme-color="themeColor"
        :headers="headersUsers"
        :items="itemsUsers"
        :loading="loadingUsers">
      <template #item-operation="item">
        <div class="operation-wrapper">
          <img
              src="../assets/disable.png"
              class="operation-icon"
              title="Disable User"
              id="operation-disable"
              v-if="isAdmin"
              @click="disableUser(item)"
          />
          <img
              src="../assets/makeAdmin.png"
              class="operation-icon"
              id="operation-make-admin"
              title="Make User Admin"
              v-if="isAdmin"
              @click="makeAdmin(item)"
          />
        </div>
      </template>
    </EasyDataTable>
  </div>
  <div v-if="!isUsers">
    <EasyDataTable
        class="my-table"
        table-class-name="customize-table"
        rows-per-page-message="Acquisitions per page:"
        rows-per-page="10"
        :theme-color="themeColor"
        :headers="headersAcquisitions"
        :items="itemsAcquisitions"
        :loading="loadingAcquisitions">
      <template #expand="item">
        <div style="padding: 15px; white-space: pre-line">
          {{ item.cars }}
        </div>
      </template>
    </EasyDataTable>
  </div>
  <button type="button" v-if="isAdmin && isUsers" @click="switchIsUser" class="btn btn-danger" style="margin-top: 2%; width: 150px">Display Acquisitions</button>
  <button type="button" v-if="isAdmin && !isUsers" @click="switchIsUser" class="btn btn-danger" style="margin-top: 2%; width: 150px">Display Users</button>
</template>

<script>
import {ref} from "vue";
import axios from "axios";
import {useToast} from "vue-toastification";
import {useStore} from "vuex";

export default {
  name: "AdminTable",
  async setup() {
    const backend = 'https://tic-project.onrender.com/api/v1';
    const isAdmin = ref(false);
    const store = useStore()

    isAdmin.value = sessionStorage.getItem('isAdmin') === 'true';
    store.commit('changeIsAdmin', isAdmin.value)
    const toast = useToast();

    const themeColor = "#b9424c";
    const loadingUsers = ref(false);
    const loadingAcquisitions = ref(false);

    const headersUsers = [
      { text: "Full Name", value: "fullname", sortable: true },
      { text: "Admin", value: "isAdmin", sortable: true },
      { text: "Disabled", value: "isDisabled", sortable: true },
      { text: "Email", value: "email", sortable: true },
      { text: "Country", value: "country", sortable: true },
      { text: "Operations", value: "operation"}
    ];

    let isUsers = ref(true);
    let itemsUsers = ref([]);

    const headersAcquisitions = [
      { text: "Full Name", value: "fullname", sortable: true },
      { text: "Email", value: "email", sortable: true },
      { text: "Total Price (€)", value: "totalPrice"},
      { text: "Acquisition Date", value: "date", sortable: true}
    ];

    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const config = {
      headers: {
        'Authorization': 'Bearer ' + getCookie('jwtToken')
      }
    }

    const getUsers = async () => {
      loadingUsers.value = true
      await axios.get(backend + '/users', config)
          .then((res) => {
            itemsUsers.value = res.data.message
          }).catch((err) => {
            toast.error(err.response.data.message)
          })
      setTimeout(() => loadingUsers.value = false, 1000)
    }
    await getUsers();

    const getAcquisitions = async () => {
      loadingAcquisitions.value = true
      await axios.get(backend + '/acquisitions', config)
          .then((res) => {
            const answer = res.data.message
            for (let acquisition of answer) {
              let carsString = '';
              for (let car of acquisition.cars) {
                carsString += car.brand + " "
                    + car.modelName + ", "
                    + "Year: " + car.manufacturingYear + ", "
                    + "Model: " + car.modelName + ", "
                    + "Price: " + car.price + "€, "
                    + "Quantity: " + car.quantity + "\n\n";
              }
              const innerAcquisition = {
                fullname: acquisition.fullname,
                email: acquisition.email,
                totalPrice: acquisition.price,
                date: acquisition.date,
                cars: carsString
              }
              itemsAcquisitions.value = itemsAcquisitions.value.concat(innerAcquisition);
            }
          }).catch((err) => {
            toast.error(err.response.data.message)
          })

      setTimeout(() => loadingAcquisitions.value = false, 1000);
    }

    let itemsAcquisitions = ref([]);

    const disableUser = async (item) => {
      let wasDisabled = item.isDisabled;
      loadingUsers.value = true;
      await axios.put(backend + '/users/disable', {
        email: item.email
      }, config)
          .then(async () => {

            if (wasDisabled) {
              toast.success('User has been successfully enabled');
            } else {
              toast.success('User has been successfully disabled');
            }
            itemsUsers.value = [];
            await getUsers();
          })
          .catch((err) => {
            toast.error(err.response.data.message)
          })
      loadingUsers.value = false
    }

    const makeAdmin = async (item) => {
      let wasAdmin = item.isAdmin;
      loadingUsers.value = true;
      await axios.put(backend + '/users/admin', {
        email: item.email
      }, config)
          .then(async () => {
            if (wasAdmin) {
              toast.success('The user is not an admin anymore');
            } else {
              toast.success('The user is now an admin');
            }
            itemsUsers.value = [];
            await getUsers();
          })
          .catch(() => {

          })
      loadingUsers.value = false;
    }

    const switchIsUser = async () => {
      isUsers.value = !isUsers.value
      if (isUsers.value) {
        await getUsers();
      } else {
        await getAcquisitions();
      }
    }

    return {
      headersUsers,
      headersAcquisitions,
      itemsUsers,
      itemsAcquisitions,
      isUsers,
      themeColor,
      loadingUsers,
      loadingAcquisitions,
      isAdmin,
      switchIsUser,
      disableUser,
      makeAdmin
    }
  }
}
</script>

<style scoped>
.my-table {
  width: 55%;
  margin: 0 auto;
}

#operation-disable {
  zoom: 15%;
}

#operation-make-admin {
  zoom: 5%;
}

.operation-icon:hover {
  filter: invert(38%) sepia(19%) saturate(2693%) hue-rotate(312deg) brightness(85%) contrast(90%);
  transition: 0.3s ease-out;
}

.customize-table {
  --easy-table-body-row-hover-background-color: rgba(240,128,128);
  --easy-table-header-background-color: rgba(185, 66, 76, 0.91);
}
</style>