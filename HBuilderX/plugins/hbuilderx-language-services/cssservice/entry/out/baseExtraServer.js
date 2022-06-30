"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseExtraServer = void 0;
const baseCompletionProcessor_1 = require("./completion/baseCompletionProcessor");
const formatProcessor_1 = require("./format/formatProcessor");
const gotoDefinition_1 = require("./goto/gotoDefinition");
const symbolProcessor_1 = require("./symbol/symbolProcessor");
// 实现基类, 将需要的函数全部在此处实现, 供其他类继承使用
class BaseExtraServer {
    constructor() {
        // 实现接口:
        this.baseCompletionProcessor = new baseCompletionProcessor_1.BaseCompletionProcessor();
        this.gotoDefinition = new gotoDefinition_1.GotoDefinition();
        // 判断当前语法树是否正确
        this.isErrorAstNode = this.baseCompletionProcessor.isErrorAstNode.bind(this.baseCompletionProcessor);
        // 根据Ast语法树, 获取当前位置需要的补全类型
        this.getCompletionTypeFromAstNode = this.baseCompletionProcessor.getCompletionTypeFromAstNode.bind(this.baseCompletionProcessor);
        // 根据分词, 获取当前位置需要的补全类型
        this.getCompletionTypeFromScanner = this.baseCompletionProcessor.getCompletionTypeFromScanner.bind(this.baseCompletionProcessor);
        // 语法树出错时, 使用分词获取需要提示的代码补全项和需要补全的类型
        this.getCompletionDataFromScanner = this.baseCompletionProcessor.getCompletionDataFromScanner.bind(this.baseCompletionProcessor);
        // 添加HX补全kind转换功能, 用于适配图标
        this.getHxKindConvertedCompletionData = this.baseCompletionProcessor.getHxKindConvertedCompletionData.bind(this.baseCompletionProcessor);
        // 添加缺失的补全功能
        this.getExtraCompletionData = this.baseCompletionProcessor.getExtraCompletionData.bind(this.baseCompletionProcessor);
        // 根据项目类型和语法库, 对现有补全项, 做增加和删减
        this.getGrammarCompletionData = this.baseCompletionProcessor.getGrammarCompletionData.bind(this.baseCompletionProcessor);
        // 根据项目类型, 提供px转换功能
        this.getPxConversionCompletionData = this.baseCompletionProcessor.getPxConversionCompletionData.bind(this.baseCompletionProcessor);
        // 添加从其他文件获取ID补全功能
        this.getIndexIdSelectorsCompletionData = this.baseCompletionProcessor.getIndexIdSelectorsCompletionData.bind(this.baseCompletionProcessor);
        // 添加从其他文件获取CLASS补全功能
        this.getIndexClassSelectorsCompletionData = this.baseCompletionProcessor.getIndexClassSelectorsCompletionData.bind(this.baseCompletionProcessor);
        // 添加基础补全功能: 属性选择器
        this.getPropertySelectorCompletionData = this.baseCompletionProcessor.getPropertySelectorCompletionData.bind(this.baseCompletionProcessor);
        // 对最后的补全项进行去重处理
        this.getDeduplicationData = this.baseCompletionProcessor.getDeduplicationData.bind(this.baseCompletionProcessor);
        // 对值的补全项进行光标的后移
        this.getMoveCursorData = this.baseCompletionProcessor.getMoveCursorData.bind(this.baseCompletionProcessor);
        // 对伪类伪元素选择器进行过滤
        this.getFiltrationPseudoData = this.baseCompletionProcessor.getFiltrationPseudoData.bind(this.baseCompletionProcessor);
        // 添加转到定义功能
        this.getDefinitionData = this.gotoDefinition.getDefinitionDataFromID.bind(this.gotoDefinition);
        // 获取altMode模式
        this.getAltMode = this.baseCompletionProcessor.getAltMode.bind(this.baseCompletionProcessor);
        // 添加css语言服务, 代码格式化功能
        this.getFormattingData = formatProcessor_1.getFormattingData;
        // 大纲图标转换
        this.getHxKindConvertedSymbolsData = symbolProcessor_1.getHxKindConvertedSymbolsData;
    }
    // 供外部调用的接口
    getLanguageServiceExt() {
        return undefined;
    }
}
exports.BaseExtraServer = BaseExtraServer;
//# sourceMappingURL=baseExtraServer.js.map