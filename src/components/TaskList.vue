<template>
	<div class="flex">
		<div
			v-for="(column, index) in columnStore.columns"
			:key="index"
			class="min-w-[100px] px-4 border-l first:border-none border-black"
		>
			<h2 class="font-bold text-center pb-5 mb-5 border-b border-black">
				{{ column }}
			</h2>
			<div v-if="taskByColumn[column]?.length > 0">
				<div class="flex flex-col gap-4">
					<TaskItem
						v-for="(task, taskIndex) in taskByColumn[column]"
						:key="taskIndex"
						:task="task"
						:column="column"
						@changeTaskPosition="changeTaskPosition"
					/>
				</div>
			</div>
			<TaskItem v-else :column="column" @changeTaskPosition="changeTaskPosition"/>
		</div>
	</div>
</template>

<script setup>
	import { defineProps, computed } from 'vue';
	import TaskItem from './TaskItem.vue';
	import { useTaskStore, useColumnStore, useAuthorStore } from '@/stores/store';

	const props = defineProps({
		filteredTasks: {
			type: Array,
		},
	});
	const columnStore = useColumnStore();
	const authorStore = useAuthorStore();

	function changeTaskPosition(moveData) {
		const fromTaskIndex = props.filteredTasks.findIndex(x => x.id === Number(moveData.fromId));
		const toTaskIndex = moveData.toId
			? props.filteredTasks.findIndex(x => x.id === Number(moveData.toId))
			: 0;
		const taskToMove = {
			...props.filteredTasks[fromTaskIndex],
			current_column: moveData.toColumn,
		};

		props.filteredTasks.splice(fromTaskIndex, 1);
		props.filteredTasks.splice(toTaskIndex, 0, taskToMove);
		props.filteredTasks.forEach((x, index) => x.sortIndex = index);
	};

	const taskByColumn = computed(() => {
		const result = {};

		for (const task of props.filteredTasks) {
			result[task.current_column] ??= [];
			result[task.current_column].push({
				author: authorStore.authorById[task.author_id] ?? task.author_id,
				id: task.id,
				title: task.title,
			})
		}

		for (const column in result) {
			result[column].sort((a, b) => a.sortIndex - b.sortIndex);
		}

		return result;
	});
</script>
