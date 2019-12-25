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
        path: '/Registe',
        component: () => import('pages/Registe.vue')
      },
      {
        path: '/Login',
        component: () => import('pages/Login.vue')
      },
      {
        path: '/PushArticle',
        component: () => import('pages/PushArticle.vue')
      },
      {
        path: '/ArticleDetail',
        component: () => import('pages/ArticleDetail.vue')
      },
      {
        path: '/QQTest',
        component: () => import('pages/QQTest.vue')
      },
      {
        path: '/ClassDetail',
        component: () => import('pages/ClassDetail.vue')
      },
      {
        path: '/ClassPub',
        component: () => import('pages/ClassPub.vue')
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
