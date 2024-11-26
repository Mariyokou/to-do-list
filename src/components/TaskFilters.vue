<template>
	<div class="flex gap-4">
		<SelectPageList v-if="authorStore.authors.length > 0" v-model="selectedAuthor" @fetch-data="getAuthors"
			placeholder="Select an author" @selection-change="updateFilters" />
		<input class="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-grey" type="text"
			v-model="searchTitle" placeholder="Search items" @input="updateFilters" />
	</div>
</template>

<script setup>
	import { defineProps, ref, defineEmits } from 'vue';
	import { SelectPageList } from 'v-selectpage';
	import { useAuthorStore } from '@/stores/store';

	const props = defineProps({
	   	searchTitle: {
			type: String,
			default: null,
		},
		selectedAuthor: {}
	});
	const authorStore = useAuthorStore();
	const emit = defineEmits(['updateFilters']);
	const searchTitle = ref('');
	const selectedAuthor = ref(null);

	function updateFilters() {
		emit('updateFilters', { author: selectedAuthor?.value?.[0], title: searchTitle?.value });
	};

	function getAuthors(data, callback) {
		const { search, pageNumber, pageSize } = data;
		const start = (pageNumber - 1) * pageSize;
		const end = start + pageSize - 1;
		const filteredAuthors = search
			? authorStore.authors.filter(val => val.name.toLowerCase().includes(search.toLowerCase()))
			: authorStore.authors

		callback(
			filteredAuthors.filter((val, index) => index >= start && index <= end),
			filteredAuthors.length
		)
	};
</script>