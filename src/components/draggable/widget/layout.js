import utils from "../utils";
import components from "../components";
export default {
	row: function(h, element, index, parent) {
		let child = components.renderChildren.apply(this, arguments);
		const { formId, componentName, span } = element.__config__;
		if (element.type === "flex") {
			child = (
				<el-row
					type={element.type}
					justify={element.justify}
					align={element.align}
				>
					{child}
				</el-row>
			);
		}
		return (
			<el-col
				span={span}
				class={utils.rowClassName(this.activeId, formId)}
				nativeOnClick={event => {
					this.$listeners.activeItem(element);
					event.stopPropagation();
				}}
			>
				<el-row gutter={element.__config__.gutter}>
					<span class="component-name">{componentName}</span>
					<draggable
						list={element.__config__.children}
						animation={340}
						group="componentsGroup"
						class="drag-wrapper"
					>
						{child}
					</draggable>
				</el-row>
				{components.itemBtns.apply(this, arguments)}
			</el-col>
		);
	}
};
