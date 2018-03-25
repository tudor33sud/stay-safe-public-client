import Vue from 'vue'
import VueRouter from 'vue-router'
 
import store from './store'
 

// the next line will register ALL local vue Components
// if you omit it, you need to register every Components
// locally wherever you need it
import Components  from 'helpers/register-all-components';
 
Vue.use(VueRouter)
 
const routes = [{
    path: '/',
    component: Components.ComponentName,
  },
 
];


const router = new VueRouter({
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes
})
 
// router.beforeEach((to, from, next) => {
//   debugger
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     const auth = store.state.security.auth
//     if (typeof auth === 'undefined') {
//       security.init(next)
//     }
//     else {
//         next()
//       }
//     }
//   else {
//     next()
//   }
// })
 
export default router