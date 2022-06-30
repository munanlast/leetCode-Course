<script setup lang="ts">
import { ref } from 'vue'
/**
 * @param {string} a
 * @param {string} b
 * @return {string}
 */

var addBinary = function(a: string, b: string) {
    if(a.length < 53 && b.length < 53){
        return (parseInt(a,2) + parseInt(b,2)).toString(2);
    }else{
        let result = '';
        let i1 = a.length - 1;
        let i2 = b.length - 1;
        let carry = 0;
        debugger
        while(i1 >= 0 || i2 >= 0){
            const l = i1 >= 0 ? parseInt(a[i1]) : 0;
            const r = i2 >= 0 ? parseInt(b[i2]) : 0;
            const sum = l + r + carry;
            carry = Math.floor(sum / 2);
            result += (sum%2);
            i1--;
            i2--;
        }
        if(carry){
            result += (carry + '');
        }
        return result.split('').reverse().join('');
    }
};
console.log(addBinary(
    "10100000100100110110010000010101111011011001101110111111111101000000101111001110001111100001101",
    "110101001011101110001111100110001010100001101011101010000011011011001011101111001100000011011110011"))
</script>
<template>
    <h4>剑指 Offer II 003. 前 n 个数字二进制中 1 的个数</h4>
    <p>给定一个非负整数 n ，请计算 0 到 n 之间的每个数字的二进制表示中 1 的个数，并输出一个数组。</p>
    <code>
        /**
        * @param {string} a
        * @param {string} b
        * @return {string}
        */

        var addBinary = function(a: string, b: string) {
            if(a.length &lt; 53 && b.length &lt; 53){
                return (parseInt(a,2) + parseInt(b,2)).toString(2);
            }else{
                let result = '';
                let i1 = a.length - 1;
                let i2 = b.length - 1;
                let carry = 0;
                debugger
                while(i1 >= 0 || i2 >= 0){
                    const l = i1 >= 0 ? parseInt(a[i1]) : 0;
                    const r = i2 >= 0 ? parseInt(b[i2]) : 0;
                    const sum = l + r + carry;
                    carry = Math.floor(sum / 2);
                    result += (sum%2);
                    i1--;
                    i2--;
                }
                if(carry){
                    result += (carry + '');
                }
                return result.split('').reverse().join('');
            }
        };
    </code>

</template>