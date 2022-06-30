"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaJsonSchema = void 0;
let baseUrl = 'https://uniapp.dcloud.net.cn/';
function buildUrl(url) {
    return baseUrl + url;
}
// *.schema.json  schema
let SchemaJsonSchema = {
    "title": "schema.json schema",
    "description": "A Schema from File ends with .schema.json",
    "type": "object",
    "definitions": {
        "errorMessage": {
            "type": "object",
            "properties": {
                "required": {
                    "description": "必填值校验失败提示。",
                    "type": "string"
                },
                "enum": {
                    "description": "枚举校验失败提示。",
                    "type": "string"
                },
                "minimum": {
                    "description": "最小值校验失败提示。",
                    "type": "string"
                },
                "maximum": {
                    "description": "最大值校验失败提示。",
                    "type": "string"
                },
                "minLength": {
                    "description": "字符串的最小长度校验失败提示。",
                    "type": "string"
                },
                "maxLength": {
                    "description": "字符串的最大长度校验失败提示。",
                    "type": "string"
                },
                "pattern": {
                    "description": "字符串的最大长度校验失败提示。",
                    "type": "string"
                }
            }
        },
        "defaultValue": {
            "type": "string",
            "enum": ["now", "clientIP", "uid"]
        },
        "componentForEditObject": {
            "type": "object",
            "properties": {
                "name": {
                    "description": "组件名称",
                    "type": "string",
                    "enum": ["input", "switch", "slider", "picker", "radio-group", "checkbox-group", "uni-easyinput", "uni-data-checkbox", "uni-data-picker", "uni-file-picker", "uni-datetime-picker", "text-area"]
                },
                "props": {
                    "description": "组件属性",
                    "type": "object"
                }
            }
        },
        "componentForShowObject": {
            "type": "object",
            "properties": {
                "name": {
                    "description": "组件名称",
                    "type": "string",
                    "enum": ["text", "rich-text", "progress", "image", "uni-data-picker", "uni-file-picker"]
                },
                "props": {
                    "description": "组件属性",
                    "type": "object"
                }
            }
        },
        "schemaProperties": {
            "type": "object",
            "properties": {
                "properties": {
                    "patternProperties": {
                        "^[a-zA-Z_]+\\w?": { "$ref": "#/definitions/schemaProperties" }
                    }
                },
                "required": {
                    "description": "是否必填。支持填写必填的下级字段名称。required可以在表级的描述出现，约定该表有哪些字段必填。也可以在某个字段中出现，如果该字段是一个json，可以对这个json中的哪些字段必填进行描述。",
                    "type": "array",
                    "items": {
                        "type": "string",
                        "enum": ["SchemaField"]
                    }
                },
                "bsonType": {
                    "description": "字段类型，如json object、字符串、数字、bool值。",
                    "type": "string",
                    "enum": ["int", "bool", "string", "double", "array", "object", "date", "timestamp", "password", "file"]
                },
                "title": {
                    "description": "标题，开发者维护时自用。如果不填label属性，将在生成前端表单代码时，默认用于表单项前面的label。",
                    "type": "string"
                },
                "description": {
                    "description": "描述，开发者维护时自用。在生成前端表单代码时，如果字段未设置component，且字段被渲染为input，那么input的placehold将默认为本描述。",
                    "type": "string"
                },
                "permission": {
                    "description": "数据库权限，控制什么角色可以对什么数据进行读/写，可控制表和字段，可设置where条件。",
                    "type": "object",
                    "properties": {
                        "read": {
                            "description": "每个用户只能读取用户自己的数据。前提是要操作的数据doc，里面有一个字段存放了uid，即uni-id的用户id。（不配置时等同于false）",
                            "anyOf": [
                                { "type": "string" },
                                { "type": "boolean" }
                            ]
                        },
                        "create": {
                            "description": "是否允许新增数据记录。（不配置时等同于false）",
                            "anyOf": [
                                { "type": "string" },
                                { "type": "boolean" }
                            ]
                        },
                        "update": {
                            "description": "是否允许更新数据。（不配置时等同于false）",
                            "anyOf": [
                                { "type": "string" },
                                { "type": "boolean" }
                            ]
                        },
                        "delete": {
                            "description": "是否允许删除数据。（不配置时等同于false）",
                            "anyOf": [
                                { "type": "string" },
                                { "type": "boolean" }
                            ]
                        },
                        "count": {
                            "description": "是否允许求数。（不配置时等同于true）",
                            "anyOf": [
                                { "type": "string" },
                                { "type": "boolean" }
                            ]
                        }
                    }
                },
                "enum": {
                    "description": "字段值枚举范围，数组中至少要有一个元素，且数组内的每一个元素都是唯一的。",
                    "anyOf": [
                        { "type": "array" },
                        {
                            "type": "object",
                            "properties": {
                                "collection": {
                                    "description": "表名",
                                    "type": "string",
                                    "enum": ["DBCollectionString"]
                                },
                                "field": {
                                    "description": "查询字段，多个字段用 `,` 分割",
                                    "type": "string",
                                    "enum": ["DBFieldString"]
                                },
                                "where": {
                                    "description": "查询条件",
                                    "type": "string",
                                    "enum": ["JQLString"]
                                },
                                "orderby": {
                                    "description": "排序字段及正序倒叙设置",
                                    "type": "string",
                                    "enum": ["DBFieldString"]
                                },
                                "action": {
                                    "description": "云端执行数据库查询的前或后，触发某个action函数操作，进行预处理或后处理",
                                    "type": "string",
                                    "enum": ["ClientDBActionString"]
                                }
                            }
                        }
                    ]
                },
                "enumType": {
                    "description": "指定enum的类型。",
                    "type": "string",
                    "enum": ["tree"]
                },
                "maximum": {
                    "description": "如果bsonType为数字时，可接受的最大值。",
                    "type": "number"
                },
                "exclusiveMaximum": {
                    "description": "是否排除 maximum。",
                    "type": "boolean"
                },
                "minimum": {
                    "description": "如果bsonType为数字时，可接受的最小值。",
                    "type": "number"
                },
                "exclusiveMinimum": {
                    "description": "是否排除 minimum。",
                    "type": "boolean"
                },
                "minLength": {
                    "description": "字符串的最小长度。",
                    "type": "number"
                },
                "maxLength": {
                    "description": "字符串的最大长度。",
                    "type": "number"
                },
                "format": {
                    "description": "数据格式，不符合格式的数据无法入库。目前只支持'url'和'email'，未来会扩展其他格式。",
                    "type": "string",
                    "enum": ["url", "email"]
                },
                "pattern": {
                    "description": "正则表达式，如设置为手机号的正则表达式后，不符合该正则表达式则校验失败，无法入库。",
                    "type": "string"
                },
                "trim": {
                    "description": `去除空白字符，支持 none|both|start|end，默认none，仅bsonType="string"时有效。`,
                    "type": "string",
                    "enum": ["none", "both", "start", "end"]
                },
                "validateFunction": {
                    "description": "扩展校验函数名。",
                    "type": "string",
                    "enum": ["HBuilderX.ValidateFunctionString"]
                },
                "errorMessage": {
                    "description": "当数据写入或更新时，校验数据合法性失败后，返回的错误提示。",
                    "anyOf": [
                        { "type": "string" },
                        {
                            "$ref": '#/definitions/errortMessage'
                        }
                    ]
                },
                "defaultValue": {
                    "description": "默认值。",
                    "anyOf": [
                        { "type": "string" },
                        { "$ref": "#/definitions/defaultValue" }
                    ]
                },
                "forceDefaultValue": {
                    "description": "强制默认值，不可通过clientDB的代码修改，常用于存放用户id、时间、客户端ip等固定值。具体参考下表的defaultValue。",
                    "anyOf": [
                        { "type": "string" },
                        { "$ref": "#/definitions/defaultValue" }
                    ]
                },
                "foreignKey": {
                    "description": "关联字段。表示该字段的原始定义指向另一个表的某个字段，值的格式为表名.字段名，比如订单表的下单用户uid字段指向uni-id-users表的_id字段，那么值为uni-id-users._id。关联字段定义后可用于联表查询，通过关联字段合成虚拟表，极大的简化了联表查询的复杂度。",
                    "type": "string"
                },
                "parentKey": {
                    "description": "当前节点对应的父级节点字段名字。",
                    "type": "string",
                    "enum": ["HBuilderX.ParentField"]
                },
                "label": {
                    "description": "字段标题。生成前端表单代码时，渲染表单项前面的label标题。",
                    "type": "string"
                },
                "group": {
                    "description": "分组id。生成前端表单代码时，多个字段对应的表单项可以合并显示在一个uni-group组件中。",
                    "type": "string"
                },
                "order": {
                    "description": "表单项排序序号。生成前端表单代码时，默认是以schema中的字段顺序从上到下排布表单项的，但如果指定了order，则按order规定的顺序进行排序。如果表单项被包含在uni-group中，则同组内按order排序。",
                    "type": "number"
                },
                "componentForEdit": {
                    "description": "生成前端编辑页面文件时(分别是 add.vue、edit.vue)，使用什么组件渲染这个表单项。比如使用input输入框。",
                    "anyOf": [
                        { "type": "array" },
                        { "$ref": "#/definitions/componentForEditObject" }
                    ]
                },
                "componentForShow": {
                    "description": "生成前端展示页面时(分别是 list.vue、detail.vue)，使用什么组件渲染。比如使用uni-dateformat格式化日期。",
                    "anyOf": [
                        { "type": "array" },
                        { "$ref": "#/definitions/componentForShowObject" }
                    ]
                },
                "arrayType": {
                    "description": `数组项类型，bsonType="array" 时有效。`,
                    "type": "string",
                    "enum": ["int", "bool", "string", "double", "object", "date", "timestamp", "file"]
                },
                "fileMediaType": {
                    "description": `文件类型，默认值为all，该属性依赖如下配置，单个文件(bsonType="file") | 多个文件：bsonType="array" 且 arrayType="file"。`,
                    "type": "string",
                    "enum": ["all", "image", "video"]
                },
                "fileExtName": {
                    "description": `文件扩展名过滤，多个用 "," 分割，例如: jpg,png，HBuilderX 3.1.0+ 支持`,
                    "type": "string"
                }
            },
        }
    },
    "properties": {
        "required": {
            "description": "是否必填。支持填写必填的下级字段名称。required可以在表级的描述出现，约定该表有哪些字段必填。也可以在某个字段中出现，如果该字段是一个json，可以对这个json中的哪些字段必填进行描述。",
            "type": "array",
            "items": {
                "type": "string",
                "enum": ["SchemaField"]
            }
        },
        "bsonType": {
            "description": "字段类型，如json object、字符串、数字、bool值。",
            "type": "string",
            "enum": ["object"]
        },
        "permission": {
            "description": "数据库权限，控制什么角色可以对什么数据进行读/写，可控制表和字段，可设置where条件。",
            "type": "object",
            "properties": {
                "read": {
                    "description": "每个用户只能读取用户自己的数据。前提是要操作的数据doc，里面有一个字段存放了uid，即uni-id的用户id。（不配置时等同于false）",
                    "anyOf": [
                        { "type": "string" },
                        { "type": "boolean" }
                    ]
                },
                "create": {
                    "description": "是否允许新增数据记录。（不配置时等同于false）",
                    "anyOf": [
                        { "type": "string" },
                        { "type": "boolean" }
                    ]
                },
                "update": {
                    "description": "是否允许更新数据。（不配置时等同于false）",
                    "anyOf": [
                        { "type": "string" },
                        { "type": "boolean" }
                    ]
                },
                "delete": {
                    "description": "是否允许删除数据。（不配置时等同于false）",
                    "anyOf": [
                        { "type": "string" },
                        { "type": "boolean" }
                    ]
                },
                "count": {
                    "description": "是否允许求数。（不配置时等同于true）",
                    "anyOf": [
                        { "type": "string" },
                        { "type": "boolean" }
                    ]
                }
            }
        },
        "properties": {
            "description": "字段类型，如json object、字符串、数字、bool值。",
            "patternProperties": {
                "^[a-zA-Z_]+\\w?": { "$ref": "#/definitions/schemaProperties" }
            }
        },
        "description": {
            "description": "数据库表描述，开发者维护时自用。",
            "type": "string"
        },
        "fieldRules": {
            "description": "字段间校验",
            "type": "string"
        }
    }
};
exports.SchemaJsonSchema = SchemaJsonSchema;
//# sourceMappingURL=schemaSchema.js.map