# Tutorial - Integrating IMA SDK with Livepeer(powered by Livepeer)
The aim of this tutorial is to provide a guide on how to implement in-stream ads in Livepeer player using Interactive media ads(IMA) sdk. This tutorial example is a simple or basic version of the Livepeer player with IMA sdk.


*Note - with the expose primitives you can build the complete version of the player*

We also built a plugin for you to wrap your Player if you dont want to implement this from scratch .

Plugin : [Livepeerjs-ima](https://github.com/livepeer-ssai/IMA-Adwrapper-Livepeer)


[Demo app](https://livepeerjs-ima.vercel.app/)

[Sample ad tags](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/tags)


## Getting started
Install Livepeer react package --version 4.x
```js
  npm i @livepeer/react
```

Add the IMA sdk script to your react index.html file
```html
    <!DOCTYPE html>
      <html lang="en">
        <head>
        </head>
        <body>
          <div id="root"></div>
      
          <script src="//imasdk.googleapis.com/js/sdkloader/ima3.js"></script>
          <script type="module" src="/src/main.jsx"></script>
       </body>
      </html>

```

or you can load it programatically 
```js
     var script = document.createElement('script');
      script.src = '//imasdk.googleapis.com/js/sdkloader/ima3.js';
      document.head.appendChild(script);
      
       script.onload = function() {
           console.log("script loaded")
        };

```




### Create a Livepeer player using the primitive components
[Here is link to the official Livepeer documentation](https://docs.livepeer.org/sdks/react/getting-started)

```js
      import { PauseIcon, PlayIcon } from "@livepeer/react/assets";
      import { getSrc, } from "@livepeer/react/external";
      import * as Player from "@livepeer/react/player";
      import {
        useMediaContext,
        useStore,
      } from "@livepeer/react/player";


      function CustomPlayer() {
        
            return (
              <Player.Root src={getSrc("https://storage.googleapis.com/interactive-media-ads/media/android.webm")}  
                   className="relative" >
                    <Player.Container className="h-1/2 w-1/2 overflow-hidden bg-gray-950 relative">
                          <Player.Video title="Live stream" className="h-full w-full"/>
                              <Player.Controls className="flex items-center justify-center">
                               <Player.PlayPauseTrigger className="w-10 h-10 hover:scale-105 flex-shrink-0"
                                  >
                                    <Player.PlayingIndicator asChild matcher={false}>
                                      <PlayIcon className="w-full h-full text-white" />
                                    </Player.PlayingIndicator>

                                    <Player.PlayingIndicator asChild>
                                      <PauseIcon className="w-full h-full text-white" />
                                    </Player.PlayingIndicator>


                                  </Player.PlayPauseTrigger>

                               </Player.Controls>
                           
                         </Player.Container>
                    </Player.Root>
                    )
           }


```

  The above snippet is a basic player. More functionalities and customization can be added to it .You can refer to [example](https://github.com/livepeer-ssai/Livepeer--instream-ads/blob/master/src/App.jsx) on how to add loading and error components.




### Create ad display container
The IMA SDK uses a dedicated ad container element for displaying both ads and ad-related UI elements. This container must be sized to overlay the video element from the top-left corner. The height and width of the ads placed in this container are set by the adsManager object, so you don't need to set these values manually.


```js
        <Player.Container className="h-1/2 w-1/2 overflow-hidden bg-gray-950 relative">
            <Player.Video title="Live stream" className="h-full w-full" />
                  <div id="ad-container" className={`absolute top-0`}></div>
       </Player.Container>

```

### Reference the video and ad-container element with a variable

```js
      const videoRef = useRef(null);
      const adPlaybackRef = useRef(null);


     ......

      <Player.Container className="h-1/2 w-1/2 overflow-hidden bg-gray-950 relative">
            <Player.Video title="Live stream" className="h-full w-full" ref={videoRef} />
                  <div id="ad-container" ref={adPlaybackRef}   className={`absolute top-0`}></div>
       </Player.Container>

      

```

###  Initialize the AdsLoader and make an ads request
  In order to request a set of ads, create an ima.AdsLoader instance. This instance takes an AdDisplayContainer object as an input and can be used to process ima.AdsRequest objects associated with a specified ad tag URL.

  As a best practice, only maintain one instance of ima.AdsLoader for the entire lifecycle of a page.
  
```js
        const initializeIMA = () => {

              videoElement = videoRef.current;
              adContainer = adPlaybackRef.current;
           
              adDisplayContainer = new google.ima.AdDisplayContainer(adContainer,videoElement);
              
              adsLoader = new google.ima.AdsLoader(adDisplayContainer);
    
              adsLoader.addEventListener(
                 google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
                 onAdsManagerLoaded,
                false);
          
              adsLoader.addEventListener(
                google.ima.AdErrorEvent.Type.AD_ERROR,
                onAdError,
                false);
        
  
              videoElement.addEventListener('ended', function() {
                adsLoader.contentComplete();
              });
              var adsRequest = new google.ima.AdsRequest();
    
          
             adsRequest.adTagUrl =tag
          

            adsRequest.linearAdSlotWidth = videoElement.clientWidth;
            adsRequest.linearAdSlotHeight = videoElement.clientHeight;
            adsRequest.nonLinearAdSlotWidth = videoElement.clientWidth;
            adsRequest.nonLinearAdSlotHeight = videoElement.clientHeight / 3;

             adsLoader.requestAds(adsRequest);
           };

```


### Listen for AdsLoader events

When ads are loaded successfully, the ima.AdsLoader emits an ADS_MANAGER_LOADED event. Parse the event passed to the callback to initialize the AdsManager object. The AdsManager loads the individual ads as defined by the response to the ad tag URL.

```js

       function onAdsManagerLoaded(adsManagerLoadedEvent) {
             
               var adsRenderingSettings = new google.ima.AdsRenderingSettings();
               adsRenderingSettings.enablePreloading = true;
               adsManager = adsManagerLoadedEvent.getAdsManager(
                    videoElement,adsRenderingSettings);
    
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

```


### Start the AdsManager
 To start ad playback, you need to start the AdsManager. Note to fully support mobile browsers, this should be triggered by a user interaction.

```js
         const loadAds = () => {
               videoElement = videoRef.current;
          
               const manager = adevent.getAdsManager(
                videoElement);
    
               videoElement?.load();
                
               adContainer.initialize();
               var width = videoElement?.clientWidth;
               var height = videoElement?.clientHeight;
               try {
                    manager.init(width, height, google.ima.ViewMode.NORMAL);
             
                    manager.start();
          
                  } catch (adError) {
                
               
                       console.log("AdsManager could not be started");
                       videoElement?.play();
                 }
              };

```
###  Listen for AdsManager events and error handling
The AdsManager also fires several events that must be handled. These events are used to track state changes, trigger play and pause on the content video, and register errors.

```js        // onAdsManagerLoaded function block,listen for events

             adsManager.addEventListener(
                  google.ima.AdEvent.Type.AD_ERROR,
                  onAdError);
             ....

            
            function onAdError(adErrorEvent) {
              if(adsManager) {
                adsManager.destroy();
                }
             }
```




