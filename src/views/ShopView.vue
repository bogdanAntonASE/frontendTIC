<template>
  <Suspense>
    <CarsTableView/>
  </Suspense>
</template>

<script>
import CarsTableView from "@/components/CarsTableView.vue";

export default {
  name: "ShopView",
  components: {
    CarsTableView
  }
}
</script>

<style scoped>

</style>