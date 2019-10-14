export const state = () => ({
    processing: false,
    error: ''
})

export const mutations = {
    SET_PROCESSING(state, payload) {
        state.processing = payload
    },
    SET_ERROR(state, payload) {
      state.error = payload
    }
}

export const actions = {
    goProcess( {commit}, payload) {
      commit("SET_PROCESSING", payload)
    }
}

export const getters = {
    getProcessing: (state) => state.processing,
    getError: (state) => state.error
}