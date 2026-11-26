<template>
    <v-card :color="color" rounded="xl" elevation="5" class="mb-6 pa-6">
        <div class="d-flex align-center"></div>
        <v-icon :icon="icon" size="40"class="me-4"></v-icon>
        <div>
            <div class="text-headline-small font-weight-bold">{{ title }}</div>
            <div class="text-body-medium" v-if="subtitle">{{ subtitle }}</div>
        </div>
    </v-card>
</template>

<script setup lang="ts">
defineProps({
    title:String,
    subtitle:String,
    icon:String,
    color:{type: String ,default:'blue-grey'}
})
</script>

<style scoped>

</style>