<script setup lang="ts">
const items = ref([
  {
    title: "Documentation",
    description: "Find in-depth information about AioFauna Features and API.",
    href: "https://docs.aiofauna.com",
  },
  {
    title: "Learn",
    description: "Learn about AioFauna in an interactive tutorial.",
    href: "https://www.youtube.com/watch?v=H3ynnADLP1I",
  },
  {
    title: "Examples",
    description: "Discover and deploy awesome AioFauna projects.",
    href: "https://www.aiofauna.com",
  },
  {
    title: "AI",
    description: "Learn how to use AioFauna with AI.",
    href: "https://swagchain.aiofauna.com",
  },
]);
</script>
<template>
  <div
    class="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex"
  >
    <div
      class="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none"
    >
      <a
        class="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
        href="https://www.linkedin.com/in/obahamondem"
        target="_blank"
        rel="noopener noreferrer"
      >
        By
        <img src="/logo.png" alt="OB Logo" class="dark:invert x2" priority />
      </a>
    </div>
  </div>

  <div
    class="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]"
  >
    <h1 class="text-title invert text-4xl">Agile</h1>
  </div>
  <div
    class="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left"
  >
    <a
      :href="i.href"
      class="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
      target="_blank"
      rel="noopener noreferrer"
      v-for="i in items"
      >∂
      <h2 class="card-title">
        {{ i.title }}
        <span
          class="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
        >
          -&gt;
        </span>
      </h2>
      <p
        class="m-0 max-w-[30ch] text-sm text-accent dark:text-success opacity-50"
      >
        {{ i.description }}
      </p>
    </a>
  </div>
</template>
