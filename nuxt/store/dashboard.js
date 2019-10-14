import axios from 'axios'
import vuex from 'vuex'

export const state = () => ({
    sitesList: [],
    sitesOnAgency: [],
    allAgency: [],
    active_executive_agency: '',
    replacerCharts: {
        "q": "й", "w": "ц", "e": "у", "r": "к", "t": "е", "y": "н", "u": "г",
        "i": "ш", "o": "щ", "p": "з", "[": "х", "]": "ъ", "a": "ф", "s": "ы",
        "d": "в", "f": "а", "g": "п", "h": "р", "j": "о", "k": "л", "l": "д",
        ";": "ж", "'": "э", "z": "я", "x": "ч", "c": "с", "v": "м", "b": "и",
        "n": "т", "m": "ь", ",": "б", ".": "ю", "/": "."
    },
    tags: {
        some: [],
        main: [],
    }
})

export const mutations = {
    SET_SITESLIST(state, payload) {

        state.sitesList = payload

    },

    SET_SITESONAGENCY(state, payload) {

        state.sitesOnAgency = payload

    },

    SET_AGENCY(state, payload) {

        state.allAgency = payload

    },

    SET_SELECT_EXECUTIVE_AGENCI(state, payload) {

        state.active_executive_agency = payload

    },

    SET_SELECT_TAGS(state, payload) {

        state.tags[payload.group] = payload.data

    }

}

export const actions = {
    async allSitesFromBack({commit}, payload) {

        commit('general/SET_PROCESSING', true, {root: true})
      await axios
            .get(process.env.API_URL + 'api/agencies/cluster')
            .then(response => {
                commit('SET_SITESLIST', response.data)
            })
            .catch(e => {
                // alert('Не удалось подключиться к базе данных, попробуйте перезагрузить страницу (F5)');
            })
        commit('general/SET_PROCESSING', false, {root: true})

    },

     allTagsFromBack({commit}, payload) {

        commit('general/SET_PROCESSING', true, {root: true})
        
         payload.forEach( async (item) => {
          await axios.get(process.env.API_URL + 'api/tags/byGroup/' + item)
                .then(response => {
                    commit("SET_SELECT_TAGS", {group: item, data: response.data})
                })
        })


        commit('general/SET_PROCESSING', false, {root: true})
    },

    async slavesByMastersFromBack({commit, getters}, payload) {

        commit('general/SET_PROCESSING', true, {root: true})
        await axios
            .get(process.env.API_URL + 'api/agencies/cluster/' + getters.is_active_executive_agency)
            .then(response => {
                commit('SET_SITESONAGENCY', response.data)
            })
            .catch(e => {
                console.log(e);

            })
        commit('general/SET_PROCESSING', false, {root: true})

    },

    async mastersFromBack({commit}, payload) {

        commit('general/SET_PROCESSING', true, {root: true})
        
        await axios
            .get(process.env.API_URL + 'api/agencies/masters')
            .then(response => {
                commit('SET_AGENCY', response.data)
            }) 
            .catch(e => {
                // alert('Не удалось подключиться к базе данных, попробуйте перезагрузить страницу (F5)');
            })
        commit('general/SET_PROCESSING', false, {root: true})

    },


    change_executive_agency({commit}, payload) {

        commit('SET_SELECT_EXECUTIVE_AGENCI', payload.id_executive_agency)

    }
}

export const getters = {
    giveList: (state) => state.sitesList,
    giveAllAgency: (state) => state.allAgency,
    giveSitesOnAgency: (state) => state.sitesOnAgency,
    is_active_executive_agency: (state) => state.active_executive_agency,
    giveReplacerCharts: (state) => state.replacerCharts,
    giveTagsByGroup: state => group => {
        let res = []
        for (let key in state.tags) {
            if (key === group) res = state.tags[key]
        }
        return res
    },
}