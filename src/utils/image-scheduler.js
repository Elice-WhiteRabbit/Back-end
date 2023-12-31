const fs = require('fs');
const path = require('path');
const postService = require('../services/post-service');
const userService = require('../services/user-service');

module.exports = async () => {
    // 사용 중인 파일 목록
    let fileNames = [];

    // post, user 전체조회 후 리스트 추출
    const postList = await postService.findAll();

    if(postList.length>0){
        postList.forEach((post) => {
            if(post.image_url){
                const url = post.image_url
                const arr = url.split("/");
                fileNames.push(arr[arr.length - 1]);
            }
        })
    }

    const userList = await userService.findAllUser();

    userList.forEach((user) => {
        if(user.profile_url){
            const url = user.profile_url;
            const arr = url.split("/");
            fileNames.push(arr[arr.length - 1]);
        }
    })

    // 현재 사용중인 이미지 목록
    const activeImagesMap = {};
    fileNames.forEach((filename) => {
        activeImagesMap[filename] = true;
    });

    let unlinkedImages = [];
    let allImages = [];

    // 전체 이미지 목록 가져오기
    allImages = fs.readdirSync('public/images');

    // 연결되지 않은 이미지 식별
    if(allImages.length > 0){
        unlinkedImages = allImages.filter(image => !activeImagesMap[image]);
    }

    // 연결되지 않은 이미지 삭제
    if(unlinkedImages.length > 0){
        unlinkedImages.forEach( async (image) => {
            const imagePath = path.join('public/images', image);
            await fs.unlinkSync(imagePath);
            console.log(`deleted : ${image}`);
        });
    }
}
