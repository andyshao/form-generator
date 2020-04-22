import utils from './utils';
import components from './components';
export default {
	default: function (h, element, index, parent) {
		let child = components.renderChildren.apply(this, arguments);
		const { formId, formRef, children, componentName, span } = element.__config__;
		const { labelWidth, labelPosition, disabled, size } = element;
		return (
			<el-col span={span} class={utils.rowClassName(this.activeId, formId)} nativeOnClick={event => { this.$listeners.activeItem(element); event.stopPropagation() }}>
				<span class="component-name">{componentName}</span>
				<el-form
					ref={formRef}
					disabled={disabled}
					size={size}
					label-width={labelWidth + 'px'}
					label-position={labelPosition}>
					<draggable list={children} animation={340} group="componentsGroup" class="drag-wrapper">
						{child}
					</draggable>
				</el-form>
				{components.itemBtns.apply(this, arguments)}
			</el-col>
		);
	}
}
