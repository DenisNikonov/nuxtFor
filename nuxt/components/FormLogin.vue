<template lang="pug">
v-form( ref="loginForm", v-model="valid", lazy-validation )
  v-card
    v-card-text
      v-container
        v-row 
          v-col( cols="12" )
            v-text-field( label="E-mail", v-model="email", :rules="emailRules", type="email", @keyup.enter="login()", required ) 
          v-col( cols="12" )
            v-text-field( label="Пароль", v-model="password", :rules="passwordRules", type="password", @keyup.enter="login()", required )
      small {{error}}
    v-card-actions
      .flex-grow-1.caption
      v-btn( color="blue darken-1", text, @click="$emit('loginDialog', dialog = false)" ) Отмена
      v-btn( color="blue darken-1", text, @click="login()" ) Войти 

</template>

<script>
import { mapGetters } from 'vuex';


export default {

  data: () => ({
    valid: false,
    email: '',
    dialog: false,
    password: '',
    error:'',
    emailRules: [
      v => !!v || 'Вы не ввели e-mail',
      v => {
        if(v.length > 0) {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(v) || 'e-mail неверен';
          } else return ''
        } 
      ],
      passwordRules: [
        v => !!v || 'Вы не ввели пароль'
      ]
  }),
  computed: {
    ...mapGetters({
      getProcessing: 'general/getProcessing',
      getError: 'general/getError'
    }),
    get_error() {
      return this.getError
    },
    get_loading() {
      return this.getProcessing
    },
  },
  watch: {
    get_error(val) {
      this.error = val;
    },
    get_loading(val) {
      this.loading = val;
      if (!val && !this.error) this.close()
    }
  },
  methods: {
    login() {
      if(this.$refs.loginForm.validate()) {
        this.loading = true;
        this.$store.dispatch('user/signin', { email: this.email, password: this.password });
      } else {
        this.error = "Вы ввели данные не верно"
      }
    },
    close() {
      this.$emit('loginDialog', this.dialog = false);
    }
  }
  
}
</script>
