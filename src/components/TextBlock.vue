<script setup lang="ts">
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
const props = defineProps({
  content: {
    type: String,
    default: "",
  }
});
const md = MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str: any, lang: any): any => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          hljs.highlight(lang, str, true).value
        );
      } catch (__) {}
    }
    return (
      '<pre ><code class="hljs">' + md.utils.escapeHtml(str) + "</code></pre>"
    );
  },
  });

</script>
<template>
  <div
    class=" bg-gray-300 rounded sh max-w-lg text-xs p-2 markdown-body"
    v-html="
      md.render(props.content)
    "

  ></div>
</template>
<style scoped lang="scss"> 
@import url("https://cdn.jsdelivr.net/npm/github-markdown-css@4.0.0/github-markdown.min.css");
@import url("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.2/styles/github.min.css");
@import url("https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap&family=Open+Sans:wght@400;600;700&display=swap&family=DM+Mono:wght@400;500;600;700&display=swap&family=Roboto+Mono:wght@400;500;600;700&display=swap&Merriweather:wght@400;500;600;700&display=swap");

.markdown-body {
 
img {
  max-width: 8rem!important;
}
}
pre { line-height: 125%; }
</style>