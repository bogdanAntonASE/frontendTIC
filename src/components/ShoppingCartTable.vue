<template>
  <div>
    <EasyDataTable
        id="myTable"
        show-index
        table-class-name="customize-table"
        hide-footer="false"
        :theme-color="themeColor"
        :headers="headers"
        :items="items"
        :loading="loading">
      <template #item-operation="item">
        <div class="operation-wrapper">
          <img
              id="delete-icon"
              src="../assets/delete.png"
              class="operation-icon"
              @click="deleteItem(item)"
          />
        </div>
      </template>
    </EasyDataTable>

    <button type="button" @click="buyCars" class="btn btn-danger" style="margin-top: 2%; width: 100px">Buy</button>
  </div>
</template>

<script>
import {useStore} from "vuex";
import {useToast} from "vue-toastification";
import {ref} from "vue";
import axios from "axios";

export default {
  name: "ShoppingCartTable",
  setup() {
    const store = useStore()
    const toast = useToast();

    console.log(store.state.shoppingCart);

    const checkIfItemExists = (car) => {
      if (items.value.length === 0) {
        return -1;
      }
      for (let i = 0; i < items.value.length; i++) {
        if ((items.value[i].brand.toString() === car.brand.toString())
            && (items.value[i].modelName.toString() === car.modelName.toString())
            && (parseInt(items.value[i].engineCapacity) === parseInt(car.engineCapacity))
            && (parseInt(items.value[i].hp) === parseInt(car.hp))
            && (parseInt(items.value[i].manufacturingYear) === parseInt(car.manufacturingYear))
            && (parseInt(items.value[i].price) === parseInt(car.price))) {
          return i;
        }
      }

      return -1;
    }

    const loading = ref(true);
    let items = ref([]);

    const headers = [
      { text: "Brand", value: "brand", sortable: true },
      { text: "Model Name", value: "modelName", sortable: true },
      { text: "Engine Capacity", value: "engineCapacity", sortable: true },
      { text: "Horsepower", value: "hp", sortable: true },
      { text: "Manufacturing Year", value: "manufacturingYear", sortable: true },
      { text: "Price", value: "price", sortable: true },
      { text: "Quantity", value: "quantity", sortable: true },
      { text: "", value: "operation"}
    ];

    loading.value = true

    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    }

    if (!getCookie('jwtToken')) {
      toast.error('You are not logged in.')
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    }

    setTimeout(function () {
      let carsCollection = store.state.shoppingCart
      if (!carsCollection || carsCollection.length === 0) {
        if (sessionStorage.getItem('shoppingCart') && sessionStorage.getItem('shoppingCart').length > 0) {
          carsCollection = JSON.parse(sessionStorage.getItem('shoppingCart'));
        }
      }

      if (carsCollection && carsCollection.length > 0) {
        for (let car of carsCollection) {
          const indexOfCar = checkIfItemExists(car);
          if (indexOfCar >= 0) {
            items.value.forEach(item => {
              if ((item.brand === car.brand.toString())
                  && (item.modelName === car.modelName.toString())
                  && (parseInt(item.engineCapacity) === parseInt(car.engineCapacity))
                  && (parseInt(item.hp) === parseInt(car.hp))
                  && (parseInt(item.manufacturingYear) === parseInt(car.manufacturingYear))
                  && (parseFloat(item.price) === parseInt(car.price))) {
                item.quantity++;
              }
            });
          } else {
            car.quantity = 1;
            items.value.push(car)
          }
        }
      } else {
        toast.error('Cart empty or not able to retrieve the shopping cart items.')
      }

      loading.value = false;
    }, 1500);

    const themeColor = "#b9424c";

    const backend = 'http://localhost:3000/api/v1';

    const config = {
      headers: {
        'Authorization': 'Bearer ' + getCookie('jwtToken')
      }
    }

    const buyCars = async () => {
      await axios.post(backend + '/cart', {
        cars: items.value
      }, config)
          .then(async () => {
            toast.success('Successfully purchased cars!')
            items.value = [];
            sessionStorage.setItem('shoppingCart', []);
          }).catch(() => {
            toast.error('Car addition process failed. Changes were not saved.')
          })
    }

    const deleteItem = (item) => {
      loading.value = true;

      setTimeout(() => {
        loading.value = false;
      }, 1000);
      items.value.map(innerItem => {
        if (innerItem.quantity > 1) {
          if ((item.brand.toString() === innerItem.brand.toString())
              && (item.modelName.toString() === innerItem.modelName.toString())
              && (parseInt(item.engineCapacity) === parseInt(innerItem.engineCapacity))
              && (parseInt(item.hp) === parseInt(innerItem.hp))
              && (parseInt(item.manufacturingYear) === parseInt(innerItem.manufacturingYear))
              && (parseFloat(item.price) === parseFloat(innerItem.price))) {
            innerItem.quantity--;
          }
        } else {
          items.value = items.value.filter((val) => {
            return (val.brand !== item.brand)
                || (val.modelName !== item.modelName)
                || (val.engineCapacity !== item.engineCapacity)
                || (val.hp !== item.hp)
                || (val.manufacturingYear !== item.manufacturingYear)
          });
        }
      })
      sessionStorage.setItem('shoppingCart', JSON.stringify(items.value))
      store.commit("changeShoppingCart", items.value);
      console.log(store.state.shoppingCart);
    }

    return {
      headers,
      themeColor,
      loading,
      items,
      buyCars,
      deleteItem
    }
  }
}
</script>

<style scoped>
.customize-table {
  --easy-table-body-row-hover-background-color: rgba(240,128,128);
  --easy-table-header-background-color: rgba(185, 66, 76, 0.91);
}

.vue3-easy-data-table__main {
  border-radius: 10px 10px 10px 10px;
}

.operation-icon:hover {
  filter: invert(38%) sepia(19%) saturate(2693%) hue-rotate(312deg) brightness(85%) contrast(90%);
  transition: 0.3s ease-out;
}

#delete-icon {
  zoom: 57%
}
#myTable {
  width: 55%;
  margin: 0 auto;
}
</style>