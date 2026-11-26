export default defineNuxtRouteMiddleware((to)=>{
    if(!import.meta.client)return
    const must = localStorage.getItem('statusPw') === 'n'
    if(must && to.path.startsWith('/Evaluatee') && to.path !== '/Evaluatee/changePw'){
        return navigateTo('/Evaluatee/changePw')
    }
})