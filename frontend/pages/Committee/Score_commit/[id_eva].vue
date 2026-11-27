<template>
    <v-container>
        <PageHeader title="คะแนนประเมินตนเอง" subtitle="ดูคะแนนและดูไฟล์ได้" icon="mdi-account-school" color="#007fff"></PageHeader>

        <v-form v-if="user.status_commit === 'y'">
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
                            <th class="text-center">คะแนนที่ได้</th>
                        </tr>
                        <tr v-for="(indicate,i) in topic.indicates" :key="indicate.id_indicate">
                            <td class="text-center">{{ indicate.name_indicate }}</td>
                            <td class="text-center">{{ indicate.detail_indicate }}</td>
                            <td class="text-center">{{ indicate.point_indicate }}</td>
                            <td class="text-center">{{ indicate.point_indicate*4 }}</td>
                            <td class="text-center">{{ indicate.point_indicate*indicate.score_commit }}</td>
                        </tr>
                    </thead>
                </v-table>
            </v-card>
            <div class="text-end">
                <v-alert color="green" rounded="lg" ><v-icon icon="mdi-trophy"></v-icon>คะแนนรวม : {{ ((user.total_commit)/3).toFixed(2)}}คะแนน</v-alert>
            </div>
        </v-form>
        <v-alert color="warning" type="warning" v-else-if="user.status_commit === 'n'" variant="tonal" rounded="xl">รอการประเมิน</v-alert>
        <v-alert type="error" v-else variant="tonal" rounded="xl">ไม่มีแบบประเมิน</v-alert>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { api, commit, eva } from '~/API/base';

const user = ref<any>({})
const topics  =ref<any>([])

const id_eva = useRoute().params.id_eva

const fetch = async()=>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${commit}/score_commit/user/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
        const res2 = await axios.get(`${commit}/score_commit/topic/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        topics.value = res2.data
    } catch (error) {
        console.error('Error get',error)
    }
}

onMounted(fetch)


</script>

<style scoped>

</style>