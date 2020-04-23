<template>
	<el-form size="small" label-width="90px">
		<el-form-item v-if="activeData.__config__.tag === 'el-cascader'" label="是否多选">
			<el-switch v-model="activeData.props.props.multiple" />
		</el-form-item>
		<el-form-item v-if="activeData.__config__.tag === 'el-cascader'" label="展示全路径">
			<el-switch v-model="activeData['show-all-levels']" />
		</el-form-item>
		<el-form-item v-if="activeData.__config__.tag === 'el-cascader'" label="可否筛选">
			<el-switch v-model="activeData.filterable" />
		</el-form-item>
		<template v-if="['el-cascader'].indexOf(activeData.__config__.tag) > -1">
			<el-divider>选项</el-divider>
			<el-form-item label="数据类型">
				<el-radio-group v-model="activeData.__config__.dataType" size="small">
					<el-radio-button label="dynamic">动态数据</el-radio-button>
					<el-radio-button label="static">静态数据</el-radio-button>
				</el-radio-group>
			</el-form-item>

			<template v-if="activeData.__config__.dataType === 'dynamic'">
				<el-form-item label="标签键名">
					<el-input v-model="activeData.props.props.label" placeholder="请输入标签键名" />
				</el-form-item>
				<el-form-item label="值键名">
					<el-input v-model="activeData.props.props.value" placeholder="请输入值键名" />
				</el-form-item>
				<el-form-item label="子级键名">
					<el-input v-model="activeData.props.props.children" placeholder="请输入子级键名" />
				</el-form-item>
			</template>

			<!-- 级联选择静态树 -->
			<el-tree
				v-if="activeData.__config__.dataType === 'static'"
				draggable
				:data="activeData.options"
				node-key="id"
				:expand-on-click-node="false"
				:render-content="renderContent"
			/>
			<div v-if="activeData.__config__.dataType === 'static'" style="margin-left: 20px">
				<el-button
					style="padding-bottom: 0"
					icon="el-icon-circle-plus-outline"
					type="text"
					@click="addTreeItem"
				>添加父级</el-button>
			</div>
			<el-divider />
		</template>

		<treeNode-dialog :visible.sync="dialogVisible" title="添加选项" @commit="addNode" />
	</el-form>
</template>
<script>
import TreeNodeDialog from '@/views/index/TreeNodeDialog'
export default {
	components: { TreeNodeDialog },
	props: {
		activeData: Object
	},
	data() {
		return {
			dialogVisible: false,
			currentNode: null,

		}
	},
	methods: {
		addTreeItem() {
			++this.idGlobal
			this.dialogVisible = true
			this.currentNode = this.activeData.options
		},
		renderContent(h, { node, data, store }) {
			return (
				<div class="custom-tree-node">
					<span>{node.label}</span>
					<span class="node-operation">
						<i on-click={() => this.append(data)}
							class="el-icon-plus"
							title="添加"
						></i>
						<i on-click={() => this.remove(node, data)}
							class="el-icon-delete"
							title="删除"
						></i>
					</span>
				</div>
			)
		},
		append(data) {
			if (!data.children) {
				this.$set(data, 'children', [])
			}
			this.dialogVisible = true
			this.currentNode = data.children
		},
		remove(node, data) {
			this.activeData.__config__.defaultValue = [] // 避免删除时报错
			const { parent } = node
			const children = parent.data.children || parent.data
			const index = children.findIndex(d => d.id === data.id)
			children.splice(index, 1)
		},
		addNode(data) {
			this.currentNode.push(data)
		},
	}
}
</script>
