import * as DESIGN_PROPERTIES from '@/config/design_properties.js';

import table from '@/components/draggable-widget/table.js';
import layout from '@/components/draggable-widget/layout.js';
import form from '@/components/draggable-widget/form.js';
import colFormItem from '@/components/draggable-widget/col-form-item.js';

export default {
	[DESIGN_PROPERTIES.LAYOUT_TYPE_COL_FORM_ITEM]: colFormItem.default,
	[DESIGN_PROPERTIES.LAYOUT_TYPE_ROW_FORM_ITEM]: layout.row,
	[DESIGN_PROPERTIES.LAYOUT_TYPE_FORM_CONTAINER]: form.default,
	[DESIGN_PROPERTIES.LAYOUT_TYPE_TABLE]: table.default
}
