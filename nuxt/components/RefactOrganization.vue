<template lang="pug">
v-dialog( v-model="dialog", max-width="600px" )
  template( v-slot:activator="{ on }" )
    v-btn.mr-2( fab, dark, small, color="blue darken-1", v-on="on" )
      v-icon mdi-pencil
  v-card
    v-card-title
      span.headline Редактирование
    v-card-text
      v-container( v-if="type === 'site'" )
        v-row 
          v-col( cols="12" )
            v-text-field( v-model="fields.name", label="Новое название сайта", :error="errors.name" )
          v-col( cols="12" )
            v-textarea( v-model="fields.description", label="Новое описание", :auto-grow="true", rows="1" )
          v-col( cols="6" )
            v-text-field( v-model="fields.support_email", label="Новая электронная почта", :error="errors.support_email" )
          v-col( cols="6" )
            v-text-field( v-model="fields.support_phone", v-mask="mask", label="Новый телефон для обращений", :error="errors.support_phone" )
          v-col( cols="6" )
            v-text-field( v-model="fields.url", label="Новая ссылка на сайт", :error="errors.url" )
          v-col( cols="6" )
            v-select.opacitySome(
              style="color: black !important;", :error='errorSelect', :clearable="true",
						  multiple, v-model="fields.main_tags", color="black", deletable-chips,
						  :items="giveTagsByGroup('main')", item-text="name", item-value="id",
						  label="Первая группа тегов",
						  :menu-props="{ bottom: true, offsetY: true, closeOnClick: true }"
            )
          v-col( cols="6" )
            v-select.opacitySome(
              style="color: black !important;", :error='errorSelect', :clearable="true",
						  multiple, v-model="fields.some_tags", color="black", deletable-chips,
						  :items="giveTagsByGroup('some')", item-text="name", item-value="id",
						  label="Первая группа тегов",
						  :menu-props="{ bottom: true, offsetY: true, closeOnClick: true }"
            )
      v-container( v-else-if="type === 'podved'" )
        v-row
          v-col( cols="12" )
            v-text-field( v-model='fields.name', label="Новое название подведомства", :error="errors.name" ) 
          v-col( cols="12" )
            v-textarea( v-model="fields.description", label="Новое описание", :auto-grow="true", rows="1" )
          v-col( cols="12" )
            v-text-field( v-model='fields.address', label="Новое адрес", :error="errors.address" )
      v-container( v-else-if="type === 'master'", style="min-height:600px" )
        v-row
          v-col( cols="12" )
            v-select.opacitySome( 
              style="color: black !important;", :error='errorSelect', :clearable="true",
						  v-model="nameAgency", color="black", deletable-chips,
						  :items="agencysToArray", label="Название минестерства *",
						  :menu-props="{ bottom: true, offsetY: true, closeOnClick: true }" 
            )
          v-col( cols="12" )
            v-text-field( v-model="newNameAgency", label="Новое название министерства", :error="errors.name" )
      small
      v-card-actions
        .flex-grow-1
        v-btn( color="blue darken-1", text, @click="dialog = false" ) Отмена
        v-btn( color="blue darken-1", text, @click="updateSite()" ) Изменить
</template>


<script>
import axios from "axios";

import { mapActions, mapGetters } from "vuex";
import { VueMaskDirective } from "v-mask";

export default {
  props: ["item", "type"],
  mounted() {
    for (let key in this.item) {
      this.fields[key] = this.item[key];
    }
  },
  directives: {
    mask: VueMaskDirective
  },
  data: () => ({
    dialog: "",
    fields: {},
    nameAgency: "",
    newNameAgency: "",
    mask: "+7 (####) ##-##-##",
    errorSelect: false,
    errors: {
      url: false,
      support_phone: false,
      support_email: false,
      name: false,
      address: false
    }
  }),
  computed: {
    ...mapGetters({
     is_active_executive_agency: "dashboard/is_active_executive_agency",
     giveAllAgency: "dashboard/giveAllAgency",
     giveTagsByGroup: "dashboard/giveTagsByGroup"
    }),
    agencysToArray() {
      let result = [];
      this.giveAllAgency.forEach(item => result.push(item.name));
      return result;
    }
  },
  methods: {
    ...mapActions({
      slavesByMastersFromBack: "dashboard/slavesByMastersFromBack",
      allSitesFromBack: "dashboard/allSitesFromBack",
      mastersFromBack: "dashboard/mastersFromBack"
    }),
    async updateSite() {
      if (this.type === "site") {
        await axios
          .patch(process.env.API_URL + "api/sites/" + this.fields.id, this.fields)
          .then(() => {
            if (this.is_active_executive_agency === "") this.allSitesFromBack();
            else this.slavesByMastersFromBack();
            this.dialog = false;
          })
          .catch(e => {
            switch (e.response.status) {
              case 422:
                for (let key in e.response.data.errors) {
                  if (e.response.data.errors[key]) this.errors[key] = true;
                }
                break;
              default:
            }
          });
      } else if (this.type === "podved") {
        await axios
          .patch(process.env.API_URL + "api/agencies/" + this.fields.id, this.fields)
          .then(() => {
            if (this.is_active_executive_agency === "") this.allSitesFromBack();
            else this.slavesByMastersFromBack();
            this.dialog = false;
          })
          .catch(e => {
            switch (e.response.status) {
              case 422:
                for (let key in e.response.data.errors) {
                  if (e.response.data.errors[key]) this.errors[key] = true;
                }
                break;
              default:
            }
          });
      } else if (this.type === "master") {
        const parent_id = this.giveAllAgency.filter(
          item => item.name === this.nameAgency
        );
        await axios
          .patch(process.env.API_URL + "api/agencies/" + parent_id[0].id, {
            name: this.newNameAgency
          })
          .then(() => {
            this.mastersFromBack();
            this.dialog = false;
          })
          .catch(e => {
            switch (e.response.status) {
              case 422:
                for (let key in e.response.data.errors) {
                  if (e.response.data.errors[key]) this.errors[key] = true;
                }
                break;
              default:
            }
          });
      }
    }
  }
};
</script>

