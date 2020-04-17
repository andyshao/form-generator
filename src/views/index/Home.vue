<template>
	<div class="container">
		<div class="left-board">
			<div class="logo-wrapper">
				<div class="logo">
					<img :src="logo" alt="logo" /> Form Generator
					<a
						class="github"
						href="https://github.com/JakHuang/form-generator"
						target="_blank"
					>
						<img src="https://github.githubassets.com/pinned-octocat.svg" alt />
					</a>
				</div>
			</div>
			<el-scrollbar class="left-scrollbar">
				<div class="components-list">
					<div class="components-title">
						<svg-icon icon-class="component" />输入型组件
					</div>
					<draggable
						class="components-draggable"
						:list="inputComponents"
						:group="{ name: 'componentsGroup', pull: 'clone', put: false }"
						:clone="cloneComponent"
						draggable=".components-item"
						:sort="false"
						@end="onEnd"
					>
						<div
							v-for="(element, index) in inputComponents"
							:key="index"
							class="components-item"
							@click="addComponent(element)"
						>
							<div class="components-body">
								<svg-icon :icon-class="element.tagIcon" />
								{{ element.label }}
							</div>
						</div>
					</draggable>
					<div class="components-title">
						<svg-icon icon-class="component" />选择型组件
					</div>
					<draggable
						class="components-draggable"
						:list="selectComponents"
						:group="{ name: 'componentsGroup', pull: 'clone', put: false }"
						:clone="cloneComponent"
						draggable=".components-item"
						:sort="false"
						@end="onEnd"
					>
						<div
							v-for="(element, index) in selectComponents"
							:key="index"
							class="components-item"
							@click="addComponent(element)"
						>
							<div class="components-body">
								<svg-icon :icon-class="element.tagIcon" />
								{{ element.label }}
							</div>
						</div>
					</draggable>
					<div class="components-title">
						<svg-icon icon-class="component" />布局型组件
					</div>
					<draggable
						class="components-draggable"
						:list="layoutComponents"
						:group="{ name: 'componentsGroup', pull: 'clone', put: false }"
						:clone="cloneComponent"
						draggable=".components-item"
						:sort="false"
						@end="onEnd"
					>
						<div
							v-for="(element, index) in layoutComponents"
							:key="index"
							class="components-item"
							@click="addComponent(element)"
						>
							<div class="components-body">
								<svg-icon :icon-class="element.tagIcon" />
								{{ element.label }}
							</div>
						</div>
					</draggable>
				</div>
			</el-scrollbar>
		</div>

		<div class="center-board">
			<div class="action-bar">
				<el-button icon="el-icon-video-play" type="text" @click="run">运行</el-button>
				<el-button icon="el-icon-download" type="text" @click="download">导出vue文件</el-button>
				<el-button class="copy-btn-main" icon="el-icon-document-copy" type="text" @click="copy">复制代码</el-button>
				<el-button class="delete-btn" icon="el-icon-delete" type="text" @click="empty">清空</el-button>
			</div>
			<el-scrollbar class="center-scrollbar">
				<el-row class="center-board-row" :gutter="formConf.gutter">
					<el-form
						:size="formConf.size"
						:label-position="formConf.labelPosition"
						:disabled="formConf.disabled"
						:label-width="formConf.labelWidth + 'px'"
					>
						<draggable class="drawing-board" :list="drawingList" :animation="340" group="componentsGroup">
							<draggable-item
								v-for="(element, index) in drawingList"
								:key="element.renderKey"
								:drawing-list="drawingList"
								:element="element"
								:index="index"
								:active-id="activeId"
								:form-conf="formConf"
								@activeItem="activeFormItem"
								@copyItem="drawingItemCopy"
								@deleteItem="drawingItemDelete"
							/>
						</draggable>
						<div v-show="!drawingList.length" class="empty-info">从左侧拖入或点选组件进行表单设计</div>
					</el-form>
				</el-row>
			</el-scrollbar>
		</div>

		<right-panel
			:active-data="activeData"
			:form-conf="formConf"
			:show-field="!!drawingList.length"
			@tag-change="tagChange"
		/>

		<form-drawer
			:visible.sync="drawerVisible"
			:form-data="formData"
			size="100%"
			:generate-conf="generateConf"
		/>
		<code-type-dialog
			:visible.sync="dialogVisible"
			title="选择生成类型"
			:show-file-name="showFileName"
			@confirm="generate"
		/>
		<input id="copyNode" type="hidden" />
	</div>
