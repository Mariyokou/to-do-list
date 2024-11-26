<script setup>
	import TaskList from './TaskList.vue';
	import TaskFilters from './TaskFilters.vue';
	import AddTask from './AddTask.vue';
	import { SelectPageList } from "v-selectpage";
	import { ref, computed, onMounted } from "vue";
	import axios from "axios";
	import { useTaskStore, useColumnStore, useAuthorStore } from '@/stores/store';

	const error = ref("");
	const selectedAuthor = ref(null);
	const searchTitle = ref("");
	const isAddTaskModalOpen = ref(false);
	const taskStore = useTaskStore();
	const columnStore = useColumnStore();
	const authorStore = useAuthorStore();


	onMounted(async () => {
		try {
			const response = await axios.get("/api/frontend-task-data.json")
			if (!response.data.authors || !response.data.columns || !response.data.tasks) {
				error.value = "Error fetching JSON data";
				console.error(error.value);
				return;
			}

			authorStore.setAuthors(response.data.authors.map(x => ({ id: x.id, name: x.display_name })));
			columnStore.setColumns(response.data.columns);
			taskStore.setTasks(response.data.tasks);
		} catch (err) {
			error.value = "Error fetching JSON data" + err;
			console.error(error.value, err);
		}
	});

	const filteredTasks = computed(() => {
		if (!selectedAuthor.value && !searchTitle.value) {
			return taskStore.tasks;
		}
		return taskStore.tasks.filter(item => {
			const conditions = []
			if (selectedAuthor.value) {
				conditions.push(item.author_id === selectedAuthor.value);
			}
			if (searchTitle?.value) {
				conditions.push(item.title.toLowerCase().includes(searchTitle.value.toLowerCase()));
			}
			return conditions.every(x => x);
		});
	});

	function updateFilters(filterData) {
		searchTitle.value = filterData.title;
		selectedAuthor.value = filterData.author;
	};
</script>

<template>
	<div class="m-10 flex flex-col gap-6">
		<h1 class="text-xl text-center">
			To Do list
		</h1>
		<TaskFilters :searchTitle="searchTitle" :selectedAuthor="selectedAuthor" @updateFilters="updateFilters" />
		<AddTask />
		<div v-if="error">
			<p class="text-red-500">{{ error }}</p>
		</div>
		<div v-if="columnStore.columns || !error">
			<TaskList :filteredTasks="filteredTasks" />
		</div>
	</div>
</template>
