offcos
======
offcos是一个大的集合，包括offcosCC，offcosAlgorithm，offcosLoader，offcosMVC等


1. offcosCC:
------------
一个有限自动机方向的实践，包括词法识别和句法识别两个部分
词法识别包括nfa构建和子集构造法生成dfa，最终生成状态转移矩阵，基本上等同于简单版的正则表达式引擎
句法分析包括LL(1)分析器实现和LALR(1)分析器的实现
todo:(尚未成熟，待定)实现一个基于js语法的面相对象编程语言，在现有js语法基础上增加class等面相对象特性，以实现面相对象的复用

2. offcosAlgorithm:
-------------------
一个算法方向的实践，用js实现了冒泡、归并、堆排等排序方法，并对比了各个方法在chrome下的执行效率

3. offcosLoader:
----------------
一个js加载器方向的实践，实现了一个符合AMD规范的加载器，并利用有向图的最小生成树解决了循环依赖问题

4. offcosMVC:
-------------
一个MVC架构方向的实践，参考了backbone的实现，去掉了不实用的router，做了一个适合自己的简装版
todo:结合offcosCC实现html和js变量的双向绑定型模板
