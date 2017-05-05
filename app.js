window.anu = {};
window.anu.globalEle = {};

var loadCSS = function(url, callback){
    var link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = url;

    document.getElementsByTagName('head')[0].appendChild(link);

    var img = document.createElement('img');
        img.onerror = function(){
            if(callback) callback(link);
        }
        img.src = url;
}

window.anu.loadScript = function(url) {
    return new Promise(function(resolve, reject) {
        // Adding the script tag to the head as suggested before
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url + "?v=" + new Date();

        // Then bind the event to the callback function.
        // There are several events for cross browser compatibility.
        script.onreadystatechange = function() {
            resolve();
        };        
        script.onload = function() {
            resolve();
        };
        script.onerror = function(e) {
            reject(e);
        }

        // Fire the loading
        head.appendChild(script);        
    })
}

window.anu.createApp = function () {
    var app = new Vue({
        el: '#app',
        template: '#apptemplate',
        data: function () {
            window.client = new ClientJS();       
            if (window.client.isMobile()) {
            loadScript("./vconsole.min.js");
            }
            return {
                global: {
                    now: new Date().toLocaleTimeString()
                }
            }
        },
        mounted: function() {
            var self = this;       
            setInterval(function () {
                self.global.now = new Date().toLocaleTimeString();
            }, 1000);
        }  
    })   
}
