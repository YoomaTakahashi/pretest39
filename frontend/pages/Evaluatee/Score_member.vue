<template>
    <v-container>
        <PageHeader title="คะแนนประเมินตนเอง" subtitle="ดูคะแนนและดูไฟล์ได้" icon="mdi-account-school" color="#7d0c14"></PageHeader>

        <v-form v-if="user.status_eva === 2 || user.status_eva === 3">
            <v-card rounded="xl" hover-elevation="4" elevation="2" class="pa-4">
                <v-list-item :title="`${user.fname}-${user.lname}`" :subtitle="`รอบที่ ${user.round_sys } ปี ${user.year_sys}`" prepend-icon="mdi-account-circle"></v-list-item>
            </v-card>

            <v-card v-for="(topic,t) in topics" :key="topic.id_topic" hover-elevation="5" elevation="2" rounded="xl" class="mb-6 mt-4">
                <v-card-title class="pa-4 bg-grey" >{{ Number(t)+1 }}.{{ topic.name_topic }}</v-card-title>
                <v-table hover>
                    <thead>
                        <tr>
                            <th class="text-center">ตัวชี้วัด</th>
                            <th class="text-center">รายละเอียดตัวชี้วัด</th>
                            <th class="text-center">น้ำหนักคะแนน</th>
                            <th class="text-center">คะแนนเต็ม</th>
                            <th class="text-center">ไฟล์เอกสาร</th>
                            <th class="text-center">รายละเอียด</th>
                            <th class="text-center">คะแนนที่ได้</th>
                        </tr>
                        <tr v-for="(indicate,i) in topic.indicates" :key="indicate.id_indicate">
                            <td class="text-center">{{ indicate.name_indicate }}</td>
                            <td class="text-center">{{ indicate.detail_indicate }}</td>
                            <td class="text-center">{{ indicate.point_indicate }}</td>
                            <td class="text-center">{{ indicate.point_indicate*4 }}</td>
                            <td class="text-center">
                                <v-btn color="info" variant="outlined" prepend-icon="mdi-eye" @click="view(indicate.file_eva)" v-if="indicate.file_eva">เปิดดู</v-btn>
                                <span v-else>-</span>
                            </td>
                            <td class="text-center">{{ indicate.detail_eva ?? '-' }}</td>
                            <td class="text-center">{{ indicate.point_indicate*indicate.score_member }}</td>
                        </tr>
                    </thead>
                </v-table>
            </v-card>
            <div class="text-end">
                <v-alert color="green" rounded="lg" ><v-icon icon="mdi-trophy"></v-icon>คะแนนรวม : {{ user.total_eva }}คะแนน</v-alert>
            </div>
        </v-form>
        <v-alert color="warning" type="warning" v-else-if="user.status_eva === 1" variant="tonal" rounded="xl">รอการประเมินตนเอง</v-alert>
        <v-alert type="error" v-else variant="tonal" rounded="xl">ไม่มีแบบประเมิน</v-alert>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { api, eva } from '~/API/base';

const user = ref<any>({})
const topics  =ref<any>([])

const view = (file:string)=>{
    const url = new URL(`/uploads/file_eva/${file}`,api).href
    window.open(url,'_blank')
}

const fetch = async()=>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${eva}/selfeva/user`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
        const res2 = await axios.get(`${eva}/score_member/topic`,{headers:{Authorization:`Bearer ${token}`}})
        topics.value = res2.data
    } catch (error) {
        console.error('Error get',error)
    }
}

onMounted(fetch)


</script>

<style scoped>

</style>