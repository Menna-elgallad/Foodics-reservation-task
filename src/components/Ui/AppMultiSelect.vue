<template>
  <div class="relative" ref="dropdown">
    <div
      @click="toggleDropdown"
      tabindex="0"
      :class="{ 'cursor-not-allowed opacity-50 focus:ring-transparent focus:border-transparent': disabled }"
      class="p-2 border bg-white transition rounded-lg cursor-pointer flex items-center justify-between w-full focus:ring-2 focus:ring-primary-light focus:border-primary"
    >
      <template v-if="selectedItems.length === 0">Select options</template>
      <template v-else>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="item in selectedItems"
            :key="item"
            class="bg-white border border-primary px-2 py-1 rounded-lg text-sm flex items-center"
          >
            {{ item.label }}
            <button
              @click.stop="removeItem(item)"
              class="ml-2 focus:outline-none"
            >
              &times;
            </button>
          </div>
        </div>
      </template>
      <div
        :class="{ 'transition-all duration-500 rotate-180': isOpen }"
        class="ml-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="m12 13.171l4.95-4.95l1.414 1.415L12 16L5.636 9.636L7.05 8.222z"
          />
        </svg>
      </div>
    </div>

    <transition name="slide">
      <div
        v-if="isOpen"
        class="absolute mt-2 w-full bg-white border rounded-lg shadow-lg overflow-y-auto max-h-52 z-10"
      >
        <div
          v-for="option in options"
          :key="option.value"
          @click="toggleItem(option)"
          class="p-2 hover:bg-primary-soft cursor-pointer transition-all"
          :class="{
            'text-primary font-semibold': selectedItems.includes(option),
          }"
        >
          {{ option.label }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    options: {
      type: Array,
      required: true,
    },
    initialValue: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  computed: {
    selectedItems: {
      get() {
        return this.value;
      },
      set(newVal) {
        this.$emit("input", newVal);
      },
    },
  },
  methods: {
    toggleDropdown() {
      if (this.disabled) return;
      this.isOpen = !this.isOpen;
    },
    toggleItem(item) {
      if (this.selectedItems.includes(item)) {
        this.removeItem(item);
      } else {
        this.selectedItems = [...this.selectedItems, item];
      }
    },
    removeItem(item) {
      this.selectedItems = this.selectedItems.filter((i) => i !== item);
      

    },
    handleClickOutside(event) {
      console.log(
        this.$refs.dropdown && !this.$refs.dropdown.contains(event.target)
      );

      if (this.$refs.dropdown && !this.$refs.dropdown.contains(event.target)) {
        this.isOpen = false;
      }
    },
  },
  mounted() {
  
    if (this.initialValue.length > 0) {
      this.selectedItems = this.initialValue;
    }

    document.addEventListener("click", this.handleClickOutside);
  },
  beforeDestroy() {

    document.removeEventListener("click", this.handleClickOutside);
  },
});
</script>

<style scoped>

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
