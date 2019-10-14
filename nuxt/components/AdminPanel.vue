<template lang="pug">
  v-dialog(v-model="dialog", max-width="600px")
    template( v-slot:activator="{ on }" )
      v-btn.mr-5( fab, dark, small, color="indigo", v-on="on" )
        v-icon mdi-plus
    v-card
      v-card-title
        span.headline Добавление
      v-card-text
        v-container( v-if = "type === 'master'" )
          v-row
            v-col( cols='12' )
              v-text-field( v-model='nameAgency', :rules='agencyRules', :error='errors.name', label='Название минестерства *', hint='Например: Министерство культуры' )
              v-text-field( v-model='address', :rules='addressRules', :error='errors.address', label='Адрес *', hint='Например: Верхнетоемский район с. Верхняя Тойма ул. Кировская д. 8' )
              v-textarea( v-model='descriptionSite', label='Описание минестерства', :auto-grow='true', rows='1' )
        v-container( v-else-if = "type === 'slave'" )
          v-row
            v-col( cols='12' )
              v-select.opacitySome( style='color: black !important;', :error='errorSelect', :clearable='true', v-model='nameAgency', color='black', deletable-chips='', :items='agencysToArray', label='Название минестерства *', :menu-props='{ bottom: true, offsetY: true, closeOnClick: true }' )
            v-col( cols='12' )
              v-text-field( v-model='namePodved', :rules='podvedRules', :error='errors.name', label='Название подведомства *', persistent-hint='' )
            v-col( cols='12' )
              v-text-field( v-model='address', :rules='addressRules', :error='errors.address', label='Адрес *', persistent-hint='', hint='Например: Верхнетоемский район с. Верхняя Тойма ул. Кировская д. 8' )
            v-col( cols='12' )
              v-textarea( v-model='descriptionSite', label='Описание организации', :auto-grow='true', persistent-hint='', rows='1' )
            v-col( cols='6' )
              v-text-field( v-model='keyWordsSite', label='Ключевые слова организации', persistent-hint='' )
            v-col( cols='6' )
              v-text-field( v-model='firstGroupTagsSite', label='Первая группа тэгов', persistent-hint='' )
            v-col( cols='6' )
              v-text-field( v-model='secondGroupTagsSite', label='Вторая группа тэгов', persistent-hint='' )
        v-container( v-else-if="type === 'site'" )
          v-row
            v-col( cols='12' )
              v-text-field( v-model='nameSite', :rules='nameRules', :error='errors.name', label='Название сайта *' )
            v-col( cols='12' )
              v-text-field( v-model='urlSite', :rules='urlRules', :error='errors.url', label='Ссылка на сайт *', hint='Например: http://www.aoresc.ru/' )
            v-col( cols='6' )
              v-text-field( v-model='supportPhoneSite', :rules='phoneRules', :error='errors.supportPhone', v-mask='mask', label='Телефон *', hint='Например: +7 (8182) 635-911' )
            v-col( cols='6' )
              v-text-field( v-model='supportEmailSite', :rules='emailRules', :error='errors.supportEmail', label='E-mail *', hint='Например: office@aoresc.ru' )
            v-col( cols='6' )
              v-select.opacitySome(
                style='color: black !important;', :error='errorSelect', :clearable='true', multiple='', v-model='firstGroupTagsSite', 
                color='black', deletable-chips='', :items="giveTagsByGroup('main')", item-text='name', item-value='id', label='Первая группа тегов', 
                :menu-props='{ bottom: true, offsetY: true, closeOnClick: true }' 
              )
            v-col( cols='6' )
              v-select.opacitySome( 
                style='color: black !important;', :error='errorSelect', :clearable='true', multiple='', v-model='secondGroupTagsSite', 
                color='black', deletable-chips='', :items="giveTagsByGroup('some')", item-text='name', item-value='id', label='Вторая группа тегов', 
                :menu-props='{ bottom: true, offsetY: true, closeOnClick: true }' 
              )
            v-col( cols='12' )
              v-textarea( v-model='descriptionSite', label='Описание сайта', :auto-grow='true', rows='1' )
            // <v-col cols="6">
            // <v-text-field v-model='keyWordsSite' label="Ключевые слова организации" >
            // </v-text-field>
            // </v-col>
          small
        v-card-actions
          .flex-grow-1
          v-btn( color="blue darken-1", text, @click="dialog = false" ) Отмена
          v-btn( color="blue darken-1", text, @click="insertAgency" ) Добавить



