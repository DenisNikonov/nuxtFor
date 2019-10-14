<template lang="pug">
div
  v-container
    v-sheet.pa-12( elevation="12", color="white" )
      v-text-field.clr-black( v-model="query", label="Введите запрос")
      v-select.clr-black.opacitySome(
        v-model="firstSelect",
        chips,
        deletable-chips,
        :items="firstSelectGet",
        label="Параметры поиска",
        multiple,
        :menu-props="{ bottom: true, offsetY: true, closeOnClick:true }"
      )
      v-select.clr-black.opacitySome(
        v-model="secondSelect",
        chips,
        deletable-chips,
        :items="secondSelectGet",
        label="Параметры поиска",
        multiple,
        :menu-props="{ bottom: true, offsetY: true, closeOnClick:true }"
      )
    .mt-12
      v-expansion-panels
        v-expansion-panel(
          v-for="(item, index) in sortSelectSecond",
          :key="item.id",
          :inset="true"
          v-if="index < (currentPage * 15) && index > countRenderElement - 1"
        )
          v-expansion-panel-header {{item.name}}
          v-expansion-panel-content
            v-container
              v-row
                v-col.pt-3( cols="12", v-if="item.description" )
                  p {{item.description}}
                v-col( cols="6", style="padding: 12px 0 0 0;" )
                  p Адрес: {{item.address}}
                v-col.d-flex.justify-end.align-end.pt-3( cols="6" )
                  admPanel( v-if="auth", type="site", :item="item" )
                  refacrOrg( v-if="auth", type="podved", :item="item" )
                  deleteOrg.mr-3( v-if="auth", type="podved", :item="item" )
              v-card.mt-5.ms-auto.v-card--site(
                v-for="site in item.sites",
                :key="site.id",
                elevation="12",
                v-if="item.sites[0]",
                style="min-width: 100%"
              )
                v-card-title.title_site.align-center
                  p {{site.name}}
                v-card-text.content_site
                  v-row.pa-3
                    v-col.pt-3( cols="12", v-if="site.description" )
                      p.pl-6 {{site.description}}
                      hr
                    v-col.pt-3( cols="12", v-else )
                      p.pl-6 Здесь должно быть описание
                      hr
                    v-col.content_site--secondBlock.pt-3( cols="12" )
                      .d-flex.flex-wrap
                        .d-flex
                          p.pl-6 Ссылка на сайта:
                            a( :href="site.url", style="color: black", target="_blank" )
                        .d-flex
                          p.pl-6 E-mail: {{site.support_email}}
                        .d-flex
                          p.pl-6 Телефон: {{site.support_phone}}
                      hr
                    v-col( cols="12", style="background-color: #e0e0e0; padding: 12px 12px 0 12px" )
                      div
                        p.mb-0.pl-6 Теги:
                      hr( style="margin: 10px -12px 0" )
                    v-col.pt-3.content_site--tagGroups( cols="7", v-if="site" )
                      p.pl-6(
                        v-for="(group, index) in tagGroups",
                        :key="index"
                      ) {{index + 1}}-я группа:
                        v-chip.mr-3(
                          v-for="(tag, index) in site[group]",
                          :key="index",
                          @click="addSelectedFilter(group, tag.name)"
                        ) {{tag.name}}
                    v-col.d-flex.justify-end.align-end.pt-3( :cols="site ? 5 : 12" )
                      refacrOrg( :item="site", type="site", v-if="auth" )
                      deleteOrg( :item="site", type="site", v-if="auth" )
      v-btn(
        v-scroll="showUpOnScroll",
				v-show="fab",
				fab,
				dark,
				fixed,
				bottom,
				right,
				color="#033977",
				@click="$vuetify.goTo(10, {duration: 1000})"
      )
        v-icon mdi-chevron-up
  .text-center.mt-3
    v-pagination(
      v-model="currentPage",
      :length="countPage",
      circle
    )
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import admPanel from "~/components/AdminPanel";
import deleteOrg from "~/components/DeleteOrganization";
import refacrOrg from "~/components/RefactOrganization";

