// This mounts the documentation and not the library
import { createApp } from 'vue'
import HostedApp from './hosted/App.vue'
import './registerServiceWorker'

const app = createApp(HostedApp)

app.config.unwrapInjectedRef = true

app.mount('#app')
