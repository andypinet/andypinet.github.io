Vue.component("andy-qiuqiudajiale", {
    template: `
        <div class="andy-qiuqiudajiale">        
            <h3>Donate</h3>
            <p>If my work is helpful to you, please support me a cup of coffee. THX.</p>    
            <div class="layout horizontal center">
                <img src="http://139.196.32.227:8080/zhifubao.jpg" alt="">
                <img src="http://139.196.32.227:8080/weixin.png" alt="">
            </div>        
        </div>
    `
});

function getUnmaskedInfo(gl) {
    var unMaskedInfo = {
        renderer: '',
        vendor: ''
    };

    var dbgRenderInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (dbgRenderInfo != null) {
        unMaskedInfo.renderer = gl.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL);
        unMaskedInfo.vendor   = gl.getParameter(dbgRenderInfo.UNMASKED_VENDOR_WEBGL);
    }

    return unMaskedInfo;
}

Vue.component("andy-yourdeviceinfo", {
    template: `
        <div class="andy-yourdeviceinfo">        
            <div class="andy-yourdeviceinfo-item" v-for="item in items">
                <span class="andy-yourdeviceinfo-item__key">{{item.key}}</span>:<span class="andy-yourdeviceinfo-item__value">{{item.value}}</span>
            </div>
        </div>     
    `,
    data: function () {
        var gl = document.getElementById("glcanvas").getContext("experimental-webgl");        
        this.items  = [
             {
                key: "appVersion",
                value: navigator.appVersion
             },
             {
                key: "浏览器供应商",
                value: navigator.vendor
             },
             {
                 key: "平台",
                 value: navigator.platform
             },
             {
                 key: "硬件内核数",
                 value: navigator.hardwareConcurrency
             },
             {
                 key: "GPU支持 render",
                 value: gl.getParameter(gl.RENDERER)
             },
             {
                 key: "GPU支持 vendor",
                 value: gl.getParameter(gl.VENDOR)
             },
             {
                 key: "显卡支持",
                 value: getUnmaskedInfo(gl).vendor
             },
             {
                 key: "显卡型号",
                 value: getUnmaskedInfo(gl).renderer
             }                                                                                     
        ];
    }
});

window.globalEle = {};
window.globalEle.link = {};

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

loadScript = function(url) {
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

