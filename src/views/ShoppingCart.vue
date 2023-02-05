<template>
  <Suspense>
    <ShoppingCartTable/>
  </Suspense>
</template>

<script>
import ShoppingCartTable from "@/components/ShoppingCartTable.vue";

export default {
  name: "ShoppingCart",
  components: {
    ShoppingCartTable
  }
}
</script>

<style scoped>

</style>