<script setup lang="ts">
import NavigationContent from '@/content/Navigation.content.ts'
import CommonChip from '@/components/common/CommonChip.vue'
</script>

<template>
  <aside
    class="sidebar"
    :aria-label="`${NavigationContent.brand.title} desktop navigation`"
  >
    <header class="sidebar__header">
      <h3 class="sidebar__header__title">
        {{ NavigationContent.brand.title }}
      </h3>
    </header>

    <main class="sidebar__content">
      <nav
        class="sidebar__nav"
        aria-label="Primary navigation"
      >
        <ul class="sidebar__nav__list">
          <li
            v-for="tab in NavigationContent.tabs"
            :key="tab.name"
            class="sidebar__nav__list__item"
          >
            <CommonChip
              :label="tab.name"
              :href="tab.href"
              :marker="'bar'"
            />
          </li>
        </ul>
      </nav>

      <section
        class="sidebar__filters"
        aria-labelledby="sidebar-filters-title"
      >
        <h4
          id="sidebar-filters-title"
          class="sidebar__sectionTitle"
        >
          Quick Filters
        </h4>

        <ul class="sidebar__filters__list">
          <li
            v-for="filter in NavigationContent.filters"
            :key="filter.label"
            class="sidebar__filters__list__item"
          >
            <CommonChip
              :label="filter.label"
              :active="filter.active"
            />
          </li>
        </ul>
      </section>

      <div
        class="sidebar__spacer"
        aria-hidden="true"
      />
    </main>

    <footer
      class="sidebar__footer"
      aria-labelledby="sidebar-summary-title"
    >
      <h4
        id="sidebar-summary-title"
        class="sidebar__sectionTitle"
      >
        Summary
      </h4>

      <dl class="sidebar__summary">
        <div class="sidebar__summary__row">
          <div
            v-for="stat in NavigationContent.stats.slice(0, 2)"
            :key="stat.label"
            class="sidebar__summary__item"
          >
            <dt class="sidebar__summary__item__label">
              {{ stat.label }}
            </dt>

            <dd class="sidebar__summary__item__value">
              {{ stat.value }}
            </dd>
          </div>
        </div>

        <div class="sidebar__summary__row">
          <div
            class="sidebar__summary__item active"
          >
            <dt class="sidebar__summary__item__label">
              {{ NavigationContent.stats[2].label }}
            </dt>

            <dd class="sidebar__summary__item__value">
              {{ NavigationContent.stats[2].value }}
            </dd>
          </div>
        </div>
      </dl>
    </footer>
  </aside>
</template>
