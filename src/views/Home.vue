<template>
  <div>
    <div class="bg-white">
      <div
        class="flex py-7 items-center justify-between shadow-b-md container mx-auto"
      >
        <h1 class="text-2xl font-bold">Restaurant Reservation System</h1>
        <AppButton
          :disabled="!enabledBranches.length"
          @click="isDisableModalOpen = true"
        >
          Disable Reservations
        </AppButton>
      </div>
    </div>
    <div class="mt-5 rounded-lg mx-auto container p-5 bg-white">
      <AppButton
        class="ml-auto mb-2"
        variant="secondary"
        @click="isAddModalOpen = true"
      >
        Add Branch
      </AppButton>
      <BranchTableSkeleton v-if="isLoading" />
      <AppNoData v-else-if="!enabledBranches.length" />
      <BranchTable
        v-else="enabledBranches.length"
        :branches="enabledBranches"
        @row-click="handleRowClick"
      />
    </div>
    <BranchAddModal
      v-model="isAddModalOpen"
      :branches="branchesData"
      @save="loadBranches"
      @close="isAddModalOpen = false"
    />
    <BranchSettingModal
      v-model="isSettingModalOpen"
      :branch="selectedBranch"
      @save="loadBranches"
      @close="isSettingModalOpen = false"
    />
    <BranchDisableModal
      v-model="isDisableModalOpen"
      :data="enabledBranches"
      @save="loadBranches"
      @close="isDisableModalOpen = false"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { fetchBranches } from "../api/branches";
import BranchTable from "@/components/BranchTable.vue";
import BranchAddModal from "@/components/BranchAddModal.vue";
import AppButton from "@/components/Ui/AppButton.vue";
import AppNoData from "@/components/Ui/AppNoData.vue";
import { Branch } from "@/types/branches";
import BranchSettingModal from "@/components/BranchSettingModal.vue";
import BranchDisableModal from "@/components/BranchDisableModal.vue";
import BranchTableSkeleton from "@/components/BranchTableSkeleton.vue";

export default Vue.extend({
  name: "Home",
  components: {
    BranchTable,
    BranchAddModal,
    BranchSettingModal,
    BranchDisableModal,
    BranchTableSkeleton,
    AppButton,
    AppNoData,
  },
  data() {
    return {
      branchesData: [] as Branch[],
      enabledBranches: [] as Branch[],
      selectedBranch: null as Branch | null,
      isSettingModalOpen: false,
      isDisableModalOpen: false,
      isAddModalOpen: false,
      isLoading: false,
    };
  },
  created() {
    this.loadBranches();
  },

  methods: {
    async loadBranches() {
      try {
        this.isLoading = true;
        this.branchesData = await fetchBranches();
        this.enabledBranches = this.branchesData;
        this.enabledBranches = this.branchesData.filter(
          (b) => b.accepts_reservations
        );
      } catch (error) {
        console.error("Failed to fetch branches:", error);
      } finally {
        this.isLoading = false;
      }
    },
    handleRowClick(branch: Branch) {
      this.selectedBranch = branch;
      this.isSettingModalOpen = true;
    },
  },
});
</script>


