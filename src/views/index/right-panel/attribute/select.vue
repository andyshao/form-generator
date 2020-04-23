<template>
	<el-form size="small" label-width="90px">
		<el-divider>选项</el-divider>
		<draggable
			:list="activeData.__slot__.options"
			:animation="340"
			group="selectItem"
			handle=".option-drag"
		>
			<div v-for="(item, index) in activeData.__slot__.options" :key="index" class="select-item">
				<el-row type="flex" justify="start" align="center">
					<div class="select-line-icon option-drag">
						<i class="el-icon-s-operation" />
					</div>
					<el-col>
						<el-input v-model="item.label" placeholder="选项名" size="small" />
					</el-col>
					<el-col>
						<el-input
							placeholder="选项值"
							size="small"
							:value="item.value"
							@input="setOptionValue(item, $event)"
						/>
					</el-col>

					<div
						class="close-btn select-line-icon"
						@click="activeData.__slot__.options.splice(index, 1)"
					>
						<i class="el-icon-remove-outline" />
					</div>
				</el-row>
			</div>
		</draggable>
		<div style="margin-left: 20px;">
			<el-button
				style="padding-bottom: 0"
				icon="el-icon-circle-plus-outline"
				type="text"
				@click="addSelectItem"
			>添加选项</el-button>
		</div>
		<el-divider />
	</el-form>
</template>
<script>
export default {
	props: {
		activeData: Object
	},
	methods: {
		addSelectItem() {
			this.activeData.__slot__.options.push({
				label: '',
				value: ''
			})
		},
		setOptionValue(item, val) {
			item.value = isNumberStr(val) ? +val : val
		},
	}
}
</script>