</template>

<script>
import draggable from 'vuedraggable'
import { saveAs } from 'file-saver'
import beautifier from 'beautifier'
import ClipboardJS from 'clipboard'
import render from '@/components/render'
import FormDrawer from './FormDrawer'
import RightPanel from './RightPanel'
import {
	inputComponents, selectComponents, layoutComponents, formConf
} from '@/components/generator/config'
import {
	exportDefault, beautifierConf, isNumberStr, titleCase
} from '@/utils/index'
import {
	makeUpHtml, vueTemplate, vueScript, cssStyle
} from '@/components/generator/html'
import { makeUpJs } from '@/components/generator/js'
import { makeUpCss } from '@/components/generator/css'
import drawingDefalut from '@/components/generator/drawingDefalut'
import logo from '@/assets/logo.png'
import CodeTypeDialog from './CodeTypeDialog'
import DraggableItem from './DraggableItem'
import {
	getDrawingList, saveDrawingList, getIdGlobal, saveIdGlobal, getFormConf
} from '@/utils/db'

const emptyActiveData = { style: {}, autosize: {} }
let oldActiveId
let tempActiveData //当前操作Widget
const drawingListInDB = getDrawingList()
const formConfInDB = getFormConf()
const idGlobal = getIdGlobal()  //全局Widget ID

