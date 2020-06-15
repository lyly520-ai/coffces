import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Router from 'vue-router'
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}

//引入lib-flexible
import 'lib-flexible'

// 引入
import axios from 'axios'
import VueAxios from 'vue-axios'
//导入
import VueCookies from 'vue-cookies'

//引入vant插件
import {
  Form,
  Field,
  Button,
  Toast,
  Tabbar, 
  TabbarItem,
  Swipe,
  SwipeItem,
  Image,
  Grid,
  GridItem,
  Loading,
  NavBar,
  GoodsAction, 
  GoodsActionIcon,
  GoodsActionButton,
  Checkbox,
  SwipeCell,
  SubmitBar,
  List,
  Cell,
  CellGroup,
  Card,
  AddressList,
  AddressEdit,
  ActionSheet,
  Tab,
  Tabs,
  Tag,
  Icon,
  Uploader
} from 'vant';
Vue
  .use(Form)
  .use(Field)
  .use(Button)
  .use(Toast)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Swipe)
  .use(SwipeItem)
  .use(Image)
  .use(Grid)
  .use(GridItem)
  .use(Loading)
  .use(NavBar)
  .use(GoodsAction)
  .use(GoodsActionButton)
  .use(GoodsActionIcon)
  .use(Checkbox)
  .use(SwipeCell)
  .use(SubmitBar)
  .use(List)
  .use(Cell)
  .use(CellGroup)
  .use(Card)
  .use(AddressList)
  .use(AddressEdit)
  .use(ActionSheet)
  .use(Tab)
  .use(Tabs)
  .use(Tag)
  .use(Icon)
  .use(Uploader)


Vue.use(VueAxios, axios)

Vue.use(VueCookies)

Vue.config.productionTip = false


// 配置post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'

// 配置请求基础路径
axios.defaults.baseURL = 'http://www.kangliuyong.com:10002'

//为vue原型添加一个属性
Vue.prototype.appkey='U2FsdGVkX18sJWxx9/8KCk2dmDTdSmm4y0jaYIrNobU='



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
