<!-- src/views/Home.vue -->

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-6">Restaurant Reservation System</h1>
    <BranchTable :branches="branches" @row-click="handleRowClick" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { fetchBranches } from '../api/branches';
import BranchTable from '../components/BranchTable.vue';
import  {Branch}  from '../types/branches';

export default defineComponent({
  name: 'Home',
  components: {
    BranchTable,
  },
  setup() {
    const branches = ref<Branch[]>([]);

    onMounted(async () => {
      try {
        branches.value = await fetchBranches();
      } catch (error) {
        console.error('Failed to fetch branches:', error);
      }
    });

    const handleRowClick = (branch: Branch) => {
      console.log('Selected branch:', branch);
      // Open reservation settings modal here
    };

    return {
      branches,
      handleRowClick,
    };
  },
});
</script>

<style scoped>
/* Add custom styles if needed */
</style>