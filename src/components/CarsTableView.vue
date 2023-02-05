<template>
  <div v-if="!isEditing && !isAdding">

    <button type="button" v-if="isAdmin" @click="addCar" class="btn btn-danger" style="margin-bottom: 2%; width: 100px">Add Car</button>
    <EasyDataTable
        id="myTable"
        show-index
        buttons-pagination
        table-class-name="customize-table"
        :theme-color="themeColor"
        :headers="headers"
        :items="items"
        :loading="loading"
        rows-per-page-message="cars per page:"
        rows-per-page="10">
      <template #item-operation="item">
        <div class="operation-wrapper">
          <img
              src="../assets/delete.png"
              class="operation-icon"
              v-if="isAdmin"
              @click="deleteItem(item)"
          />
          <img
              src="../assets/edit.png"
              class="operation-icon"
              v-if="isAdmin"
              @click="editItem(item)"
          />
          <img
            src="../assets/shopping-cart.png"
            class="operation-icon"
            @click="addToCart(item)"
          />
        </div>
      </template>
    </EasyDataTable>
  </div>

  <div class="container-fluid h-100" v-if="isEditing" id="editForm">
    <h3>Edit Car</h3>
    <div class="row h-100">
      <div class="col-md-12 h-100 d-flex justify-content-center align-items-md-baseline">

        <div class="col-md-5 edit rounded px-5 py-4 shadow bg-white text-left">
          <div class="edit-item col-12 form-group">
            <label class="col-form-label col-form-label-sm">Brand: </label>
            <input type="text" class="form-control form-control-sm" v-model="editingItem.brand" />
            <br />
            <label class="col-form-label col-form-label-sm">Model Name: </label>
            <input type="text" class="form-control form-control-sm" v-model="editingItem.modelName" />
            <br />
            <label class="col-form-label col-form-label-sm">Engine Capacity: </label>
            <input type="text" class="form-control form-control-sm" v-model="editingItem.engineCapacity" />
            <br />
            <label class="col-form-label col-form-label-sm">Horsepower: </label>
            <input type="text" class="form-control form-control-sm" v-model="editingItem.hp" />
            <br />
            <label class="col-form-label col-form-label-sm">Manufacturing Year: </label>
            <input type="text" class="form-control form-control-sm" v-model="editingItem.manufacturingYear" />
            <br />
            <label class="col-form-label col-form-label-sm">Price: </label>
            <input type="text" class="form-control form-control-sm" v-model="editingItem.price" />
            <br />
            <div class="col-12 form-group text-center">
              <button class="btn btn-danger btn-sm col-4" style="font-weight: bold" @click="submitEdit">Submit</button>
              <button class="btn btn-danger btn-sm col-4" style="font-weight: bold; margin-left: 10px" @click="cancelEdit">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="container-fluid h-100" v-if="isAdding" id="addForm">
    <h3>Add Car</h3>
    <div class="row h-100">
      <div class="col-md-12 h-100 d-flex justify-content-center align-items-md-baseline">

        <div class="col-md-5 edit rounded px-5 py-4 shadow bg-white text-left">
          <div class="edit-item col-12 form-group">
            <label class="col-form-label col-form-label-sm">Brand: </label>
            <input type="text" class="form-control form-control-sm" v-model="newAddedItem.brand" />
            <br />
            <label class="col-form-label col-form-label-sm">Model Name: </label>
            <input type="text" class="form-control form-control-sm" v-model="newAddedItem.modelName" />
            <br />
            <label class="col-form-label col-form-label-sm">Engine Capacity: </label>
            <input type="text" class="form-control form-control-sm" v-model="newAddedItem.engineCapacity" />
            <br />
            <label class="col-form-label col-form-label-sm">Horsepower: </label>
            <input type="text" class="form-control form-control-sm" v-model="newAddedItem.hp" />
            <br />
            <label class="col-form-label col-form-label-sm">Manufacturing Year: </label>
            <input type="text" class="form-control form-control-sm" v-model="newAddedItem.manufacturingYear" />
            <br />
            <label class="col-form-label col-form-label-sm">Price: </label>
            <input type="text" class="form-control form-control-sm" v-model="newAddedItem.price" />
            <br />
            <div class="col-12 form-group text-center">
              <button class="btn btn-danger btn-sm col-4" style="font-weight: bold" @click="submitAddCar">Submit</button>
              <button class="btn btn-danger btn-sm col-4" style="font-weight: bold; margin-left: 10px" @click="cancelAdd">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {ref, reactive} from "vue";
