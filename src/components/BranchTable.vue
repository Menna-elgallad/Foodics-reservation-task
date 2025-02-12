<!-- src/components/BranchTable.vue -->

<template>
  <div class="overflow-x-auto">
    <table class="min-w-full bg-white">
      <thead>
        <tr>
          <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-700">Name</th>
          <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-700">Reference</th>
          <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-700">Tables</th>
          <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-700">Duration</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="branch in branches"
          :key="branch.id"
          @click="onRowClick(branch)"
          class="cursor-pointer hover:bg-gray-100"
        >
          <td class="px-6 py-4 border-b border-gray-300">{{ branch.name }}</td>
          <td class="px-6 py-4 border-b border-gray-300">{{ branch.reference }}</td>
          <td class="px-6 py-4 border-b border-gray-300">
            {{ branch.sections.flatMap(section => section.tables).filter(table => table.accepts_reservations).length }}
          </td>
          <td class="px-6 py-4 border-b border-gray-300">{{ branch.reservation_duration }} mins</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Branch } from '../types/branches';

export default defineComponent({
  name: 'BranchTable',
  props: {
    branches: {
      type: Array as PropType<Branch[]>,
      required: true,
    },
  },
  emits: ['row-click'],
  methods: {
    onRowClick(branch: Branch) {
      this.$emit('row-click', branch);
    },
  },
});
</script>

<style scoped>
/* Add custom styles if needed */
</style>