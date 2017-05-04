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

Vue.use(VueMarkdown);

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

var app = new Vue({
  el: '#app',
  template: '#apptemplate',
  data: function () {
      return {
          global: {
              now: new Date().toLocaleTimeString()
          }
      }
  },
    mounted: function() {
        var self = this;
loadCSS("http://139.196.32.227:8080/test.css", function(link) {
    console.dir(link);
});        
        setInterval(function () {
            self.global.now = new Date().toLocaleTimeString();
        }, 1000);
    }  
})