import {useToast} from "vue-toastification";
import {useStore} from "vuex";

const backend = 'http://localhost:3000/api/v1';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export default {
  name: "CarsTableView",
  async setup() {
    const store = useStore();
    const loading = ref(true);
    const isAdmin = ref(false);
    let items = ref([]);

    const toast = useToast();

    const headers = [
      { text: "Brand", value: "brand", sortable: true },
      { text: "Model Name", value: "modelName", sortable: true },
      { text: "Engine Capacity", value: "engineCapacity", sortable: true },
      { text: "Horsepower", value: "hp", sortable: true },
      { text: "Manufacturing Year", value: "manufacturingYear", sortable: true },
      { text: "Price (€)", value: "price", sortable: true },
      { text: "Quantity", value: "quantity", sortable: true },
      { text: "Operation", value: "operation" }
    ];

    const config = {
      headers: {
        'Authorization': 'Bearer ' + getCookie('jwtToken')
      }
    }

    const isEditing = ref(false);
    const isAdding = ref(false);

    const checkIfItemExists = (car) => {
      if (items.value.length === 0) {
        return -1;
      }
      for (let i = 0; i < items.value.length; i++) {
        if ((items.value[i].brand === car.brand.toString())
            && (items.value[i].modelName === car.modelName.toString())
            && (items.value[i].engineCapacity === parseInt(car.engineCapacity))
            && (items.value[i].hp === parseInt(car.hp))
            && (items.value[i].manufacturingYear === parseInt(car.manufacturingYear))
            && (items.value[i].price === parseFloat(car.price))) {
          console.log(car)
          return i;
        }
      }

      return -1;
    }

    loading.value = true;

    const getCars = async () => {
      await axios.get(backend + "/cars", config)
          .then(res => {
            setTimeout(() => {
              for (let car of res.data.message) {
                if (car.quantity <= 0) {
                  continue;
                }
                const indexOfCar = checkIfItemExists(car);
                if (indexOfCar >= 0) {
                  items.value.forEach(item => {
                    if ((item.brand === car.brand.toString())
                        && (item.modelName === car.modelName.toString())
                        && (item.engineCapacity === parseInt(car.engineCapacity))
                        && (item.hp === parseInt(car.hp))
                        && (item.manufacturingYear === parseInt(car.manufacturingYear))
                        && (item.price === parseFloat(car.price))) {
                      item.quantity += car.quantity;
                    }
                  });
                } else {
                  let currentCar = {
                    brand: car.brand,
                    modelName: car.modelName,
                    engineCapacity: parseInt(car.engineCapacity),
                    hp: parseInt(car.hp),
                    manufacturingYear: parseInt(car.manufacturingYear),
                    price: parseFloat(car.price),
                    quantity: parseInt(car.quantity)
                  }
                  items.value.push(currentCar)
                }
              }
              loading.value = false
            }, 1000)
          }).catch(err => {
            console.log(err)
            toast.error(err.response.data.message)
            setTimeout(() => {
              window.location.href = '/';
            }, 1500);
          })
    }

    await getCars();

    const deleteItem = async (val) => {
      const index = checkIfItemExists(val);
      const configLocal = {
        headers: {
          Authorization: 'Bearer ' + getCookie('jwtToken')
        },
        data: {
          key: val,
        }
      }

      if (items.value[index].quantity > 1) {
        const answer = confirm('Are you sure that you want to remove one item of this kind?')
        if (!answer) {
          return;
        }


        await axios.delete(backend + '/cars', configLocal)
            .then(res => {
              console.log(res)
              toast.success('Successfully removed quantity for item!')
            }).catch(err => {
              console.log(err)
              toast.success('Failed to remove one quantity for item!')
            })
        items.value[index].quantity--;
      } else {
        const answer = confirm('Are you sure that you want to remove this item?')
        if (!answer) {
          return;
        }

        await axios.delete(backend + '/cars', configLocal)
            .then(res => {
              console.log(res)
              items.value = items.value.filter((item) => {
                return (item.brand !== val.brand)
                    || (item.modelName !== val.modelName)
                    || (item.engineCapacity !== val.engineCapacity)
                    || (item.hp !== val.hp)
                    || (item.manufacturingYear !== val.manufacturingYear)
              });
              toast.success('Successfully removed item!')
            }).catch(err => {
              console.log(err)
              toast.error('Failed to remove item!')
            })
      }
    };

    const editingItem = reactive({
      brand: "",
      engineCapacity: 0,
      hp: 0,
      modelName: "",
      price: 0.0,
      manufacturingYear: 0,
      quantity: 0
    });

    const oldItem = reactive({
      brand: "",
      engineCapacity: 0,
      hp: 0,
      modelName: "",
      price: 0.0,
      manufacturingYear: 0,
      quantity: 0
    });

    const newAddedItem = reactive({
      brand: "",
      engineCapacity: 0,
      hp: 0,
      modelName: "",
      price: 0.0,
      manufacturingYear: 0,
      quantity: 1
    });

    const editItem = (val) => {
      isEditing.value = true;

      const { brand,
        modelName,
        engineCapacity,
        hp,
        manufacturingYear,
        quantity,
        price} = val;

      editingItem.brand = brand;
      editingItem.modelName = modelName;
      editingItem.engineCapacity = engineCapacity;
      editingItem.hp = hp;
      editingItem.manufacturingYear = manufacturingYear;
      editingItem.quantity = quantity;
      editingItem.price = price;

      oldItem.brand = brand;
      oldItem.modelName = modelName;
      oldItem.engineCapacity = engineCapacity;
      oldItem.hp = hp;
      oldItem.manufacturingYear = manufacturingYear;
      oldItem.quantity = quantity;
      oldItem.price = price;
    }

    const updateShoppingCart = (oldItem, newItem) => {
      if (!store.state.shoppingCart || store.state.shoppingCart.length === 0) {
        return;
      }
      for (let car of store.state.shoppingCart) {
        if ((car.brand.toString() === oldItem.brand.toString())
            && (car.modelName.toString() === oldItem.modelName.toString())
            && (parseInt(car.engineCapacity) === parseInt(oldItem.engineCapacity)
                && (parseInt(car.hp) === parseInt(newItem.hp))
                && (parseInt(car.manufacturingYear) === parseInt(oldItem.manufacturingYear))
                && (parseFloat(car.price) === parseInt(oldItem.price)))) {
          car.brand = newItem.brand
          car.modelName = newItem.modelName
          car.engineCapacity = newItem.engineCapacity
          car.hp = newItem.hp
          car.manufacturingYear = newItem.manufacturingYear
          car.price = newItem.price

          //only one might change once submitting the edit process.
          break;
        }
      }
    }

    const submitEdit = async () => {
      isEditing.value = false
      loading.value = true;
      const index = checkIfItemExists(oldItem)

      const item = items.value[index];
      item.brand = editingItem.brand;
      item.modelName = editingItem.modelName;
      item.engineCapacity = editingItem.engineCapacity;
      item.hp = editingItem.hp;
      item.manufacturingYear = editingItem.manufacturingYear;
      item.quantity = editingItem.quantity;

      await axios.put(backend + '/cars', {
        oldItem: oldItem,
        newItem: editingItem
      }, config)
          .then(async () => {
            toast.success('Successfully edited item!')
            items.value = [];
            await getCars();

            updateShoppingCart(oldItem, editingItem);
          }).catch(() => {
            toast.error('Car edit process failed. Changes were not saved.')
          })
    }

    const cancelEdit = () => {
      isEditing.value = false;
    }

    const cancelAdd = () => {
      isAdding.value = false;
    }

    const addToCart = (val) => {
      let quantityInCart = 0;
      if (store.state.shoppingCart && store.state.shoppingCart.length > 0) {
        for (let item of store.state.shoppingCart) {
          if ((item.brand.toString() === val.brand.toString())
              && (item.modelName.toString() === val.modelName.toString())
              && (parseInt(item.engineCapacity) === parseInt(val.engineCapacity)
                  && (parseInt(item.hp) === parseInt(val.hp))
                  && (parseInt(item.manufacturingYear) === parseInt(val.manufacturingYear))
                  && (parseFloat(item.price) === parseInt(val.price)))) {
            quantityInCart++;
          }
        }
      }

      let quantityAvailable = 0;
      for (let item of items.value) {
        if ((item.brand.toString() === val.brand.toString())
            && (item.modelName.toString() === val.modelName.toString())
            && (parseInt(item.engineCapacity) === parseInt(val.engineCapacity))
            && (parseInt(item.hp) === parseInt(val.hp))
            && (parseInt(item.manufacturingYear) === parseInt(val.manufacturingYear))
            && (parseFloat(item.price) === parseFloat(val.price))) {
          quantityAvailable = item.quantity;
        }
      }
      if (quantityInCart > quantityAvailable - 1) {
        toast.error('You are not allowed to add more than ' + quantityAvailable + ' in your shopping cart.');
      } else {
        const newItem = {
          brand: val.brand,
          modelName: val.modelName,
          engineCapacity: val.engineCapacity,
          hp: val.hp,
          manufacturingYear: val.manufacturingYear,
          price: val.price,
          quantity: quantityInCart + 1
        }

        store.commit("changeShoppingCart", newItem)
        sessionStorage.setItem('shoppingCart', JSON.stringify(store.state.shoppingCart))
        toast.success('Car added in the shopping cart.')
      }

      console.log(store.state.shoppingCart)
    }

    const themeColor = "#b9424c";

    isAdmin.value = sessionStorage.getItem('isAdmin') === 'true';

    const addCar = () => {
      isAdding.value = true;

      newAddedItem.brand = '';
      newAddedItem.modelName = '';
      newAddedItem.engineCapacity = 0;
      newAddedItem.hp = 0;
      newAddedItem.manufacturingYear = 0;
      newAddedItem.quantity = 0;
      newAddedItem.price = 0;
    }

    const submitAddCar = async () => {
      isAdding.value = false
      loading.value = true;

      console.log('here?')

      await axios.post(backend + '/cars', {
        newItem: newAddedItem
      }, config)
          .then(async () => {
            toast.success('Successfully added new item!')
            items.value = [];
            await getCars();
          }).catch(() => {
            toast.error('Car addition process failed. Changes were not saved.')
          })
    }

    return {
      headers,
      items,
      loading,
      isAdmin,
      deleteItem,
      editItem,
      submitEdit,
      cancelEdit,
      addToCart,
      addCar,
      cancelAdd,
      submitAddCar,
      editingItem,
      oldItem,
      isEditing,
      isAdding,
      newAddedItem,
      themeColor
    };
  },
}

</script>

<style scoped>
.operation-icon:hover {
  filter: invert(38%) sepia(19%) saturate(2693%) hue-rotate(312deg) brightness(85%) contrast(90%);
  transition: 0.3s ease-out;
}
#myTable {
  width: 55%;
  margin: 0 auto;
}
.operation-wrapper .operation-icon {
  width: 20px;
  cursor: pointer;
}

.customize-table {
  --easy-table-body-row-hover-background-color: rgba(240,128,128);
  --easy-table-header-background-color: rgba(185, 66, 76, 0.91);
}
</style>