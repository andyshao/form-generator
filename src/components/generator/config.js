import input from "./widget/input.js";
import select from "./widget/select.js";
import layout from "./widget/layout.js";
import container from "./widget/container.js";
import table from "./widget/table.js";

// 表单属性【右面板】
export const formConf = {
	formRef: "elForm",
	formModel: "formData",
	size: "medium",
	labelPosition: "right",
	labelWidth: 100,
	formRules: "rules",
	gutter: 15,
	disabled: false,
	span: 24,
	formBtns: true
};

export const pageConf = {
	disabled: false,
	readonly: false,
	span: 24
};

//容器型组件
export const containerComponents = container;

// 输入型组件 【左面板】
export const inputComponents = input;

// 选择型组件 【左面板】
export const selectComponents = select;

// 布局型组件 【左面板】
export const layoutComponents = layout;

// 表格组件
export const tableComponents = table;

