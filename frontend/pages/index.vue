<template>
    <v-app class="bg-style">
        <v-container>
            <v-row justify="center" align="center">
                <v-col cols="12" md="6">
                    <div>
                        <div class="text-center text-md-start ">
                            <div class="logo-box md-6 mx-auto mx-md-0">
                                <div class="logo-ring"></div>
                                <v-sheet width="150" height="150" rounded="circle" elevation="8" class="logo-float d-flex justify-center align-center">
                                    <v-img src="/img/logo.png" width="200" height="200"></v-img>
                                </v-sheet>
                            </div>
                            <div class="text-display-small font-weight-bold md-1 mt-3">
                                <span class="text-blue-grey-darken-4">วิทยาลัยเทคนิค<span class="text-blue-lighten-2">น่าน</span></span>
                            </div>
                            <div class="text-title-medium text-medium-emphasis mb-6">NTC Evaluation System - ระบบประเมินบุคลากร</div>

                            <ClientOnly>
                                <v-chip size="large" variant="elevated" color="white" class="mb-6">
                                    <v-icon icon="mdi-circle" color="success" size="10" class="me-3 blink"></v-icon>
                                    <span class="text-title-large font-weight-bold me-3"> {{ time }} </span>
                                    <span class="text-body-medium text-medium-emphasis"> {{ date }} </span>
                                </v-chip>
                            </ClientOnly>

                            <v-card rounded="xl" variant="outlined" color="grey-lighten-2" class="bg-white pa-4 d-none d-md-0">
                                <div class="text-body-medium font-weight-bold text-black mb-3">การเข้าใช้งานระบบ</div>
                                <v-list density="compact" bg-color="transpent">
                                    <v-list-item v-for="r in roles" :key="r.title" :title="r.title" :subtitle="r.detail" :prepend-icon="r.icon" class="px-0 text-blck"></v-list-item>
                                </v-list>
                            </v-card>
                        </div>
                    </div>
                </v-col>
                <v-col cols="12" md="5" sm="8" offset-md="1">
                    <v-card rounded="xl" elevation="12" class="pa-4">
                            <v-chip variant="tonal" color="info" size="small" prepend-icon="mdi-clock-outline" class="mb-4">{{ greeting }}</v-chip>
                            <div class="d-flex align-center mb-1">
                                <v-img class="me-3" src="/img/logo.png" max-width="50" height="50"></v-img>
                                <h3 class="text-headline-large font-weight-bold">เข้าสู่ระบบ</h3>
                            </div>
                            <div class="text-body-medium text-medium-emphasis mb-6">กรุณาลงชื่อเข้าใช้เพื่อเข้าสู่ระบบ</div>
                            <v-alert rounded="lg" v-if="error" variant="tonal" type="error" class="mb-2 shake">{{ error }}</v-alert>
                            <v-form @submit.prevent="login">
                                <v-row>
                                    <v-col cols="12" md="12">
                                        <v-text-field label="ชื่อผู้ใช้" v-model="username" variant="outlined" prepend-inner-icon="mdi-account-circle"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="12">
                                        <v-text-field label="รหัสผ่าน" v-model="password" variant="outlined" prepend-inner-icon="mdi-lock" :append-inner-icon="show ? 'mdi-eye':'mdi-eye-off'" :type="show ? 'text':'password'" @click:append-inner="show = !show"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="12">
                                        <v-select label="ประเภทสมาชิก" v-model="role"  variant="outlined" prepend-inner-icon="mdi-account-group" :items="typeR"></v-select>
                                    </v-col>
                                    <v-col cols="12" md="12">
                                        <v-checkbox v-model="remember" label="จดจำฉัน" density="compact" hide-details class="mb-4"></v-checkbox>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" md="12">
                                        <center>
                                            <v-btn class="red-button text-center text-white py-8" rounded="lg" block append-icon="mdi-arrow-right" type="submit">เข้าสู่ระบบ</v-btn>
                                        </center>
                                    </v-col>
                                </v-row>
                            </v-form>
                            <center>
                                <p class="text-center">หากไม่มีบัญชี <nuxt-link to="/regis" class="text-red-lighten-2">สมัครสมาชิก</nuxt-link></p>
                            </center>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script setup lang="ts">
import axios from 'axios'
import auth from '~/API/auth'
import { api } from '~/API/base'

definePageMeta({

    layout:false

})
const error = ref('')
const pic_user = ref<File | null>(null)
const show = ref(false)
const remember = ref(false)
const typeR = ['ฝ่ายบุคลากร','ผู้รับการประเมินผล','กรรมการประเมิน']
const username = ref('')
const password = ref('')
const role = ref('')

const roles = ref([
    {title:'ฝ่ายบุคลากร',detail:'จัดการการประเมินเช่น จัดการผู้รับและกรรมการประเมิน จัดการหัวข้อและตัวชี้วัด และจัดการรอบการประเมิน',icon:'mdi-account-tie'},
    {title:'ผู้รับการประเมินผล',detail:'แก้ไขข้อมูลส่วนตัว ประเมินตนเองและรายงานผลการประเมิน',icon:'mdi-account-school'},
    {title:'กรรมการประเมิน',detail:'ประเมินผลผู้รับการประเมินผล แนบลายเซ็น',icon:'mdi-account-star'},
])

let timer:any

const now = ref(new Date())

onMounted(()=>{
    timer = setInterval(()=>(now.value = new Date()),1000)

    const saved = localStorage.getItem('saveUser')
    if(saved){
        username.value = saved
        remember.value = false
    }
})
onUnmounted(() => clearInterval(timer))

const time = computed(()=>now.value.toLocaleTimeString('th-TH'))
const date = computed(()=>now.value.toLocaleDateString('th-TH',{weekday:'narrow',day:'numeric',month:'narrow',year:'numeric'})) 

const greeting = computed(()=>{
    const h = now.value.getHours()
    if(h < 12)return'สวัสดีตอนเช้า'
    if(h < 17)return'สวัสดีตอนบ่าย'
    return 'สวัสดีตอนเย็น'
})
    


const login = async()=>{
    try {
        const res = await auth.login({
            username:username.value,
            password:password.value,
            role:role.value
        })
        localStorage.setItem('token',res.data.token)

        if(remember.value)localStorage.setItem('saveUser',username.value)
        else localStorage.removeItem('saveUser')

        if(remember.value)localStorage.setItem('statusPw','n')
        else localStorage.removeItem('statusPw')



        alert("ดำเนินการสำเร็จ")
        if(res.data.statusPw)return navigateTo('/Evaluatee/changePw')

        const useRole = res.data.role
        if(useRole === 'ฝ่ายบุคลากร')useRouter().push('/Staff')
        if(useRole === 'ผู้รับการประเมินผล')useRouter().push('/Evaluatee')
        if(useRole === 'กรรมการประเมิน')useRouter().push('/Committee')
    } catch (err:any) {
        console.error("error save",err)
        error.value = err.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ'
    }
}
</script>

<style scoped>
.bg-style{
    background: linear-gradient(135deg,white 0%,rgb(255, 239, 239) 25%,rgb(234, 248, 255) 70%);
}

.red-button{
    background: linear-gradient(135deg,rgb(255, 56, 56),rgb(255, 76, 115));
}

.logo-box{
    position: relative;
    width: 200px;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.logo-ring{
    position: absolute;
    inset: 0;
    border: 2px solid transparent;
    border-radius: 50%;
    border-bottom-color: #f03845;
    border-top-color: #007fff;
    animation: spin 3s infinite linear;
}

@keyframes spin{
    to {transform: rotate(360deg);}
}
</style>