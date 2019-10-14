const env = require('dotenv').config()

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Реестр сайтов Архангельской области',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Реестр сайтов Архангельской области' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },

  buildModules: [
    '@nuxtjs/vuetify'
  ],

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/dotenv'
  ],

  // env: env.parsed,

  axios: {
    //baseURL: "http://siteregistry/"
  },
  
  // auth: {
    // redirect: {
      // login: '/login',
      // logout: '/',
      // callback: '/login',
      // home: '/'
    // },
    // strategies: {
      // local: false,
      // password_grant: {
        // _scheme: 'local',
        // endpoints: {
          // login: {
            // url: '/oauth/token',
            // method: 'post',
            // propertyName: 'access_token'
          // },
          // logout: false,
          // user: {
            // url: 'api/auth/me',
            // method: 'get',
            // propertyName: 'user'
          // }
        // }
      // }
    // }
  // },
  // auth: {
  //     strategies: {
  //       'laravel.passport': {
  //         url: 'http://siteregistry/oauth/token',
  //         client_id: '1',
  //         client_secret: 'aGsIh9vSFUoQlsdS1mIwhkx13Sv9sDer2zfJOA23'
  //       },
  //   }
  //     // local: {
  //     //   endpoints: {
  //     //     login: { url: 'login', method: 'post', propertyName: 'meta.token' },
  //     //     user: { url: 'user', method: 'get', propertyName: 'data' },
  //     //     logout: {}
  //     //   }
  //     // }
  // },
  // env: {
    // baseUrl: 'localhost:8081'
  // }
  server: {
    host: process.env.APP_URL,
    port: process.env.APP_PORT
  }
}
