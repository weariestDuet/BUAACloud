import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/',
      component: '@/layouts/TopNavi/index',
      routes: [
        { path: '/overview', component: '@/pages/overview/index'},
        { path: '/image', component: '@/pages/image/index'},
        { path: '/container', component: '@/pages/container/index'},
        { path: '/build', component: '@/pages/build/index'},
        { path: '/task', component: '@/pages/task/index'},
        { path: '/maintenance', component: '@/pages/maintenance/index'},
      ]
    }
  ],
});
