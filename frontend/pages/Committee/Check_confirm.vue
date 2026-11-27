ts<template>
    <v-app>
        <v-container>
            <v-row justify="center">
                <v-col cols="12" md="12">
                    <page-header title="ตรวจสอบผลและยืนยัน" icon="mdi-draw" subtitle="ยืนยันผลการประเมิน" color="#007fff"></page-header>
                    <v-card rounded="xl" elevation="5" class="mt-4">
                        <v-table class="mt-3" hover>
                            <thead>
                                <tr>
                                    <th class="text-center">ลำดับ</th>
                                    <th class="text-center">ชื่อ</th>
                                    <th class="text-center">นามสกุล</th>
                                    <th class="text-center">วันที่ออกแบบประเมิน</th>
                                    <th class="text-center">รอบการประเมิน</th>
                                    <th class="text-center">ตรวจสอบ</th>
                                    <th class="text-center">ยืนยันผล</th>
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
                                        <center>
                                            <v-btn   variant="outlined"  size="small" @click="check(items.id_eva)" color="info" prepend-icon="mdi-eye">ตรวจสอบ</v-btn>
                                        </center>
                                    </td>
                                    <td class="text-center">
                                        <center>
                                            <v-btn v-if="items.signature"   variant="outlined"  size="small" @click="go(items.id_eva)" color="green" prepend-icon="mdi-check">ยืนยันผลแล้ว</v-btn>
                                            <v-btn  v-else variant="outlined"  size="small" @click="go(items.id_eva)" color="info" prepend-icon="mdi-pen">ยืนยันผล</v-btn>
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
        const res = await axios.get(`${commit}/check`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res.data

    } catch (error) {
        console.error("Error get",error);
        
    }
}



const result = ref([])

const formatDate = (dateStr:string)=>{
    const day = new Date(dateStr)
    return day.toLocaleDateString('th-TH')
}

const go=(id_eva:number)=>{
    navigateTo({path:`/Committee/Signature/${id_eva}`})
}

const check=(id_eva:number)=>{
    navigateTo({path:`/Committee/Score_commit/${id_eva}`})
}


onMounted(fetch)
</script>

<style scoped>

</style>