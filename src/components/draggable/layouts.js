import * as DESIGN_PROPERTIES from '@/config/design_properties.js';
import table from './widget/table.js';
import layout from './widget/layout.js';
import form from './widget/form.js';
import colFormItem from './widget/col-form-item.js';

export default {
	[DESIGN_PROPERTIES.LAYOUT_TYPE_COL_FORM_ITEM]: colFormItem.default,
	[DESIGN_PROPERTIES.LAYOUT_TYPE_ROW_FORM_ITEM]: layout.row,
	[DESIGN_PROPERTIES.LAYOUT_TYPE_FORM_CONTAINER]: form.default,
	[DESIGN_PROPERTIES.LAYOUT_TYPE_TABLE]: table.default
}
