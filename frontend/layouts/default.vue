<template>
    <v-app>
        <v-app-bar :color="bg(user.role)" elevation="5" class="rounded-b">
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title class="font-weight-bold">NTC EVALUATION SYSTEM</v-toolbar-title>
            <v-spacer></v-spacer>

            <p class="text-center">คุณ : {{ user.fname }} {{ user.lname }} <br> {{ user.role }}</p>
            <v-btn variant="text" icon="mdi-logout" @click="logout"></v-btn>
        </v-app-bar>

        <v-navigation-drawer app color="#404040" v-model="drawer" width="260" :temporary="isMobile" :permanent="!isMobile">
            <v-list density="comfortable">
                <v-list-item>
                    <v-list-item-title class="font-weight-bold">NTC EVALUATION SYSTEM</v-list-item-title>
                    <div class="mt-2">
                        <v-chip color="white" variant="outlined"  >{{ user.role }}</v-chip>
                    </div>
                </v-list-item>
            </v-list>

            <v-divider color="white" opacity="0.5"></v-divider>

            <v-list density="comfortable">
                <v-list-item v-for="[title,to] in navitem" :key="to" :to="to">
                    <v-list-item-title class="font-weight-bold">
                        {{ title }}
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-main>
            <v-container fluid class="py-2">
                <slot></slot>
            </v-container>
            <v-footer class="text-caption justify-center">© 2026 NTC EVALUATION SYSTEM</v-footer>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">    
import axios from 'axios'
import { useDisplay } from 'vuetify';
import { api } from '~/API/base';

const {mdAndDown} = useDisplay()
const isMobile = computed(()=> mdAndDown.value)
const user = ref<any>({})
const drawer =ref(false)


const logout = ()=>{
    if(!confirm('ท่านต้องการออกจากระบบใช่หรือไม่'))return
    localStorage.removeItem('token')
    navigateTo('/',{replace:true})
}

const roles: Record<string,[string,string][]> = {
    'ฝ่ายบุคลากร':[
        ['หน้าหลัก','/Staff/'],
        ['จัดการผู้รับการประเมินผล','/Staff/Manage_eva'],
        ['จัดการกรรมการประเมิน','/Staff/Manage_commit'],
        ['จัดการหัวข้อการประเมิน','/Staff/Topic'],
        ['จัดการตัวชี้วัดการประเมิน','/Staff/Indicate'],
        ['จัดการรอบการประเมิน','/Staff/Round'],
        ['จัดการแบบประเมิน','/Staff/Eva'],
        ['ผลการประเมินของผู้รับการประเมินผล','/Staff/Score_evaList'],
        ['ผลการประเมินของกรรมการประเมิน','/Staff/Score_commitList'],
        ['สถานะการประเมินของผู้รับการประเมิน','/Staff/Status_eva'],
        ['สถานะการประเมินของกรรมการประเมิน','/Staff/Status_comit'],
        ['เอกสารหรือคู่มือการประเมิน','/Staff/Document'],
        ['รายงานชื่อผู้รับการประเมินผล','/Staff/Report'],
    ],
    
    'ผู้รับการประเมินผล':[
        ['หน้าหลัก','/Evaluatee/'],
        ['แก้ไขข้อมูลส่วนตัว','/Evaluatee/Edit_eva'],
        ['แบบประเมินตนเอง','/Evaluatee/Selfeva'],
        ['ตรวจสอบผลการประเมิน','/Evaluatee/Check_score'],
        ['รายงานคะแนนการประเมิน','/Evaluatee/Report'],
        ['คู่มือการประเมิน','/Evaluatee/Doc'],
    ],

    'กรรมการประเมิน':[
        ['รายชื่อผู้รับการประเมินผล','/Committee/'],
        ['ดำเนินการประเมิน','/Committee/Show_eva'],
        ['ตรวจสอบและยืนยัน','/Committee/Check_confirm'],
        ['คู่มือการประเมิน','/Committee/Doc'],
    ]
}

const navitem = computed(()=> roles[user.value.role] || [])

const fetch = async()=>{
    const token = localStorage.getItem('token')
    if(!token){
        return navigateTo('/',{replace:true})
    }
    try {
        const res = await axios.get(`${api}/profile`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
    } catch (error) {
        console.error('Error Get',error)
        localStorage.removeItem('token')
        navigateTo('/')
    }
}
onMounted(fetch)

const bg = (role:string)=>{
    if(role === 'ฝ่ายบุคลากร')return '#647687'
    if(role === 'กรรมการประเมิน')return '#007fff'
    if(role === 'ผู้รับการประเมินผล')return '#7d0c14'
}
</script>

<style scoped>
@media print {
    .v-app-bar,.v-btn,.no-p{
        display: none !important;
        margin-top: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        width: 0 !important;
    }
}
</style>