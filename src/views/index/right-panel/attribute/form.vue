<template>
	<el-form size="small" label-width="90px">
		<el-form-item label="api地址">
			<el-input v-model="data.apiUrl" placeholder="请输入字段名（v-model）" />
		</el-form-item>
	</el-form>
</template>
<script>
export default {
	props: {
		data: Object
	},
	watch: {
		data: {
			handler(val) {
				console.log('data:', data)
			},
			immediate: true //立即执行handler方法
		}
	},
	mounted() {
		console.log(this.$listener);
	}
}
</script>
