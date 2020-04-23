<template>
	<el-form size="small" label-width="90px">
		<el-divider>正则校验</el-divider>
		<div v-for="(item, index) in activeData.__config__.regList" :key="index" class="reg-item">
			<span class="close-btn" @click="activeData.__config__.regList.splice(index, 1)">
				<i class="el-icon-close" />
			</span>
			<el-form-item label="表达式">
				<el-input v-model="item.pattern" placeholder="请输入正则" />
			</el-form-item>
			<el-form-item label="错误提示" style="margin-bottom:0">
				<el-input v-model="item.message" placeholder="请输入错误提示" />
			</el-form-item>
		</div>
		<div style="margin-left: 20px">
			<el-button icon="el-icon-circle-plus-outline" type="text" @click="addReg">添加规则</el-button>
		</div>
	</el-form>
</template>
<script>
export default {
	props: {
		activeData: Object
	},
	methods: {
		addReg() {
			this.activeData.__config__.regList.push({
				pattern: '',
				message: ''
			})
		},
	}
}
</script>
