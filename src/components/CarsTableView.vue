<template>
  <div v-if="!isEditing">
    <EasyDataTable
        id="myTable"
        show-index
        buttons-pagination
        table-class-name="customize-table"
        :theme-color="themeColor"
        :headers="headers"
        :items="items"
        :loading="loading">
      <template #item-operation="item">
        <div class="operation-wrapper">
          <img
              src="../assets/delete.png"
              class="operation-icon"
              @click="deleteItem(item)"
          />
          <img
              src="../assets/edit.png"
              class="operation-icon"
              @click="editItem(item)"
          />
        </div>
      </template>
    </EasyDataTable>
  </div>

  <div class="container-fluid h-100" v-if="isEditing" id="editForm">
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
            <label class="col-form-label col-form-label-sm">Quantity: </label>
            <input type="text" class="form-control form-control-sm" v-model="editingItem.quantity" />
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
</template>

<script>
import axios from "axios";
import {ref, reactive} from "vue";
import {useToast} from "vue-toastification";

const backend = 'http://localhost:3000/api/v1';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export default {
  name: "CarsTableView",
  async setup() {
    const loading = ref(true);
    let items = ref([]);

    const toast = useToast();

    const headers = [
      { text: "Brand", value: "brand", sortable: true },
      { text: "Model Name", value: "modelName", sortable: true },
      { text: "Engine Capacity", value: "engineCapacity", sortable: true },
      { text: "Horsepower", value: "hp", sortable: true },
      { text: "Manufacturing Year", value: "manufacturingYear", sortable: true },
      { text: "Price", value: "price", sortable: true },
      { text: "Quantity", value: "quantity", sortable: true },
      { text: "Operation", value: "operation" }
    ];

    const config = {
      headers: {
        'Authorization': 'Bearer ' + getCookie('jwtToken')
      }
    }

    const isEditing = ref(false);

    const checkIfItemExists = (car) => {
      if (items.value.length === 0) {
        return -1;
      }
      for (let i = 0; i < items.value.length; i++) {
        if ((items.value[i].brand === car.brand)
            && (items.value[i].modelName === car.modelName)
            && (items.value[i].engineCapacity === car.engineCapacity)
            && (items.value[i].hp === car.hp)
            && (items.value[i].manufacturingYear === car.manufacturingYear)) {
          return i;
        }
      }

      return -1;
    }

    loading.value = true;
    await axios.get(backend + "/cars", config)
        .then(res => {
          setTimeout(() => {
            loading.value = false
            for (let car of res.data.message) {
              const indexOfCar = checkIfItemExists(car);
              if (indexOfCar >= 0) {
                items.value.forEach(item => {
                  if ((item.brand === car.brand)
                      && (item.modelName === car.modelName)
                      && (item.engineCapacity === car.engineCapacity)
                      && (item.hp === car.hp)
                      && (item.manufacturingYear === car.manufacturingYear)) {
                    item.quantity++;
                  }
                });
              } else {
                car.quantity = 1;
                items.value.push(car)
              }
            }
          }, 1500)
        }).catch(err => {
          console.log(err)
          toast.error(err.response.data.message)
          setTimeout(() => {
            window.location.href = '/';
          }, 1500);
        })

    const deleteItem = (val) => {
      const index = checkIfItemExists(val);
      if (items.value[index].quantity > 0) {
        const answer = confirm('Are you sure that you want to remove one item of this kind?')
        if (!answer) {
          return;
        }
        items.value[index].quantity--;
        toast.success('Successfully removed quantity for item!')
      } else {
        const answer = confirm('Are you sure that you want to remove this item?')
        if (!answer) {
          return;
        }
        items.value = items.value.filter((item) => {
          return (item.brand !== val.brand)
              || (item.modelName !== val.modelName)
              || (item.engineCapacity !== val.engineCapacity)
              || (item.hp !== val.hp)
              || (item.manufacturingYear !== val.manufacturingYear)
        });
        toast.success('Successfully removed item!')
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

    const editItem = (val) => {
      isEditing.value = true;

      const { brand,
        modelName,
        engineCapacity,
        hp,
        manufacturingYear,
        quantity} = val;

      editingItem.brand = brand;
      editingItem.modelName = modelName;
      editingItem.engineCapacity = engineCapacity;
      editingItem.hp = hp;
      editingItem.manufacturingYear = manufacturingYear;
      editingItem.quantity = quantity;

      oldItem.brand = brand;
      oldItem.modelName = modelName;
      oldItem.engineCapacity = engineCapacity;
      oldItem.hp = hp;
      oldItem.manufacturingYear = manufacturingYear;
      oldItem.quantity = quantity;
      console.log(val);
    }

    const submitEdit = () => {
      isEditing.value = false
      const index = checkIfItemExists(oldItem)

      const item = items.value[index];
      item.brand = editingItem.brand;
      item.modelName = editingItem.modelName;
      item.engineCapacity = editingItem.engineCapacity;
      item.hp = editingItem.hp;
      item.manufacturingYear = editingItem.manufacturingYear;
      item.quantity = editingItem.quantity;

      toast.success('Successfully edited item!')
    }

    const cancelEdit = () => {
      isEditing.value = false;
    }

    const themeColor = "#b9424c";

    return {
      headers,
      items,
      loading,
      deleteItem,
      editItem,
      submitEdit,
      cancelEdit,
      editingItem,
      oldItem,
      isEditing,
      themeColor
    };
  },
}

</script>

<style scoped>
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