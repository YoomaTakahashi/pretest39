<template>
    <v-container>
        <PageHeader title="ตรวจสอบผลการประเมิน" subtitle="สามารถเลือกฝ่ายที่จะตรวจสอบคะแนน" icon="mdi-clipboard-search" color="#7d0c14"/>

        <v-row>
            <v-col cols="12" md="6" v-for="m in menus" :key="m.to">
                <v-card :to="m.to" rounded="xl" elevation="5" class="pa-6">
                    <div class="d-flex align-center">
                        <v-avatar :color="m.color" size="64" class="me-4">
                            <v-icon :icon="m.icon" color="white" size="32"></v-icon>
                        </v-avatar>
                        <div>
                            <div class="text-title-large font-weight-bold">{{ m.title }}</div>
                            <div class="text-body-medium text-medium-phasis">{{ m.detail }}</div>
                        </div>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
const menus = [
    {title:'ผลการประเมินตนเอง',detail:'ผลการประเมินที่ท่านได้ทำการประเมิน',icon:'mdi-account-school',color:'blue',to:'/Evaluatee/Score_member'},
    {title:'ผลการประเมินของกรรมการประเมิน',detail:'ผลการประเมินที่กรรมการประเมิน',icon:'mdi-account-star',color:'green',to:'/Evaluatee/Score_commit'}
]
</script>

<style scoped>

</style>