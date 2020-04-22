import layouts from '@/components/draggable-widget/layouts.js';
export default {
	itemBtns(h, element, index, parent) {
		const { copyItem, deleteItem } = this.$listeners
		return [
			<span class="drawing-item-copy" title="复制" onClick={event => {
				copyItem(element, parent); event.stopPropagation()
			}}>
				<i class="el-icon-copy-document" />
			</span>,
			<span class="drawing-item-delete" title="删除" onClick={event => {
				deleteItem(index, parent); event.stopPropagation()
			}}>
				<i class="el-icon-delete" />
			</span>
		]
	},
	renderChildren(h, element, index, parent) {
		const config = element.__config__
		if (!Array.isArray(config.children)) return null
		return config.children.map((el, i) => {
			const layout = layouts[el.__config__.layout]
			if (layout) {
				return layout.call(this, h, el, i, config.children)
			} else {}
			throw new Error(`没有与${config.layout}匹配的layout`);
		})
	}
}
