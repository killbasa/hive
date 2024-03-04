import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layouts/AppLayout.vue';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			component: AppLayout,
			children: [
				{
					path: '/',
					name: 'dashboard',
					component: () => import('@/views/Dashboard.vue')
				},
				{
					path: '/channels',
					name: 'channels',
					component: () => import('@/views/Channels.vue')
				},
				{
					path: '/videos',
					name: 'videos',
					component: () => import('@/views/Videos.vue')
				}
			]
		}
	]
});

export default router;
