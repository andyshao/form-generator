<template>
	<el-form size="small" label-width="90px">
		<el-form-item label="表单名" v-if="activeData.__config__.layout === 'formContainer'">
			<el-input v-model="activeData.__config__.formRef" placeholder="请输入表单名（ref）" />
		</el-form-item>
		<el-form-item label="表单模型" v-if="activeData.__config__.layout === 'formContainer'">
			<el-input v-model="activeData.__config__.formModel" placeholder="请输入数据模型" />
		</el-form-item>
		<el-form-item label="校验模型" v-if="activeData.__config__.layout === 'formContainer'">
			<el-input v-model="activeData.__config__.formRules" placeholder="请输入校验模型" />
		</el-form-item>
		<el-form-item label="表单尺寸" v-if="activeData.__config__.layout === 'formContainer'">
			<el-radio-group v-model="activeData.size">
				<el-radio-button label="medium">中等</el-radio-button>
				<el-radio-button label="small">较小</el-radio-button>
				<el-radio-button label="mini">迷你</el-radio-button>
			</el-radio-group>
		</el-form-item>
		<el-form-item label="标签对齐" v-if="activeData.__config__.layout === 'formContainer'">
			<el-radio-group v-model="activeData.labelPosition">
				<el-radio-button label="left">左对齐</el-radio-button>
				<el-radio-button label="right">右对齐</el-radio-button>
				<el-radio-button label="top">顶部对齐</el-radio-button>
			</el-radio-group>
		</el-form-item>

		<el-form-item label="表单按钮" v-if="activeData.__config__.layout === 'formContainer'">
			<el-switch v-model="activeData.formBtns" />
		</el-form-item>
	</el-form>
</template>
<script>
export default {
	props: {
		activeData: Object
	}
}
</script>
