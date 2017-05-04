Vue.component("andy-qiuqiudajiale", {
    template: `
        <div class="andy-qiuqiudajiale">        
            <h3>Donate</h3>
            <p>If my work is helpful to you, please support me a cup of coffee. THX.</p>    
            <div class="layout horizontal center">
                <img src="https://139.196.32.227:8080/zhifubao.jpg" alt="">
                <img src="https://139.196.32.227:8080/weixin.png" alt="">
            </div>        
        </div>
    `
});

Vue.use(VueMarkdown);

var app = new Vue({
  el: '#app',
  template: '#apptemplate',
  data: {
    message: 'Hello Vue!'
  }
})

