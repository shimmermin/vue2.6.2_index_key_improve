# vue2.6.2_index_key_improve
This study improves the diff algorithm, it significantly reduces operations on the real DOM. This study tested the  optimization schemes on Android and PC. The experimental results show that compared to the original Vue 2.6, rendering performance is improved by up to 89.62%, and rendering time is reduced by up to about 2000ms. 

原版Vue 2.6的渲染算法是diff算法，该算法基于Virtual DOM思想，虽然有效减少了渲染过程中对真实DOM的操作次数，并提高了渲染性能，但是仍然有很大的优化空间。本次研究在原版Vue 2.6框架的基础上对diff算法中最耗时的子节点比较的部分（updatechildren）进行改进，显著减少在页面更新过程中对真实DOM的操作次数。本次研究在Android端、PC端对两个优化方案进行了测试，实验结果表明，相比原版Vue 2.6框架，优化方案取得了显著的优化效果，渲染性能提升幅度高达89.62%，页面渲染时间最多减少了约2000 ms。

改进的方案中又加入了一个map，我们定义为newKeyToIdx，即prevVnode子节点的key值到vnode子节点的index的映射，可以理解为原版map的翻转，这样的作法可以使得启发式的搜索不仅仅从newS指针所指的节点开始，而是先从oldS开始查找匹配，如果没有匹配，再从oldE开始查找匹配，如果还是没有匹配，最后从newS开始查找匹配。启发式搜索的初始搜索点增多，启发程度更大。

本次研究采用的性能测试工具是：Js-framework benchmark是一个简易的Benchmark，为多个前端框架做基准测试。这个Benchmark创建了带有随机实体的大表格，测量了各种各样操作的时间，包括渲染的时间间隔。https://stefankrause.net/js-frameworks-benchmark8/table.html.

通过调试改进后的算法，发现对Benchmark原本有的6种操作并无太大的影响，因为原本的6种操作就是简单的创建或删除，无论什么样的框架，都会对真实DOM进行定量的操作，因此本次研究又为Benchmark增加了8项较为复杂的操作，用来测试改进的算法。新增的8项复杂操作如下：
（1）删除列表的第一个节点和最后一个节点。
（2）每十个节点一组，删除每组的最后一个节点。
（3）交换第一个节点和第二个节点的位置，删除第三个和最后一个节点。
（4）删除第一个和最后一个节点，剩余节点的前两个节点位置互换。
（5）第一个和第二个节点的位置互换，新增一个节点代替第三个节点，删除最后一个节点。
（6）每五个节点为一组，倒序排列后删除每组最后一个节点。
（7）每三个节点为一组，倒序排列后删除每组的最后一个节点，并删除整个列表尾部的未分组节点（总节点数 % 3）。
（8）每十个节点为一组，删除每组的第一个和最后一个节点，并交换中间两个节点的位置。
新增8项操作均为较复杂、常见的列表更新操作，测试用例覆盖了改进算法的三个分支，可以更直观地看到改进部分对渲染性能的提升效果。

实验结果： 
经过多次实验，对于新增的8项操作，改进diff算法的Vue框架能够稳定、正确地运行，更重要的是改进diff算法的Vue框架比原版的Vue框架在渲染性能方面的提升更加显著。分析表5.3-5.6的实验数据可知，改进diff算法的Vue框架在PC端、Android端的渲染时间均有明显的减少，渲染性能提升率高达89.62%，由于移动端的硬件性能远低于PC端，所以页面的渲染时间比PC端更长，但是改进的框架在Android端的渲染时间减少的更多(最多减少了2000 ms)。经过多次实验，观察原始的实验数据可知，Android端的渲染环境不稳定，渲染时间经常有不稳定的情况出现，而在PC端的渲染时间则更加稳定。相比1000个节点的更新，10,000个节点的更新更加能显示出改进diff算法的Vue框架在性能上的优越性。
对于8项复杂的DOM操作，改进diff算法的Vue框架减少的渲染时间和减少的DOM操作次数是相关的，其中第6项操作（op6）由于改进diff算法的Vue框架相比原版框架只减少了1次对真实DOM的操作，所以对于第6项DOM操作的渲染性能并没有大幅度的提升，甚至在Android端出现了性能下降的情况，推测性能下降的原因是改进diff算法的Vue框架在Android端的map构建和搜索上的开销过大，但是即使该项DOM操作的渲染性能有所下降，也只下降了不到17%，对于其他DOM操作的渲染性能的大幅度提升来说，我们还是可以认为，总体上改进diff算法的Vue框架比原版框架的渲染性能有显著的提升。

