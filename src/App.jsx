import { useState,useEffect,useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { PauseIcon, PlayIcon } from "@livepeer/react/assets";
import { getSrc, } from "@livepeer/react/external";
import * as Player from "@livepeer/react/player";
import {
  useMediaContext,
  useStore,
} from "@livepeer/react/player";




function App() {
         const playRef = useRef(null);
         const videoRef = useRef(null);
         const [adevent,setEvent]=useState()
         const [container,setContainer]=useState()
         const [canPlay,setCanPlay]=useState(false)

          const adPlaybackRef = useRef(null);
          const [adsLoaded, setAdsLoaded] = useState(false);
          const [adsCompleted, setAdsCompleted] = useState(false);
          var adContainer;
          var adDisplayContainer;
          var adsLoader;
          var adsManager;
          var videoElement;
     
        
        useEffect(() => {
            videoElement = videoRef.current;
            initializeIMA();
          }, []);



         
            function onAdsManagerLoaded(adsManagerLoadedEvent) {
              // Instantiate the AdsManager from the adsLoader response and pass it the video element
            
              setAdsLoaded(true);
              setEvent(adsManagerLoadedEvent)
             
              var adsRenderingSettings = new google.ima.AdsRenderingSettings();
              adsRenderingSettings.enablePreloading = true;
              adsManager = adsManagerLoadedEvent.getAdsManager(
                  videoElement,adsRenderingSettings);
        ;
    
                  console.log(adsManager,"mangerrrr")
    
              adsManager.addEventListener(
                google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
                onContentPauseRequested);
              adsManager.addEventListener(
                google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
                onContentResumeRequested);
    
                adsManager.addEventListener(
                  google.ima.AdEvent.Type.LOADED,
                 onAdLoaded);
                 adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE,()=>setAdsLoaded(false) || setAdsCompleted(true));


                 adsManager.addEventListener(
                  google.ima.AdEvent.Type.AD_ERROR,
                  onAdError);
            }
            
            function onAdError(adErrorEvent) {
              // Handle the error logging.
              console.log(adErrorEvent.getError(),"err");
              if(adsManager) {
                adsManager.destroy();
              }
            }



          const initializeIMA = () => {
            console.log("initializing IMA");
            adContainer = adPlaybackRef.current;
         
            adDisplayContainer = new google.ima.AdDisplayContainer(adContainer,videoElement);
            console.log(adDisplayContainer,"display")
            setContainer(adDisplayContainer)
            adsLoader = new google.ima.AdsLoader(adDisplayContainer);
  
              adsLoader.addEventListener(
                google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
                onAdsManagerLoaded,
                false);
          
              adsLoader.addEventListener(
                google.ima.AdErrorEvent.Type.AD_ERROR,
                onAdError,
                false);
        
            console.log(adsLoader,"lll")
            videoElement.addEventListener('ended', function() {
              adsLoader.contentComplete();
            });
            var adsRequest = new google.ima.AdsRequest();
  
          
             adsRequest.adTagUrl ="https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_preroll_skippable&sz=640x480&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator="
          

            adsRequest.linearAdSlotWidth = videoElement.clientWidth;
            adsRequest.linearAdSlotHeight = videoElement.clientHeight;
            adsRequest.nonLinearAdSlotWidth = videoElement.clientWidth;
            adsRequest.nonLinearAdSlotHeight = videoElement.clientHeight / 3;
            console.log(adsRequest,"after reeee")


            // adsRequest.setAdWillAutoPlay(true);
            // adsRequest.setAdWillPlayMuted(false);
      
            adsLoader.requestAds(adsRequest);
        
          
  
  
          };
      
  

   

           const loadAds = () => {
            videoElement = videoRef.current;
          
            const manager = adevent.getAdsManager(
                videoElement);
    
                 videoElement?.load();
                
                 container.initialize();
               var width = videoElement?.clientWidth;
               var height = videoElement?.clientHeight;
              try {
                manager.init(width, height, google.ima.ViewMode.NORMAL);
             
                manager.start();
                console.log("loading ads 22");
              } catch (adError) {
                       console.log(adError,"errr")
                   // Play the video without ads, if an error occurs
                       console.log("AdsManager could not be started");
                       videoElement?.play();
              }
  
              setAdsLoaded(false);
  
          };
      
  

          const handlePlayButtonClick = () => {
            console.log("clicked")
            videoElement?.play();
            };

          const handleVideoPlay = () => {
             console.log("playing add")
              loadAds();
          };
  
  
          function onContentPauseRequested() {
            videoElement?.pause();
          }
          
          function onContentResumeRequested() {
            videoElement?.play();
             }
  
          function onAdLoaded(adEvent) {
            var ad = adEvent.getAd();
            
            if (!ad.isLinear()) {
              videoElement?.play();
            }
          }
  
        
   
              console.log(canPlay,adsLoaded,"playe")

            
            return (
                  <div className='w-full h-full'>
                      <Player.Root src={getSrc("https://storage.googleapis.com/interactive-media-ads/media/android.webm")}  autoPlay  >
                            <Player.Container className="h-1/2 w-1/2 overflow-hidden bg-gray-950 relative">
                                  <Player.Video title="Live stream" className="h-full w-full" ref={videoRef} 
                                   
                                   />
                                    <CurrentSource
                                        style={{
                                          position: "absolute",
                                          left: 20,
                                          bottom: 20,
                                        }}
                                         setCanPlay={setCanPlay}
                                      />

                                  <Player.Controls className="flex items-center justify-center">

                                         <Player.PlayPauseTrigger className="w-10 h-10 hover:scale-105 flex-shrink-0"
                                          // ref={playRef}
                                      
                                             >

                                                <Player.PlayingIndicator asChild matcher={false}>
                                                  <PlayIcon className="w-full h-full text-white" />
                                                </Player.PlayingIndicator>

                                                <Player.PlayingIndicator asChild>
                                                  <PauseIcon className="w-full h-full text-white" />
                                                </Player.PlayingIndicator>

 
                                           </Player.PlayPauseTrigger>

                                     </Player.Controls>
                                           <Player.LoadingIndicator
                                                className='flex w-full h-full justify-center items-center bg-black text-white font-semibold'
                                                   onLoad={(e) => {
                                            // we fake an error here every time there is progress
                                                     console.log(e,"event ii")
                                          
                                                      }}
                                              >
                                                Loading...
                                     </Player.LoadingIndicator>
                                      <Player.ErrorIndicator
                                        matcher="all"
                                        className='flex w-full h-full justify-center items-center bg-black text-white font-semibold'
                                      >
                                        An error occurred. Trying to resume playback...
                                      </Player.ErrorIndicator>

                                    <div id="ad-container" ref={adPlaybackRef}  className={`absolute top-0 ${adsCompleted&&"hidden"} ` }></div>
                                      {canPlay&&adsLoaded&&
                                          <div className='absolute top-0 flex items-center justify-center w-full h-full '>
                                              <PlayIcon className="w-10 h-10 text-white" onClick={handleVideoPlay}/>
                                      
                                              </div>
                                       }




                            </Player.Container>

                      </Player.Root>



                  </div>
                )
}



function CurrentSource({
  style,
  __scopeMedia,
  setCanPlay
}) {
  const context = useMediaContext("CurrentSource", __scopeMedia);

  const { currentSource } = useStore(context.store, ({ currentSource }) => ({
    currentSource,
  }));

  useEffect(()=>{
    setCanPlay(context.store.getState()?.canPlay)
  },[context.store.getState()?.canPlay])
  return currentSource ? (
    <div style={style}>
      <span>
        Playback type:{" "}
        <span
          style={{
            color: "#ffffffe2",
          }}
        >
          {/* {currentSource?.type} */}
        </span>
      </span>
    </div>
  ) : null;
}


export default App
