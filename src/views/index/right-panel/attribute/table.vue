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
		data: Object
	}
}
</script>
