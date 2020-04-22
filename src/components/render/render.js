export function makeMap(str, expectsLowerCase) {
	const map = Object.create(null);
	const list = str.split(",");
	for (let i = 0; i < list.length; i++) {
		map[list[i]] = true;
	}
	return expectsLowerCase ? val => map[val.toLowerCase()] : val => map[val];
}

// 参考https://github.com/vuejs/vue/blob/v2.6.10/src/platforms/web/server/util.js
const isAttr = makeMap(
	"accept,accept-charset,accesskey,action,align,alt,async,autocomplete," +
		"autofocus,autoplay,autosave,bgcolor,border,buffered,challenge,charset," +
		"checked,cite,class,code,codebase,color,cols,colspan,content,http-equiv," +
		"name,contenteditable,contextmenu,controls,coords,data,datetime,default," +
		"defer,dir,dirname,disabled,download,draggable,dropzone,enctype,method,for," +
		"form,formaction,headers,height,hidden,high,href,hreflang,http-equiv," +
		"icon,id,ismap,itemprop,keytype,kind,label,lang,language,list,loop,low," +
		"manifest,max,maxlength,media,method,GET,POST,min,multiple,email,file," +
		"muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster," +
		"preload,radiogroup,readonly,rel,required,reversed,rows,rowspan,sandbox," +
		"scope,scoped,seamless,selected,shape,size,type,text,password,sizes,span," +
		"spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex," +
		"target,title,type,usemap,value,width,wrap"
);

/**
 * @Desc:  监听变化
 * @param dataObject [组件对象]
 * @params defaultValue [默认值]
 */
function vModel(self, dataObject, defaultValue) {
	dataObject.props.value = defaultValue;

	dataObject.on.input = val => {
		self.$emit("input", val);
	};
}

const componentChild = {
	"el-input": {
		prepend(h, conf, key) {
			return <template slot="prepend">{conf.__slot__[key]}</template>;
		},
		append(h, conf, key) {
			return <template slot="append">{conf.__slot__[key]}</template>;
		}
	},
	"el-select": {
		options(h, conf, key) {
			const list = [];
			conf.__slot__.options.forEach(item => {
				list.push(
					<el-option
						label={item.label}
						value={item.value}
						disabled={item.disabled}
					></el-option>
				);
			});
			return list;
		}
	},
	"el-radio-group": {
		options(h, conf, key) {
			const list = [];
			conf.__slot__.options.forEach(item => {
				if (conf.__config__.optionType === "button") {
					list.push(
						<el-radio-button label={item.value}>
							{item.label}
						</el-radio-button>
					);
				} else {
					list.push(
						<el-radio label={item.value} border={conf.border}>
							{item.label}
						</el-radio>
					);
				}
			});
			return list;
		}
	},
	"el-checkbox-group": {
		options(h, conf, key) {
			const list = [];
			conf.__slot__.options.forEach(item => {
				if (conf.__config__.optionType === "button") {
					list.push(
						<el-checkbox-button label={item.value}>
							{item.label}
						</el-checkbox-button>
					);
				} else {
					list.push(
						<el-checkbox label={item.value} border={conf.border}>
							{item.label}
						</el-checkbox>
					);
				}
			});
			return list;
		}
	},
	"el-upload": {
		"list-type": (h, conf, key) => {
			const list = [];
			const config = conf.__config__;
			if (conf["list-type"] === "picture-card") {
				list.push(<i class="el-icon-plus"></i>);
			} else {
				list.push(
					<el-button
						size="small"
						type="primary"
						icon="el-icon-upload"
					>
						{config.buttonText}
					</el-button>
				);
			}
			if (config.showTip) {
				list.push(
					<div slot="tip" class="el-upload__tip">
						只能上传不超过 {config.fileSize}
						{config.sizeUnit} 的{conf.accept}文件
					</div>
				);
			}
			return list;
		}
	},
	"el-table": {
		options(h, conf, key) {
			const list = [];
			conf.__slot__.tableColumn.forEach(item => {
				list.push(
					<el-table-column label={item.prop} border={item.label} width={item.width}>
					</el-table-column>
				);
			});
			return list;
		}
	},
};

export default {
	render(h) {
		const dataObject = {
			attrs: {},
			props: {},
			on: {},
			style: {}
		};
		const confClone = JSON.parse(JSON.stringify(this.conf)); //widget object
		const children = [];

		//处理slot
		const childObjs = componentChild[confClone.__config__.tag]; //filter widget
		if (childObjs) {
			Object.keys(childObjs).forEach(key => {
				const childFunc = childObjs[key];
				if (confClone.__slot__ && confClone.__slot__[key]) {
					children.push(childFunc(h, confClone, key));
				}
			});
		}
		console.log('confClone', confClone)

		Object.keys(confClone).forEach(key => {
			const val = confClone[key];
			if (key === "__vModel__") { //当为字段属性时
				vModel(this, dataObject, confClone.__config__.defaultValue);
			} else if (dataObject[key]) { //当为组件 style属性时
				dataObject[key] = { ...dataObject[key], ...val }; // 返回仅为对象
			} else if (!isAttr(key)) { //当为是组件 props属性
				dataObject.props[key] = val;
			} else { //当为DOM ATTR 时
				dataObject.attrs[key] = val;
			}
		});
		delete dataObject.props.__config__;
		delete dataObject.props.__slot__;
		return h(this.conf.__config__.tag, dataObject, children);
	},
	props: ["conf"]
};
