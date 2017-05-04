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
        setInterval(function () {
            self.global.now = new Date().toLocaleTimeString();
        }, 1000);
    }  
})

