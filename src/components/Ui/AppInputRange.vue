<template>
    <div ref="timeInput" class="flex justify-between items-center px-3 border rounded-lg bg-white relative focus:ring-2 focus:ring-primary-light focus:border-primary" tabindex="0">
      <input
        type="text"
        class="outline-none w-10 text-sm "
        :value="displayValue[0]"
        @input="(e) => handleInput(e, 0)"
        @click="setCursorPosition($event)"
        maxlength="5"
        placeholder="00:00"
      />
      <span class="mx-2"> - </span>
      <input
        type="text"
        class="outline-none w-10 text-sm "
        :value="displayValue[1]"
        @input="(e) => handleInput(e, 1)"
        @click="[setCursorPosition($event)]"
        maxlength="5"
        placeholder="00:00"
      />
      <button type="button" class="rounded-full w-4 h-4 flex items-center justify-center bg-red-300 absolute -right-2 -top-1" @click="removeTime"> - </button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      value: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        displayValue: [...this.value], // Local copy of the value for display
      };
    },
    watch: {
      value(newValue) {
        // Sync the prop value with the local display value
        this.displayValue = [...newValue];
      },
    },
    methods: {
      handleInput(event, index) {
        const target = event.target;
        const cursorPosition = target.selectionStart; 
        let value = target.value.replace(/[^0-9]/g, ""); 
  
   
        if (value.length > 2) {
          value = value.slice(0, 2) + ":" + value.slice(2, 4);
        }

        const [hours, minutes] = value.split(":");
        if (hours && parseInt(hours) > 23) value = "23:" + (minutes || "00");
        if (minutes && parseInt(minutes) > 59) value = (hours || "00") + ":59";
  
     
        this.displayValue[index] = value;
  
  
        this.$emit("input", [
          ...this.displayValue.slice(0, index),
          value,
          ...this.displayValue.slice(index + 1),
        ]);
  
        this.$nextTick(() => {
          target.setSelectionRange(cursorPosition, cursorPosition);
        });
      },
      removeTime() {
        this.$emit("remove");
      },
      setCursorPosition(event) {
        const target = event.target;
        const cursorPosition = event.target.selectionStart;
  
       
        this.$nextTick(() => {
          target.setSelectionRange(cursorPosition, cursorPosition);
        });
      },
    },
  };
  </script>
