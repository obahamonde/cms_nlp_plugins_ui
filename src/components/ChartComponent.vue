<script setup lang="ts">
import { Chart, registerables, ChartData, ChartOptions } from "chart.js";
Chart.register(...registerables);
const toggleLegend = ref(true);
const chart = ref<Chart<"doughnut" | "bar" | "line" | "pie" | "radar">>();
const ctx = ref<HTMLCanvasElement>();
const chartType = ref<"doughnut" | "bar" | "line" | "pie" | "radar">(
  "doughnut",
);

interface MyDataset {
  label: string;
  data: number[];
  backgroundColor: string[];
  borderWidth: number;
  fill: boolean;
}

interface MyChartData {
  labels: string[];
  datasets: MyDataset[];
}

const chartData = ref<ChartData>({
  labels: [],
  datasets: [],
}) as Ref<MyChartData>;
const options = computed<
  ChartOptions<"doughnut" | "bar" | "line" | "pie" | "radar">
>(() => ({
  scales: {
    myScale: {
      type: "logarithmic",
      position: toggleLegend.value ? "left" : "right",
    },
  },
  plugins: {
    legend: {
      position: toggleLegend.value ? "top" : "bottom",
    },
    title: {
      display: true,
      text: "Chart.js Doughnut Chart",
    },
  },
}));

onMounted(() => {
  if (!ctx.value) return;
  const canvasCtx = ctx.value.getContext("2d");
  if (!canvasCtx) return;
  chart.value = new Chart(canvasCtx, {
    type: chartType.value,
    data: chartData.value,
    options: options.value,
  });
});

watch(chartType, () => {
  if (!chart.value) return;
  chart.value.destroy();
  chart.value = new Chart(ctx.value!, {
    type: chartType.value,
    data: chartData.value,
    options: options.value,
  });
});
const onFileChange = async (e: Event) => {
  e.preventDefault();
  const formData = new FormData();
  const files = (e.target as HTMLInputElement).files;
  if (!files) return;
  formData.append("file", files[0]);

  try {
    const response = await fetch("/api/documents/csv/foo", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.error(`Error: ${response.statusText}`);
      return;
    }

    const data = await response.json();
    console.log(data);
    if (!data || !data.string_data || !data.numeric_data) {
      console.error("Invalid data received from server");
      return;
    }

    chartData.value.labels = Object.keys(data.string_data);

    // Handle numeric data (changed)
    chartData.value.datasets = [];
    for (const [key, value] of Object.entries(data.numeric_data)) {
      chartData.value.datasets.push({
        label: key,
        data: value.data,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderWidth: 1,
        fill: true,
      });
    }

    if (chart.value) {
      chart.value.destroy();
      chart.value = new Chart(ctx.value!, {
        type: chartType.value,
        data: chartData.value,
        options: options.value,
      });
    }
  } catch (error) {
    console.error(`Fetch failed: ${error}`);
  }
};
</script>
<template>
  <div>
    <input type="file" accept="*/*" @change="onFileChange" />
    <select v-model="chartType" class="select-wrapper">
      <option value="doughnut">Doughnut</option>
      <option value="bar">Bar</option>
      <option value="line">Line</option>
      <option value="pie">Pie</option>
      <option value="radar">Radar</option>
    </select>

    <canvas ref="ctx" width="400" height="400"></canvas>
  </div>
</template>
<style scoped>
.select-wrapper {
  position: relative;
  width: 200px;
  height: 40px;
  background-color: #f2f2f2;
  border-radius: 5px;
  overflow: hidden;
}

select {
  width: 100%;
  height: 100%;
  padding: 10px;
  background: transparent;
  border: none;
  outline: none;
  appearance: none; /* Remove default arrow in some browsers */
  -webkit-appearance: none; /* Remove default arrow in WebKit browsers */
  -moz-appearance: none; /* Remove default arrow in Firefox */
  cursor: pointer;
}

/* Custom arrow */
.select-wrapper::after {
  content: "\25BC"; /* Unicode down arrow */
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  pointer-events: none; /* Makes sure the dropdown is still clickable */
}
</style>
