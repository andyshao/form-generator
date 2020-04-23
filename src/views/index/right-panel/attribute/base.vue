<template>
	<el-form>
		<el-form-item v-if="activeData.__vModel__!==undefined" label="字段名">
            <el-input v-model="activeData.__vModel__" placeholder="请输入字段名（v-model）" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.componentName!==undefined" label="组件名">
            {{ activeData.__config__.componentName }}
          </el-form-item>
          <el-form-item v-if="activeData.__config__.label!==undefined" label="标题">
            <el-input v-model="activeData.__config__.label" placeholder="请输入标题" />
          </el-form-item>
          <el-form-item v-if="activeData.placeholder!==undefined" label="占位提示">
            <el-input v-model="activeData.placeholder" placeholder="请输入占位提示" />
          </el-form-item>
          <el-form-item v-if="activeData['start-placeholder']!==undefined" label="开始占位">
            <el-input v-model="activeData['start-placeholder']" placeholder="请输入占位提示" />
          </el-form-item>
          <el-form-item v-if="activeData['end-placeholder']!==undefined" label="结束占位">
            <el-input v-model="activeData['end-placeholder']" placeholder="请输入占位提示" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.span!==undefined" label="栅格">
            <el-slider v-model="activeData.__config__.span" :max="24" :min="1" :marks="{12:''}"/>
          </el-form-item>
	</el-form>
</template>
<script>
export default {
	props: {
		activeData: Object
	},
	watch: {
		activeData: {
			handler(val) {
				console.log('val:', val)
			},
			immediate: true //立即执行handler方法
		}
	},
	mounted() {
	}
}
</script>
