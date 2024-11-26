<template>
	<div class="flex">
		<button class="p-4 bg-gray-300" @click="openModal">Add task</button>
	</div>
	<div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-1">
		<div class="flex flex-col items-center gap-6 bg-white p-5 rounded-lg">
			<h2 class="font-bold text-lg">Add new task</h2>

			<div class="flex flex-col w-full">
				<label for="inputTitleField" class="text-lg font-semibold text-gray-700">Enter title</label>
				<input
					v-model="taskTitle"
					type="text"
					id="inputTitleField"
					@change="resetError"
					class="mt-2 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray"
					placeholder="Enter title"
				/>
			</div>

			<div class="flex flex-col w-full" v-if="authorStore.authors.length > 0">
				<label for="authorSelect" class="text-lg font-semibold text-gray-700">Select the author</label>
				<select
					v-model="selectedAuthor"
					id="authorSelect"
					@change="resetError"
					class="mt-2 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray"
				>
					<option value="" disabled>Select an author</option>
					<option v-for="option in authorStore.authors" :key="option.id" :value="option.id">
						{{ option.name }}
					</option>
				</select>
			</div>

			<div class="flex gap-4">
				<button class="p-4 bg-gray-300" @click="addTask">Confirm</button>
				<button class="p-4 bg-gray-300" @click="closeModal">Cancel</button>
			</div>

			<div v-if="error">
				<p class="text-red-500">{{ error }}</p>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { defineProps, ref } from 'vue';
	import { useTaskStore, useColumnStore, useAuthorStore } from '@/stores/store';
	import axios from "axios";

	const selectedAuthor = ref(null);
	const taskTitle = ref('');
	const error = ref('');
	const isModalOpen = ref(false);
	const taskStore = useTaskStore();
	const columnStore = useColumnStore();
	const authorStore = useAuthorStore();

	async function addTask() {
		if (!selectedAuthor.value) {
			error.value = "Missing author"
			return;
		}
		if (!taskTitle.value) {
			error.value = "Missing title"
			return;
		}

		const column = columnStore.columns[0];
		const lastId = taskStore.tasks.slice(-1)[0].id;
		const newTask = {
			author_id: selectedAuthor.value,
			id: lastId + 1,
			title: taskTitle.value,
			current_column: column,
		};
		taskStore.addTask(newTask);

		try {
			await axios.post('todo/api/tasks', data);
			isModalOpen.value = false;
		} catch (err) {
			error.value = "Error posting data to backend: " + err;
			console.error(error.value, err);
		}
	};

	function resetError() {
		error.value = "";
	}

	function openModal() {
		isModalOpen.value = true;
		error.value = "";
		selectedAuthor.value = null;
		taskTitle.value = "";
	};

	function closeModal() {
		isModalOpen.value = false;
	};
</script>