export default {
	components: {
		draggable,
		render,
		FormDrawer,
		RightPanel,
		CodeTypeDialog,
		DraggableItem
	},
	data() {
		return {
			logo,
			idGlobal,
			formConf,
			inputComponents,
			selectComponents,
			layoutComponents,
			labelWidth: 100,
			drawingList: drawingDefalut,
			drawingData: {},
			activeId: drawingDefalut[0].formId,
			drawerVisible: false,
			formData: {},
			dialogVisible: false,
			generateConf: null,
			showFileName: false,
			activeData: drawingDefalut[0]
		}
	},
	computed: {
	},
	watch: {
		// eslint-disable-next-line func-names
		'activeData.label': function (val, oldVal) {
			if (
				this.activeData.placeholder === undefined
				|| !this.activeData.tag
				|| oldActiveId !== this.activeId
			) {
				return
			}
			this.activeData.placeholder = this.activeData.placeholder.replace(oldVal, '') + val
		},
		activeId: {
			handler(val) {
				this.$debug('activeId', val)
				oldActiveId = val
			},
			immediate: true //立即执行handler方法
		},
		drawingList: {
			handler(val) {
				//保存到本地缓存中
				saveDrawingList(val)
				if (val.length === 0) this.idGlobal = 100
			},
			deep: true //是否深度监听
		},
		idGlobal: {
			handler(val) {
				saveIdGlobal(val)
			},
			immediate: true
		}
	},
	mounted() {
		//默认加载本地缓存中Layout数据
		if (Array.isArray(drawingListInDB) && drawingListInDB.length > 0) {
			this.drawingList = drawingListInDB
		} else {
			this.drawingList = drawingDefalut //加载默认
		}
		//默认选中第一个Widget
		this.activeFormItem(this.drawingList[0])

		//默认加载本地缓存中的Form属性
		if (formConfInDB) {
			this.formConf = formConfInDB
		}

		//设置Copy监听
		const clipboard = new ClipboardJS('#copyNode', {
			text: trigger => {
				const codeStr = this.generateCode() //生成Form布局代码
				this.$debug('生成布局代码', codeStr);
				this.$notify({
					title: '成功',
					message: '代码已复制到剪切板，可粘贴。',
					type: 'success'
				})
				return codeStr
			}
		})
		clipboard.on('error', e => {
			this.$message.error('代码复制失败')
		})
	},
	methods: {
		/**
		 * @Date: 2020-04-17 17:22:07
		 * @Desc: 选中组件
		 */
		activeFormItem(element) {
			this.activeData = element
			this.activeId = element.formId
		},
		/**
		 * @Date: 2020-04-17 17:22:26
		 * @Desc: 拖拽结束事件回调
		 */
		onEnd(obj, a) {
			//判断是否拖拽到Board，而不是在Components中
			if (obj.from !== obj.to) {
				this.activeData = tempActiveData //设置当前拖拽组件对象
				this.activeId = this.idGlobal //从本地缓存中设置当前Widget ID => 触发watch监听事件
			}
		},
		/**
		 * @Date: 2020-04-17 17:22:43
		 * @Desc: 点击组件添加到Layout中
		 */
		addComponent(item) {
			const clone = this.cloneComponent(item)
			this.drawingList.push(clone) //保存到本地缓存
			this.activeFormItem(clone) //选中当前组件
		},
		/**
		 * @Date: 2020-04-17 17:33:16
		 * @Desc: 克隆组件
		 * @return [Object] 组件对象
		 */
		cloneComponent(origin) {
			const clone = JSON.parse(JSON.stringify(origin))
			//设置克隆Widget ID 自增
			clone.formId = ++this.idGlobal

			//设置默认栅格布局span值，继承自Form
			clone.span = formConf.span

			//设置widget 唯一标示
			clone.renderKey = +new Date() // 改变renderKey后可以实现强制更新组件

			//判断是否是布局型组件
			if (!clone.layout) clone.layout = 'colFormItem' //设置为块级组件
			this.$debug('cloneComponent clone', clone);

			//如果是块级组件
			if (clone.layout === 'colFormItem') {
				clone.vModel = `field${this.idGlobal}` //设置节点标识
				clone.placeholder !== undefined && (clone.placeholder += clone.label) //设置默认占位提示
				tempActiveData = clone
			} else if (clone.layout === 'rowFormItem') { //如果是行内组件
				delete clone.label //移除标题，因为row组件不需要展示
				clone.componentName = `row${this.idGlobal}` //设置组件标识
				clone.gutter = this.formConf.gutter //继承表单分栏间隔
				tempActiveData = clone
			}
			return tempActiveData
		},
		/**
		 * @Date: 2020-04-17 17:37:33
		 * @Desc: 处理表单Layout数据
		 * @return JSON
		 */
		assembleFormData() {
			this.formData = {
				fields: JSON.parse(JSON.stringify(this.drawingList)),
				...this.formConf
			}
			this.$debug('assembleFormData', JSON.stringify(this.formData));
		},
		/**
		 * @Date: 2020-04-17 17:34:09
		 * @Desc: 选择生成类型
		 */
		generate(data) {
			const func = this[`exec${titleCase(this.operationType)}`]
			this.generateConf = data
			func && func(data)
		},
		/**
		 * @Date: 2020-04-17 17:35:24
		 * @Desc: 运行
		 */
		execRun(data) {
			this.assembleFormData()
			this.drawerVisible = true
		},
		/**
		 * @Date: 2020-04-17 17:35:31
		 * @Desc: 下载
		 */
		execDownload(data) {
			const codeStr = this.generateCode()
			const blob = new Blob([codeStr], { type: 'text/plain;charset=utf-8' })
			saveAs(blob, data.fileName)
		},
		/**
		 * @Date: 2020-04-17 17:35:36
		 * @Desc: 复制
		 */
		execCopy(data) {
			document.getElementById('copyNode').click()
		},
		/**
		 * @Date: 2020-04-17 17:25:08
		 * @Desc: 清空Layout配置
		 */
		empty() {
			this.$confirm('确定要清空所有组件吗？', '提示', { type: 'warning' }).then(
				() => {
					this.drawingList = []
					this.idGlobal = 100
				}
			)
		},
		/**
		 * @Date: 2020-04-17 17:25:38
		 * @Desc: 复制单个组件,并添加到Layout中
		 */
		drawingItemCopy(item, parent) {
			let clone = JSON.parse(JSON.stringify(item))
			clone = this.createIdAndKey(clone)
			parent.push(clone)
			this.activeFormItem(clone)
		},
		/**
		 * @Date: 2020-04-17 17:26:15
		 * @Desc: 复制单个组件时调用，目的更新复制对象的属性，生成新组件
		 * @return [Object] 新组件对象
		 */
		createIdAndKey(item) {
			item.formId = ++this.idGlobal
			item.renderKey = +new Date()
			if (item.layout === 'colFormItem') {
				item.vModel = `field${this.idGlobal}`
			} else if (item.layout === 'rowFormItem') {
				item.componentName = `row${this.idGlobal}`
			}
			//遍历子组件，深度更新
			if (Array.isArray(item.children)) {
				item.children = item.children.map(childItem => this.createIdAndKey(childItem))
			}
			return item
		},
		/**
		 * @Date: 2020-04-17 17:28:11
		 * @Desc: 删除单个组件
		 */
		drawingItemDelete(index, parent) {
			parent.splice(index, 1)
			this.$nextTick(() => {
				const len = this.drawingList.length
				if (len) {
					this.activeFormItem(this.drawingList[len - 1])
				}
			})
		},
		/**
		 * @Date: 2020-04-17 17:51:29
		 * @Desc: 根据JSON 生成表单布局代码
		 * @return [String] vue code
		 */
		generateCode() {
			const { type } = this.generateConf //是页面 or Dialog
			this.assembleFormData() //获取布局JSON
			const script = vueScript(makeUpJs(this.formData, type))
			const html = vueTemplate(makeUpHtml(this.formData, type))
			const css = cssStyle(makeUpCss(this.formData))
			return beautifier.html(html + script + css, beautifierConf.html)
		},
		/**
		 * @Date: 2020-04-17 17:28:32
		 * @Desc: 导出Vue文件
		 */
		download() {
			this.dialogVisible = true
			this.showFileName = true
			this.operationType = 'download'
		},
		/**
		 * @Date: 2020-04-17 17:28:42
		 * @Desc: 运行
		 */
		run() {
			this.dialogVisible = true
			this.showFileName = false
			this.operationType = 'run'
		},
		/**
		 * @Date: 2020-04-17 17:28:51
		 * @Desc: 复制代码
		 */
		copy() {
			this.dialogVisible = true
			this.showFileName = false
			this.operationType = 'copy'
		},
		/**
		 * @Date: 2020-04-17 17:29:37
		 * @Desc: 组件参数更新回调
		 */
		tagChange(newTag) {
			newTag = this.cloneComponent(newTag)
			newTag.vModel = this.activeData.vModel
			newTag.formId = this.activeId
			newTag.span = this.activeData.span
			delete this.activeData.tag
			delete this.activeData.tagIcon
			delete this.activeData.document
			//更新对应属性
			Object.keys(newTag).forEach(key => {
				if (this.activeData[key] !== undefined
					&& typeof this.activeData[key] === typeof newTag[key]) {
					newTag[key] = this.activeData[key]
				}
			})
			this.activeData = newTag
			this.updateDrawingList(newTag, this.drawingList)
		},
		/**
		 * @Date: 2020-04-17 17:31:21
		 * @Desc:  更新Layout中指定组件属性
		 */
		updateDrawingList(newTag, list) {
			const index = list.findIndex(item => item.formId === this.activeId)
			if (index > -1) {
				list.splice(index, 1, newTag)
			} else {
				list.forEach(item => {
					if (Array.isArray(item.children)) this.updateDrawingList(newTag, item.children)
				})
			}
		}
	}
}
</script>

<style lang='scss'>
@import "@/styles/home";
</style>
