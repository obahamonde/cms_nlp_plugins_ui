<script setup lang="ts">
import * as monaco from "monaco-editor";
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import JSONWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import CSSWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import HTMLWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import TSWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

const StorageName = {
  EDITOR_STATE: "editorState",
  EDITOR_VALUE: "editorValue",
};

const props = defineProps<{
  activeTab: string;
}>();

const emit = defineEmits<{
  call: [monaco.editor.IStandaloneCodeEditor];
  send: [typeof editorValue.value];
}>();

const initialEditorValue = {
  html: "",
  css: "",
  javascript: "",
  python: "",
};

declare global {
  interface Window {
    MonacoEnvironment: any;
  }
}

window.MonacoEnvironment = {
  getWorker(_: string, label: string) {
    if (label === "json") return new JSONWorker();

    if (label === "css" || label === "scss" || label === "less")
      return new CSSWorker();

    if (label === "html" || label === "handlebars" || label === "razor")
      return new HTMLWorker();

    if (label === "typescript" || label === "javascript") return new TSWorker();

    return new EditorWorker();
  },
};

const container = ref<HTMLDivElement | null>(null);

let editor: monaco.editor.IStandaloneCodeEditor;

const { activeTab } = toRefs(props);

const editorState = useStorage<Record<string, any>>(
  StorageName.EDITOR_STATE,
  {},
);
const editorValue = useStorage<Record<string, any>>(
  StorageName.EDITOR_VALUE,
  initialEditorValue,
);

onMounted(() => {
  editor = monaco.editor.create(container.value!, {
    language: activeTab.value,
    theme: isDark.value ? "vs-dark" : "vs",
  });

  emit("send", editorValue.value);

  editor.onDidChangeModelContent(
    useDebounceFn(() => {
      if (editorValue.value[activeTab.value] !== editor.getValue()!) {
        editorValue.value[activeTab.value] = editor.getValue()!;
        emit("send", editorValue.value);
      }
    }, 500),
  );

  if (editorValue.value[activeTab.value]) {
    editor.setValue(editorValue.value[activeTab.value]);
    editor.restoreViewState(editorState.value[activeTab.value]);
  }

  editor.addAction({
    id: "call-autocomplete",
    label: "Call Autocompletion",
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
    contextMenuGroupId: "navigation",
    contextMenuOrder: 1.5,
    run: function (ed) {
      emit("call", editor);
    },
  });
});

watch(activeTab, (currentTab, prevTab) => {
  monaco.editor.setModelLanguage(editor.getModel()!, currentTab);

  editorState.value[prevTab] = editor.saveViewState();

  if (editorValue.value[currentTab])
    editor.setValue(editorValue.value[currentTab]);
  else editor.setValue("");

  if (editorState.value[currentTab]) {
    editor.restoreViewState(editorState.value[currentTab]!);
    editor.focus();
  }
});

watch(isDark, (value) => {
  editor.updateOptions({
    theme: value ? "vs-dark" : "vs",
  });
});

const editorObserver = useResizeObserver(container, () => {
  editor.layout();
});

onUnmounted(() => {
  editor?.dispose();
  editorObserver.stop();
});
</script>

<template>
  <div ref="container" style="height: calc(100% - 2.5rem)" />
</template>
