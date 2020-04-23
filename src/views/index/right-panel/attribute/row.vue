<template>
	<el-form size="small" label-width="90px">
		<el-form-item v-if="activeData.__config__.layout==='rowFormItem'" label="栅格间隔">
			<el-input-number v-model="activeData.gutter" :min="0" placeholder="栅格间隔" />
		</el-form-item>
		<el-form-item label="内边距" v-if="activeData.padding !==undefined">
			<el-select
				v-model="activeData.padding"
				placeholder="请选择"
				:style="{width: '100%'}"
				clearable
				filterable
			>
				<el-option
					v-for="(item, index) in styleOptions.padding"
					:key="index"
					:label="item.value"
					:value="item.label"
				/>
			</el-select>
		</el-form-item>
		<el-form-item label="外边距" v-if="activeData.margin !==undefined">
			<el-select
				v-model="activeData.margin"
				placeholder="请选择"
				:style="{width: '100%'}"
				clearable
				filterable
			>
				<el-option
					v-for="(item, index) in styleOptions.margin"
					:key="index"
					:label="item.value"
					:value="item.label"
				/>
			</el-select>
		</el-form-item>

		<el-form-item v-if="activeData.__config__.layout==='rowFormItem'" label="布局模式">
			<el-radio-group v-model="activeData.type">
				<el-radio-button label="default" />
				<el-radio-button label="flex" />
			</el-radio-group>
		</el-form-item>

		<el-form-item v-if="activeData.justify!==undefined&&activeData.type==='flex'" label="水平排列">
			<el-select v-model="activeData.justify" placeholder="请选择水平排列" :style="{width: '100%'}">
				<el-option
					v-for="(item, index) in justifyOptions"
					:key="index"
					:label="item.label"
					:value="item.value"
				/>
			</el-select>
		</el-form-item>
		<el-form-item v-if="activeData.align!==undefined&&activeData.type==='flex'" label="垂直排列">
			<el-radio-group v-model="activeData.align">
				<el-radio-button label="top" />
				<el-radio-button label="middle" />
				<el-radio-button label="bottom" />
			</el-radio-group>
		</el-form-item>
	</el-form>
</template>
<script>
import styleOptions from '@/utils/styleOptions';
export default {
	props: {
		activeData: Object
	},
	data() {
		return {
			styleOptions: styleOptions,
			justifyOptions: [
				{
					label: 'start',
					value: 'start'
				},
				{
					label: 'end',
					value: 'end'
				},
				{
					label: 'center',
					value: 'center'
				},
				{
					label: 'space-around',
					value: 'space-around'
				},
				{
					label: 'space-between',
					value: 'space-between'
				}
			],
		}
	}
}
</script>
