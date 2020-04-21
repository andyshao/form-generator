
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
					<div v-for="(item, listIndex) in leftComponents" :key="listIndex">
						<div class="components-title">
							<svg-icon icon-class="component" />
							{{ item.title }}
						</div>
						<draggable
							class="components-draggable"
							:list="item.list"
							:group="{ name: 'componentsGroup', pull: 'clone', put: false }"
							:clone="cloneComponent"
							draggable=".components-item"
							:sort="false"
							@end="onEnd"
						>
							<div
								v-for="(element, index) in item.list"
								:key="index"
								class="components-item"
								@click="addComponent(element)"
							>
								<div class="components-body">
									<svg-icon :icon-class="element.__config__.tagIcon" />
									{{ element.__config__.label }}
								</div>
							</div>
						</draggable>
					</div>
				</div>
			</el-scrollbar>
		</div>

		<div class="center-board">
			<div class="action-bar">
				<el-button icon="el-icon-video-play" type="text" @click="run">运行</el-button>
				<el-button icon="el-icon-view" type="text" @click="showJson">查看json</el-button>
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
		<json-drawer
			size="60%"
			:visible.sync="jsonDrawerVisible"
			:json-str="JSON.stringify(formData)"
			@refresh="refreshJson"
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
import { debounce } from 'throttle-debounce'
import { saveAs } from 'file-saver'
import beautifier from 'beautifier'
import ClipboardJS from 'clipboard'
import render from '@/components/render/render'
import FormDrawer from './FormDrawer'
import JsonDrawer from './JsonDrawer'
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
import * as DESIGN_PROPERTIES from '@/config/design_properties.js';
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
		JsonDrawer,
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
			jsonDrawerVisible: false,
			generateConf: null,
			showFileName: false,
			activeData: drawingDefalut[0],
			saveDrawingListDebounce: debounce(340, saveDrawingList),
			saveIdGlobalDebounce: debounce(340, saveIdGlobal),
			leftComponents: [
				{
					title: '输入型组件',
					list: inputComponents
				},
				{
					title: '选择型组件',
					list: selectComponents
				},
				{
					title: '布局型组件',
					list: layoutComponents
				}
			]
		}
	},
	computed: {
	},
	watch: {
		// eslint-disable-next-line func-names
		'activeData.__config__.label': function (val, oldVal) {
			if (
				this.activeData.placeholder === undefined
				|| !this.activeData.__config__.tag
				|| oldActiveId !== this.activeId
			) {
				return
			}
			this.activeData.placeholder = this.activeData.placeholder.replace(oldVal, '') + val
		},
		activeId: {
			handler(val) {
				oldActiveId = val
			},
			immediate: true //立即执行handler方法
		},
		drawingList: {
			handler(val) {
				//保存到本地缓存中
				this.saveDrawingListDebounce(val)
				if (val.length === 0) this.idGlobal = 100
			},
			deep: true //是否深度监听
		},
		idGlobal: {
			handler(val) {
				this.saveIdGlobalDebounce(val)
			},
			immediate: true
		}
	},
	mounted() {
		//默认加载本地缓存中Layout数据
		if (Array.isArray(drawingListInDB) && drawingListInDB.length > 0) {
			this.drawingList = drawingListInDB
		} else {
			this.drawingList = drawingDefalut
		}
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
			this.activeId = element.__config__.formId
		},
		/**
		 * @Date: 2020-04-17 17:22:26
		 * @Desc: 拖拽结束事件回调
		 */
		onEnd(obj) {
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
			const config = clone.__config__
			//设置克隆Widget ID 自增
			config.formId = ++this.idGlobal
			//设置默认栅格布局span值，继承自Form
			config.span = formConf.span
			//设置widget 唯一标示
			config.renderKey = +new Date() // 改变renderKey后可以实现强制更新组件

			switch(config.layout) {
				case DESIGN_PROPERTIES.LAYOUT_TYPE_COL_FORM_ITEM:
					clone.__vModel__ = `field${this.idGlobal}` //设置节点标识
					clone.placeholder !== undefined && (clone.placeholder += config.label) //设置默认占位提示
					break;
				case DESIGN_PROPERTIES.LAYOUT_TYPE_ROW_FORM_ITEM:
					config.componentName = `row${this.idGlobal}` //设置组件标识
					config.gutter = this.formConf.gutter //继承表单分栏间隔
					break;
				case DESIGN_PROPERTIES.LAYOUT_TYPE_ROW_DEFAULT_ITEM:
					config.componentName = `padding${this.idGlobal}` //设置组件标识
					break;
				default:
					console.log('未找到对应组件')
			}

			tempActiveData = clone
			return tempActiveData
			//如果是块级组件
			// if (config.layout === 'colFormItem') {
			// 	clone.__vModel__ = `field${this.idGlobal}` //设置节点标识
			// 	clone.placeholder !== undefined && (clone.placeholder += config.label) //设置默认占位提示
			// } else if (config.layout === 'rowFormItem') { //如果是行内组件
			// 	config.componentName = `row${this.idGlobal}` //设置组件标识
			// 	config.gutter = this.formConf.gutter //继承表单分栏间隔
			// } else if (config.layout === 'layoutWidget') {
			// 	config.componentName = `padding${this.idGlobal}` //设置组件标识
			// }
			// tempActiveData = clone
			// return tempActiveData
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
			const config = item.__config__
			config.formId = ++this.idGlobal
			config.renderKey = +new Date()
			if (config.layout === 'colFormItem') {
				item.__vModel__ = `field${this.idGlobal}`
			} else if (config.layout === 'rowFormItem') {
				config.componentName = `row${this.idGlobal}`
			}
			if (Array.isArray(config.children)) {
				config.children = config.children.map(childItem => this.createIdAndKey(childItem))
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
			this.assembleFormData()
			const script = vueScript(makeUpJs(this.formData, type))
			const html = vueTemplate(makeUpHtml(this.formData, type))
			const css = cssStyle(makeUpCss(this.formData))
			return beautifier.html(html + script + css, beautifierConf.html)
		},
		showJson() {
			this.assembleFormData()
			this.jsonDrawerVisible = true
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
			const config = newTag.__config__
			newTag.__vModel__ = this.activeData.__vModel__
			config.formId = this.activeId
			config.span = this.activeData.__config__.span
			this.activeData.__config__.tag = config.tag
			this.activeData.__config__.tagIcon = config.tagIcon
			this.activeData.__config__.document = config.document
			if (typeof this.activeData.__config__.defaultValue === typeof config.defaultValue) {
				config.defaultValue = this.activeData.__config__.defaultValue
			}
			Object.keys(newTag).forEach(key => {
				if (this.activeData[key] !== undefined) {
					newTag[key] = this.activeData[key]
				}
			})
			console.log(newTag)
			this.activeData = newTag
			this.updateDrawingList(newTag, this.drawingList)
		},
		/**
		 * @Date: 2020-04-17 17:31:21
		 * @Desc:  更新Layout中指定组件属性
		 */
		updateDrawingList(newTag, list) {
			const index = list.findIndex(item => item.__config__.formId === this.activeId)
			if (index > -1) {
				list.splice(index, 1, newTag)
			} else {
				list.forEach(item => {
					if (Array.isArray(item.__config__.children)) this.updateDrawingList(newTag, item.__config__.children)
				})
			}
		},
		refreshJson(data) {
			this.drawingList = JSON.parse(JSON.stringify(data.fields))
			delete data.fields
			this.formConf = data
			console.log(this.drawingList, this.formConf)
		}
	}
}
</script>

<style lang='scss'>
@import "@/styles/home";
</style>
