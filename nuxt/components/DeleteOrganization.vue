<template lang="pug">
  v-dialog( v-model="dialog", max-width="600px", min-width="600px" )
    template( v-slot:activator="{ on }" )
      v-btn.ml-3( fab, dark, small, color="red", v-on="on" )
        v-icon mdi-delete
    v-card( v-if="type === 'podved'" )
      v-card-title
        span.headline Удаление
      v-card-text
        v-container
          v-row
            v-col( cols="12" )
              v-text-field( value="Вы уверены, что хотите удалить запись?", :disbled="true" )
        small
      v-card-actions
        .flex-grow-1
        v-btn( color="blue darken-1", text, @click="dialog = false" ) Отмена
        v-btn( color="blue darken-1", text, @click="deletePodved()") Удалить
    v-card( v-if="type === 'site'" )
      v-card-title
          span.headline Удаление
      v-card-text
        v-container
          v-row
            v-col( cols="12" )
              v-text-field( value="Вы уверены, что хотите удалить данный сайт?", :disbled="true" )
        small
      v-card-actions
        .flex-grow-1
        v-btn( color="blue darken-1", text, @click="dialog = false" ) Отмена
        v-btn( color="blue darken-1", text, @click="deleteSite()") Удалить
    v-card( v-if="type === 'master'" )
      v-card-title
          span.headline Удаление
      v-card-text(style="min-height: 600px")
        v-container
          v-row
            v-col( cols="12" )
              v-select.opacitySome(
                v-model="nameAgency",
                style= "color: black !important;",
                :error='errorSelect',
                :clearable="true",
                color="black",
                deletable-chips,
                :items="agencysToArray",
                label="Название минестерства *",
                :menu-props="{ bottom: true, offsetY: true, closeOnClick: true }"
              )
        small
      v-card-actions
        .flex-grow-1
        v-btn( color="blue darken-1", text, @click="dialog = false" ) Отмена
        v-btn( color="blue darken-1", text, @click="deleteAgency()") Удалить    
</template>

<script>
import axios from "axios";

import { mapGetters, mapActions } from "vuex";

export default {
  props: ["type", "item"],
  data: () => ({
    dialog: "",
    errorSelect: false,
    nameAgency: ""
  }),
  computed: {
    ...mapGetters({
      giveAllAgency: "dashboard/giveAllAgency",
      is_active_executive_agency: "dashboard/is_active_executive_agency"
    }),
    agencysToArray() {
      let result = [];
      this.giveAllAgency.forEach(item => result.push(item.name));
      return result;
    }
  },
  methods: {
    ...mapActions({
      mastersFromBack: "dashboard/mastersFromBack",
      slavesByMastersFromBack: "dashboard/slavesByMastersFromBack",
      allSitesFromBack: "dashboard/allSitesFromBack"
    }),
    async deleteAgency() {
      const parent_id = this.giveAllAgency.filter(
        item => item.name === this.nameAgency
      );

      await axios.delete(process.env.API_URL + "api/agencies/" + parent_id[0].id).then(() => {
        this.mastersFromBack();
        this.dialog = false;
      });
    },
    async deletePodved() {
      await axios.delete(process.env.API_URL + "api/agencies/" + this.item.id).then(() => {
        if (this.is_active_executive_agency === "") this.allSitesFromBack();
        else this.slavesByMastersFromBack();
        this.dialog = false;
      });
    },
    async deleteSite() {
      await axios.delete(process.env.API_URL + "api/sites/" + this.item.id).then(() => {
        if (this.is_active_executive_agency === "") this.allSitesFromBack();
        else this.slavesByMastersFromBack();
        this.dialog = false;
      });
    }
  }
};
</script>