import React, {  useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faHeart} from "@fortawesome/free-regular-svg-icons"
import likeService from '../../services/likeServices'
import subService from '../../services/subscriptionServise'
import { PlaylistSection} from '../index'
import { setChannelProfile, setVideoDetails } from '../../store/videoSlice'
import {useSelector, useDispatch } from 'react-redux'
import {useDebounce} from "../../utils/index"
import { useMutation } from 'react-query'
import useDataFetch from '../../utils/useDataFetch'

function VideoSection() {

  const videoDetail = useSelector((state) => state.videoReducer.videoDetail)
  const channelProfile = useSelector(state => state.videoReducer.channelProfile)
  const authStatus = useSelector((state) => state.authReducer.status)

  const [error, setError] = useState("")

  const dispatch = useDispatch()

  const [playlistDisplay, setPlaylistDisplay] = useState(false)
    
  const navigate = useNavigate()

  const getPublicId = (videoFile) =>
    {
    const arr = videoFile.split("/")
    return arr[arr.length - 1].replace(".mp4", "") 
    }

  const publicId = useRef(getPublicId(videoDetail.detail?.videoFile))  

  const toggleLike = async (videoId) => {
      setError("")
      try{
        !authStatus && navigate("/login")
          await likeService.toggleVideoLike(videoId)
          dispatch(setVideoDetails({
          userLikedVideo : !videoDetail.userLikedVideo
        }))

        }
        catch(error){
          setError(error?.message)
        }    
      }

  const debounceToggleLike = useDebounce(toggleLike, 300)

  const toggleSubscription = async (channelId) => {
    setError("")
      try {
        !authStatus && navigate("/login")
            await subService.toggleSubscription(channelId)
            dispatch(setChannelProfile({
            userSubscribedChannel : !channelProfile.userSubscribedChannel
          }))
        }
        catch (error) {
          setError(error?.message) 
        }
      }

  const debounceToggleSubscription = useDebounce(toggleSubscription, 300)

  if(error) return  <p>{error}</p>
  
  return  (
    <div className='relative'>
        <iframe
        className='rounded-2xl object-fill'
        width="100%"
        height="450"
        src={`https://player.cloudinary.com/embed/?public_id=${publicId.current}&cloud_name=backend-project-chai&player[controls]=true`}
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        
      ></iframe>
      <div className='w-full bg-white h-[100px] '>
        <div className='h-10 px-4 py-2'>{videoDetail.detail.title}</div>
        <div className='flex items-center justify-between px-2'>
        <div className='flex gap-4 items-center w-[50%] justify-around'>
          <div onClick={() => navigate(`/channel-profile/${videoDetail.detail.owner}/videos`)} className='flex cursor-pointer w-full gap-12'>
            <div className='w-12 h-12 rounded-full overflow-hidden'>
                <img src={channelProfile.channelOwnerProfile.avatar} className='w-full h-full'/>
            </div>
            <div className='flex flex-col'>
                <h2>{channelProfile.channelOwnerProfile.username}</h2>
                <h5>{channelProfile.channelOwnerProfile.subscriberCount}</h5>
            </div>
            </div>
            <div onClick={() => debounceToggleSubscription(channelProfile.channelOwnerProfile._id)} className='cursor-pointer bg-red-500 w-32 h-12 text-center rounded-2xl'>
                {channelProfile.userSubscribedChannel ? "Subscribed" : "Subscribe"}
            </div>
        </div>
        <div className='flex items-center gap-2 w-[40%] cursor-pointer justify-evenly'>
            <div onClick={() => debounceToggleLike(videoDetail.detail._id)}>
              <FontAwesomeIcon icon={faHeart} style={{color: videoDetail.userLikedVideo ? "#db0f4c" : ""}} />
              <span>{videoDetail.detail.videoLikeCount}</span>
            </div>

            <div onClick={() => setPlaylistDisplay((prev => !prev))} className='cursor-pointer'>
                playlist
                {playlistDisplay &&  <PlaylistSection />}
            </div>
        </div>
      </div>
        </div>
      </div>
    
  ) 
}

export default VideoSection