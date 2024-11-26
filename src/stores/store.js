import { ref, computed } from 'vue'
import { defineStore } from 'pinia'


export const useTaskStore = defineStore('task', () => {
	const tasks = ref([]);

	function setTasks(_tasks) {
		tasks.value = _tasks;
	};

	function addTask(newTask) {
		tasks.value.push(newTask);
	};

	return { tasks, addTask, setTasks };
});

export const useColumnStore = defineStore('column', () => {
	const columns = ref([]);

	function setColumns(_columns) {
		columns.value = _columns;
	};

	return { columns, setColumns };
});

export const useAuthorStore = defineStore('author', () => {
	const authors = ref([]);
	const authorById = computed(() => authors.value.reduce((acc, x) => {
		acc[x.id] = x.name;
		return acc;
	}, {}));

	function setAuthors(_authors) {
		authors.value = _authors;
	};

	return { authors, authorById, setAuthors };
})
