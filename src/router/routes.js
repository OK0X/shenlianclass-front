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
        path: '/CourseDetail',
        component: () => import('pages/CourseDetail.vue')
      },
      {
        path: '/CourseCreate',
        component: () => import('pages/CourseCreate.vue')
      },
      {
        path: '/MyCourses',
        component: () => import('pages/MyCourses.vue')
      },
      {
        path: '/MyCreate',
        component: () => import('pages/MyCreate.vue')
      },
      {
        path: '/CourseCheck',
        component: () => import('pages/CourseCheck.vue')
      },
      {
        path: '/CourseCheckDetail',
        component: () => import('pages/CourseCheckDetail.vue')
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
      },
      {
        path: '/MyInfo',
        component: () => import('pages/MyInfo.vue')
      },
      {
        path: '/PageTemplate',
        component: () => import('pages/PageTemplate.vue')
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
