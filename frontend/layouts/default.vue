<template>
    <v-app>
        <v-app-bar elevation="5" class="rounded-b">
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
        ['หน้าหลัก','/Staff/'],
        ['หน้าหลัก','/Staff/'],
        ['หน้าหลัก','/Staff/'],
        ['หน้าหลัก','/Staff/'],
        ['หน้าหลัก','/Staff/'],
        ['หน้าหลัก','/Staff/'],
        ['หน้าหลัก','/Staff/'],
        ['หน้าหลัก','/Staff/'],
        ['หน้าหลัก','/Staff/'],
        ['หน้าหลัก','/Staff/'],
        ['หน้าหลัก','/Staff/'],
        ['หน้าหลัก','/Staff/'],
        ['หน้าหลัก','/Staff/'],
        ['หน้าหลัก','/Staff/'],
    ]
}

const navitem = computed(()=> roles[user.value.role] || [])
</script>

<style scoped>

</style>