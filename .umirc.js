import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    {
      path: '/',
      component: '@/layouts/index',
      routes: [
        { exact: true, path: '/', component: 'index' },
        { exact: true, path: '/:id', component: 'detail' },
      ],
    }, 
  ],
  history: {
    type: 'hash',
  },
  theme: {
    "@primary-color": "#1DA57A",
  },
  antd: {},
  dva: {},
});
