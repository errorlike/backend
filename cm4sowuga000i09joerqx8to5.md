---
title: "索引的基本知识"
datePublished: Tue Dec 17 2024 16:40:35 GMT+0000 (Coordinated Universal Time)
cuid: cm4sowuga000i09joerqx8to5
slug: 57si5byv55qe5z65pys55l6kg
tags: databases

---

## 磁盘的结构。

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1732541472013/12f23739-13ff-4dd6-9136-413794a1dd8d.png align="center")

> block A由扇区3和磁道1所定位

磁道和扇区，磁道和扇区定位了一个block，block是计算机读取文件的单位。假设这个block能够存储512Byte的数据。我们有这样一张表：表中的一条记录占用128Byte的数据。这张表有100条记录。那么这张表需要25个block来进行存储。

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1732541562036/524e0c3f-9c88-4ac5-a4fe-c04ebfb84a6f.png align="center")

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1732541569900/47fce7b5-2631-44dc-80ff-2492cc31ced1.png align="center")

我们为这张表建立一个密集索引，使用id作为key,每个id连接一条数据记录。每条索引记录需要使用16Byte的存储。则整个索引表需要100\*16/512=3.2，需要4个block来进行存储。

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1732541590106/a63ef9e0-0af8-4bb2-bb67-d54b49a5cff1.png align="center")

则此时定位一条数据需要4+1=5个block。

如果我们以10为单位再为这张索引表建立一个稀疏索引表。这个索引表需要16\*10/512=0.3125。一个block来进行存储。

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1732545269048/38d3da77-86fe-4e14-bf1d-74d2e82c314b.png align="left")

此时定位一条数据需要扫描1 + 1 + 1 = 3个block。减少了一次io操作。

如果此时这张稀疏索引表依然占据了较大的空间，我们可以继续向上建立稀疏索引表。

***我们通过一个多级索引可以减少 io次数***

如果将图片向右旋转90°，是一颗树。

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1732545240699/fe9aba21-4fe1-4f6c-897d-f9412d1eddd0.png align="center")

## 二叉搜索树 VS B树：

### 二叉树

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1732545151828/4a9f6e0a-e78d-4437-ae96-4cc069be005c.png align="center")

*二叉搜索树的问题：*

​ 每个节点对应的是一个block，如果需要找到12这个位于叶子节点的数据，io次数等于树的高度。极限情况下退化成链表。

### B树

降低树深度的方法：每一层容纳更多的数据，自平衡树。

B树是一颗多路(非叶子节点有最多有m个子节点)的平衡树。

B树的规则：

1. 每个节点至少有m/2的上界个孩子节点。
    
2. 根节点可以有少于2个子节点。
    
3. key数 = 孩子数量 -1
    
4. 叶子节点都在同一层级
    
5. 自底向上生长。
    

### B树 VS B+树:

B树的非叶子节点

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1732545180333/038397d3-934c-47cc-ab53-22fd86ac869f.png align="center")

> cp = child\_pointer rp = record\_pointer k= key\_pointer

由底层的节点(超过degree后)分裂后向上添加中值，递归的向上生长。

B+树是B树的一个变体：

区别是：

1. key可以重复。
    
2. 非叶子节点不含有data pointer.
    
    1. 叶子节点连接成一个有序链表。
        

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1732545171220/565e5934-d4ac-48a2-baf0-e6a2e7ba5146.png align="center")

优点：

* 非叶子节点不存储数据，单一节点可以存储更多的数据，树会更加矮胖。同时查询更加可以预测，b树的查询数据可能在叶子节点，可能在中间节点，而B+树始终在叶子节点=树的深度。
    
* 范围查询或者全表数据查询：如果使用B+需要返回父节点，增加了io次数，B+树可以在叶子节点直接顺序遍历。
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1732541395331/916f307b-aa59-4aaa-a6df-31b193f39104.png align="center")
    
* 插入和合并的复杂性：B+树的数据都在叶子节点，单发生节点的合并或者分裂的时候涉及到的节点更少。
    

MySQL中每个索引都是一颗B+树，聚集索引的叶子节点保存的是数据记录，而辅助索引（二级索引）的叶子节点是主键。

#### 参考资料：

[10.2 B Trees and B+ Trees. How they are useful in Databases](https://www.youtube.com/watch?v=aZjYr87r1b8&t=1806s)

[Understanding B-Trees: The Data Structure Behind Modern Databases - YouTube](https://www.youtube.com/watch?v=K1a2Bk8NrYQ)

[dgraph.io/blog/post/b-tree-vs-b+-tree/](http://dgraph.io/blog/post/b-tree-vs-b+-tree/)

[『浅入浅出』MySQL 和 InnoDB - 面向信仰编程](https://draveness.me/mysql-innodb/)