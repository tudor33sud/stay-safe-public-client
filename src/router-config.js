import Vue from 'vue'
import VueRouter from 'vue-router'

import store from './store'
import security from './keycloak'

// the next line will register ALL local vue Components
// if you omit it, you need to register every Components
// locally wherever you need it
import Components from 'helpers/register-all-components';
Vue.use(VueRouter)
const routes = [{
    path: '/',
    component: Components.RouterDefaultView,
    meta: {
        requiresAuth: true
    }
}, {
    path: '/report',
    component: Components.Report,
    meta: {
        requiresAuth: true
    }
},
{
    path: '/events',
    component: Components.MyEvents,
    meta: {
        requiresAuth: true
    }
},
{
    path: '/activity',
    component: Components.Activity,
    meta: {
        requiresAuth: true
    }
},
{
    path: '/assignments',
    component: Components.Assignments,
    meta: {
        requiresAuth: true
    }
},
{
    path: '/contact',
    component: Components.Contact,
    meta: {
        requiresAuth: true
    }
},
];


const router = new VueRouter({
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
        const auth = store.state.security.auth
        if (typeof auth === 'undefined') {
            security.init(next, to.meta.roles)
        }
        else {
            if (to.meta.roles) {
                if (security.roles(to.meta.roles[0])) {
                    next()
                }
                else {
                    next({ name: 'unauthorized' })
                }
            }
            else {
                next()
            }
        }
    }
    else {
        next()
    }
})

router.onReady((cb, errCb) => {
    history.pushState("", document.title, window.location.pathname + window.location.search);
});

export default router