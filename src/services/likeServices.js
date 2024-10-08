class likeServices {

    async toggleVideoLike (videoId) {
        try{
            const response = await fetch(`/api/v1/like/toggle-videoLike/${videoId}`)
            return response.ok && response
        }catch(error){
            console.log(error?.message)
        }
    }

    async toggleCommentLike (commentId){
        try{
            const response = await fetch(`/api/v1/like/toggle-commentLike/${commentId}`)
            return response.ok && response
        }catch(error){
            console.log(error?.message)
        }
       
    }

    async getAllLikedVideos () {
        try {
            const response = await fetch('/api/v1/like/get-allLiked-videos')
            return response.ok && response.json()
        } catch (error) {
            console.log(error?.message)
            
        }
    }

}

const likeService = new likeServices()
export default likeService