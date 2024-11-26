<template>
	<div
		draggable="true"
		@dragstart="selectTaskToMove($event, task)"
		@dragover.prevent
		@drop="moveTask($event, column, task)"
	>
		<div v-if="task" class="bg-[#e7ff2038] p-4">
			<h3>{{ task.title }}</h3>
			<p class="text-xs italic">Author: {{ task.author }}</p>
		</div>
		<div v-else class="p-4"></div>
	</div>
</template>

<script setup>
	import { defineProps, defineEmits } from 'vue';

	defineProps({
		task: {
			type: Object,
		},
		column: {
			type: String,
		},
	});
	const emit = defineEmits(['changeTaskPosition']);

	function selectTaskToMove(evt, task) {
		evt.dataTransfer.setData('fromId', task.id);
    };

	function moveTask(evt, toColumn, task) {
		const fromId = evt.dataTransfer.getData('fromId');
      	emit('changeTaskPosition', { toColumn, fromId, toId: task?.id });
	};
</script>
