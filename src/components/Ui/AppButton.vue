<template>
    <button
      :class="buttonClasses"
      :disabled="loading || disabled"
      @click="$emit('click')"
    >
      <span v-if="loading" class="loader"></span>
      <slot v-else></slot>
    </button>
  </template>
  
  <script>
  export default {
    props: {
      variant: {
        type: String,
        default: "primary", 
        validator: (value) => ["primary", "secondary"].includes(value),
      },
      loading: {
        type: Boolean,
        default: false,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      buttonClasses() {
        return [
          "px-3 py-2 transition-all enabled:hover:opacity-90 block rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary focus:ring-primary-light",
          this.variant === "primary"
            ? "bg-primary text-white "
            : "border bg-white border-gray-300 ",
          this.loading || this.disabled ? "opacity-50 cursor-not-allowed" : "",
        ];
      },
    },
  };
  </script>
  
  <style scoped>
  .loader {
    border: 2px solid white;
    border-top: 2px solid transparent;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    animation: spin 0.6s linear infinite;
    display: inline-block;
    margin-bottom: -2px;
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  </style>
  