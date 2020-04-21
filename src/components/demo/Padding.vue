<template>
	<div class="padding_container" :style="styleObj">
		<slot></slot>
	</div>
</template>
<script>
export default {
	props: {
		top: {
			type: Number,
			default() {
				return 0
			}
		},
		right: {
			type: Number,
			default() {
				return 0
			}
		},
		bottom: {
			type: Number,
			default() {
				return 0
			}
		},
		left: {
			type: Number,
			default() {
				return 0
			}
		}
	},
	computed: {
		styleObj() {
			return {
				'padding-top': this.top + 'px',
				'padding-right': this.right + 'px',
				'padding-bottom': this.bottom + 'px',
				'padding-left': this.left + 'px'
			}
		}
	}
}
</script>>
<style>
.padding_container {
	width: 100%;
	height: 100%;
}
</style>
