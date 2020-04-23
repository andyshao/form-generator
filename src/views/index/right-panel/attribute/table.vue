<template>
	<el-form size="small" label-width="90px">
		<el-form-item label="api地址">
			<el-input v-model="data.apiUrl" placeholder="请输入字段名（v-model）" />
		</el-form-item>
	</el-form>
	<!-- <div>Hello World</div> -->
</template>
<script>
export default {
	props: {
		showField: Boolean,
		data: Object
	},
	watch: {
		data: {
			handler(val) {
				// this.activeData = val;
				console.log('handler 123')
			},
			immediate: true //立即执行handler方法
		}
	},
	mounted() {
		console.log(this.$listener);
	}
}
</script>
