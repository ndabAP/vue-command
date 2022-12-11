import { createApp } from 'vue'
import HostedApp from './hosted/App.vue'
import './registerServiceWorker'

createApp(HostedApp).mount('#app')
