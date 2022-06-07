<template>
    <h4>剑指 Offer II 001. 整数除法</h4>
    <p>给定两个整数 a 和 b ，求它们的除法的商 a/b ，要求不得使用乘号 '*'、除号 '/' 以及求余符号 '%' 。</p>
    <p>注意：<br/>
    整数除法的结果应当截去（truncate）其小数部分，例如：truncate(8.345) = 8 以及 truncate(-2.7335) = -2
    假设我们的环境只能存储 32 位有符号整数，其数值范围是 [−231, 231−1]。本题中，如果除法结果溢出，则返回 231 − 1
    </p>
示例 1：
<code>
    输入：a = 15, b = 2
    输出：7
    解释：15/2 = truncate(7.5) = 7
    示例 2：
</code>
<code>
    解题：
    /**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
var divide = function(a, b) {
    let count = 0;
    // 记录商的正负数
    const flag = Math.abs(a) + Math.abs(b) === Math.abs(a + b);
    // 使用绝对值做计算
    a = Math.abs(a);
    b = Math.abs(b);
    if(b === 1){
        count = a;
    }else{
        while(a >= b){
            count++;
            a = a-b;
        }
    }
    
    if(count > 2147483647 && flag){
        count = 2147483647;
    }else if(count > 2147483648 && !flag){
        count = 2147483648
    }
    if(flag){
        return count;
    }else{
        return Number('-' + count);
    }
};
</code>
</template>