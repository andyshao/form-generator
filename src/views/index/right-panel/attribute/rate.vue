<template>
	<el-form size="small" label-width="90px">
		<el-form-item v-if="activeData['allow-half'] !== undefined" label="允许半选">
			<el-switch v-model="activeData['allow-half']" />
		</el-form-item>
		<el-form-item v-if="activeData['show-text'] !== undefined" label="辅助文字">
			<el-switch v-model="activeData['show-text']" @change="rateTextChange" />
		</el-form-item>
		<el-form-item v-if="activeData['show-score'] !== undefined" label="显示分数">
			<el-switch v-model="activeData['show-score']" @change="rateScoreChange" />
		</el-form-item>
	</el-form>
</template>
<script>
export default {
	props: {
		activeData: Object
	},
	methods: {
		rateTextChange(val) {
			if (val) this.activeData['show-score'] = false
		},
		rateScoreChange(val) {
			if (val) this.activeData['show-text'] = false
		},
	}
}
</script>
