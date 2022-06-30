<script setup lang="ts">
/**
 * @param {number} n
 * @return {number[]}
 */
var countBits = function(n: number) {
    let count = 0;
    for(let i = 0; i <= n; i++){
        let match = i.toString(2).match(/1/g);
        count += match ?  match.length : 0;
    }
    return count;
};
countBits(6);

</script>
<template>
    <h4>剑指 Offer II 003. 前 n 个数字二进制中 1 的个数</h4>
    <p>给定一个非负整数 n ，请计算 0 到 n 之间的每个数字的二进制表示中 1 的个数，并输出一个数组。</p>
    <code>
        /**
        * @param {number} n
        * @return {number[]}
        */
        var countBits = function(n: number) {
            let count = 0;
            for(let i = 0; i <= n; i++){
                let match = i.toString(2).match(/1/g);
                count += match ?  match.length : 0;
            }
            return count;
        };
        console.log(countBits(6))
    </code>
</template>