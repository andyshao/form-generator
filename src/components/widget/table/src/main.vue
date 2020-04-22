<template>
	<el-table :data="data" style="width: 100%">
		<el-table-column
			:prop="column.prop"
			:label="column.label"
			:width="column.width ? column.width : null"
			v-for="(column, index) in columnOptions"
			:key="index"
		></el-table-column>
	</el-table>
</template>

  <script>
export default {
	name: 'lwc-table',
	props: {
		columnOptions: {
			type: Array,
			default() {
				return []
			}
		},
		data: {
			type: Array,
			default() {
				return []
			}
		}
	},
	mounted() {
		console.log('lis:', this.$listeners)
	}
}
  </script>
