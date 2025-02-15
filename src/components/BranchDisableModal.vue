<template>
  <div>
    <AppModal v-model="isModalOpen">
      <template #header> Disable All Branches </template>
      <div class="p-5 mt-16  md:w-[500px] w-[90vw]">
        <span>Are you sure you want to disable all branches ? </span>

        <div class="mt-4 flex gap-3 justify-end">
          <AppButton @click="close" variant="secondary"> Cancel </AppButton>
          <AppButton :loading="loading" @click="save"> Disable </AppButton>
        </div>
      </div>
    </AppModal>

    <AppToast ref="toast" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Branch } from "@/types/branches";
import AppModal from "@/components/Ui/AppModal.vue";
import AppButton from "@/components/Ui/AppButton.vue";
import AppToast from "@/components/Ui/AppToast.vue";

import { ChangeReservationsForBranch } from "@/api/branches";

export default Vue.extend({
  components: {
    AppModal,
    AppToast,

    AppButton,
  },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    data: {
      type: Array as () => Branch[],
      required: true,
    },
  },

  watch: {
    value(newVal) {
      this.isModalOpen = newVal;
    },
    isModalOpen(newVal) {
      this.$emit("input", newVal);
    },
  },
  data() {
    return {
      isModalOpen: false,
      loading: false,
    };
  },

  methods: {
    async save() {
      try {
        this.loading = true;
        const enablePromises = this.data.map((branch) =>
          ChangeReservationsForBranch(branch.id , false)
        );
        const results = await Promise.allSettled(enablePromises);

        results.forEach((result, index) => {
          if (result.status === "rejected") {
            throw new Error(
              `Failed to update branch ${this.data[index].id}:`,
              result.reason
            );
          }
        });

        this.$emit("save");

        const toast = this.$refs.toast as InstanceType<typeof AppToast>;
        toast.showToast("Branches Disabled Successfully");
        this.close();
      } catch (error) {
        console.error("Failed to disable branches:", error);
      } finally {
        this.loading = false;
      }
    },
    close() {
      this.$emit("close");
    },
  },
});
</script>
