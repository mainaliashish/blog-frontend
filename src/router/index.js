import { createRouter, createWebHistory } from 'vue-router'

import PostIndex from '@/views/posts/PostIndex.vue'
import PostCreate from '@/views/posts/PostCreate.vue'
import PostEdit from '@/views/posts/PostEdit.vue'
import PostDelete from '@/views/posts/PostDelete.vue'
import PostShow from '@/views/posts/PostShow.vue'
import Login from '@/views/account/Login.vue'
import Register from '@/views/account/Register.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useUtilsStore } from '@/store/utilsStore'
import { useAuthStore } from '@/store/authStore'
import { checkPostOwnership } from '@/router/guards/authGuards'

const routes = [
  {
    path: '/',
    name: 'homepage',
    component: DefaultLayout,
    redirect: '/posts',
    children: [
      {
        path: 'posts',
        name: 'post.index',
        component: PostIndex,
        meta: { title: 'All Posts', noAuth: true },
      },
      {
        path: 'posts/create',
        name: 'post.create',
        component: PostCreate,
        meta: { title: 'Create Post' },
      },
      {
        path: 'posts/:id/edit',
        name: 'post.edit',
        component: PostEdit,
        meta: { title: 'Edit Post' },
        beforeEnter: checkPostOwnership,
      },
      {
        path: 'posts/:id/delete',
        name: 'post.delete',
        component: PostDelete,
        meta: { title: 'Delete Post' },
      },
      {
        path: 'posts/:id',
        name: 'post.show',
        component: PostShow,
        meta: { title: 'View Post', noAuth: true },
      },
      {
        path: 'login',
        name: 'login',
        component: Login,
        meta: { title: 'Login', noAuth: true },
      },
      {
        path: 'register',
        name: 'register',
        component: Register,
        meta: { title: 'Register', noAuth: true },
      },
    ],
  },
]

// Create the router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guards to set the document title
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Blog App'
  next()
})

router.beforeEach(async (to) => {
  const utilsStore = useUtilsStore()
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated()
  // console.log(isAuthenticated)
  if (to.path === '/login' && isAuthenticated) {
    utilsStore.handleError('You are already logged in.')
    router.push('/')
  }
  if (to.path !== '/login' && !isAuthenticated && !to.meta.noAuth) {
    utilsStore.handleError('You must Login to continue.')
    return '/login'
  }
})

export default router
