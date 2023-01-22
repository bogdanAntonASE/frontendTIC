<template>
  <div class="car-display">
    <div class="cars-container">
      <div class="car-image">
        <img :src="image"
      </div>
      <div class="car-info">
        <h1>{{ car }}</h1>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CarsView"
}
</script>

<style scoped>

</style>