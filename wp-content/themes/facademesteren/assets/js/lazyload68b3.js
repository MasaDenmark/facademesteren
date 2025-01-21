//http://youmightnotneedjquery.com/
document.addEventListener("DOMContentLoaded", function () {
  // wait until images, links, fonts, stylesheets, and js is loaded

  /* LAZY LOADING VIDEOS */

  var lazyVideos = [].slice.call(document.querySelectorAll("video.lazy"));

  if ("IntersectionObserver" in window) {
    var lazyVideoObserver = new IntersectionObserver(function (
      entries,
      observer
    ) {
      entries.forEach(function (video) {
        if (video.isIntersecting) {
          for (var source in video.target.children) {
            var videoSource = video.target.children[source];
            if (
              typeof videoSource.tagName === "string" &&
              videoSource.tagName === "SOURCE"
            ) {
              videoSource.src = videoSource.dataset.src;
            }
          }

          video.target.load();
          video.target.classList.remove("lazy");
          lazyVideoObserver.unobserve(video.target);
        }
      });
    });

    lazyVideos.forEach(function (lazyVideo) {
      lazyVideoObserver.observe(lazyVideo);
    });
  }

  /* LAZY LOADING IMAGES */
  //Images: https://web.dev/lazy-loading-images/
  var lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

  if ("IntersectionObserver" in window) {
    let lazyImageObserver = new IntersectionObserver(function (
      entries,
      observer
    ) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.srcset = lazyImage.dataset.srcset;
          lazyImage.classList.remove("lazy");
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    lazyImages.forEach(function (lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
    /*INFO 
            <img 
              class="lazy" 
              src="{PLACERHOLDER IMAGE WHICH IS THERE TILL WE REACH IMAGE}" 
              data-src="{NO IDEA WHAT THIS IMAGE DOES}" 
              data-srcset="
              {THIS IS THE IMAGE WHICH SHOWS ON LOAD}, 
              {THIS IS THE IMAGE FOR.... I DO NOT know. COULD BE COOL if this image could be loaded on phone}
              " 
          />
    
        */
  }
}); //DOMContentLoaded
