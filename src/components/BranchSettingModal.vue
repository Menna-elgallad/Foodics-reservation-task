<template>
  <div>
    <AppModal v-model="isModalOpen">
      <template #header>
        Edit Branch {{ branch?.name }} branch reservation settings</template
      >
      <div class="h-[90vh] overflow-y-auto">
        <form
          class="mt-20 lg:mt-16 lg:w-[600px] w-[90vw] p-5 pb-20 focus:outline-none"
          @submit.prevent="validateAndSubmit"
        >
          <div class="mb-4">
            <label class="text-start block text-sm font-medium mb-2"
              >Reservation Duration (minutes)</label
            >
            <input
              v-model="reservation_duration"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary"
            />
          </div>
          <div v-if="tablesOptions.length" class="mb-4">
            <label class="text-start block text-sm font-medium mb-2">
              Tables
            </label>
            <MultiSelect
              :options="tablesOptions"
              :initialValue="tablesEnabled"
              :disabled="!tablesOptions.length"
              v-model="selectedTables"
            />
          </div>
          <div
            v-for="(times, key) in reservation_times"
            :key="key"
            class="mb-4"
          >
            <label class="text-start block text-sm font-medium mb-2">
              {{ key }}
              <button
                v-if="key === 'saturday'"
                type="button"
                @click="applyToAllDays"
                class="block ml-auto text-primary text-sm"
              >
                Apply on all days
              </button>
            </label>
            <div class="w-full px-3 py-2 border bg-white rounded-lg flex gap-2">
              <AppInputRange
                v-if="times.length"
                v-for="(time, index) in times"
                :key="index"
                v-model="times[index]"
                @remove="removeTimeSlot(key, index)"
              />
              <span v-if="!times.length"> Add Availabe Reservation Times</span>

              <button
                type="button"
                @click="addTimeSlot(key)"
                class="ml-auto bg-white border rounded-lg w-8 h-8 flex items-center justify-center hover:bg-stone-100 transition"
              >
                +
              </button>
            </div>

            <div v-if="validationErrors[key]" class="text-red-400 text-sm mt-1">
              {{ validationErrors[key] }}
            </div>
          </div>
          <div
            class="mt-4 flex justify-between fixed left-0 bottom-0 p-5 w-full rounded-b-md bg-white border-t"
          >
            <button
              type="button"
              @click="disableReservations"
              class="text-red-400 font-medium text-sm"
            >
              Disable Reservations
            </button>
            <div class="flex gap-3">
              <AppButton type="button" @click="close()" variant="secondary">
                Cancel
              </AppButton>
              <AppButton :loading="isLoading"> Save </AppButton>
            </div>
          </div>
        </form>
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
import AppInputRange from "@/components/Ui/AppInputRange.vue";
import AppButton from "@/components/Ui/AppButton.vue";
import AppToast from "@/components/Ui/AppToast.vue";
import { updateBranch, ChangeReservationsForBranch } from "@/api/branches";
import { changeTableReservation } from "@/api/tables";

interface ReservationTimes {
  [key: string]: string[][];
}

