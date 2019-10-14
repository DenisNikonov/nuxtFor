<template lang="pug">
v-app#inspire
    v-container( fill-height, style="height: calc(100vh - 58px)" )
        v-layout( align-center )
            v-flex
                h1.display-2.primaty--text.mb-2 Упссс, 404
                p Страница не найдена
                v-btn(to='/', outlined color="primary") На главную
</template>


<script>

export default {
    
}
</script>


<style scoped>
  .theme--light.v-application {
    background-color: #2c2c2c;
    color: #004d9f
  }

</style>
