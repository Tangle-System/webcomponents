function t(){}function e(t){return t()}function n(){return Object.create(null)}function i(t){t.forEach(e)}function o(t){return"function"==typeof t}function r(t,e){return t!=t?e==e:t!==e}function a(t,e){t.appendChild(e)}function s(t,e,n){t.insertBefore(e,n||null)}function l(t){t.parentNode.removeChild(t)}function c(t){return document.createElement(t)}function d(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function u(t){return document.createTextNode(t)}function m(){return u(" ")}function p(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function g(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function h(t,e,n){e in t?t[e]="boolean"==typeof t[e]&&""===n||n:g(t,e,n)}function x(t){return""===t?null:+t}function f(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function b(t,e){t.value=null==e?"":e}function $(t,e,n,i){t.style.setProperty(e,n,i?"important":"")}function v(t,e,n){t.classList[n?"add":"remove"](e)}function y(t){const e={};for(const n of t)e[n.name]=n.value;return e}let w;function k(t){w=t}function E(){if(!w)throw new Error("Function called outside component initialization");return w}function A(t){E().$$.on_mount.push(t)}function L(){const t=E();return(e,n)=>{const i=t.$$.callbacks[e];if(i){const o=function(t,e,n=!1){const i=document.createEvent("CustomEvent");return i.initCustomEvent(t,n,!1,e),i}(e,n);i.slice().forEach((e=>{e.call(t,o)}))}}}const _=[],M=[],C=[],T=[],P=Promise.resolve();let z=!1;function j(t){C.push(t)}const N=new Set;let H=0;function O(){const t=w;do{for(;H<_.length;){const t=_[H];H++,k(t),S(t.$$)}for(k(null),_.length=0,H=0;M.length;)M.pop()();for(let t=0;t<C.length;t+=1){const e=C[t];N.has(e)||(N.add(e),e())}C.length=0}while(_.length);for(;T.length;)T.pop()();z=!1,N.clear(),k(t)}function S(t){if(null!==t.fragment){t.update(),i(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(j)}}const Z=new Set;function R(t,e){-1===t.$$.dirty[0]&&(_.push(t),z||(z=!0,P.then(O)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function B(r,a,s,c,d,u,m,p=[-1]){const g=w;k(r);const h=r.$$={fragment:null,ctx:null,props:u,update:t,not_equal:d,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(a.context||(g?g.$$.context:[])),callbacks:n(),dirty:p,skip_bound:!1,root:a.target||g.$$.root};m&&m(h.root);let x=!1;if(h.ctx=s?s(r,a.props||{},((t,e,...n)=>{const i=n.length?n[0]:e;return h.ctx&&d(h.ctx[t],h.ctx[t]=i)&&(!h.skip_bound&&h.bound[t]&&h.bound[t](i),x&&R(r,t)),e})):[],h.update(),x=!0,i(h.before_update),h.fragment=!!c&&c(h.ctx),a.target){if(a.hydrate){const t=function(t){return Array.from(t.childNodes)}(a.target);h.fragment&&h.fragment.l(t),t.forEach(l)}else h.fragment&&h.fragment.c();a.intro&&((f=r.$$.fragment)&&f.i&&(Z.delete(f),f.i(b))),function(t,n,r,a){const{fragment:s,on_mount:l,on_destroy:c,after_update:d}=t.$$;s&&s.m(n,r),a||j((()=>{const n=l.map(e).filter(o);c?c.push(...n):i(n),t.$$.on_mount=[]})),d.forEach(j)}(r,a.target,a.anchor,a.customElement),O()}var f,b;k(g)}let U;function X(t){let e,n,i,o,r,c,u,m,p,h,x,f,b;return{c(){e=d("svg"),n=d("g"),i=d("path"),o=d("path"),r=d("path"),c=d("path"),u=d("defs"),m=d("linearGradient"),p=d("stop"),h=d("stop"),x=d("linearGradient"),f=d("stop"),b=d("stop"),g(i,"d","M18.0312 6.01025L6.01037 18.0311"),g(i,"stroke","white"),g(i,"stroke-width","2"),g(i,"stroke-linecap","round"),g(i,"stroke-linejoin","round"),g(o,"d","M18.0312 6.01025L6.01037 18.0311"),g(o,"stroke","url(#paint0_linear_2500_2)"),g(o,"stroke-width","2"),g(o,"stroke-linecap","round"),g(o,"stroke-linejoin","round"),g(r,"d","M18.0312 18.0312L6.01037 6.01043"),g(r,"stroke","white"),g(r,"stroke-width","2"),g(r,"stroke-linecap","round"),g(r,"stroke-linejoin","round"),g(c,"d","M18.0312 18.0312L6.01037 6.01043"),g(c,"stroke","url(#paint1_linear_2500_2)"),g(c,"stroke-width","2"),g(c,"stroke-linecap","round"),g(c,"stroke-linejoin","round"),g(n,"opacity","0.6"),g(p,"stop-color","white"),g(h,"offset","1"),g(h,"stop-color","white"),g(h,"stop-opacity","0"),g(m,"id","paint0_linear_2500_2"),g(m,"x1","18.3847"),g(m,"y1","6.36381"),g(m,"x2","6.36393"),g(m,"y2","18.3846"),g(m,"gradientUnits","userSpaceOnUse"),g(f,"stop-color","white"),g(b,"offset","1"),g(b,"stop-color","white"),g(b,"stop-opacity","0"),g(x,"id","paint1_linear_2500_2"),g(x,"x1","17.6776"),g(x,"y1","18.3848"),g(x,"x2","5.65682"),g(x,"y2","6.36399"),g(x,"gradientUnits","userSpaceOnUse"),g(e,"width","25"),g(e,"height","25"),g(e,"viewBox","0 0 25 25"),g(e,"fill","none"),g(e,"xmlns","http://www.w3.org/2000/svg")},m(t,l){s(t,e,l),a(e,n),a(n,i),a(n,o),a(n,r),a(n,c),a(e,u),a(u,m),a(m,p),a(m,h),a(u,x),a(x,f),a(x,b)},d(t){t&&l(e)}}}function Y(t){let e;function n(t,e){return"number"===t[4]?F:D}let i=n(t),o=i(t);return{c(){o.c(),e=u("")},m(t,n){o.m(t,n),s(t,e,n)},p(t,r){i===(i=n(t))&&o?o.p(t,r):(o.d(1),o=i(t),o&&(o.c(),o.m(e.parentNode,e)))},d(t){o.d(t),t&&l(e)}}}function D(t){let e,n,i,o,r,d=t[17]&&G(t);return{c(){e=c("p"),d&&d.c(),n=m(),i=c("input"),g(i,"maxlength",t[8]),g(i,"type","text"),g(i,"placeholder",t[5]),g(i,"class","tangle-msg-box-dialog-textbox"),v(i,"invalid",t[17])},m(l,c){s(l,e,c),d&&d.m(e,null),a(e,n),a(e,i),b(i,t[0]),o||(r=p(i,"input",t[23]),o=!0)},p(t,o){t[17]?d?d.p(t,o):(d=G(t),d.c(),d.m(e,n)):d&&(d.d(1),d=null),256&o[0]&&g(i,"maxlength",t[8]),32&o[0]&&g(i,"placeholder",t[5]),1&o[0]&&i.value!==t[0]&&b(i,t[0]),131072&o[0]&&v(i,"invalid",t[17])},d(t){t&&l(e),d&&d.d(),o=!1,r()}}}function F(t){let e,n,i,o;return{c(){e=c("p"),n=c("tangle-number-input"),h(n,"min",t[6]),h(n,"max",t[7]),h(n,"value",t[0]),$(e,"display","flex"),$(e,"justify-content","center")},m(r,l){s(r,e,l),a(e,n),i||(o=p(n,"change",t[22]),i=!0)},p(t,e){64&e[0]&&h(n,"min",t[6]),128&e[0]&&h(n,"max",t[7]),1&e[0]&&h(n,"value",t[0])},d(t){t&&l(e),i=!1,o()}}}function G(t){let e,n;return{c(){e=c("small"),n=u(t[12]),g(e,"class","invalidtext")},m(t,i){s(t,e,i),a(e,n)},p(t,e){4096&e[0]&&f(n,t[12])},d(t){t&&l(e)}}}function J(t){let e,n,i,o;return{c(){e=c("button"),n=u(t[11]),g(e,"class","tangle-msg-box-dialog-button cancel")},m(r,l){s(r,e,l),a(e,n),t[24](e),i||(o=p(e,"click",t[18]),i=!0)},p(t,e){2048&e[0]&&f(n,t[11])},d(n){n&&l(e),t[24](null),i=!1,o()}}}function q(t){let e,n,i,o;return{c(){e=c("button"),n=u(t[10]),g(e,"class","tangle-msg-box-dialog-button secondary")},m(r,l){s(r,e,l),a(e,n),i||(o=p(e,"click",t[20]),i=!0)},p(t,e){1024&e[0]&&f(n,t[10])},d(t){t&&l(e),i=!1,o()}}}function I(e){let n,o,r,d,h,x,b,$,y,w,k,E,A,L,_,M,C,T,P,z="alert"!==e[1]&&X(),j="prompt"===e[1]&&Y(e),N="alert"!==e[1]&&!e[10]&&J(e),H=e[10]&&q(e);return{c(){n=c("div"),o=c("div"),r=c("div"),d=c("div"),z&&z.c(),h=m(),x=u(e[2]),b=m(),$=c("div"),y=c("p"),w=u(e[3]),k=m(),j&&j.c(),E=m(),A=c("div"),N&&N.c(),L=m(),H&&H.c(),_=m(),M=c("button"),C=u(e[9]),this.c=t,g(d,"id","exitElm"),g(r,"class","tangle-msg-box-dialog-header"),g($,"class","tangle-msg-box-dialog-body"),g(M,"class","tangle-msg-box-dialog-button"),g(A,"class","tangle-msg-box-dialog-footer"),g(o,"class","tangle-msg-box-dialog"),v(o,"tangle-msg-box-dialog-hide",e[14]),g(n,"class","tangle-msg-box-modal")},m(t,i){s(t,n,i),a(n,o),a(o,r),a(r,d),z&&z.m(d,null),a(r,h),a(r,x),a(o,b),a(o,$),a($,y),a(y,w),a($,k),j&&j.m($,null),a(o,E),a(o,A),N&&N.m(A,null),a(A,L),H&&H.m(A,null),a(A,_),a(A,M),a(M,C),e[25](M),e[26](o),T||(P=[p(d,"click",e[18]),p(M,"click",e[19])],T=!0)},p(t,e){"alert"!==t[1]?z||(z=X(),z.c(),z.m(d,null)):z&&(z.d(1),z=null),4&e[0]&&f(x,t[2]),8&e[0]&&f(w,t[3]),"prompt"===t[1]?j?j.p(t,e):(j=Y(t),j.c(),j.m($,null)):j&&(j.d(1),j=null),"alert"===t[1]||t[10]?N&&(N.d(1),N=null):N?N.p(t,e):(N=J(t),N.c(),N.m(A,L)),t[10]?H?H.p(t,e):(H=q(t),H.c(),H.m(A,_)):H&&(H.d(1),H=null),512&e[0]&&f(C,t[9]),16384&e[0]&&v(o,"tangle-msg-box-dialog-hide",t[14])},i:t,o:t,d(t){t&&l(n),z&&z.d(),j&&j.d(),N&&N.d(),H&&H.d(),e[25](null),e[26](null),T=!1,i(P)}}}function K(t,e,n){let i,o;A((async()=>{r.focus();const t=document.createElement("style");return t.innerHTML="@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');",document.body.appendChild(t),()=>t.remove()})),document.addEventListener("keydown",(t=>{"Enter"===t.key&&u(),"Escape"===t.key&&d()}));const r=E(),a=L(),s=(t,e)=>{a(t,e),r.dispatchEvent&&r.dispatchEvent(new CustomEvent(t,{detail:e})),window.top&&window.top.postMessage(JSON.stringify({name:t,detail:e}),"*")};let l,c=!1;function d(){const t=l;n(14,c=!0),t.addEventListener("animationend",(function e(n){"msg-box-dialog-hide"===n.animationName&&(t.removeEventListener("animationend",e),s("submit",!1),r.remove())}))}function u(){if(!o){const t=l;n(14,c=!0),t.addEventListener("animationend",(function e(n){"msg-box-dialog-hide"===n.animationName&&(t.removeEventListener("animationend",e),s("submit","prompt"!==h||g),r.remove())}))}}let m,p,{value:g=""}=e,{type:h="prompt"}=e,{title:x=""}=e,{content:f=""}=e,{inputtype:b="text"}=e,{placeholder:$=""}=e,{min:v=-999999999}=e,{max:y=999999999}=e,{maxlength:w=999999999}=e,{confirm:k="Potvrdit"}=e,{secondary:_=""}=e,{cancel:C="Zrušit"}=e,{regex:T=/.*/}=e,{invalidtext:P="Zadejte platnou hodnotu"}=e;return t.$$set=t=>{"value"in t&&n(0,g=t.value),"type"in t&&n(1,h=t.type),"title"in t&&n(2,x=t.title),"content"in t&&n(3,f=t.content),"inputtype"in t&&n(4,b=t.inputtype),"placeholder"in t&&n(5,$=t.placeholder),"min"in t&&n(6,v=t.min),"max"in t&&n(7,y=t.max),"maxlength"in t&&n(8,w=t.maxlength),"confirm"in t&&n(9,k=t.confirm),"secondary"in t&&n(10,_=t.secondary),"cancel"in t&&n(11,C=t.cancel),"regex"in t&&n(21,T=t.regex),"invalidtext"in t&&n(12,P=t.invalidtext)},t.$$.update=()=>{2097152&t.$$.dirty[0]&&(i=new RegExp(T.toString().slice(1,-1))),1&t.$$.dirty[0]&&n(17,o=!function(t){return i.test(t)}(g))},[g,h,x,f,b,$,v,y,w,k,_,C,P,l,c,m,p,o,d,u,function(){const t=l;n(14,c=!0),t.addEventListener("animationend",(function e(n){"msg-box-dialog-hide"===n.animationName&&(t.removeEventListener("animationend",e),s("submit","secondary"),r.remove())}))},T,t=>n(0,g=t.detail.value),function(){g=this.value,n(0,g)},function(t){M[t?"unshift":"push"]((()=>{p=t,n(16,p)}))},function(t){M[t?"unshift":"push"]((()=>{m=t,n(15,m)}))},function(t){M[t?"unshift":"push"]((()=>{l=t,n(13,l)}))}]}"function"==typeof HTMLElement&&(U=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){const{on_mount:t}=this.$$;this.$$.on_disconnect=t.map(e).filter(o);for(const t in this.$$.slotted)this.appendChild(this.$$.slotted[t])}attributeChangedCallback(t,e,n){this[t]=n}disconnectedCallback(){i(this.$$.on_disconnect)}$destroy(){!function(t,e){const n=t.$$;null!==n.fragment&&(i(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}});class Q extends U{constructor(t){super(),this.shadowRoot.innerHTML='<style>*{font-family:"Poppins", sans-serif !important}.tangle-msg-box-modal{font-family:inherit;width:100%;height:100%;display:flex;justify-content:center;align-items:center;overflow:auto;position:fixed;top:0;left:0;z-index:100000}.tangle-msg-box-dialog{width:calc(100% - 2em);max-width:314px;overflow:hidden;box-sizing:border-box;box-shadow:0 0.5em 1em rgba(0, 0, 0, 0.5);border-radius:25px;animation:msg-box-dialog-show 265ms cubic-bezier(0.18, 0.89, 0.32, 1.28)}.tangle-msg-box-dialog-header{color:inherit;background-color:#191919;text-align:center;font-weight:500;font-size:16px;padding:16px;padding-top:42px;padding-bottom:0px}.tangle-msg-box-dialog-body{color:inherit;background-color:#191919;padding-bottom:24px;padding-top:16px}.tangle-msg-box-dialog-body>p{text-align:center;font-size:12px;color:#9b9b9b;line-height:18px;font-weight:300;padding:0;margin:0;margin-left:22px;margin-right:22px;overflow-wrap:break-word}.tangle-msg-box-dialog-footer{color:inherit;background-color:#191919;display:flex;flex-direction:column-reverse;justify-content:stretch;padding-left:22px;padding-right:22px;padding-bottom:20px}.tangle-msg-box-dialog-button{color:inherit;font-family:inherit;font-size:inherit;background-color:rgba(0, 0, 0, 0);width:100%;max-width:100%;margin-top:8px;padding:16px;padding-top:14.5px;padding-bottom:14.5px;border:none;outline:0;border-radius:0px;transition:background-color 225ms ease-out}.tangle-msg-box-dialog-button:focus{background-color:rgba(0, 0, 0, 0.05)}.tangle-msg-box-dialog-button:active{background-color:rgba(0, 0, 0, 0.15)}.tangle-msg-box-dialog-textbox{width:100%;margin-top:16px;transition:border 125ms ease-out, border 125ms ease-out;border-radius:10px;background:#303030;padding:13px 0px;border:none;text-align:center;font-family:"Poppins", sans-serif;-moz-appearance:textfield;font-size:16px;font-weight:500;color:white;margin-bottom:-10px !important}.tangle-msg-box-dialog-textbox:focus{box-shadow:0 0 0.1em 0.2em rgba(13, 134, 255, 0.5)}.tangle-msg-box-modal{background-color:rgba(31, 31, 31, 0.5)}.tangle-msg-box-dialog{color:white}.tangle-msg-box-dialog-textbox{background-color:#2f2f2f}.tangle-msg-box-dialog-header{background:#191919}.tangle-msg-box-dialog-button{border-radius:20px;font-weight:500;font-size:14px;color:#777777 !important;cursor:pointer}.tangle-msg-box-dialog-button:hover{color:white}.tangle-msg-box-dialog-button:last-of-type{background:#ff257e !important;color:white !important}.tangle-msg-box-dialog-button:last-of-type:hover{background:#ff4a94 !important}.tangle-msg-box-dialog-button.cancel{margin-bottom:-10px}#exitElm{height:0;width:0;margin-top:-30px;float:right;transform:translateX(-20px)}.tangle-msg-box-dialog.tangle-msg-box-dialog-hide{opacity:0;animation:msg-box-dialog-hide 265ms ease-in}@keyframes msg-box-dialog-show{0%{opacity:0;transform:translateY(-100%)}100%{opacity:1;transform:translateX(0)}}@keyframes msg-box-dialog-hide{0%{opacity:1;transform:translateX(0)}100%{opacity:0;transform:translateY(-50%)}}.invalidtext{color:red;margin-top:8px;display:block}.invalid{border:1px solid red}.secondary{background:#303030 !important;margin-top:15px}</style>',B(this,{target:this.shadowRoot,props:y(this.attributes),customElement:!0},K,I,r,{value:0,type:1,title:2,content:3,inputtype:4,placeholder:5,min:6,max:7,maxlength:8,confirm:9,secondary:10,cancel:11,regex:21,invalidtext:12},null,[-1,-1]),t&&(t.target&&s(t.target,this,t.anchor),t.props&&(this.$set(t.props),O()))}static get observedAttributes(){return["value","type","title","content","inputtype","placeholder","min","max","maxlength","confirm","secondary","cancel","regex","invalidtext"]}get value(){return this.$$.ctx[0]}set value(t){this.$$set({value:t}),O()}get type(){return this.$$.ctx[1]}set type(t){this.$$set({type:t}),O()}get title(){return this.$$.ctx[2]}set title(t){this.$$set({title:t}),O()}get content(){return this.$$.ctx[3]}set content(t){this.$$set({content:t}),O()}get inputtype(){return this.$$.ctx[4]}set inputtype(t){this.$$set({inputtype:t}),O()}get placeholder(){return this.$$.ctx[5]}set placeholder(t){this.$$set({placeholder:t}),O()}get min(){return this.$$.ctx[6]}set min(t){this.$$set({min:t}),O()}get max(){return this.$$.ctx[7]}set max(t){this.$$set({max:t}),O()}get maxlength(){return this.$$.ctx[8]}set maxlength(t){this.$$set({maxlength:t}),O()}get confirm(){return this.$$.ctx[9]}set confirm(t){this.$$set({confirm:t}),O()}get secondary(){return this.$$.ctx[10]}set secondary(t){this.$$set({secondary:t}),O()}get cancel(){return this.$$.ctx[11]}set cancel(t){this.$$set({cancel:t}),O()}get regex(){return this.$$.ctx[21]}set regex(t){this.$$set({regex:t}),O()}get invalidtext(){return this.$$.ctx[12]}set invalidtext(t){this.$$set({invalidtext:t}),O()}}function V(e){let n,o,r,d,u,h,f,$;return{c(){n=c("main"),o=c("div"),o.innerHTML='<svg width="18" height="28" viewBox="0 0 14 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.620667 10.5L13.6138 0.540707L13.6138 20.4593L0.620667 10.5Z" fill="white"></path></svg>',r=m(),d=c("input"),u=m(),h=c("div"),h.innerHTML='<svg width="18" height="28" viewBox="0 0 14 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.0483 10.5L0.0551758 20.4593L0.0551758 0.540708L13.0483 10.5Z" fill="white"></path></svg>',this.c=t,g(d,"type","number"),g(d,"min",e[1]),g(d,"max",e[2])},m(t,i){s(t,n,i),a(n,o),a(n,r),a(n,d),b(d,e[0]),a(n,u),a(n,h),f||($=[p(o,"click",e[3]),p(d,"input",e[4]),p(h,"click",e[5])],f=!0)},p(t,[e]){2&e&&g(d,"min",t[1]),4&e&&g(d,"max",t[2]),1&e&&x(d.value)!==t[0]&&b(d,t[0])},i:t,o:t,d(t){t&&l(n),f=!1,i($)}}}function W(t,e,n){let{min:i=-999999999}=e,{max:o=999999999}=e,{value:r=0}=e;const a=E(),s=L();return t.$$set=t=>{"min"in t&&n(1,i=t.min),"max"in t&&n(2,o=t.max),"value"in t&&n(0,r=t.value)},t.$$.update=()=>{var e,l,c;1&t.$$.dirty&&(s(e="change",l={value:r}),a.dispatchEvent&&a.dispatchEvent(new CustomEvent(e,{detail:l}))),1&t.$$.dirty&&(c=r,console.log({val:c,min:i,max:o}),c<i&&n(0,r=i),c>o&&n(0,r=o))},[r,i,o,t=>r>i&&n(0,r--,r),function(){r=x(this.value),n(0,r)},t=>r<o&&n(0,r++,r)]}customElements.define("tangle-modal",Q);class tt extends U{constructor(t){super(),this.shadowRoot.innerHTML='<style>main{display:flex;align-items:center;margin-top:4px;margin-bottom:-16px}input{width:75.79px;border-radius:10px;background:#303030;padding:13px 0px;border:none;text-align:center;font-family:"Poppins", sans-serif;-moz-appearance:textfield;font-size:16px;font-weight:500;color:white}input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{-webkit-appearance:none}div{padding:26px}svg{padding-top:4px}</style>',B(this,{target:this.shadowRoot,props:y(this.attributes),customElement:!0},W,V,r,{min:1,max:2,value:0},null),t&&(t.target&&s(t.target,this,t.anchor),t.props&&(this.$set(t.props),O()))}static get observedAttributes(){return["min","max","value"]}get min(){return this.$$.ctx[1]}set min(t){this.$$set({min:t}),O()}get max(){return this.$$.ctx[2]}set max(t){this.$$set({max:t}),O()}get value(){return this.$$.ctx[0]}set value(t){this.$$set({value:t}),O()}}function et(e){let n;return{c(){n=c("iframe"),this.c=t,g(n,"title","Lumexum modal"),g(n,"srcdoc",e[0])},m(t,e){s(t,n,e)},p(t,[e]){1&e&&g(n,"srcdoc",t[0])},i:t,o:t,d(t){t&&l(n)}}}function nt(t,e,n){let{value:i=""}=e,{type:o="prompt"}=e,{title:r=""}=e,{content:a=""}=e,{inputtype:s="text"}=e,{placeholder:l=""}=e,{min:c=-999999999}=e,{max:d=999999999}=e,{maxlength:u=999999999}=e,{confirm:m="Potvrdit"}=e,{secondary:p=""}=e,{cancel:g="Zrušit"}=e,{regex:h=/.*/}=e,{invalidtext:x="Zadejte platnou hodnotu"}=e;const f=E(),b=L();let $;window.onmessage=function(t){let e={};try{e=JSON.parse(t.data)}catch(t){}var n,i;"submit"===e?.name&&(console.log("Dispatching event",e),n="submit",i=e.detail,b(n,i),f.dispatchEvent&&f.dispatchEvent(new CustomEvent(n,{detail:i})),f.remove())},A((async()=>{y=await fetch("dialog-component.js").then((t=>t.text())),$=document.createElement("tangle-modal"),$.setAttribute("value",i),$.setAttribute("type",o),$.setAttribute("title",r),$.setAttribute("content",a),$.setAttribute("inputtype",s),$.setAttribute("placeholder",l),$.setAttribute("min",c),$.setAttribute("max",d),$.setAttribute("maxlength",u),$.setAttribute("confirm",m),$.setAttribute("secondary",p),$.setAttribute("cancel",g),$.setAttribute("regex",h),$.setAttribute("invalidtext",x),$=$,console.log($),n(0,v=`\n  <!DOCTYPE html>\n<html lang="cs">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Tangle Modal</title>\n</head>\n<body>\n  ${$?$.outerHTML:""}\n  <script type="module">\n    ${y}\n  <\/script>\n</body>\n</html>\n`)}));let v="",y="";return t.$$set=t=>{"value"in t&&n(1,i=t.value),"type"in t&&n(2,o=t.type),"title"in t&&n(3,r=t.title),"content"in t&&n(4,a=t.content),"inputtype"in t&&n(5,s=t.inputtype),"placeholder"in t&&n(6,l=t.placeholder),"min"in t&&n(7,c=t.min),"max"in t&&n(8,d=t.max),"maxlength"in t&&n(9,u=t.maxlength),"confirm"in t&&n(10,m=t.confirm),"secondary"in t&&n(11,p=t.secondary),"cancel"in t&&n(12,g=t.cancel),"regex"in t&&n(13,h=t.regex),"invalidtext"in t&&n(14,x=t.invalidtext)},[v,i,o,r,a,s,l,c,d,u,m,p,g,h,x]}customElements.define("tangle-number-input",tt);class it extends U{constructor(t){super(),this.shadowRoot.innerHTML="<style>iframe{position:absolute;left:0;top:0;border:0;width:100vw;height:100vh;z-index:1000000}</style>",B(this,{target:this.shadowRoot,props:y(this.attributes),customElement:!0},nt,et,r,{value:1,type:2,title:3,content:4,inputtype:5,placeholder:6,min:7,max:8,maxlength:9,confirm:10,secondary:11,cancel:12,regex:13,invalidtext:14},null),t&&(t.target&&s(t.target,this,t.anchor),t.props&&(this.$set(t.props),O()))}static get observedAttributes(){return["value","type","title","content","inputtype","placeholder","min","max","maxlength","confirm","secondary","cancel","regex","invalidtext"]}get value(){return this.$$.ctx[1]}set value(t){this.$$set({value:t}),O()}get type(){return this.$$.ctx[2]}set type(t){this.$$set({type:t}),O()}get title(){return this.$$.ctx[3]}set title(t){this.$$set({title:t}),O()}get content(){return this.$$.ctx[4]}set content(t){this.$$set({content:t}),O()}get inputtype(){return this.$$.ctx[5]}set inputtype(t){this.$$set({inputtype:t}),O()}get placeholder(){return this.$$.ctx[6]}set placeholder(t){this.$$set({placeholder:t}),O()}get min(){return this.$$.ctx[7]}set min(t){this.$$set({min:t}),O()}get max(){return this.$$.ctx[8]}set max(t){this.$$set({max:t}),O()}get maxlength(){return this.$$.ctx[9]}set maxlength(t){this.$$set({maxlength:t}),O()}get confirm(){return this.$$.ctx[10]}set confirm(t){this.$$set({confirm:t}),O()}get secondary(){return this.$$.ctx[11]}set secondary(t){this.$$set({secondary:t}),O()}get cancel(){return this.$$.ctx[12]}set cancel(t){this.$$set({cancel:t}),O()}get regex(){return this.$$.ctx[13]}set regex(t){this.$$set({regex:t}),O()}get invalidtext(){return this.$$.ctx[14]}set invalidtext(t){this.$$set({invalidtext:t}),O()}}customElements.define("tangle-iframe",it);class ot{static async create(t,e,n,{confirm:i,cancel:o}){const r=document.createElement("tangle-iframe");return r.setAttribute("title",t),r.setAttribute("content",e),r.setAttribute("type",n),i&&r.setAttribute("confirm",i),o&&r.setAttribute("cancel",o),document.body.appendChild(r),new Promise(((t,e)=>{r.addEventListener("submit",(function e(n){t(n.detail),r.removeEventListener("submit",e)}))}))}static async alert(t,e="",{confirm:n}={confirm:"Ok"}){const i=document.createElement("tangle-iframe");return i.setAttribute("title",e),i.setAttribute("content",t),i.setAttribute("type","alert"),n&&i.setAttribute("confirm",n),document.body.appendChild(i),new Promise(((t,e)=>{i.addEventListener("submit",(function e(n){t(n.detail),i.removeEventListener("submit",e)}))}))}static async confirm(t,e="",{confirm:n,cancel:i,secondary:o}={confirm:"Potvrdit",cancel:"Zrušit",secondary:null}){const r=document.createElement("tangle-iframe");return r.setAttribute("title",e),r.setAttribute("content",t),r.setAttribute("type","confirm"),n&&r.setAttribute("confirm",n),i&&r.setAttribute("cancel",i),o&&r.setAttribute("secondary",o),document.body.appendChild(r),new Promise(((t,e)=>{r.addEventListener("submit",(function e(n){t(n.detail),r.removeEventListener("submit",e)}))}))}static async prompt(t,e,n="",i,{placeholder:o,min:r,max:a,regex:s,invalidText:l,maxlength:c}={placeholder:void 0,min:void 0,max:void 0,regex:void 0,maxlength:void 0},{confirm:d,cancel:u}={confirm:"Potvrdit",cancel:"Zrušit"}){const m=document.createElement("tangle-iframe");return m.setAttribute("value",e),n&&m.setAttribute("title",n),t&&m.setAttribute("content",t),c>1&&m.setAttribute("maxlength",c),m.setAttribute("type","prompt"),m.setAttribute("inputtype",i),"number"==typeof r&&m.setAttribute("min",r),"number"==typeof a&&m.setAttribute("max",a),o&&m.setAttribute("placeholder",o),d&&m.setAttribute("confirm",d),u&&m.setAttribute("cancel",u),s&&m.setAttribute("regex",s),l&&m.setAttribute("invalidtext",l),document.body.appendChild(m),new Promise(((t,e)=>{m.addEventListener("submit",(function e(n){console.log(n,"data are here wow"),t(n.detail),m.removeEventListener("submit",e)}))}))}}window.TangleMsgBox=ot,window.prompt=ot.prompt,window.confirm=ot.confirm,window.alert=ot.alert,new Q({}),new tt({}),new it({});export{ot as TangleMsgBox,ot as default};
//# sourceMappingURL=dialog-component.js.map
