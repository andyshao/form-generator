<template>
	<el-row v-if="activeData.__config__.layoutTree">
		<el-divider>布局结构树</el-divider>
		<el-tree
			:data="[activeData.__config__]"
			:props="layoutTreeProps"
			node-key="renderKey"
			default-expand-all
			draggable
		>
			<span slot-scope="{ node, data }">
				<span class="node-label">
					<svg-icon
						class="node-icon"
						:icon-class="data.__config__?data.__config__.tagIcon:data.tagIcon"
					/>
					{{ node.label }}
				</span>
			</span>
		</el-tree>
	</el-row>
</template>
<script>
export default {
	props: {
		activeData: Object
	},
	data() {
		return {
			layoutTreeProps: {
				label(data, node) {
					const config = data.__config__
					return data.componentName || `${config.label}: ${data.__vModel__}`
				}
			}
		}
	}
}
</script>
