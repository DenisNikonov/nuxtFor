import axios from 'axios'

export const state = () => ({
  user: {
    isAuthenticated: false,
    apiToken: null,
  }
})

export const mutations = {
  SET_USER(state, payload) {
    state.user.isAuthenticated = true
    state.user.apiToken = payload.apiToken
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + payload.apiToken;
    localStorage.setItem('token', payload.apiToken);
  },
  UNSET_USER(state) {
    state.user.isAuthenticated = false
    state.user.apiToken = null
    localStorage.removeItem('token')
  }
}

export const actions = {
  async signin( { commit }, payload ) {
    commit('general/SET_PROCESSING', true, {root: true});

    let formData = {
      username: payload.email,
      password: payload.password,
    }
    //await await this.$auth.loginWith('password_grant', {
    //  data: {
    //    grant_type: 'password',
    //    client_id: '1',
    //    client_secret: 'aGsIh9vSFUoQlsdS1mIwhkx13Sv9sDer2zfJOA23',
    //    scope: '',
    //    username: payload.email,
    //    password: payload.password
    //  }
    //})
    // await this.$auth.loginWith('laravel.passport', {
    //   data: {
    //     username: formData.email,
    //     password: formData.password
    //   }
    // })
    
    await axios({
       method: 'post',
       url: process.env.API_URL + '/api/login',
       data: formData
     })
     .then(response => {
       commit('SET_USER', {
         apiToken: response.data.access_token
       });
       commit('general/SET_ERROR', '', {root: true});
     })
     .catch(e => {
       switch (e.response.status) {
         case 422:
           return commit('general/SET_ERROR', e.response.data.message, {root: true});
         default:
           commit('general/SET_ERROR', 'Ошибка сервера. Попробуйте перезагрузить страницу.', {root: true})
       }
     })
     .finally(resp => {
       commit('general/SET_PROCESSING', false, {root: true});
     })
  },
  signin_force({
    commit
  }, payload) {
    commit('general/SET_PROCESSING', true, {root: true});
    commit('SET_USER', {
      apiToken: payload
    })
    commit('general/SET_PROCESSING', false, {root: true});
  },

  async logout({
    commit
  }) {
    commit('general/SET_PROCESSING', true, {root: true});

    await axios({
        method: 'post',
        url: process.env.API_URL + 'api/logout',
      })
      .then(response => {
        if (response.data.status === 200) {
          commit('UNSET_USER');
        }
      })
      .catch(e => {
        alert(e.response.data)
      })
      .finally(resp => {
        commit('general/SET_PROCESSING', false, {root: true});
      })
  },
}

export const getters = {
  isUserAuthenticated: (state) => state.user.isAuthenticated,
  userId: (state) => state.user.userId
}