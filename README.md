# Tutorial - Integrating IMA SDK with Livepeer
The aim of this tutorial is to provide a guide on how to implement in-stream ads in Livepeer player using Interactive media ads(IMA) sdk. This tutorial example is a simple or basic version of the Livepeer player with IMA sdk.


*Note - with the expose primitives you can build the complete version of the player*

We also built a plugin for you to wrap your Player if you dont want to implement this from scratch .[Livepeerjs-ima](https://github.com/livepeer-ssai/IMA-Adwrapper-Livepeer)


[Demo app]("")


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
                          <Player.Video title="Live stream" className="h-full w-full" ref={videoRef} />
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
