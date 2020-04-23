import utils from '../utils';
import components from '../components';
export default {
	default: function (h, element, index, parent) {
		const { formId, componentName, span } = element.__config__;
		const { tableColumn } = element.__slot__;
		let mockData = [];
		return (
			<el-col span={span} class={utils.rowClassName(this.activeId, formId)} nativeOnClick={event => { this.$listeners.activeItem(element); event.stopPropagation() }}>
				<span class="component-name">{componentName}</span>
				<lwc-table
					data={mockData}
					columnOptions={tableColumn}>
				</lwc-table>
				{components.itemBtns.apply(this, arguments)}
			</el-col>
		);
	}
}
