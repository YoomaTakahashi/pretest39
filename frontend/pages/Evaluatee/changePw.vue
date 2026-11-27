<template>
    <v-container style="max-width: 560px;">
        <PageHeader title="เปลี่ยนรหัสผ่านครั้งแรก" subtitle="เปลี่ยนรหัสผ่านเพื่อความปลอดถัยของท่าน" icon="mdi-lock-reset" color="#7d0c14"></PageHeader>

        <v-form @submit.prevent="saveMember">
            <v-card rounded="xl" elevation="5" class="pa-5">
                <v-text-field label="รหัสผ่านเดิม" v-model="form.oldPw" :error-messages="error.oldPw" variant="outlined" prepend-inner-icon="mdi-lock-outline" :append-inner-icon="show ? 'mdi-eye':'mdi-eye-off'" :type="show ? 'text':'password'" @click:append-inner="show = !show"></v-text-field>
                <v-text-field label="รหัสผ่านใหม่ (6 อักขระตัวอักษร)" v-model="form.newPw" :error-messages="error.newPw" variant="outlined" prepend-inner-icon="mdi-lock" :append-inner-icon="show2 ? 'mdi-eye':'mdi-eye-off'" :type="show2 ? 'text':'password'" @click:append-inner="show2 = !show2"></v-text-field>
                <v-text-field label="ยืนยันรหัสผ่าน" v-model="confirm" :error-messages="error.confirm" variant="outlined" prepend-inner-icon="mdi-lock-check" :append-inner-icon="show3 ? 'mdi-eye':'mdi-eye-off'" :type="show3 ? 'text':'password'" @click:append-inner="show3 = !show3"></v-text-field>
                <v-btn color="#7d0c14" block prepend-icon="mdi-content-save" type="submit">เปลี่ยนรหัสผ่าน</v-btn>
            </v-card>
        </v-form>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
// import { defineBasicLoader } from 'vue-router/experimental';
import { api } from '~/API/base';

definePageMeta({layout:false})

const form = ref({
    oldPw:'',
    newPw:''
})

const error = ref<Record<string,string>>({})
const show = ref(false)
const show2 = ref(false)
const show3 = ref(false)
const confirm = ref('')

function validate(){
    error.value = {}
    if(!form.value.oldPw)error.value.oldPw = 'กรุณากรอกรหัสผ่านเดิม'
    if(form.value.newPw.trim().length < 6)error.value.newPw = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัว'
    else if(form.value.newPw === form.value.oldPw)error.value.confirm = 'รหัสผ่านต้องไม่ซ้ำกับรหัสผ่านเดิม'
    if(confirm.value !== form.value.newPw)error.value.confirm = 'รหัสผ่านไม่ตรงกัน'
    // if()
    return Object.keys(error.value).length === 0

}

const saveMember = async()=>{
    const token = localStorage.getItem('token')
    if(!validate())return
    try {
        await axios.put(`${api}/auth/changePw`,form.value,{headers:{Authorization:`Bearer ${token}`}})
        alert('เปลี่ยนรหัสสำเร็จ')
        navigateTo('/Evaluatee')
    } catch (error) {
        console.error('Error put',error)
    }
}
</script>

<style scoped>

</style>