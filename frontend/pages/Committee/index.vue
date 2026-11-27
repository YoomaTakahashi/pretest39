ts<template>
    <v-app>
        <v-container>
            <v-row justify="center">
                <v-col cols="12" md="12">
                    <page-header title="รายชื่อผู้รับการประเมินผล" icon="mdi-clipboard-edit" subtitle="ดำเนินการประเมินผู้รับการประเมิน" color="#007fff"></page-header>
                    <v-card rounded="xl" elevation="5" class="mt-4">
                        <v-table class="mt-3" hover>
                            <thead>
                                <tr>
                                    <th class="text-center">ลำดับ</th>
                                    <th class="text-center">ชื่อ</th>
                                    <th class="text-center">นามสกุล</th>
                                    <th class="text-center">วันที่ออกแบบประเมิน</th>
                                    <th class="text-center">รอบการประเมิน</th>
                                    <th class="text-center">สถานะการประเมิน</th>
                                    <th class="text-center">ตรวจสอบ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_eva">
                                    <td class="text-center">{{ index+1 }}</td>
                                    <td class="text-center">{{ items.fname }}</td>
                                    <td class="text-center">{{ items.lname }}</td>
                                    <td class="text-center">{{ formatDate(items.day_eva) }}</td>
                                    <td class="text-center">
                                        รอบที่ : {{ items.round_sys }} ปี {{ items.year_sys }}
                                    </td>
                                    <td class="text-center">
                                        <v-chip :color="bg(items.status_eva)" :prepend-icon="icon(items.status_eva)" variant="tonal" size="small">{{ items.status_eva === 1 ? 'รอการประเมินตนเอง':items.status_eva === 2 ? 'รอกรรมการประเมิน':'ประเมินสำเร็จ' }}</v-chip>
                                    </td>
                                    <td class="text-center">
                                        <center>
                                            <v-btn   variant="outlined"  size="small" @click="go(items.id_eva)" color="info" prepend-icon="mdi-pen">ตรวจสอบ</v-btn>
                                        </center>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="text-center text-red" v-if="result.length === 0" colspan="12">ไม่พบข้อมูล</td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script setup lang="ts">
import axios from 'axios'
import { api, commit, staff } from '~/API/base'
import PageHeader from '~/components/PageHeader.vue'





const token = import.meta.client ? localStorage.getItem('token'):null



const fetch = async()=>{
    try {
        const res = await axios.get(`${commit}/show`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res.data

    } catch (error) {
        console.error("Error get",error);
        
    }
}

const bg = (status:any)=>{
    if(status === 1)return "error"
    if(status === 2)return "warning"
    if(status === 3)return "success"
}

const icon = (status:any)=>{
    if(status === 1)return "mdi-close"
    if(status === 2)return "mdi-clock"
    if(status === 3)return "mdi-checl-circle"
}

const cards = [
    {color:'blue',icon:'mdi-file-document'},
    {color:'success',icon:'mdi-check-circle'},
    {color:'error',icon:'mdi-clock-alert'},
]

const status:any = {
    1: {text:'รอการประเมินตนเอง',color:'error'},
    2: {text:'รอกรรมการประเมิน',color:'warning'},
    3: {text:'ประเมินสำเร็จ',color:'success'},
}

const result = ref([])

const formatDate = (dateStr:string)=>{
    const day = new Date(dateStr)
    return day.toLocaleDateString('th-TH')
}

const go=(id_eva:number)=>{
    navigateTo({path:`/Committee/Score_member/${id_eva}`})
}


onMounted(fetch)
</script>

<style scoped>

</style>