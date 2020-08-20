
- git使用一：从某次commit 处切新分支
```
    1、git log 查看提交
    2、// 通过checkout 跟上commitId 即可创建制定commit之前的本地分支
    git checkout commitId -b 本地新branchName

    3: commitID后面的提交便不会出现在新分支上面了
```