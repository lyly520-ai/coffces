export const routes = [{
    path: '/main',
    name: 'Main',
    component: r => require(['../views/Main.vue'], r),
    children: [{
        path: 'home',
        name: 'Home',
        component: r => require(['../views/Home.vue'], r),
      },
      {
        path: 'menu',
        name: 'Menu',
        component: r => require(['../views/Menu.vue'], r),
      },
      {
        path: 'order',
        name: 'Order',
        component: r => require(['../views/Order.vue'], r),
      }, ,
      {
        path: 'shopcart',
        name: 'Shopcart',
        component: r => require(['../views/Shopcart.vue'], r),
      }, ,
      {
        path: 'my',
        name: 'My',
        component: r => require(['../views/My.vue'], r),
      }
    ]
  },
  {
    path: '/register',
    name: 'Register',
    component: r => require(['../views/Register.vue'], r)
  },
  {
    path: '/login',
    name: 'Login',
    component: r => require(['../views/Login.vue'], r)
  },
  {
    path: '/detail/:pid',
    name: 'Detail',
    component: r => require(['../views/Detail.vue'], r)
  },
  {
    path: '/account',
    name: 'Account',
    component: r => require(['../views/Account.vue'], r)
  },
  {
    path: '/address',
    name: 'Address',
    component: r => require(['../views/Address.vue'], r)
  },
  {
    path: '/newAddress',
    name: 'NewAddress',
    component: r => require(['../views/NewAddress.vue'], r)
  },
  {
    path: '/secure',
    name: 'Secure',
    component: r => require(['../views/Secure.vue'], r)
  },
  {
    path: '/like',
    name: 'Like',
    component: r => require(['../views/Like.vue'], r)
  },
  {
    path: '/pay',
    name: 'Pay',
    component: r => require(['../views/Pay.vue'], r)
  },
  {
    path: '/email',
    name: 'Email',
    component: r => require(['../views/Email.vue'], r)
  },
  {
    path: '/retrieve',
    name: 'Retrieve',
    component: r => require(['../views/Retrieve.vue'], r)
  },
  {
    path: '*',
    redirect: {
      name: 'Home'
    }
  }
]
