<template>
<div>
  <AppModal v-model="isModalOpen">
    <template #header>
        Add Branches
    </template>
    <div class="p-5 mt-16 sm:min-w-[50vw] lg:min-w-[500px]">
        <MultiSelect
        :options="branchOptions"
        v-model="selectedBranches"
        placeholder="Select branches"
        />

        <div class="mt-4 flex gap-3 justify-end"">
            <AppButton  @click="close" variant="secondary"> Cancel </AppButton>
            <AppButton :disabled="!selectedBranches.length" :loading="isLoading"  @click="save" > Add </AppButton>
        </div>
    </div>
  </AppModal>
  <AppToast ref="toast" />
</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Branch } from "@/types/branches";
import MultiSelect from "@/components/Ui/AppMultiSelect.vue"; 
import AppModal from "@/components/Ui/AppModal.vue";
import AppButton from "@/components/Ui/AppButton.vue";
import AppToast from '@/components/Ui/AppToast.vue';
import { ChangeReservationsForBranch } from "@/api/branches";

export default Vue.extend({
  components: {
    MultiSelect, 
    AppModal,
    AppButton,
    AppToast
  },
  props: {
    value: {
      type: Boolean,
      required: true,
    },

    branches: {
      type: Array as () => Branch[],
      required: true,
    },
  },
  data() {
    return {
      selectedBranches: [] as { label: string; value: string }[], 
      isModalOpen: false,
      isLoading : false
    };
  },

  watch: {
    value(newVal) {
      this.isModalOpen = newVal;
    },
    isModalOpen(newVal) {
      this.$emit("input", newVal);
    },
  },
  computed: {

    branchOptions(): { label: string; value: string }[] {
      return this.branches
        .filter((branch) => !branch.accepts_reservations)
        .map((branch) => ({
          label: branch.name,
          value: branch.id,
        }));
    },
  },
  methods: {
    async save() {
        const toast = (this.$refs.toast as InstanceType<typeof AppToast>);
      try {
        this.isLoading = true

        const enablePromises = this.selectedBranches.map((branchId) =>
          ChangeReservationsForBranch(branchId.value, true)
        );

        const results = await Promise.allSettled(enablePromises);

        results.forEach((result, index) => {
          if (result.status === "rejected") {
            throw new Error("Failed to enable reservations for branch:", result.reason);
          }
        });
        this.isLoading = false
        toast.showToast('Branches Added Successfully');
        this.$emit("save");
        this.close()
      } catch (error) {
        console.error("Error enabling reservations:", error);
      }
      finally{
        this.isLoading = false
      }
    },
    close() {
      this.$emit("close");
    },
  },
});
</script>
