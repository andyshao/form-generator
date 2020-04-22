<script>
import draggable from 'vuedraggable'
import render from '@/components/render/render'

import layouts from '@/components/draggable-widget/layouts.js';

function layoutIsNotFound() {
	throw new Error(`没有与${this.element.__config__.layout}匹配的layout`)
}


export default {
	components: {
		render,
		draggable
	},
	props: [
		'element',
		'index',
		'drawingList',
		'activeId'
	],
	render(h) {
		const layout = layouts[this.element.__config__.layout]

		if (layout) {
			return layout.call(this, h, this.element, this.index, this.drawingList)
		}
		return layoutIsNotFound.call(this)
	}
}
</script>
