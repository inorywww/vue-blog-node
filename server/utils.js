const Tag = require("./models/Tag");
const Article = require("./models/Article");

// 根据articles计算所有tag
exports.getTags = async function(){
    let allArticles = []; // 存放所有文章
    let allTags = []; // 存放数据库所有tag
    let allTagsTemp = []; // 存放文章中所有tag
    await Article.find().then(res => allArticles = res);
    await Tag.find().then(res => allTags = res);
    let tagID = 1;
    // 先找到文章中所有包含的tag
    allArticles.forEach(item => {
        item.tags.forEach(tag => {
            const index = allTagsTemp.findIndex(t => t.tagName && t.tagName === tag)
            if(index >= 0){
                allTagsTemp[index].totalNum += 1;
            }
            else{
                allTagsTemp.push({
                    tagName:tag,
                    totalNum:1,
                    tagID
                });
                tagID += 1;
            }
        });
    });
    // 判断当前tag是否存在，不存在才加进去 存在更新数量
    allTagsTemp.forEach(item => {
        const index = allTags.findIndex(t => t.tagName && t.tagName === item.tagName);
        if(index < 0){
            new Tag(item).save();
        }
        else{
            Tag.findOneAndUpdate(
                {tagName:item.tagName},
                {$set:{"totalNum": item.totalNum}},
                {new:true}).then(res => res)
        }
    })
}
