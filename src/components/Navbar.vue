<template>
  <nav flex="~ gap-4" mt-6 justify-center text-xl>
    <RouterLink btn-icon to="/" title="Home" data-test-id="home">
      <Icon icon="mdi-home" />
    </RouterLink>

    <RouterLink btn-icon to="/about" title="About" data-test-id="about">
      <Icon icon="mdi-information" />
    </RouterLink>

    <a
      btn-icon
      rel="noreferrer"
      href="https://github.com/obahamonde/aiofauna"
      target="_blank"
      title="GitHub"
    >
      <Icon icon="mdi-github" />
    </a>

    <button btn-icon @click="toggleDark()" title="Toggle Theme">
      <Icon
        :icon="isDark ? 'mdi-lightbulb-off' : 'mdi-lightbulb-on'"
        :class="isDark ? 'text-accent' : 'text-secondary'"
      />
    </button>
  </nav>
</template>
