<template>
    <h4>剑指 Offer II 005. 单词长度的最大乘积</h4>
    <p>给定一个字符串数组 words，请计算当两个字符串 words[i] 和 words[j] 不包含相同字符时，它们长度的乘积的最大值。
        假设字符串中只包含英语的小写字母。如果没有不包含相同字符的一对字符串，返回 0。</p>
    <code>
        /**
        * @param {string[]} words
        * @return {number}
        */
        var maxProduct = function(words) {
            words = words.sort((a,b) => b.length - a.length);
            let result = [];
            let i = 1;
            let first = words[0];
            while(i &lt; words.length){
                if(diff(first, words[i])){
                    words.splice(i,1);
                    i = 1;
                }else{
                    result.push(first.length * words.length);
                    words.splice(i,1);
                    words.splice(0,1);
                    first = words[0];
                }
            }

            function diff(a,b){
                for(let i = 0; i &lt; b.length: i++){
                    if(a.indexOf(b[i]) !== -1){
                        return true
                    }
                }
                return false;
            }
            return Math.max(...result);
        };
    </code>
</template>
<script setup lang="ts">
        /**
        * @param {string[]} words
        * @return {number}
        */
        var maxProduct = function(words: Array<string>) {
            words = words.sort((a,b) => b.length - a.length);
            let result:Array<number> = [];
            for(let k = 0; k < words.length; k ++){
                let i = k+1;
                const clone = [...words]
                let first = clone[k];
                while(i < clone.length){
                    if(diff(first, clone[i])){
                        clone.splice(i,1);
                        i = k+1;
                    }else{
                        result.push(first.length * clone[i].length);
                        clone.splice(i,1);
                        clone.splice(0,1);
                        first = clone[0];
                    }
                }
            }
            

            function diff(a: string, b:string){
                for(let i = 0; i < b.length; i++){
                    if(a.indexOf(b[i]) !== -1){
                        return true
                    }
                }
                return false;
            }
            return result.length ? Math.max(...result) : 0;
        };
        console.log(maxProduct(["a","ab","abc","d","cd","bcd","abcd"]))
</script>