export default {
  name: "Dashboard",
  props: {
    'auth': {
      required: true,
      type: Boolean
    }
  },
  mounted () {
    this.agencyPages = this.giveAllAgency.map(
      item => new Object({ id: item.id, page: 1, searchPage: 1 })
    );
    this.agencyPages.push({ id: 0, page: 1, searchPage: 1 });
    
  },
  data: () => ({
    firstSelect: [],
    secondSelect: [],
    thirtSelect: [],
    query: "",
    dialog: false,
    fab: false,
    tagGroups: ["main_tags", "some_tags"],
    agencyPages: []
  }),
  methods: {
    //mapActions({
    //llSitesFromBack: "dashboard/allSitesFromBack",
    //slavesByMastersFromBack: "dashboard/slavesByMastersFromBack",
    // allTagsFromBack: "dashboard/allTagsFromBack"
    //
    showUpOnScroll(e) {
      const top = window.pageYOffset;
      this.fab = top > 1;
    },
    addSelectedFilter(group, tagName) {
      if (group === "main_tags" && !this.firstSelect.includes(tagName)) {
        this.firstSelect.push(tagName);
      }
      if (group === "some_tags" && !this.secondSelect.includes(tagName)) {
        this.secondSelect.push(tagName);
      }
    },

  },
  computed: {
    ...mapGetters({
      is_active_executive_agency: "dashboard/is_active_executive_agency",
      giveAllAgency: "dashboard/giveAllAgency",
      giveList: "dashboard/giveList",
      giveSitesOnAgency: "dashboard/giveSitesOnAgency",
      giveReplacerCharts: "dashboard/giveReplacerCharts",
      giveTagsByGroup: "dashboard/giveTagsByGroup"
    }),
    searching() {
      return (
        this.firstSelect.length > 0 ||
        this.secondSelect.length > 0 ||
        this.thirtSelect.length > 0 ||
        this.query.length > 0
      );
    },
    countPage() {
      return Math.floor(this.sortSelectSecond.length / 15 + 1);
    },
    currentPage: {
      get: function() {
        if(this.agencyPages.length < 1) return 1
        let founded = this.agencyPages.find(
          item => item.id === this.is_active_executive_agency
        );
        if (!founded) founded = this.agencyPages[this.agencyPages.length - 1];

        let index = this.searching ? founded.searchPage : founded.page;

        return this.countPage >= index ? index : 1;
      },
      set: function(value) {
        let founded = this.agencyPages.find(
          item => item.id === this.is_active_executive_agency
        );
        if (!founded) founded = this.agencyPages[this.agencyPages.length - 1];

        let key = this.searching ? "searchPage" : "page";

        founded[key] = value;
      }
    },
    countRenderElement() {
      return this.currentPage === 1 ? 0 : this.currentPage * 15 - 15
    },
    firstSelectGet() {
      return this.giveTagsByGroup('main').map(item => item.name);
    },
    secondSelectGet() {
      return this.giveTagsByGroup('some').map(item => item.name);
    },
    // thirtSelectGet() {
    //   return this.giveTagsByGroup("some").map(item => item.name);
    // },
    sortArray() {
      return this.list.filter(item => {
        return item.name
          .toLowerCase()
          .trim()
          .replace(/["«»,.\s]/gm, "")
          .includes(
            this.query
              .toLowerCase()
              .trim()
              .replace(/["«»\s]/gm, "")
              .replace(/[A-z.,;'\[\]]/gm, symb => {
                return (symb = symb
                  ? this.giveReplacerCharts[symb]
                  : this.giveReplacerCharts[symb]);
              })
          );
      });
    },
    sortSelectFirst() {
      if (this.firstSelect.length === 0) return this.sortArray;

      return this.sortArray.filter(function(item) {
        let tags = item.sites[0]
          ? item.sites.reduce((accum, site) => accum.concat(site.main_tags), [])
          : [];
        return (
          tags.filter(tag => this.firstSelect.includes(tag.name)).length > 0
        );
      }, this);
    },
    sortSelectSecond() {
      if (this.secondSelect.length === 0) {
        return this.sortSelectFirst;
      }

      return this.sortSelectFirst.filter(function(item) {
        let tags = item.sites[0]
          ? item.sites.reduce((accum, site) => accum.concat(site.some_tags), [])
          : [];
        return (
          tags.filter(tag => this.secondSelect.includes(tag.name)).length > 0
        );
      }, this);
    },
    currentAgencyId() {
      return this.is_active_executive_agency;
    },

    list() {
      if (!this.currentAgencyId) {
        return this.giveList;
      } else {
        return this.giveSitesOnAgency;
      }
    }
  },
  components: {
    deleteOrg,
    refacrOrg,
    admPanel
  }
};
</script>

<style>
.v-content__wrap {
  background-color: #e1e2e3;
}
.theme--light .v-card .v-card__text {
  color: #000 !important;
}
.v-card--site {
  border-radius: 8px;
}
hr {
  background-color: rgba(0, 0, 0, 0.5);
}
.title_site {
  background-color: #316eaf;
  color: white;
  margin: 0;
  padding: 16px 16px 16px 2rem !important;
  font-size: 13pt !important;
}
.title_site p {
  margin: 3px;
}
.content_site {
  padding: 0;
}
.content_site hr {
  margin: 25px -12px 0;
}
.content_site--secondBlock {
  padding: 12px 12px 0 12px;
}
.content_site--secondBlock p {
  margin-right: 70px;
}
.content_site--secondBlock hr {
  margin: 0 -12px;
}
.content_site--tagGroups p {
  margin: 12px 0 0;
}
.list-complete-item {
  /* transition: all 1s; */
  display: inline-block;
  /* margin-right: 10px; */
}
.theme--light.v-pagination .v-pagination__item--active {
  color: #ffffff !important;
}
.v-application .primary--text {
  color: #000 !important;
}
.theme--light.v-pagination .v-pagination__item--active {
  color: black;
}
.v-application .primary {
  background-color: rgb(3, 57, 119) !important;
}
.list-complete-leave-active {
  transition: all 0.8s cubic-bezier(0.59, 0.32, 0.33, 0.73);
}
.list-complete-enter {
  transform: translateX(-20px);
  opacity: 0;
}
.list-complete-leave-to {
  transform: translateX(20000px);
  opacity: 0;
}
.opacitySome {
  color: rgba(0, 0, 0, 0.3) !important;
}
.clr-black {
  color: black !important;
}
</style>
