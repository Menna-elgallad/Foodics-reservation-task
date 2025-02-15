<template>
  <transition name="slide-fade">
    <div
      v-if="isVisible"
      class="fixed px-4 py-2 top-4 right-4 border-2 min-w-96 border-primary-light bg-white rounded-lg"
    >
    <div class="flex items-center justify-between">
      <span>{{ message }} </span>
      <button
        @click="hideToast"
        class="ml-4 p-1 rounded hover:bg-opacity-25 hover:bg-gray-400"
      >
        &times;
      </button>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      isVisible: false,
      message: "",
    };
  },
  computed: {},
  methods: {
    showToast(message: string, type = "info", duration = 3000) {
      this.message = message;
      this.isVisible = true;

      setTimeout(() => {
        this.hideToast();
      }, duration);
    },
    hideToast() {
      this.isVisible = false;
    },
  },
});
</script>

<style>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease-out;
}
.slide-fade-enter {
  transform: translateX(20px);
  opacity: 0;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
