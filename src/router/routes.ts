import { route } from 'quasar/wrappers';
import { RouteCallback } from '@quasar/app-vite';
import { RouteRecordRaw, RouteRecordRedirectOption } from 'vue-router';
import { useAuthStore } from 'src/stores/auth-store';

const routes: RouteRecordRaw[] = [
  {
    beforeEnter(to, from, next) {
      const auth = useAuthStore();
      auth.import();
      if (!auth.isAuthorized) {
        next();
      } else {
        next({ name: 'index' });
      }
    },
    path: '/',
    component: () => import('layouts/auth/AuthLayout.vue'),
    redirect: <RouteRecordRedirectOption> route( <RouteCallback> {name: 'login'} ),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/auth/LoginPage.vue')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('pages/auth/RegisterPage.vue')
      },
    ],
  },
  {
    beforeEnter(to, from, next) {
      const auth = useAuthStore();
      auth.import();
      if (auth.isAuthorized) {
        next();
      } else {
        next({ name: 'login' });
      }
    },
    path: '/dashboard',
    component: () => import('layouts/dashboard/DashboardLayout.vue'),
    redirect: <RouteRecordRedirectOption> route( <RouteCallback> {name: 'index'} ),
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('pages/dashboard/IndexPage.vue')
      },
      {
        path: 'search',
        name: 'search',
        component: () => import('pages/dashboard/SearchPage.vue')
      },
      {
        path: 'myPost',
        name: 'myPost',
        component: () => import('pages/dashboard/MyPostPage.vue')
      },
      {
        path: 'allPost',
        name: 'allPost',
        component: () => import('pages/dashboard/AllPostPage.vue')
      },
      {
        path: 'allUser',
        name: 'allUser',
        component: () => import('pages/dashboard/AllUserPage.vue')
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
