import './style.css'
import 'vant/lib/index.css';
import { createApp } from 'vue'
import App from './App.vue'
import { Button, Field, Loading, Tag, Popover, Icon, NoticeBar, Popup, Toast } from 'vant';
import store from './store'

const app = createApp(App)

app.use(Button).use(Field).use(Loading).use(Tag).use(NoticeBar).use(Popover).use(Icon).use(Popup).use(Toast)
app.use(store)
app.mount('#app')