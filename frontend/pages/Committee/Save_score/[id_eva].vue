<template>
    <v-container>
        <PageHeader title="แบบประเมิน" subtitle="ใส่คะแนน 1-4" icon="mdi-clipboard-edit" color="#007fff"></PageHeader>

        <v-form v-if="user.status_commit === 'n'" @submit.prevent="saveScore">
            <v-card rounded="xl" hover-elevation="4" elevation="2" class="pa-4">
                <v-list-item :title="`${user.fname}-${user.lname}`" :subtitle="`รอบที่ ${user.round_sys } ปี ${user.year_sys}`" prepend-icon="mdi-account-circle"></v-list-item>
            </v-card>

            <v-card v-for="(topic,t) in topics" :key="topic.id_topic" hover-elevation="5" elevation="2" rounded="xl" class="mb-6 mt-4">
                <v-card-title class="pa-4 bg-grey" >{{ Number(t)+1 }}.{{ topic.name_topic }}</v-card-title>

                <v-card-text v-for="(indicate,i) in topic.indicates" :key="indicate.id_indicate">
                    <div class="text-title-medium font-weight-bold">{{ Number(t)+1 }}.{{ Number(i)+1 }}.{{ indicate.name_indicate }}</div>
                    <div class="text-medium-small text-phasis">{{ indicate.detail_indicate }}</div>
                    <v-chip size="small" class="me-2 mb-4">น้ำหนักคะแนน : {{ indicate.point_indicate }}</v-chip>
                    <v-chip size="small" class="mb-4" color="info">น้ำหนักคะแนน : {{ indicate.point_indicate*4 }}</v-chip>
                    <v-alert rounded="lg" elevation="2">
                        
                    </v-alert>
                    <v-divider v-if="Number(i) < topic.indicates.length - 1"></v-divider>
                </v-card-text>
            </v-card>
            <div class="text-center">
                <v-btn color="#007fff" size="large" prepend-icon="mdi-content-save" type="submit">บันทึกคะแนน</v-btn>
            </div>
        </v-form>
        <v-alert color="warning" type="warning" v-else-if="user.status_eva === 1" variant="tonal" rounded="xl">ยังไม่ได้ประเมินตนเอง</v-alert>
        <v-alert color="success" type="success" v-else-if="user.status_commit === 'y'" variant="tonal" rounded="xl">ประเมินสำเร็จ</v-alert>
        <v-alert type="error" v-else variant="tonal" rounded="xl">ไม่มีแบบประเมิน</v-alert>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { commit, eva } from '~/API/base';

const user = ref<any>({})
const topics  =ref<any>([])
const detail_commit = ref('')

const id_eva = useRoute().params.id_eva

const fetch = async()=>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${commit}/save/user/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
        const res2 = await axios.get(`${commit}/save/topic/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        topics.value = res2.data
    } catch (error) {
        console.error('Error get',error)
    }
}

onMounted(fetch)




const saveScore = async()=>{
    const token = localStorage.getItem('token')
    const formData =new FormData()
    const allScore = topics.value.flatMap((t:any)=>
        t.indicates.map((i:any)=>{
            return{
                id_topic:t.id_topic,
                id_indicate:i.id_indicate,
                score:i.score,
            }
        })
    )
    if(allScore.some((s:any)=> !s.score)){
        alert('กรุณากรอกคะแนนให้สมบูรณ์')
        return
    }
    formData.append('scores',JSON.stringify(allScore))
    const detail_commitTo = detail_commit.value && detail_commit.value.trim() ? detail_commit.value : ''
    formData.append('detail_commit',detail_commitTo)
    try {
        await axios.post(`${commit}/save/save/${id_eva}`,formData,{headers:{Authorization:`Bearer ${token}`}})
        alert('ประเมินสำเร็จ')
        fetch()
    } catch (error) {
        console.error('Error post',error)
    }
}
</script>

<style scoped>

</style>