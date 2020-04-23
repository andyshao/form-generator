<template>
	<el-form size="small" label-width="90px">
		<el-form-item v-if="activeData.__config__.tag === 'el-color-picker'" label="颜色格式">
			<el-select
				v-model="activeData['color-format']"
				placeholder="请选择颜色格式"
				:style="{ width: '100%' }"
				clearable
				@change="colorFormatChange"
			>
				<el-option
					v-for="(item, index) in colorFormatOptions"
					:key="index"
					:label="item.label"
					:value="item.value"
				/>
			</el-select>
		</el-form-item>

		<!--颜色组件-->
		<el-form-item
			v-if="activeData.size !== undefined &&
              (activeData.__config__.optionType === 'button' ||
                activeData.__config__.border ||
                activeData.__config__.tag === 'el-color-picker')"
			label="选项尺寸"
		>
			<el-radio-group v-model="activeData.size">
				<el-radio-button label="medium">中等</el-radio-button>
				<el-radio-button label="small">较小</el-radio-button>
				<el-radio-button label="mini">迷你</el-radio-button>
			</el-radio-group>
		</el-form-item>
	</el-form>
</template>
<script>
export default {
	props: {
		activeData: Object
	},
	data() {
		return {
			colorFormatOptions: [
				{
					label: 'hex',
					value: 'hex'
				},
				{
					label: 'rgb',
					value: 'rgb'
				},
				{
					label: 'rgba',
					value: 'rgba'
				},
				{
					label: 'hsv',
					value: 'hsv'
				},
				{
					label: 'hsl',
					value: 'hsl'
				}
			],
		}
	},
	methods: {
		colorFormatChange(val) {
			this.activeData.__config__.defaultValue = null
			this.activeData['show-alpha'] = val.indexOf('a') > -1
			this.activeData.__config__.renderKey = +new Date() // 更新renderKey,重新渲染该组件
		},
	}
}
</script>
