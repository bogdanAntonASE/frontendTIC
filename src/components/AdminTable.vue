<template>
  <div v-if="isUsers" >
    <EasyDataTable
        class="my-table"
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
        :theme-color="themeColor"
        :headers="headersAcquisitions"
        :items="itemsAcquisitions"
        :loading="loadingAcquisitions"/>
  </div>
</template>

<script>
import {ref} from "vue";
import axios from "axios";
import {useToast} from "vue-toastification";

export default {
  name: "AdminTable",
  async setup() {
    const backend = 'http://localhost:3000/api/v1';
    const isAdmin = ref(false);

    isAdmin.value = sessionStorage.getItem('isAdmin') === 'true';
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
      { text: "Brand", value: "brand"},
      { text: "Model Name", value: "modelName"},
      { text: "Manufacturing Year", value: "manufacturingYear"},
      { text: "Quantity", value: "quantity"},
      { text: "Total Price", value: "totalPrice"},
      { text: "Country", value: "country", sortable: true },
      { text: "Operations", value: "operation"}
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
            itemsUsers.value = itemsUsers.value.concat(res.data.message)
            console.log(res.data)
          }).catch((err) => {
            console.log(err);
          })
      setTimeout(() => loadingUsers.value = false, 1000)
    }
    await getUsers();

    let itemsAcquisitions = ref([]);

    const disableUser = async (item) => {
      let wasDisabled = item.isDisabled;
      loadingUsers.value = true;
      await axios.put(backend + '/users/disable', {
        email: item.email
      }, config)
          .then(async () => {

            console.log('here')
            if (wasDisabled) {
              toast.success('User has been successfully enabled');
            } else {
              toast.success('User has been successfully disabled');
            }
            itemsUsers.value = [];
            await getUsers();
          })
          .catch((err) => {

            console.log(err)
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
</style>