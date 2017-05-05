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

function findIP(onNewIP) { //  onNewIp - your listener function for new IPs
  var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection; //compatibility for firefox and chrome
  var pc = new myPeerConnection({iceServers: []}),
    noop = function() {},
    localIPs = {},
    ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
    key;

  function ipIterate(ip) {
    if (!localIPs[ip]) onNewIP(ip);
    localIPs[ip] = true;
  }
  pc.createDataChannel(""); //create a bogus data channel
  pc.createOffer(function(sdp) {
    sdp.sdp.split('\n').forEach(function(line) {
      if (line.indexOf('candidate') < 0) return;
      line.match(ipRegex).forEach(ipIterate);
    });
    pc.setLocalDescription(sdp, noop, noop);
  }, noop); // create offer and set local description
  pc.onicecandidate = function(ice) { //listen for candidate events
    if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
    ice.candidate.candidate.match(ipRegex).forEach(ipIterate);
  };
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
        var self = this;
        var ret = {};
        ret.items  = [
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
        findIP(function (newIps) {
            ret.items.push({
                key: "IP",
                value: newIps
            });
            console.log('got ip: ', newIps);            
        });
        return ret;
    }
});