<template>
  <dialog
    class="rounded-lg overflow-visible"
    ref="dialog"
    @close="handleClose"
    @click="handleClickOutside"
  >
    <div
      v-if="$slots.header && isVisible"
      class="border-b rounded-t-lg bg-white fixed z-10 w-full font-semibold sm:text-xl text-lg p-5 leading-none"
    >
      <slot name="header"></slot>
    </div>
    <div v-if="isVisible" class="bg-stone-50 rounded-lg" @click.stop>
      <slot />
    </div>
  </dialog>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "ModalDialog",
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      isVisible: this.value,
    };
  },
  watch: {
    value(newVal: boolean) {
      this.isVisible = newVal;
      newVal ? this.show() : this.close();
    },
  },
  methods: {
    show(): void {
      (this.$refs.dialog as HTMLDialogElement)?.showModal();
      this.isVisible = true;
      this.$emit("input", true);
    },
    close(): void {
      (this.$refs.dialog as HTMLDialogElement)?.close();
      this.isVisible = false;
      this.$emit("input", false);
    },
    handleClose(): void {
      this.isVisible = false;
      this.$emit("input", false);
    },
    handleClickOutside(event: MouseEvent): void {
      if (event.target === this.$refs.dialog) {
        this.close();
      }
    },
    handleEsc(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        this.close();
      }
    },
  },
  mounted() {
    document.addEventListener("keydown", this.handleEsc);
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.handleEsc);
  },
});
</script>

<style scoped>
dialog {
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 0.2s ease-out, transform 0.2s ease-out,
    overlay 0.2s ease-out allow-discrete, display 0.2s ease-out allow-discrete;
}

dialog:open {
  opacity: 1;
  transform: scale(1);
}

@starting-style {
  dialog:open {
    opacity: 0;
    transform: scale(0.95);
  }
}

dialog::backdrop {
  background-color: rgba(0, 0, 0, 0%);
  backdrop-filter: blur(0px);
  transition: display 0.2s allow-discrete, overlay 0.2s allow-discrete,
    background-color 0.2s ease-out, backdrop-filter 0.2s ease-out;
}

dialog:focus-visible {
  outline: none;
}

dialog:open::backdrop {
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
}

@starting-style {
  dialog:open::backdrop {
    background-color: rgba(0, 0, 0, 0%);
    backdrop-filter: blur(0px);
  }
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: #5f27cd;
  border-radius: 10px;
  border: 2px solid transparent;
  background-clip: padding-box;
}
</style>
