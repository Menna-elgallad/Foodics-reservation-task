<!-- src/components/BranchTable.vue -->

<template>
  <div class="overflow-x-auto">
    <table class="min-w-full bg-white rounded-lg">
      <thead>
        <tr>
          <th
            class="px-6 py-4 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-700 "
          >
            Name
          </th>
          <th
            class="px-6 py-4 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-700 "
          >
            Reference
          </th>
          <th
            class="px-6 py-4 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-700 "
          >
            Tables
          </th>
          <th
            class="px-6 py-4 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-700 "
          >
            Duration
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="branch in branches"
          :key="branch.id"
          @click="onRowClick(branch)"
          class="cursor-pointer transition-all hover:bg-gray-100 border-b border-gray-300"
        >
          <td class="px-6 py-5">{{ branch.name }}</td>
          <td class="px-6 py-5">
            <span
              v-if="branch.reference"
              class="bg-primary-light px-3 text-white rounded-full text-sm font-semibold"
              >{{ branch.reference }}</span
            >
            <span v-else>-</span>
          </td>
          <td class="px-6 py-5">
            {{
              branch.sections
                .flatMap((section) => section.tables)
                .filter((table) => table.accepts_reservations).length
            }}
          </td>
          <td class="px-6 py-5">
            {{ branch.reservation_duration }}
            <span class="text-xs font-semibold">Minutes</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Branch } from "@/types/branches";

export default defineComponent({
  name: "BranchTable",
  props: {
    branches: {
      type: Array as PropType<Branch[]>,
      required: true,
    },
  },
  data()  {
    return {
      isLoading : false
    }
  }  ,
  emits: ["row-click"],
  methods: {
    onRowClick(branch: Branch) {
      this.$emit("row-click", branch);
    },
  },
});
</script>

<style scoped></style>
