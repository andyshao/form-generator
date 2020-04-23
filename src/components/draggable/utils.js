export default {
	/**
	 * @Author: TangLiangcheng
	 * @Date: 2020-04-23 10:05:50
	 * @Desc: 布局行组件 class 名
	 * @param activeId [当前选择组件ID]
	 * @param widgetId [渲染组件ID]
	 * @return class名 [string]
	 */
	rowClassName(activeId, widgetId) {
		const className =
			activeId === widgetId
				? "drawing-row-item active-from-item"
				: "drawing-row-item";

		return className;
	}
};
