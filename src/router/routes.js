/* eslint-disable */
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Index.vue')
      },
      {
        path: '/Test',
        component: () => import('pages/Test.vue')
      },
      {
        path: '/ClassDetail',
        component: () => import('pages/ClassDetail.vue')
      },
      {
        path: '/ClassPub',
        component: () => import('pages/ClassPub.vue')
      },
      {
        path: '/MyClass',
        component: () => import('pages/MyClass.vue')
      },
      {
        path: '/MyPub',
        component: () => import('pages/MyPub.vue')
      },
      {
        path: '/CourseCheck',
        component: () => import('pages/CourseCheck.vue')
      },
      {
        path: '/ClassDetailCheck',
        component: () => import('pages/ClassDetailCheck.vue')
      },
      {
        path: '/BackendConfig',
        component: () => import('pages/BackendConfig.vue')
      },
      {
        path: '/Ask',
        component: () => import('pages/Ask.vue')
      },
      {
        path: '/AskDetail',
        component: () => import('pages/AskDetail.vue')
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
