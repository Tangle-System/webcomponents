function t(){}function e(t){return t()}function n(){return Object.create(null)}function i(t){t.forEach(e)}function o(t){return"function"==typeof t}function r(t,e){return t!=t?e==e:t!==e}function a(t,e){t.appendChild(e)}function s(t,e,n){t.insertBefore(e,n||null)}function l(t){t.parentNode.removeChild(t)}function c(t){return document.createElement(t)}function d(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function u(t){return document.createTextNode(t)}function m(){return u(" ")}function p(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function g(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function h(t,e,n){e in t?t[e]="boolean"==typeof t[e]&&""===n||n:g(t,e,n)}function x(t){return""===t?null:+t}function f(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function b(t,e){t.value=null==e?"":e}function $(t,e,n,i){t.style.setProperty(e,n,i?"important":"")}function v(t,e,n){t.classList[n?"add":"remove"](e)}function y(t){const e={};for(const n of t)e[n.name]=n.value;return e}let w;function k(t){w=t}function E(){if(!w)throw new Error("Function called outside component initialization");return w}function _(){const t=E();return(e,n)=>{const i=t.$$.callbacks[e];if(i){const o=function(t,e,n=!1){const i=document.createEvent("CustomEvent");return i.initCustomEvent(t,n,!1,e),i}(e,n);i.slice().forEach((e=>{e.call(t,o)}))}}}const A=[],L=[],C=[],M=[],P=Promise.resolve();let z=!1;function T(t){C.push(t)}const j=new Set;let H=0;function N(){const t=w;do{for(;H<A.length;){const t=A[H];H++,k(t),S(t.$$)}for(k(null),A.length=0,H=0;L.length;)L.pop()();for(let t=0;t<C.length;t+=1){const e=C[t];j.has(e)||(j.add(e),e())}C.length=0}while(A.length);for(;M.length;)M.pop()();z=!1,j.clear(),k(t)}function S(t){if(null!==t.fragment){t.update(),i(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(T)}}const O=new Set;function Z(t,e){-1===t.$$.dirty[0]&&(A.push(t),z||(z=!0,P.then(N)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function B(r,a,s,c,d,u,m,p=[-1]){const g=w;k(r);const h=r.$$={fragment:null,ctx:null,props:u,update:t,not_equal:d,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(a.context||(g?g.$$.context:[])),callbacks:n(),dirty:p,skip_bound:!1,root:a.target||g.$$.root};m&&m(h.root);let x=!1;if(h.ctx=s?s(r,a.props||{},((t,e,...n)=>{const i=n.length?n[0]:e;return h.ctx&&d(h.ctx[t],h.ctx[t]=i)&&(!h.skip_bound&&h.bound[t]&&h.bound[t](i),x&&Z(r,t)),e})):[],h.update(),x=!0,i(h.before_update),h.fragment=!!c&&c(h.ctx),a.target){if(a.hydrate){const t=function(t){return Array.from(t.childNodes)}(a.target);h.fragment&&h.fragment.l(t),t.forEach(l)}else h.fragment&&h.fragment.c();a.intro&&((f=r.$$.fragment)&&f.i&&(O.delete(f),f.i(b))),function(t,n,r,a){const{fragment:s,on_mount:l,on_destroy:c,after_update:d}=t.$$;s&&s.m(n,r),a||T((()=>{const n=l.map(e).filter(o);c?c.push(...n):i(n),t.$$.on_mount=[]})),d.forEach(T)}(r,a.target,a.anchor,a.customElement),N()}var f,b;k(g)}let R;function U(t){let e,n,i,o,r,c,u,m,p,h,x,f,b;return{c(){e=d("svg"),n=d("g"),i=d("path"),o=d("path"),r=d("path"),c=d("path"),u=d("defs"),m=d("linearGradient"),p=d("stop"),h=d("stop"),x=d("linearGradient"),f=d("stop"),b=d("stop"),g(i,"d","M18.0312 6.01025L6.01037 18.0311"),g(i,"stroke","white"),g(i,"stroke-width","2"),g(i,"stroke-linecap","round"),g(i,"stroke-linejoin","round"),g(o,"d","M18.0312 6.01025L6.01037 18.0311"),g(o,"stroke","url(#paint0_linear_2500_2)"),g(o,"stroke-width","2"),g(o,"stroke-linecap","round"),g(o,"stroke-linejoin","round"),g(r,"d","M18.0312 18.0312L6.01037 6.01043"),g(r,"stroke","white"),g(r,"stroke-width","2"),g(r,"stroke-linecap","round"),g(r,"stroke-linejoin","round"),g(c,"d","M18.0312 18.0312L6.01037 6.01043"),g(c,"stroke","url(#paint1_linear_2500_2)"),g(c,"stroke-width","2"),g(c,"stroke-linecap","round"),g(c,"stroke-linejoin","round"),g(n,"opacity","0.6"),g(p,"stop-color","white"),g(h,"offset","1"),g(h,"stop-color","white"),g(h,"stop-opacity","0"),g(m,"id","paint0_linear_2500_2"),g(m,"x1","18.3847"),g(m,"y1","6.36381"),g(m,"x2","6.36393"),g(m,"y2","18.3846"),g(m,"gradientUnits","userSpaceOnUse"),g(f,"stop-color","white"),g(b,"offset","1"),g(b,"stop-color","white"),g(b,"stop-opacity","0"),g(x,"id","paint1_linear_2500_2"),g(x,"x1","17.6776"),g(x,"y1","18.3848"),g(x,"x2","5.65682"),g(x,"y2","6.36399"),g(x,"gradientUnits","userSpaceOnUse"),g(e,"width","25"),g(e,"height","25"),g(e,"viewBox","0 0 25 25"),g(e,"fill","none"),g(e,"xmlns","http://www.w3.org/2000/svg")},m(t,l){s(t,e,l),a(e,n),a(n,i),a(n,o),a(n,r),a(n,c),a(e,u),a(u,m),a(m,p),a(m,h),a(u,x),a(x,f),a(x,b)},d(t){t&&l(e)}}}function X(t){let e;function n(t,e){return"number"===t[4]?Y:G}let i=n(t),o=i(t);return{c(){o.c(),e=u("")},m(t,n){o.m(t,n),s(t,e,n)},p(t,r){i===(i=n(t))&&o?o.p(t,r):(o.d(1),o=i(t),o&&(o.c(),o.m(e.parentNode,e)))},d(t){o.d(t),t&&l(e)}}}function G(t){let e,n,i,o,r,d=t[14]&&q(t);return{c(){e=c("p"),d&&d.c(),n=m(),i=c("input"),g(i,"maxlength",t[8]),g(i,"type","text"),g(i,"placeholder",t[5]),g(i,"class","tangle-msg-box-dialog-textbox"),v(i,"invalid",t[14])},m(l,c){s(l,e,c),d&&d.m(e,null),a(e,n),a(e,i),b(i,t[0]),o||(r=p(i,"input",t[19]),o=!0)},p(t,o){t[14]?d?d.p(t,o):(d=q(t),d.c(),d.m(e,n)):d&&(d.d(1),d=null),256&o&&g(i,"maxlength",t[8]),32&o&&g(i,"placeholder",t[5]),1&o&&i.value!==t[0]&&b(i,t[0]),16384&o&&v(i,"invalid",t[14])},d(t){t&&l(e),d&&d.d(),o=!1,r()}}}function Y(t){let e,n,i,o;return{c(){e=c("p"),n=c("tangle-number-input"),h(n,"min",t[6]),h(n,"max",t[7]),h(n,"value",t[0]),$(e,"display","flex"),$(e,"justify-content","center")},m(r,l){s(r,e,l),a(e,n),i||(o=p(n,"change",t[18]),i=!0)},p(t,e){64&e&&h(n,"min",t[6]),128&e&&h(n,"max",t[7]),1&e&&h(n,"value",t[0])},d(t){t&&l(e),i=!1,o()}}}function q(t){let e,n;return{c(){e=c("small"),n=u(t[11]),g(e,"class","invalidtext")},m(t,i){s(t,e,i),a(e,n)},p(t,e){2048&e&&f(n,t[11])},d(t){t&&l(e)}}}function F(t){let e,n,i,o;return{c(){e=c("button"),n=u(t[10]),g(e,"class","tangle-msg-box-dialog-button")},m(r,l){s(r,e,l),a(e,n),i||(o=p(e,"click",t[15]),i=!0)},p(t,e){1024&e&&f(n,t[10])},d(t){t&&l(e),i=!1,o()}}}function D(e){let n,o,r,d,h,x,b,$,y,w,k,E,_,A,L,C,M,P,z="alert"!==e[1]&&U(),T="prompt"===e[1]&&X(e),j="alert"!==e[1]&&F(e);return{c(){n=c("div"),o=c("div"),r=c("div"),d=c("div"),z&&z.c(),h=m(),x=u(e[2]),b=m(),$=c("div"),y=c("p"),w=u(e[3]),k=m(),T&&T.c(),E=m(),_=c("div"),j&&j.c(),A=m(),L=c("button"),C=u(e[9]),this.c=t,g(d,"id","exitElm"),g(r,"class","tangle-msg-box-dialog-header"),g($,"class","tangle-msg-box-dialog-body"),g(L,"class","tangle-msg-box-dialog-button"),g(_,"class","tangle-msg-box-dialog-footer"),g(o,"class","tangle-msg-box-dialog"),v(o,"tangle-msg-box-dialog-hide",e[13]),g(n,"class","tangle-msg-box-modal")},m(t,i){s(t,n,i),a(n,o),a(o,r),a(r,d),z&&z.m(d,null),a(r,h),a(r,x),a(o,b),a(o,$),a($,y),a(y,w),a($,k),T&&T.m($,null),a(o,E),a(o,_),j&&j.m(_,null),a(_,A),a(_,L),a(L,C),e[20](o),M||(P=[p(d,"click",e[15]),p(L,"click",e[16])],M=!0)},p(t,[e]){"alert"!==t[1]?z||(z=U(),z.c(),z.m(d,null)):z&&(z.d(1),z=null),4&e&&f(x,t[2]),8&e&&f(w,t[3]),"prompt"===t[1]?T?T.p(t,e):(T=X(t),T.c(),T.m($,null)):T&&(T.d(1),T=null),"alert"!==t[1]?j?j.p(t,e):(j=F(t),j.c(),j.m(_,A)):j&&(j.d(1),j=null),512&e&&f(C,t[9]),8192&e&&v(o,"tangle-msg-box-dialog-hide",t[13])},i:t,o:t,d(t){t&&l(n),z&&z.d(),T&&T.d(),j&&j.d(),e[20](null),M=!1,i(P)}}}function I(t,e,n){let i,o;var r;r=async()=>{const t=document.createElement("style");return t.innerHTML="@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');",document.body.appendChild(t),()=>t.remove()},E().$$.on_mount.push(r);const a=E(),s=_(),l=(t,e)=>{s(t,e),a.dispatchEvent&&a.dispatchEvent(new CustomEvent(t,{detail:e}))};let c,d=!1;let{value:u=""}=e,{type:m="prompt"}=e,{title:p=""}=e,{content:g=""}=e,{inputtype:h="text"}=e,{placeholder:x=""}=e,{min:f=-999999999}=e,{max:b=999999999}=e,{maxlength:$=999999999}=e,{confirm:v="Potvrdit"}=e,{cancel:y="Zrušit"}=e,{regex:w=/.*/}=e,{invalidtext:k="Zadejte platnou hodnotu"}=e;return t.$$set=t=>{"value"in t&&n(0,u=t.value),"type"in t&&n(1,m=t.type),"title"in t&&n(2,p=t.title),"content"in t&&n(3,g=t.content),"inputtype"in t&&n(4,h=t.inputtype),"placeholder"in t&&n(5,x=t.placeholder),"min"in t&&n(6,f=t.min),"max"in t&&n(7,b=t.max),"maxlength"in t&&n(8,$=t.maxlength),"confirm"in t&&n(9,v=t.confirm),"cancel"in t&&n(10,y=t.cancel),"regex"in t&&n(17,w=t.regex),"invalidtext"in t&&n(11,k=t.invalidtext)},t.$$.update=()=>{131072&t.$$.dirty&&(i=new RegExp(w.toString().slice(1,-1))),1&t.$$.dirty&&n(14,o=!function(t){return i.test(t)}(u))},[u,m,p,g,h,x,f,b,$,v,y,k,c,d,o,function(){const t=c;n(13,d=!0),t.addEventListener("animationend",(function e(n){"msg-box-dialog-hide"===n.animationName&&(t.removeEventListener("animationend",e),l("submit",!1),a.remove())}))},function(){if(!o){const t=c;n(13,d=!0),t.addEventListener("animationend",(function e(n){"msg-box-dialog-hide"===n.animationName&&(t.removeEventListener("animationend",e),l("submit","prompt"!==m||u),a.remove())}))}},w,t=>n(0,u=t.detail.value),function(){u=this.value,n(0,u)},function(t){L[t?"unshift":"push"]((()=>{c=t,n(12,c)}))}]}"function"==typeof HTMLElement&&(R=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){const{on_mount:t}=this.$$;this.$$.on_disconnect=t.map(e).filter(o);for(const t in this.$$.slotted)this.appendChild(this.$$.slotted[t])}attributeChangedCallback(t,e,n){this[t]=n}disconnectedCallback(){i(this.$$.on_disconnect)}$destroy(){!function(t,e){const n=t.$$;null!==n.fragment&&(i(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}});class J extends R{constructor(t){super(),this.shadowRoot.innerHTML='<style>*{font-family:"Poppins", sans-serif !important}.tangle-msg-box-modal{font-family:inherit;width:100%;height:100%;display:flex;justify-content:center;align-items:center;overflow:auto;position:fixed;top:0;left:0}.tangle-msg-box-dialog{width:calc(100% - 2em);max-width:314px;overflow:hidden;box-sizing:border-box;box-shadow:0 0.5em 1em rgba(0, 0, 0, 0.5);border-radius:25px;animation:msg-box-dialog-show 265ms cubic-bezier(0.18, 0.89, 0.32, 1.28)}.tangle-msg-box-dialog-header{color:inherit;background-color:#191919;text-align:center;font-weight:500;font-size:16px;padding:16px;padding-top:42px;padding-bottom:0px}.tangle-msg-box-dialog-body{color:inherit;background-color:#191919;padding-bottom:24px;padding-top:16px}.tangle-msg-box-dialog-body>p{text-align:center;font-size:12px;color:#9b9b9b;line-height:18px;font-weight:300;padding:0;margin:0;margin-left:27px;margin-right:27px;overflow-wrap:break-word}.tangle-msg-box-dialog-footer{color:inherit;background-color:#191919;display:flex;flex-direction:column-reverse;justify-content:stretch;padding-left:22px;padding-right:22px;padding-bottom:8px}.tangle-msg-box-dialog-button{color:inherit;font-family:inherit;font-size:inherit;background-color:rgba(0, 0, 0, 0);width:100%;max-width:100%;margin-top:8px;padding:16px;padding-top:14.5px;padding-bottom:14.5px;border:none;outline:0;border-radius:0px;transition:background-color 225ms ease-out}.tangle-msg-box-dialog-button:focus{background-color:rgba(0, 0, 0, 0.05)}.tangle-msg-box-dialog-button:active{background-color:rgba(0, 0, 0, 0.15)}.tangle-msg-box-dialog-textbox{width:100%;margin-top:16px;transition:border 125ms ease-out, border 125ms ease-out;border-radius:10px;background:#303030;padding:13px 0px;border:none;text-align:center;font-family:"Poppins", sans-serif;-moz-appearance:textfield;font-size:16px;font-weight:500;color:white}.tangle-msg-box-dialog-textbox:focus{box-shadow:0 0 0.1em 0.2em rgba(13, 134, 255, 0.5)}.tangle-msg-box-modal{background-color:rgba(31, 31, 31, 0.5)}.tangle-msg-box-dialog{color:white}.tangle-msg-box-dialog-textbox{background-color:#2f2f2f}.tangle-msg-box-dialog-header{background:#191919}.tangle-msg-box-dialog-button{border-radius:20px;font-weight:500;font-size:14px;color:#777777 !important;cursor:pointer}.tangle-msg-box-dialog-button:hover{color:white}.tangle-msg-box-dialog-button:last-of-type{background:#ff257e !important;color:white !important}.tangle-msg-box-dialog-button:last-of-type:hover{background:#ff4a94 !important}#exitElm{height:0;width:0;margin-top:-30px;float:right;transform:translateX(-20px)}.tangle-msg-box-dialog.tangle-msg-box-dialog-hide{opacity:0;animation:msg-box-dialog-hide 265ms ease-in}@keyframes msg-box-dialog-show{0%{opacity:0;transform:translateY(-100%)}100%{opacity:1;transform:translateX(0)}}@keyframes msg-box-dialog-hide{0%{opacity:1;transform:translateX(0)}100%{opacity:0;transform:translateY(-50%)}}.invalidtext{color:red;margin-top:8px;display:block}.invalid{border:1px solid red}</style>',B(this,{target:this.shadowRoot,props:y(this.attributes),customElement:!0},I,D,r,{value:0,type:1,title:2,content:3,inputtype:4,placeholder:5,min:6,max:7,maxlength:8,confirm:9,cancel:10,regex:17,invalidtext:11},null),t&&(t.target&&s(t.target,this,t.anchor),t.props&&(this.$set(t.props),N()))}static get observedAttributes(){return["value","type","title","content","inputtype","placeholder","min","max","maxlength","confirm","cancel","regex","invalidtext"]}get value(){return this.$$.ctx[0]}set value(t){this.$$set({value:t}),N()}get type(){return this.$$.ctx[1]}set type(t){this.$$set({type:t}),N()}get title(){return this.$$.ctx[2]}set title(t){this.$$set({title:t}),N()}get content(){return this.$$.ctx[3]}set content(t){this.$$set({content:t}),N()}get inputtype(){return this.$$.ctx[4]}set inputtype(t){this.$$set({inputtype:t}),N()}get placeholder(){return this.$$.ctx[5]}set placeholder(t){this.$$set({placeholder:t}),N()}get min(){return this.$$.ctx[6]}set min(t){this.$$set({min:t}),N()}get max(){return this.$$.ctx[7]}set max(t){this.$$set({max:t}),N()}get maxlength(){return this.$$.ctx[8]}set maxlength(t){this.$$set({maxlength:t}),N()}get confirm(){return this.$$.ctx[9]}set confirm(t){this.$$set({confirm:t}),N()}get cancel(){return this.$$.ctx[10]}set cancel(t){this.$$set({cancel:t}),N()}get regex(){return this.$$.ctx[17]}set regex(t){this.$$set({regex:t}),N()}get invalidtext(){return this.$$.ctx[11]}set invalidtext(t){this.$$set({invalidtext:t}),N()}}function K(e){let n,o,r,d,u,h,f,$;return{c(){n=c("main"),o=c("div"),o.innerHTML='<svg width="18" height="28" viewBox="0 0 14 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.620667 10.5L13.6138 0.540707L13.6138 20.4593L0.620667 10.5Z" fill="white"></path></svg>',r=m(),d=c("input"),u=m(),h=c("div"),h.innerHTML='<svg width="18" height="28" viewBox="0 0 14 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.0483 10.5L0.0551758 20.4593L0.0551758 0.540708L13.0483 10.5Z" fill="white"></path></svg>',this.c=t,g(d,"type","number"),g(d,"min",e[1]),g(d,"max",e[2])},m(t,i){s(t,n,i),a(n,o),a(n,r),a(n,d),b(d,e[0]),a(n,u),a(n,h),f||($=[p(o,"click",e[3]),p(d,"input",e[4]),p(h,"click",e[5])],f=!0)},p(t,[e]){2&e&&g(d,"min",t[1]),4&e&&g(d,"max",t[2]),1&e&&x(d.value)!==t[0]&&b(d,t[0])},i:t,o:t,d(t){t&&l(n),f=!1,i($)}}}function Q(t,e,n){let{min:i=-999999999}=e,{max:o=999999999}=e,{value:r=0}=e;const a=E(),s=_();return t.$$set=t=>{"min"in t&&n(1,i=t.min),"max"in t&&n(2,o=t.max),"value"in t&&n(0,r=t.value)},t.$$.update=()=>{var e,l,c;1&t.$$.dirty&&(s(e="change",l={value:r}),a.dispatchEvent&&a.dispatchEvent(new CustomEvent(e,{detail:l}))),1&t.$$.dirty&&(c=r,console.log({val:c,min:i,max:o}),c<i&&n(0,r=i),c>o&&n(0,r=o))},[r,i,o,t=>r>i&&n(0,r--,r),function(){r=x(this.value),n(0,r)},t=>r<o&&n(0,r++,r)]}customElements.define("tangle-modal",J);class V extends R{constructor(t){super(),this.shadowRoot.innerHTML='<style>main{display:flex;align-items:center;margin-top:16px}input{width:75.79px;border-radius:10px;background:#303030;padding:13px 0px;border:none;text-align:center;font-family:"Poppins", sans-serif;-moz-appearance:textfield;font-size:16px;font-weight:500;color:white}input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{-webkit-appearance:none}div{padding:26px}svg{padding-top:4px}</style>',B(this,{target:this.shadowRoot,props:y(this.attributes),customElement:!0},Q,K,r,{min:1,max:2,value:0},null),t&&(t.target&&s(t.target,this,t.anchor),t.props&&(this.$set(t.props),N()))}static get observedAttributes(){return["min","max","value"]}get min(){return this.$$.ctx[1]}set min(t){this.$$set({min:t}),N()}get max(){return this.$$.ctx[2]}set max(t){this.$$set({max:t}),N()}get value(){return this.$$.ctx[0]}set value(t){this.$$set({value:t}),N()}}customElements.define("tangle-number-input",V);class W{static async create(t,e,n,{confirm:i,cancel:o}){const r=document.createElement("tangle-modal");return r.setAttribute("title",t),r.setAttribute("content",e),r.setAttribute("type",n),i&&r.setAttribute("confirm",i),o&&r.setAttribute("cancel",o),document.body.appendChild(r),new Promise(((t,e)=>{r.addEventListener("submit",(function e(n){t(n.detail),r.removeEventListener("submit",e)}))}))}static async alert(t,e="",{confirm:n}={confirm:"Ok"}){const i=document.createElement("tangle-modal");return i.setAttribute("title",e),i.setAttribute("content",t),i.setAttribute("type","alert"),n&&i.setAttribute("confirm",n),document.body.appendChild(i),new Promise(((t,e)=>{i.addEventListener("submit",(function e(n){t(n.detail),i.removeEventListener("submit",e)}))}))}static async confirm(t,e="",{confirm:n,cancel:i}={confirm:"Potvrdit",cancel:"Zrušit"}){const o=document.createElement("tangle-modal");return o.setAttribute("title",e),o.setAttribute("content",t),o.setAttribute("type","confirm"),n&&o.setAttribute("confirm",n),i&&o.setAttribute("cancel",i),document.body.appendChild(o),new Promise(((t,e)=>{o.addEventListener("submit",(function e(n){t(n.detail),o.removeEventListener("submit",e)}))}))}static async prompt(t,e,n="",i,{placeholder:o,min:r,max:a,regex:s,invalidText:l,maxlength:c}={placeholder:void 0,min:void 0,max:void 0,regex:void 0,maxlength:void 0},{confirm:d,cancel:u}={confirm:"Potvrdit",cancel:"Zrušit"}){const m=document.createElement("tangle-modal");return m.setAttribute("value",e),n&&m.setAttribute("title",n),t&&m.setAttribute("content",t),c&&m.setAttribute("maxlength",c),m.setAttribute("type","prompt"),m.setAttribute("inputtype",i),"number"==typeof r&&m.setAttribute("min",r),"number"==typeof a&&m.setAttribute("max",a),o&&m.setAttribute("placeholder",o),d&&m.setAttribute("confirm",d),u&&m.setAttribute("cancel",u),s&&m.setAttribute("regex",s),l&&m.setAttribute("invalidtext",l),document.body.appendChild(m),new Promise(((t,e)=>{m.addEventListener("submit",(function e(n){t(n.detail),m.removeEventListener("submit",e)}))}))}}window.TangleMsgBox=W,window.prompt=W.prompt,window.confirm=W.confirm,window.alert=W.alert,new J({}),new V({});export{W as TangleMsgBox,W as default};
//# sourceMappingURL=dialog-component.js.map
