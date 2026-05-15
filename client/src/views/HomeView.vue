<script setup lang="ts">
import CommonSearch from '@/components/common/CommonSearch.vue'
import HOME_CONTENT from '@/content/home.ts'
</script>

<template>
  <section class="home">
    <header class="home__header">
      <div class="home__header__text">
        <h1>{{ HOME_CONTENT.header.title }}</h1>
        <p>{{ HOME_CONTENT.header.description }}</p>
      </div>

      <CommonSearch />
    </header>

    <main class="home__main">
      Page content here!
    </main>
  </section>
</template>
