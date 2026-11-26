<template>
    <v-container>
        <PageHeader title="แบบประเมินตนเอง" subtitle="ใส่คะแนน 1-4 และแนบไฟล์ประเมินได้" icon="mdi-clipboard-edit" color="#7d0c14"></PageHeader>

        <v-card rounded="xl" elevation="4" class="pa-4">
            <v-list-item class="text-medium text-phasis" :title="`${user.fname}-${user.lname}`" :subtitle="`รอบที่ ${user.round_sys } ปี ${user.year_sys}`" prepend-icon="mdi-account-circle"></v-list-item>
        </v-card>

        <v-card v-for="(topic,t) in topics" :key="topic.id_topic" rounded="xl" elevation="4" class="pa-5">
            <v-card-title class="text-medium bg-grey" >{{ Number(t)+1 }}.{{ topic.name_topic }}</v-card-title>

            <v-card ></v-card>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { eva } from '~/API/base';

const user = ref<any>({})
const topics  =ref<any>([])

const fetch = async()=>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${eva}/selfeva/user`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
        const res2 = await axios.get(`${eva}/selfeva/topic`,{headers:{Authorization:`Bearer ${token}`}})
        topics.value = res2.data
    } catch (error) {
        console.error('Error get',error)
    }
}

onMounted(fetch)

</script>

<style scoped>

</style>