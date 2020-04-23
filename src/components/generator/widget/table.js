export default [
	{
		__config__: {
			label: "表格",
			layout: "lwc-table",
			children: [],
			tableData: "tableData",
			tag: "el-table",
			tagIcon: "number",
			defaultValue: undefined,
			span: 24,
			document: "https://element.eleme.cn/#/zh-CN/component/input-number"
		},
		__slot__: {
			tableColumn: [{
				prop: "name",
				label: "名称",
				width: 180
			}]
		},
		size: "medium",
		border: false,
	}
];
