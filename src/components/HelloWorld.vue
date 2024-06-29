<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps({
  msg: String,
});

const msg = ref('hello');
const count = ref(0);
</script>
