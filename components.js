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
  if (myPeerConnection) {
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
        });
        return ret;
    }
});

Vue.component("andy-testyourgpu", {
    template: `
        <div class="andy-testyourgpu" v-if="cansee">   
            <h3>测试gpu</h3>
            <div ref="result" v-html="result"></div>     
            <button :disabled="disabled" @click="start">start</button>
        </div>     
    `,
    data: function () {    
        var ret = {};
        ret.result = "";
        ret.disabled = false;
        ret.cansee = customElements && typeof customElements.define == "function";
        if (window.client.isChrome() && parseFloat(window.client.getBrowserVersion()) > 52) {
            ret.cansee = true;
        }
        return ret;
    },
    mounted: function () {
        var self = this;
        window.anu.loadScript("./gpu.js").then(function () {
           self.onReady();
        })
    },
    methods: {
        onReady: function () {
            var self = this;
            if (window.performance) {
                var gpu = new GPU();

                function splitArray(array, part) {
                    var tmp = [];
                    for(var i = 0; i < array.length; i += part) {
                        tmp.push(array.slice(i, i + part));
                    }
                    return tmp;
                }

                //
                // Startup code
                //
                var mat_size = 512;
                var A = [];
                var B = [];
                for(var n = 0; n < mat_size*mat_size; n++) {
                    var randA = Math.random();
                    var randB = Math.random();
                    A.push(randA);
                    B.push(randB);
                }
                A = splitArray(A, mat_size);
                B = splitArray(B, mat_size);

                function createMult(mode) {
                    var opt = {
                        dimensions: [mat_size, mat_size],
                        mode: mode
                    };

                    return gpu.createKernel(function(A, B) {
                        var sum = 0;
                        for (var i=0; i<512; i++) {
                            sum += A[this.thread.y][i] * B[i][this.thread.x];
                        }
                        return sum;
                    }, opt);
                }

                var mult = {
                    cpu: createMult('cpu'),
                    gpu: createMult('gpu')
                };

                var benchmarkOpt = {};

                var suite = new Benchmark.Suite;

                suite.add('mat_mult_cpu', function() {
                    var mode = 'cpu';
                    var mat_mult = mult[mode];

                    var C = mat_mult(A, B);
                    
                    return C;
                }, benchmarkOpt);

                suite.add('mat_mult_gpu', function() {
                    var mode = 'gpu';
                    var mat_mult = mult[mode];

                    var C = mat_mult(A, B);
                    
                    return C;
                }, benchmarkOpt);

                suite.on('complete', function(event) {
                    
                    var stats = {};
                    
                    stats.cpu = this.filter(function(benchmark) {
                        return benchmark.name == 'mat_mult_cpu';
                    }).map('stats')[0];
                    
                    stats.gpu = this.filter(function(benchmark) {
                        return benchmark.name == 'mat_mult_gpu';
                    }).map('stats')[0];                    
                    
                    var faster = '';
                    if (stats.cpu.mean > stats.gpu.mean) {
                        var times = stats.cpu.mean / stats.gpu.mean;
                        faster = ' <em>(' + times.toFixed(2) + ' times faster!)</em>';
                    }

                    self.disabled = false;
                    self.result = `
                        <p>CPU: ${stats.cpu.mean.toFixed(3)} s \xb1 ${stats.cpu.rme.toFixed(1)} %</p>
                        <p>GPU: ${stats.gpu.mean.toFixed(3)}s \xb1 ${stats.gpu.rme.toFixed(1)} % faster</p>
                    `;
                });

                suite.on('error', function(event) {
                    console.log("There was an error running on the GPU.");
                    self.result = `<p>There was an error running on the GPU.</p>`;
                    self.disabled = false;
                });

                function demoMult() {
                    suite.run({ 'async': true });
                }

                window.demoMult = demoMult;
            }          
        },
        start: function () {
            var self = this;
            self.result = `<p>Start GPU.</p>`;
            self.disabled = true;
            window.demoMult();            
        }
    }
});