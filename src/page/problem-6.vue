<template>
    <h4>剑指 Offer II 006. 排序数组中两个数字之和</h4>
    <p>给定一个已按照 升序排列  的整数数组 numbers ，请你从数组中找出两个数满足相加之和等于目标数 target 。
        函数应该以长度为 2 的整数数组的形式返回这两个数的下标值。numbers 的下标 从 0 开始计数 ，所以答案数组应当满足 0 &lt;= answer[0] &lt; answer[1] &lt; numbers.length 。
        假设数组中存在且只存在一对符合条件的数字，同时一个数字不能使用两次。
    </p>

</template>
<script setup lang="ts">
    /**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(numbers, target) {
    let l = 0, r = numbers.length -1;
    while(l <= r){
        if(numbers[l] + numbers[r] > target){
            r--;
        }else if(numbers[l] + numbers[r] < target){
            l++;
        }else{
            return [numbers[l],numbers[r]]
        }
    }
};
console.log(twoSum([1,2,4,6,10],8))
</script>