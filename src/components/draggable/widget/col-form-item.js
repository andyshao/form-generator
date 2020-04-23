import components from '../components';
export default {
	default: function (h, element, index, parent) {
		const { activeItem } = this.$listeners
		const config = element.__config__
		let className = this.activeId === config.formId ? 'drawing-item active-from-item' : 'drawing-item'
		let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null
		if (config.showLabel === false) labelWidth = '0'
		return (
			<el-col span={config.span} class={className}
				nativeOnClick={event => { activeItem(element); event.stopPropagation() }}>
				<el-form-item label-width={labelWidth}
					label={config.showLabel ? config.label : ''} required={config.required}>
					<render key={config.renderKey} conf={element} onInput={event => {
						this.$set(config, 'defaultValue', event)
					}} />
				</el-form-item>
				{components.itemBtns.apply(this, arguments)}
			</el-col>
		)
	}
}
