<template>
  <div class="editor">
    <div class="editor-fields">
      <slot />
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.editor { width: 100%; }
.editor-fields { display: flex; flex-direction: column; gap: 16px; }
</style>
