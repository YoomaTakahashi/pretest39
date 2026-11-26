<template>
    <v-app class="bg-style">
        <v-container>
            <v-row justify="center">
                <v-col cols="12" md="12">
                    <v-card rounded="xl" elevation="12">
                        <v-card-title>
                            <center><v-img class="mt-3" src="/img/logo.png" width="15%"></v-img></center>
                            <h3 class="text-center font-weight-bold">สมัครสมาชิก</h3>
                            <h3 class="text-center font-weight-bold text-medium-emphasis text-body-medium">NTC Evaluation System</h3>
                        </v-card-title>
                        <v-card-text>
                            <br>
                            <v-form @submit.prevent="saveMember">
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-text-field label="ชื่อ" v-model="form.fname" :error-messages="error.fname" variant="outlined"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field label="นามสกุล" v-model="form.lname" :error-messages="error.lname" variant="outlined"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field label="อีเมล" v-model="form.email" :error-messages="error.email" variant="outlined" prepend-inner-icon="mdi-email"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field label="ชื่อผู้ใช้" v-model="form.username" :error-messages="error.username" variant="outlined" prepend-inner-icon="mdi-account-circle"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field label="รหัสผ่าน" v-model="form.password" :error-messages="error.password" variant="outlined" prepend-inner-icon="mdi-lock" :append-inner-icon="show ? 'mdi-eye':'mdi-eye-off'" :type="show ? 'text':'password'" @click:append-inner="show = !show"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field label="ยืนยันรหัสผ่าน" v-model="conP" :error-messages="error.conP" variant="outlined" prepend-inner-icon="mdi-lock" :append-inner-icon="show2 ? 'mdi-eye':'mdi-eye-off'" :type="show2 ? 'text':'password'" @click:append-inner="show2 = !show2"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-select label="ประเภทสมาชิก" v-model="form.role" :error-messages="error.role" variant="outlined" prepend-inner-icon="mdi-account-group" :items="typeR"></v-select>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-file-input label="รูปภาพสมาชิก" v-model="pic_user" :error-messages="error.pic_user" variant="outlined" prepend-icon="" prepend-inner-icon="mdi-file" accept=".png , .jpg" hint="รองรับเฉพาะไฟล์ PNG และ JPG เท่านั้น" persistent-hint></v-file-input>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" md="12">
                                        <center>
                                            <v-btn class="red-button text-center text-white w-50 py-8" append-icon="mdi-arrow-right" type="submit" rounded="lg">สมัครสมาชิก</v-btn>
                                        </center>
                                    </v-col>
                                </v-row>
                            </v-form>
                            <center>
                                <p class="text-center">หากมีบัญชีอยู่แล้ว <nuxt-link to="/" class="text-red-lighten-2">เข้าสู่ระบบ</nuxt-link></p>
                            </center>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script setup lang="ts">
import axios from 'axios'
import { api } from '~/API/base'

definePageMeta({

    layout:false

})
const error = ref<Record<string,string>>({})
const pic_user = ref<File | null>(null)
const show = ref(false)
const show2 = ref(false)
const typeR = ['ฝ่ายบุคลากร','ผู้รับการประเมินผล','กรรมการประเมิน']
const conP = ref('')
const form = ref({
    fname:'',
    lname:'',
    email:'',
    username:'',
    password:'',
    role:''
})
const emailRegex = /^[^\s]+@[^\s]+\.[^\s]{2,}$/i
function validate(){
    error.value = {}
    const f = form.value

    if(!f.fname.trim())error.value.fname = 'กรุณากรอกชื่อ'
    if(!f.lname.trim())error.value.lname = 'กรุณากรอกนามสกุล'
    if(!f.email.trim())error.value.email = 'กรุณากรอกอีเมล'
    else if(!emailRegex.test(f.email.trim()))error.value.email = 'กรุณากรอกอีเมลให้ถูกต้อง'

    if(!f.username.trim())error.value.username = 'กรุณากรอกชื่อผู้ใช้'
    else if(f.username.trim().length < 4)error.value.username = 'ชื่อผู้ใช้ต้องยาวอย่างน้อย 4 ตัวอักษร'

    if(!f.password.trim())error.value.password = 'กรุณากรอกรหัสผ่าน'
    else if(f.password.trim().length < 6)error.value.password = 'รหัสผ่านต้องยาวอย่างน้อย 6 ตัวอักษร'

    if(!conP.value.trim())error.value.conP = 'กรุณายืนยันรหัสผ่าน'
    else if(conP.value.trim().length !== f.password.trim().length)error.value.conP = 'รหัสผ่านไม่ตรงกัน'

    if(!f.role.trim())error.value.role = 'กรุณาเลือกประเภทสมาชิก'

    return Object.keys(error.value).length === 0

}

const saveMember = async()=>{
    if(!validate())return 
    const formdata = new FormData
    formdata.append('form',JSON.stringify(form.value))
    formdata.append('pic_user',pic_user.value!)
    try {
        await axios.post(`${api}/auth/regis`,formdata)
        alert("ดำเนินการสำเร็จ")
        navigateTo('/',{replace:true})
    } catch (error) {
        console.error("error save",error)
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

</style>