export default Vue.extend({
  components: {
    MultiSelect,
    AppModal,
    AppInputRange,
    AppButton,
    AppToast,
  },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    branch: {
      type: Object as () => Branch,
      required: true,
    },
  },
  data() {
    return {
      tables: [],
      isModalOpen: false,
      isLoading: false,
      selectedTables: [] as {
        label: string;
        value: string;
        accepts_reservations: boolean;
      }[],
      reservation_times: {
        Saturday: [],
        Sunday: [],
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
      } as ReservationTimes, 
      reservation_duration: 0,
      validationErrors: {} as { [key: string]: string }, 
    };
  },
  watch: {
    value(newVal) {
      this.isModalOpen = newVal;
    },
    isModalOpen(newVal) {
      this.$emit("input", newVal);
    },
  
    branch(newVal) {
      const weekOrder = [
        "saturday",
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
      ];
      this.reservation_duration = newVal.reservation_duration || 0;
      this.reservation_times = Object.fromEntries(
        weekOrder.map((day) => [day, newVal.reservation_times?.[day] || []])
      );
    },
  },
  computed: {
    tablesOptions(): {
      label: string;
      value: string;
      accepts_reservations: boolean;
    }[] {
      if (!this.branch) return [];
      return this.branch.sections.flatMap((section) =>
        section.tables.map((table) => ({
          label: `${section.name} - ${table.name}`,
          value: table.id,
          accepts_reservations: table.accepts_reservations,
        }))
      );
    },
    tablesEnabled(): { label: string; value: string }[] {
      if (!this.tablesOptions?.length) return [];
      return this.tablesOptions.filter((table) => table.accepts_reservations);
    },
  },
  methods: {
   
    addTimeSlot(day: string) {
      if (this.reservation_times[day].length < 3) {
        this.reservation_times[day].push(["00:00", "00:00"]);
      }
    },

   
    removeTimeSlot(day: string, index: number) {
      this.reservation_times[day].splice(index, 1);
    },
   
   
    applyToAllDays() {
      const saturdayTimes = this.reservation_times["saturday"];
      if (saturdayTimes) {
        Object.keys(this.reservation_times).forEach((day) => {
          if (day !== "saturday") {
            this.reservation_times[day] = JSON.parse(
              JSON.stringify(saturdayTimes)
            );
          }
        });
      }
    },

    timeToMinutes(time: string): number {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    },

   
    validateTimeSlot(timeSlot: string[]): boolean {
      const [start, end] = timeSlot;

    
      if (start === end) {
        return false;
      }


      const startMinutes = this.timeToMinutes(start);
      const endMinutes = this.timeToMinutes(end);

  
      const slotDuration =
        endMinutes > startMinutes
          ? endMinutes - startMinutes
          : 24 * 60 - startMinutes + endMinutes;

      
      return slotDuration >= this.reservation_duration;
    },

   
    validateDay(day: string): string | null {
      const times = this.reservation_times[day];

      for (let i = 0; i < times.length; i++) {
        const [start, end] = times[i];

       
        if (start === end) {
          return `Slot ${
            i + 1
          } has invalid times (start and end cannot be the same).`;
        }

        if (!this.validateTimeSlot(times[i])) {
          return `Slot ${
            i + 1
          } is too short or invalid for the reservation duration (${
            this.reservation_duration
          } minutes).`;
        }

     
        if (i > 0) {
          const prevEnd = this.timeToMinutes(times[i - 1][1]);
          const currentStart = this.timeToMinutes(times[i][0]);

         
          if (currentStart === prevEnd) {
            return `Slot ${
              i + 1
            } cannot start at the same time as the previous slot's end.`;
          }

       
          const prevStart = this.timeToMinutes(times[i - 1][0]);
          const currentEnd = this.timeToMinutes(times[i][1]);

          if (
            (currentStart >= prevStart && currentStart < prevEnd) || 
            (currentEnd > prevStart && currentEnd <= prevEnd) || 
            (prevEnd <= prevStart && currentStart < prevEnd) || 
            (currentEnd <= currentStart && currentEnd > prevStart) 
          ) {
            return `Slot ${i + 1} overlaps with the previous slot.`;
          }
        }
      }

      return null; 
    },


    validateAllDays(): boolean {
      let isValid = true;
      this.validationErrors = {}; 

      Object.keys(this.reservation_times).forEach((day) => {
        const error = this.validateDay(day);
        if (error) {
          this.validationErrors[day] = error; 
          isValid = false;
        }
      });

      return isValid;
    },
    async disableReservations() {
      try {
        this.isLoading = true;
        await ChangeReservationsForBranch(this.branch.id, false);
        this.$emit("save");
        const toast = this.$refs.toast as InstanceType<typeof AppToast>;
        toast.showToast(`Branch '${this.branch.name}' Disabled Successfully`);
        this.isLoading = false;
        this.close();
      } catch (error) {
        console.error("Failed to disable branches:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async validateAndSubmit() {
      if (!this.validateAllDays()) {
        return;
      }
      const toast = this.$refs.toast as InstanceType<typeof AppToast>;
      const payload = {
        reservation_duration: this.reservation_duration,
        reservation_times: this.reservation_times,
      };
      try {
        this.isLoading = true;
        const updatedBranch = await updateBranch(this.branch.id, payload);
        const updatedTables = [
        ...this.tablesEnabled.filter(
              (tableItem) =>
                !this.selectedTables
                  .map((value ) => value.value)
                  .includes(tableItem.value)
            ).map((tableItem) => ({...tableItem , accepts_reservations: false}))
            , ...this.selectedTables.map((tableItem) => ({...tableItem , accepts_reservations: true}))
          
        ];
     
        if (updatedTables.length > 0) {
          const updatedTablesRequests = updatedTables.map((table) =>
            changeTableReservation(table.value , table.accepts_reservations)
          );

          const results = await Promise.allSettled(updatedTablesRequests);
          results.forEach((result, index) => {
            if (result.status === "rejected") {
              throw new Error(" Failed to update table", result.reason);
            }
          });
        }
        this.$emit("save", updatedBranch);
        this.isLoading = false;
        toast.showToast(`Branch "${this.branch.name}" Updated Successfully`);
        this.isModalOpen = false;
      } catch (error) {
        console.error("Failed to update branch:", error);
      } finally {
        this.isLoading = false;
      }
    },
    close() {
      this.$emit("close");
    },
  },
});
</script>
