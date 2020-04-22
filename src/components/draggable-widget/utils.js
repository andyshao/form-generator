export default {
	rowClassName(activeId, widgetId) {
		const className = activeId === widgetId
			? 'drawing-row-item active-from-item'
			: 'drawing-row-item';

		return className;
	}
}