</template>


<script>
import axios from 'axios'
import { mapActions, mapGetters } from 'vuex'
import { VueMaskDirective } from 'v-mask'

export default {
    props:['type', "item"],
  data: () => ({
    dialog: "",
    address: "",
    nameAgency: "",
    namePodved: "",
    nameSite: "",
    urlSite: "",
    supportPhoneSite: "",
    supportEmailSite: "",
    keyWordsSite: "",
    descriptionSite: "",
    firstGroupTagsSite: [],
    secondGroupTagsSite: [],
    mask: '+7 (####) ##-##-##',
    nameRules: [
        v => !!v || 'Вы не ввели название сайта'
    ],
    urlRules: [
        v => !!v || 'Вы не ввели ссылку на сайт'
    ],
    phoneRules: [
        v => !!v || 'Вы не ввели телефон'
    ],
    emailRules: [
        v => !!v || 'Вы не ввели e-mail'
    ],
    agencyRules: [
      v => !!v || 'Вы не ввели название минестерства'
    ],
    addressRules: [
      v => !!v || 'Вы не ввели адрес'
    ],
    podvedRules: [
      v => !!v || 'Вы не ввели название подведомства'
    ],
    errors: {
      url: false,
      supportPhone: false,
      supportEmail: false,
      name: false,
      address: false,
    },
    errorSelect: false,
  }),
  directives: {
    mask: VueMaskDirective
  },
  methods: {
    ...mapActions({
      slavesByMastersFromBack: 'dashboard/slavesByMastersFromBack',
      allSitesFromBack: 'dashboard/allSitesFromBack',
      mastersFromBack: 'dashboard/mastersFromBack',
    }),
    async insertAgency() {
        if(this.type === "master") {
          const postData = {
            "parent_id": null,
            "name": this.nameAgency,
 	          "description": this.descriptionSite,
 	          "address": this.address
          };
          await axios.post(process.env.API_URL + 'api/agencies', postData)
                     .then( () => {
                       this.mastersFromBack();
                       this.dialog=false
                     })
                     .catch(e => {
                       switch (e.response.status) {
                         case 422:
                          for(let key in e.response.data.errors) {
                            if(e.response.data.errors[key]) this.errors[key] = true
                          }
                           break;
                         default:
                       }
                     })
        } else if(this.type === "slave") {
          if(this.nameAgency === '') return this.errorSelect = true;
          const parent_id = this.giveAllAgency.filter(item => item.name === this.nameAgency);

          const postDataPodvedAgency = {
            "parent_id": parent_id[0].id,
            "name": this.namePodved,
 	          "description": this.descriptionSite,
 	          "address": this.address
          };

          await axios.post(process.env.API_URL + 'api/agencies', postDataPodvedAgency)
                     .then( () => {
                       this.dialog = false
                     })
                     .catch(e => {
                       switch (e.response.status) {
                         case 422:
                          for(let key in e.response.data.errors) {
                            if(e.response.data.errors[key]) this.errors[key] = true
                          }
                           break;
                         default:
                       }
                     })

        } else if(this.type === "site") {
          const postDataSites = {
            "agency_id": this.item.id,
            "name": this.nameSite,
            "url": this.urlSite,
            "keywords": this.keyWordsSite,
            "support_email": this.supportEmailSite,
            "support_phone": this.supportPhoneSite,
            "main_tags" : this.firstGroupTagsSite,
            "some_tags" : this.secondGroupTagsSite,
          };
          await axios.post(process.env.API_URL + 'api/sites', postDataSites)
                     .then( () => {
                       if(this.is_active_executive_agency === '') this.allSitesFromBack();
                       else this.slavesByMastersFromBack();
                       this.dialog = false
                     })
                     .catch(e => {
                       switch (e.response.status) {
                         case 422:
                          for(let key in e.response.data.errors) {
                            if(e.response.data.errors[key]) this.errors[key] = true
                          }
                           break;
                         default:

                       }

                     })
        }
    }
  },
  computed : {
    ...mapGetters({
      giveAllAgency: 'dashboard/giveAllAgency',
      is_active_executive_agency: 'dashboard/is_active_executive_agency',
      giveTagsByGroup: 'dashboard/giveTagsByGroup'
    }),
    agencysToArray() {

      let result = [];
      this.giveAllAgency.forEach(item => result.push(item.name));
      return result

    },
  },
}
</script>
