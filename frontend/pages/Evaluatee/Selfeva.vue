<template>
    <v-container>
        <PageHeader title="แบบประเมินตนเอง" subtitle="ใส่คะแนน 1-4 และแนบไฟล์ประเมินได้" icon="mdi-clipboard-edit" color="#7d0c14"></PageHeader>

        <v-form v-if="user.status_eva === 1" @submit.prevent="saveScore">
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
                    <v-row>
                        <v-col cols="12" md="3">
                            <v-select v-if="indicate.check_indicate === 'y'" :items="[1,2,3,4]" label="ใส่คะแนน 1-4" variant="outlined" v-model="indicate.score"></v-select>
                            <v-text-field v-else label="ใส่คะแนน 1-4" variant="outlined" v-model="indicate.score" @input="indicate.score > 4 ? indicate.score = 4 :null" type="number" min="1"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="5">
                            <v-textarea label="คำอธิบายเพิ่มเติม (ถ้ามี)" v-model="indicate.detail_eva" rows="1" auto-grow variant="outlined"></v-textarea>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-file-input label="*** รองรับเฉพาะนามสกุล .PNG .JPG .PDF ***" v-model="indicate.file_eva" variant="outlined" @change="onFilechange($event,topic.id_topic,indicate.id_indicate)" accept=".png,.jpg,.pdf" prepend-icon="mdi-paperclip"></v-file-input>
                        </v-col>
                    </v-row>
                    <v-divider v-if="Number(i) < topic.indicates.length - 1"></v-divider>
                </v-card-text>
            </v-card>
            <div class="text-center">
                <v-btn color="#7d0c14" size="large" prepend-icon="mdi-content-save" type="submit">บันทึกคะแนน</v-btn>
            </div>
        </v-form>
        <v-alert color="success" type="success" v-else-if="user.status_eva === 2 || user.status_eva === 3" variant="tonal" rounded="xl">ประเมินสำเร็จ</v-alert>
        <v-alert type="error" v-else variant="tonal" rounded="xl">ไม่มีแบบประเมิน</v-alert>
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

const fileMap = ref<Record<string,File>>({})
const onFilechange = (event:Event,id_topic:number,id_indicate:number)=>{
    const file = (event.target as HTMLInputElement)?.files?.[0]
    if(!file)return
    fileMap.value[`${id_topic}-${id_indicate}`] = file
}


const saveScore = async()=>{
    const token = localStorage.getItem('token')
    const formData =new FormData()
    const allScore = topics.value.flatMap((t:any)=>
        t.indicates.map((i:any)=>{
            const key = `${t.id_topic}-${i.id_indicate}`
            const file = fileMap.value[key]
            if(file)formData.append(`file_${key}`,file)
            return{
                id_topic:t.id_topic,
                id_indicate:i.id_indicate,
                score:i.score,
                detail_eva:i.detail_eva,
                file_key:file ? `file_${key}` :null
            }
        })
    )
    if(allScore.some((s:any)=> !s.score)){
        alert('กรุณากรอกคะแนนให้สมบูรณ์')
        return
    }
    formData.append('scores',JSON.stringify(allScore))
    try {
        await axios.post(`${eva}/selfeva/save`,formData,{headers:{Authorization:`Bearer ${token}`}})
        alert('ประเมินสำเร็จ')
        fetch()
    } catch (error) {
        console.error('Error post',error)
    }
}
</script>

<style scoped>

</style>