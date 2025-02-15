<template>
  <div class="overflow-x-auto">
    <table class="min-w-full bg-white rounded-lg">
      <thead>
        <tr>
          <th
            class="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-700"
          >
            Name
          </th>
          <th
            class="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-700"
          >
            Reference
          </th>
          <th
            class="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-700"
          >
            Tables
          </th>
          <th
            class="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-700"
          >
            Duration
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="i in 5"
          :key="i"
          class="cursor-pointer transition-all hover:bg-gray-100 border-b border-gray-300"
        >
          <td class="px-6 py-5">
            <div class="h-2 bg-gray-300 rounded-lg animate-pulse"></div>
          </td>

          <td class="px-6 py-5">
            <div class="h-2 bg-gray-300 rounded-lg animate-pulse w-3/4"></div>
          </td>

          <td class="px-6 py-5">
            <div class="h-2 bg-gray-300 rounded-lg animate-pulse w-1/2"></div>
          </td>

          <td class="px-6 py-5">
            <div class="h-2 bg-gray-300 rounded-lg animate-pulse w-1/4"></div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "BranchTableSkeleton",
});
</script>
