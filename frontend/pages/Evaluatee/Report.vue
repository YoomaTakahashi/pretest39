<template>
    <v-container>
        <PageHeader title="รายงานคะแนนการประเมิน" subtitle="คะแนนที่กรรมการประเมินและลายเซ็นการประเมิน" icon="mdi-file-chart" color="#7d0c14"></PageHeader>

        <v-form v-if="user.status_eva === 3">

            <v-card v-for="(topic,t) in topics" :key="topic.id_topic" hover-elevation="5" elevation="2" rounded="xl" class="mb-6 mt-4">
                <v-card-title class="pa-4 bg-grey" >{{ Number(t)+1 }}.{{ topic.name_topic }}</v-card-title>
                <v-table hover>
                    <thead>
                        <tr>
                            <th class="text-center">ตัวชี้วัด</th>
                            <th class="text-center">รายละเอียดตัวชี้วัด</th>
                            <th class="text-center">น้ำหนักคะแนน</th>
                            <th class="text-center">คะแนนเต็ม</th>
                            <th class="text-center">คะแนนที่ได้</th>
                        </tr>
                        <tr v-for="(indicate,i) in topic.indicates" :key="indicate.id_indicate">
                            <td class="text-center">{{ indicate.name_indicate }}</td>
                            <td class="text-center">{{ indicate.detail_indicate ?? "-" }}</td>
                            <td class="text-center">{{ indicate.point_indicate }}</td>
                            <td class="text-center">{{ indicate.point_indicate*4 }}</td>
                            <td class="text-center">{{ averge(indicate.id_indicate) }}</td>
                        </tr>
                    </thead>
                </v-table>
            </v-card>
            <div class="text-end">
                <v-alert color="green" rounded="lg" hover-elevation="3" elevation="2" ><v-icon icon="mdi-trophy"></v-icon>คะแนนรวมสุทธิ : {{ ((user.total_commit)/3).toFixed(2) }}คะแนน</v-alert>
            </div>

            <v-card class="mt-4" elevation="5" rounded="xl" >
                <v-card-title class="pa-4">
                    <v-icon icon="mdi-comment-text" color="error"></v-icon>
                    ข้อเสนอแนะของกรรมการ
                </v-card-title>
                <v-list>
                    <v-list-item v-for="commit in commits" :key="commit.id_commit" :title="commit.level_commit" :subtitle="commit.detail_commit || 'รอการประเมิน'" prepend-icon="mdi-account-tie"></v-list-item>
                </v-list>
            </v-card>
        </v-form>
        <v-alert color="warning" type="warning" v-else-if="user.status_eva === 2" variant="tonal" rounded="xl">รอกรรมการประเมิน</v-alert>
        <v-alert color="warning" type="warning" v-else-if="user.status_eva === 1" variant="tonal" rounded="xl">ยังไม่ได้ประเมินตนเอง</v-alert>
        <v-alert type="error" v-else variant="tonal" rounded="xl">ไม่มีแบบประเมิน</v-alert>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { api, eva } from '~/API/base';

const user = ref<any>({})
const topics  =ref<any>([])
const commits  =ref<any>([])
const scores  =ref<any>([])

const averge = (id:number)=>{
    const s = scores.value[id] ?? {}
    return (((s.a ?? 0)+(s.b ?? 0)+(s.c ?? 0))/3).toFixed(2)
    
}

const fetch = async()=>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${eva}/selfeva/user`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
        const res2 = await axios.get(`${eva}/selfeva/topic`,{headers:{Authorization:`Bearer ${token}`}})
        topics.value = res2.data
        const res3 = await axios.get(`${eva}/score_commit/commit`,{headers:{Authorization:`Bearer ${token}`}})
        commits.value = res3.data
        const res4 = await axios.get(`${eva}/score_commit/scores`,{headers:{Authorization:`Bearer ${token}`}})
        scores.value = res4.data
    } catch (error) {
        console.error('Error get',error)
    }
}

onMounted(fetch)


</script>

<style scoped>

</style>    