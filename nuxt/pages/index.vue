<template lang="pug">
v-app#inspire
  v-navigation-drawer( v-model="drawer", app, clipped, style="background-color:#306eb0;")
    v-list( dense, shaped, min-width="256px")
      v-list-item-group
        div( style="text-align: center;" )
          adminPanel( type="master", v-if="auth" )
          refacrOrg( type="master", v-if="auth" )
          deleteOrg( type="master", v-if="auth" )
        v-list-item(
          v-for="(item, index) in giveAllAgency",
          :key="index",
          @click="actived_executive_agency(item.id)",
          style="color: #fff !important"
        )
          v-list-item-content
            v-list-item-title( style="white-space: normal;" ) {{item.name}}
  v-app-bar(
    app,
    clipped-left,
    :style="'background-color:' + '#033977;' + 'background-image:' + 'url(' + require('../static/85.png') + ')' + ' !important;' + 'background-position:' + '80%;'"
  )
    v-app-bar-nav-icon( style="color: #FFFFFF !important", @click.stop="drawer = !drawer" )
    v-toolbar-title( style="color: #fff !important" ) Реестр сайтов Архангельской области
    v-progress-linear(
      :active="loading",
      :indeterminate ="loading",
      absolute,
      bottom,
      color="deep-purple accent-4"
    )
    v-content.flex-grow-1
    adminPanel( type="slave", v-if="auth" )
    v-btn(
      color="white",
      dark,
      :outlined="true",
      v-show="auth",
      @click="logoutUser"
    ) Выйти
    v-dialog(
      v-model="dialog",
      persistent,
      max-width="600px"
    )
      template( v-slot:activator="{ on }" )
        v-btn( color="white", dark, :outlined="true", v-show="!auth", v-on="on" ) Войти
      formLogin( :dialog="dialog" @loginDialog="statusForm")
  v-content
    v-container( justify-center )
      Dashboard( :auth="auth" )
</template>

<script>
  import { mapActions, mapGetters } from "vuex";
  import formLogin from "~/components/FormLogin";
  import adminPanel from "~/components/AdminPanel";
  import deleteOrg from "~/components/DeleteOrganization";
  import refacrOrg from "~/components/RefactOrganization";
  import Dashboard from '~/components/Dashboard';



  export default {
    async fetch ({store}) {
        await store.dispatch('dashboard/mastersFromBack')
        await store.dispatch("dashboard/allSitesFromBack");
        await store.dispatch("dashboard/allTagsFromBack", ["main", "some"]);

    },
    props: {
      source: String
    },
    async beforeMount() {
      const apiToken = localStorage.getItem("token");
      if (apiToken) {
        this.signin_force(apiToken);
      }
      this.mastersFromBack();
    },
    data: () => ({
      auth: false,
      items: [],
      drawer: null,
      active_executive_agency: "",
      loading: false,
      dialog: false
    }),
    watch: {
      get_isAuthenticated(newVal) {
        this.auth = newVal;
      },
      get_proccesing(newVal) {
        this.loading = newVal;
      }
    },
    computed: {
      ...mapGetters({
        isUserAuthenticated: "user/isUserAuthenticated", 
        getProcessing :"general/getProcessing", 
        giveAllAgency : "dashboard/giveAllAgency"
      }),
      get_isAuthenticated() {
        return this.isUserAuthenticated;
      },
      get_proccesing() {
        return this.getProcessing;
      }
    },
    methods: {
      ...mapActions({
        change_executive_agency: "dashboard/change_executive_agency",
        logout: "user/logout",
        signin_force: "user/signin_force",
        mastersFromBack: "dashboard/mastersFromBack",
        slavesByMastersFromBack: "dashboard/slavesByMastersFromBack"
      }),
      async actived_executive_agency(id_executive_agency) {
        if (this.active_executive_agency === id_executive_agency) {
          this.active_executive_agency = "";
          this.change_executive_agency("");
        } else {
          this.active_executive_agency = id_executive_agency;
          this.change_executive_agency({ id_executive_agency });
          await this.slavesByMastersFromBack();
        }
      },
      logoutUser() {
        this.logout();
      },
      statusForm(status) {
        this.dialog = status;
      }
    },
    components: {
      formLogin,
      adminPanel,
      deleteOrg,
      refacrOrg,
      Dashboard
    }
  };
</script>

<style>
  html {
    overflow: scroll;
    overflow-x: hidden;
  }
  ::-webkit-scrollbar {
    width: 0px;
  }
  ::-webkit-scrollbar-thumb {
    background: #FF0000;
  }
  .v-application {
    font-family: 'Azbuka04', 'Roboto', 'sans-serif' !important
  }
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  #create .v-speed-dial {
    position: absolute;
  }
  #create .v-btn--floating {
    position: relative;
  }
</style>