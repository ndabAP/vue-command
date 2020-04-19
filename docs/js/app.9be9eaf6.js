(function(t){function e(e){for(var r,s,u=e[0],a=e[1],c=e[2],h=0,p=[];h<u.length;h++)s=u[h],Object.prototype.hasOwnProperty.call(o,s)&&o[s]&&p.push(o[s][0]),o[s]=0;for(r in a)Object.prototype.hasOwnProperty.call(a,r)&&(t[r]=a[r]);l&&l(e);while(p.length)p.shift()();return i.push.apply(i,c||[]),n()}function n(){for(var t,e=0;e<i.length;e++){for(var n=i[e],r=!0,u=1;u<n.length;u++){var a=n[u];0!==o[a]&&(r=!1)}r&&(i.splice(e--,1),t=s(s.s=n[0]))}return t}var r={},o={app:0},i=[];function s(e){if(r[e])return r[e].exports;var n=r[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.m=t,s.c=r,s.d=function(t,e,n){s.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},s.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,e){if(1&e&&(t=s(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)s.d(n,r,function(e){return t[e]}.bind(null,r));return n},s.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="";var u=window["webpackJsonp"]=window["webpackJsonp"]||[],a=u.push.bind(u);u.push=e,u=u.slice();for(var c=0;c<u.length;c++)e(u[c]);var l=a;i.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"03fa":function(t,e,n){},"50ba":function(t,e,n){"use strict";var r=n("03fa"),o=n.n(r);o.a},"56d7":function(t,e,n){"use strict";n.r(e);var r=n("2b0e"),o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("main",[t._m(0),n("p",[t._v("A fully working Vue.js terminal emulator.")]),n("vue-command",{attrs:{"autocompletion-resolver":t.autocompletionResolver,"built-in":t.builtIn,commands:t.commands,executed:t.executed,history:t.history,"help-timeout":1250,prompt:t.prompt,stdin:t.stdin,"show-help":""},on:{"update:executed":function(e){t.executed=e},"update:history":function(e){t.history=e},"update:stdin":function(e){t.stdin=e}}}),t._m(1)],1)},i=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("h1",[n("a",{attrs:{href:"https://github.com/ndabAP/vue-command"}},[t._v("vue-command")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("pre",[t._v("      "),n("code",[t._v("\n$ npm i --save vue-command\n      ")]),t._v("\n    ")])}],s=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[t.isLoading||t.isError?t._e():n("span",[t._v(t._s(t.joke))]),t.isLoading&&!t.isError?n("span",[t._v("Loading ...")]):t._e(),t.isError?n("span",[t._v("There was an error getting the joke")]):t._e()])},u=[],a=n("a34a"),c=n.n(a);function l(t,e,n,r,o,i,s){try{var u=t[i](s),a=u.value}catch(c){return void n(c)}u.done?e(a):Promise.resolve(a).then(r,o)}function h(t){return function(){var e=this,n=arguments;return new Promise((function(r,o){var i=t.apply(e,n);function s(t){l(i,r,o,s,u,"next",t)}function u(t){l(i,r,o,s,u,"throw",t)}s(void 0)}))}}var p="https://api.chucknorris.io/jokes/random",f=5e3,d={inject:["terminate"],data:function(){return{abortController:new AbortController,isError:!1,isLoading:!0,joke:""}},mounted:function(){var t=h(c.a.mark((function t(){var e,n,r,o=this;return c.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return setTimeout((function(){o.isLoading&&o.abortController.abort()}),f),t.prev=1,t.next=4,fetch(p,{signal:this.abortController.signal});case 4:if(e=t.sent,e.ok){t.next=9;break}return this.setIsError(!0),this.terminate(),t.abrupt("return");case 9:return t.next=11,e.json();case 11:n=t.sent,r=n.value,this.joke=r,t.next=19;break;case 16:t.prev=16,t.t0=t["catch"](1),this.setIsError(!0);case 19:return t.prev=19,this.isLoading=!1,this.terminate(),t.finish(19);case 23:case"end":return t.stop()}}),t,this,[[1,16,19,23]])})));function e(){return t.apply(this,arguments)}return e}(),methods:{setIsError:function(t){this.isError=t}}},m=d,v=n("2877"),y=Object(v["a"])(m,s,u,!1,null,null,null),b=y.exports,g=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[t._l(t.characters,(function(e,r){return n("span",{key:r,style:{color:t.color(r)}},[t._v("\n    "+t._s(e)+"\n  ")])})),n("br"),n("br"),t._v("\n  Press Ctrl + C to leave.\n")],2)},w=[],x="ArrowUp",P="ArrowDown",I="c",O="Control",_=["#FF0000","#FF9900","#CCFF00","#33FF00","#00FF66","#00FFFF","#0066FF","#3300FF","#CC00FF","#FF0099"],k=40,j={inject:["terminate"],data:function(){return{characters:"KLIEH",index:0,interval:void 0}},mounted:function(){var t=this;this.interval=setInterval((function(){t.index++}),k),window.addEventListener("keydown",(function(e){e.key===I&&e.getModifierState(O)&&(clearInterval(t.interval),t.terminate())}),!0)},methods:{color:function(t){t+=this.index;var e=Math.floor(t/_.length)*_.length;return _[t-e]}}},S=j,F=Object(v["a"])(S,g,w,!1,null,null,null),$=F.exports,C=function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.context.parsed.help?n("span",[t._v("\n  Options: "),n("br"),t._v("\n   --timeout (default: 50)"),n("br"),t._v("\n   --amount (default: 10)\n")]):n("span",[t._v(t._s("#".repeat(t.index)))])},E=[],A={inject:["terminate"],data:function(){return{index:0}},mounted:function(){var t=this;if(this.context.parsed.help)this.terminate();else{var e=this.context.parsed.timeout||50,n=this.context.parsed.amount||10,r=function r(){return setTimeout((function(){t.index++,t.index<n?r():t.terminate()}),e)};r()}}},T=A,L=Object(v["a"])(T,C,E,!1,null,null,null),H=L.exports,B=function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.environment.isExecuting?n("div",[n("textarea",{ref:"nano",attrs:{rows:"14"},on:{keydown:function(e){return(e.type.indexOf("key")||88===e.keyCode)&&e.ctrlKey?t.terminate(e):null}}},[t._v("This is a text editor! Press Ctrl + X to leave.")])]):t._e()},M=[],D={inject:["setIsFullscreen","terminate"],created:function(){this.setIsFullscreen(!0)},mounted:function(){this.$refs.nano.focus()}},N=D,q=(n("50ba"),Object(v["a"])(N,B,M,!1,null,"59c15ed6",null)),V=q.exports,z=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{ref:"vue-command",staticClass:"vue-command",on:{keydown:[function(e){return e.type.indexOf("key")||38===e.keyCode?(e.preventDefault(),t.mutatePointerHandler(e)):null},function(e){return e.type.indexOf("key")||40===e.keyCode?(e.preventDefault(),t.mutatePointerHandler(e)):null},function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"tab",9,e.key,"Tab")?null:(e.preventDefault(),t.autocomplete(e))}],click:t.focus}},[t._t("bar",[t.hideBar?t._e():n("div",{staticClass:"term-bar"},[n("span",{staticClass:"term-title"},[t._v("\n        "+t._s(t.title)+"\n      ")])])]),n("div",{staticClass:"term",class:{"white-theme":t.whiteTheme}},[n("div",{ref:"term-std",staticClass:"term-std"},[n("div",{ref:"term-cont",staticClass:"term-cont",class:{"term-cont-fullscreen":t.local.isFullscreen}},[t.showIntro?n("div",[t._v("\n          "+t._s(t.intro)+"\n        ")]):t._e(),t._l(t.local.history,(function(e,r){return n("div",{key:r,staticClass:"term-hist",class:{"term-hist-fullscreen":t.local.isFullscreen&&r===t.local.history.length-1}},[n("stdout",{directives:[{name:"show",rawName:"v-show",value:!t.local.isFullscreen||r===t.local.history.length-1,expression:"(!local.isFullscreen || index === local.history.length - 1)"}],staticClass:"term-stdout",attrs:{component:e}}),n("stdin",{directives:[{name:"show",rawName:"v-show",value:0===r&&!t.local.isFullscreen||!(r===t.local.history.length-1&&t.local.isInProgress)&&!t.local.isFullscreen,expression:"(index === 0 && !local.isFullscreen) || !(index === local.history.length - 1 && local.isInProgress) && !local.isFullscreen"}],ref:"stdin",refInFor:!0,attrs:{bus:t.bus,cursor:t.local.cursor,"hide-prompt":t.hidePrompt,"is-fullscreen":t.local.isFullscreen,"is-in-progress":t.local.isInProgress,"is-last":r===t.local.history.length-1,prompt:t.prompt,"help-text":t.helpText,"help-timeout":t.helpTimeout,"show-help":t.showHelp,stdin:t.local.stdin,uid:t._uid},on:{"update:stdin":function(e){return t.$set(t.local,"stdin",e)},handle:t.handle},scopedSlots:t._u([{key:"prompt",fn:function(){return[t._t("prompt")]},proxy:!0}],null,!0)})],1)}))],2)])])],2)},R=[],U=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"term-stdin-container"},[t._t("prompt",[t.hidePrompt?t._e():n("span",{staticClass:"term-ps"},[t._v("\n      "+t._s(t.local.prompt)+"\n    ")])]),n("span",{staticClass:"term-stdin"},[n("input",{directives:[{name:"model",rawName:"v-model",value:t.local.stdin,expression:"local.stdin"}],ref:"input",attrs:{autofocus:t.isLast,disabled:!t.isLast||t.isInProgress,placeholder:t.placeholder,type:"text",autocorrect:"off",autocapitalize:"none"},domProps:{value:t.local.stdin},on:{click:function(e){return t.setCursor(t.$refs.input.selectionStart)},keyup:[function(e){return t.setCursor(t.$refs.input.selectionStart)},function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.handle(e)}],input:function(e){e.target.composing||t.$set(t.local,"stdin",e.target.value)}}})])],2)},J=[];function K(t,e,n,r,o,i,s){try{var u=t[i](s),a=u.value}catch(c){return void n(c)}u.done?e(a):Promise.resolve(a).then(r,o)}function W(t){return function(){var e=this,n=arguments;return new Promise((function(r,o){var i=t.apply(e,n);function s(t){K(i,r,o,s,u,"next",t)}function u(t){K(i,r,o,s,u,"throw",t)}s(void 0)}))}}var X={inject:["setCursor","setStdin"],props:{bus:{required:!0,type:Object},cursor:{default:0,required:!0,type:Number},helpText:{default:"",type:String},helpTimeout:{default:0,type:Number},hidePrompt:{default:!1,type:Boolean},isInProgress:{default:!1,required:!0,type:Boolean},isLast:{default:!1,required:!0,type:Boolean},isFullscreen:{default:!1,required:!0,type:Boolean},prompt:{default:"",type:String},showHelp:{default:!1,type:Boolean},stdin:{default:"",required:!0,type:String},uid:{required:!0,type:Number}},data:function(){return{placeholder:"",local:{prompt:"",stdin:""}}},watch:{cursor:function(){this.isLast&&this.$refs.input.setSelectionRange(this.cursor,this.cursor)},isInProgress:function(){var t=W(c.a.mark((function t(){return c.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(this.isInProgress||!this.isLast){t.next=5;break}return t.next=3,this.$nextTick();case 3:this.scrollIntoView(),this.focus();case 5:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}(),isLast:function(t,e){e&&!t&&this.blur()},stdin:function(){var t=W(c.a.mark((function t(){return c.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return this.isLast&&(this.local.stdin=this.stdin),t.next=3,this.$nextTick();case 3:this.setCursor(this.$refs.input.selectionStart);case 4:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}(),"local.stdin":function(){this.$emit("update:stdin",this.local.stdin),this.setCursor(this.$refs.input.selectionStart)}},created:function(){this.local.prompt=this.prompt,this.local.stdin=this.stdin},mounted:function(){var t=this;this.scrollIntoView(),this.focus(),setTimeout((function(){t.isLast&&t.showHelp&&t.setPlaceholder(t.helpText)}),this.helpTimeout)},methods:{handle:function(){this.setPrompt(this.prompt),this.$emit("handle",this.local.stdin),this.setPlaceholder("")},setPlaceholder:function(t){this.placeholder=t},setPrompt:function(t){this.local.prompt=t},blur:function(){this.$refs.input.blur()},focus:function(){this.$refs.input.focus()},scrollIntoView:function(){this.$refs.input.scrollIntoView()}}},G=X,Q=(n("839b"),Object(v["a"])(G,U,J,!1,null,null,null)),Y=Q.exports,Z=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n(t.component,{tag:"component"})},tt=[],et={props:{component:{required:!0,type:Object}}},nt=et,rt=(n("836c"),Object(v["a"])(nt,Z,tt,!1,null,null,null)),ot=rt.exports,it={provide:function(){return{setCursor:this.setCursor}},data:function(){return{local:{cursor:0}}},watch:{cursor:function(){this.local.cursor=this.cursor},"local.cursor":function(){this.$emit("update:cursor",this.local.cursor)}},methods:{autocomplete:function(){"function"===typeof this.autocompletionResolver&&this.autocompletionResolver()},setCursor:function(t){this.local.cursor=t}}},st=n("afab"),ut=n.n(st);function at(t,e,n,r,o,i,s){try{var u=t[i](s),a=u.value}catch(c){return void n(c)}u.done?e(a):Promise.resolve(a).then(r,o)}function ct(t){return function(){var e=this,n=arguments;return new Promise((function(r,o){var i=t.apply(e,n);function s(t){at(i,r,o,s,u,"next",t)}function u(t){at(i,r,o,s,u,"throw",t)}s(void 0)}))}}var lt=function(t){for(var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"VueCommandStdout",r=arguments.length,o=new Array(r>3?r-3:0),i=3;i<r;i++)o[i-3]=arguments[i];return{name:n,mixins:o,inject:["terminate"],mounted:function(){var t=ct(c.a.mark((function t(){return c.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,this.$nextTick();case 2:this.terminate();case 3:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}(),render:function(n){return e?n("span",{},t):n("span",{domProps:{innerHTML:t}})}}},ht=function(t){for(var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"VueCommandStderr",r=arguments.length,o=new Array(r>3?r-3:0),i=3;i<r;i++)o[i-3]=arguments[i];return{name:n,mixins:o,inject:["terminate"],mounted:function(){var t=ct(c.a.mark((function t(){return c.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,this.$nextTick();case 2:this.terminate();case 3:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}(),render:function(n){return e?n("span",{},t):n("span",{domProps:{innerHTML:t}})}}},pt=function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return{name:"VueCommandDummyStdout",mixins:e,inject:["terminate"],mounted:function(){var t=ct(c.a.mark((function t(){return c.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,this.$nextTick();case 2:this.terminate();case 3:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}(),render:function(t){return t("span",{},"")}}};function ft(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function dt(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?ft(Object(n),!0).forEach((function(e){mt(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):ft(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function mt(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function vt(t){return wt(t)||gt(t)||bt(t)||yt()}function yt(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function bt(t,e){if(t){if("string"===typeof t)return xt(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(n):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?xt(t,e):void 0}}function gt(t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}function wt(t){if(Array.isArray(t))return xt(t)}function xt(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function Pt(t,e,n,r,o,i,s){try{var u=t[i](s),a=u.value}catch(c){return void n(c)}u.done?e(a):Promise.resolve(a).then(r,o)}function It(t){return function(){var e=this,n=arguments;return new Promise((function(r,o){var i=t.apply(e,n);function s(t){Pt(i,r,o,s,u,"next",t)}function u(t){Pt(i,r,o,s,u,"throw",t)}s(void 0)}))}}var Ot={provide:function(){return{terminate:this.terminate}},methods:{handle:function(){var t=It(c.a.mark((function t(e){var n;return c.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(e=e.trim(),n=ut()(e,this.yargsOptions)._[0],void 0===this.builtIn[n]){t.next=6;break}return t.next=5,Promise.resolve(this.builtIn[n](e));case 5:return t.abrupt("return");case 6:this.execute(e);case 7:case"end":return t.stop()}}),t,this)})));function e(e){return t.apply(this,arguments)}return e}(),execute:function(){var t=It(c.a.mark((function t(e){var n,r,o,i,s;return c.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(n=ut()(e,this.yargsOptions)._[0],r=pt(),"function"!==typeof this.commands[n]){t.next=14;break}return o=ut()(e,this.yargsOptions),t.next=6,Promise.resolve(this.commands[n](o));case 6:r=t.sent,r=this.setupComponent(r,this.local.history.length,o),i=new Set(this.executed),i.delete(e),i.add(e),this.$emit("update:executed",i),t.next=16;break;case 14:""!==e&&(r=ht("".concat(e,": ").concat(this.notFound),!0)),r=this.setupComponent(r,this.local.history.length);case 16:this.setPointer(this.executed.size),s=vt(this.local.history),s.push(r),this.emitExecute(),this.setIsInProgress(!0),this.setHistory(s),this.$emit("update:history",vt(s));case 23:case"end":return t.stop()}}),t,this)})));function e(e){return t.apply(this,arguments)}return e}(),setupComponent:function(t){var e=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return t=dt({},t),hasOwnProperty.call(t,"computed")||(t.computed={}),t.computed=dt({environment:function(){return{isExecuting:e.local.isInProgress&&e.local.history.length-1===n,isFullscreen:e.local.isFullscreen,isInProgress:e.local.isInProgress}},context:function(){return{cursor:e.local.cursor,parsed:r}}},t.computed),t},terminate:function(){this.setStdin(""),this.setIsFullscreen(!1),this.$emit("executed"),this.setIsInProgress(!1)}}};function _t(t){return Ft(t)||St(t)||jt(t)||kt()}function kt(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function jt(t,e){if(t){if("string"===typeof t)return $t(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(n):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?$t(t,e):void 0}}function St(t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}function Ft(t){if(Array.isArray(t))return $t(t)}function $t(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}var Ct={provide:function(){return{setPointer:this.setPointer}},data:function(){return{local:{history:[],pointer:0}}},watch:{history:function(){this.setHistory(_t(this.history))},"local.pointer":function(){this.$emit("update:pointer",this.local.pointer)},pointer:function(){this.setPointer(this.pointer)}},methods:{mutatePointerHandler:function(t){var e=t.key;if(e===x&&this.local.pointer>0)this.local.pointer--;else{if(!(e===P&&this.local.pointer<this.executed.size-1))return;this.local.pointer++}this.local.stdin=_t(this.executed)[this.local.pointer]},setHistory:function(t){this.local.history=t},setPointer:function(t){this.local.pointer=t}}},Et={provide:function(){return{setIsFullscreen:this.setIsFullscreen,setIsInProgress:this.setIsInProgress}},data:function(){return{local:{isFullscreen:!1,isInProgress:!1}}},watch:{isFullscreen:function(){this.setIsFullscreen(this.isFullscreen)},isInProgress:function(){this.setIsInProgress(this.isInProgress)},"local.isFullscreen":function(){this.$emit("update:isFullscreen",this.local.isFullscreen)},"local.isInProgress":function(){this.$emit("update:isInProgress",this.local.isInProgress)}},methods:{setIsFullscreen:function(t){this.local.isFullscreen=t},setIsInProgress:function(t){this.local.isInProgress=t}}};function At(t){return Bt(t)||Ht(t)||Lt(t)||Tt()}function Tt(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function Lt(t,e){if(t){if("string"===typeof t)return Mt(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(n):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?Mt(t,e):void 0}}function Ht(t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}function Bt(t){if(Array.isArray(t))return Mt(t)}function Mt(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function Dt(t,e,n,r,o,i,s){try{var u=t[i](s),a=u.value}catch(c){return void n(c)}u.done?e(a):Promise.resolve(a).then(r,o)}function Nt(t){return function(){var e=this,n=arguments;return new Promise((function(r,o){var i=t.apply(e,n);function s(t){Dt(i,r,o,s,u,"next",t)}function u(t){Dt(i,r,o,s,u,"throw",t)}s(void 0)}))}}var qt=new r["a"],Vt={components:{Stdin:Y,Stdout:ot},mixins:[it,Ot,Ct,Et],provide:function(){return{emitExecute:this.emitExecute,emitExecuted:this.emitExecuted,emitInput:this.emitInput,setStdin:this.setStdin}},props:{autocompletionResolver:{default:void 0,type:Function},builtIn:{default:function(){return{}},type:Object},commands:{required:!0,type:Object},cursor:{default:0,type:Number},executed:{required:!0,type:Set},helpTimeout:{default:4e3,type:Number},hideBar:{default:!1,type:Boolean},hidePrompt:{default:!1,type:Boolean},helpText:{default:"Type help",type:String},history:{default:function(){return[]},type:Array},intro:{default:"Fasten your seatbelts!",type:String},isFullscreen:{default:!1,type:Boolean},isInProgress:{default:!1,type:Boolean},notFound:{default:"command not found",type:String},pointer:{default:0,type:Number},prompt:{default:"~neil@moon:#",type:String},showHelp:{default:!1,type:Boolean},showIntro:{default:!1,type:Boolean},stdin:{default:"",type:String},title:{default:"neil@moon: ~",type:String},whiteTheme:{default:!1,type:Boolean},yargsOptions:{default:function(){return{}},type:Object}},data:function(){return{bus:qt,local:{stdin:""},scroll:{eventListener:void 0,isBottom:!0,resizeObserver:void 0}}},watch:{stdin:function(){this.setStdin(this.stdin)},"local.stdin":function(){this.$emit("input",this.local.stdin),this.$emit("update:stdin",this.local.stdin),""===this.local.stdin&&this.setPointer(this.executed.size)}},mounted:function(){var t=this;this.scroll.resizeObserver=new ResizeObserver(function(){var e=Nt(c.a.mark((function e(n){return c.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.$nextTick();case 2:t.scroll.isBottom&&(t.$refs["term-std"].scrollTop=t.$refs["term-std"].scrollHeight);case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()),this.scroll.resizeObserver.observe(this.$refs["term-cont"]),this.scroll.eventListener=function(){var e=t.$refs["term-std"];t.scroll.isBottom=e.scrollHeight-e.scrollTop-e.clientHeight===0},this.$refs["term-std"].addEventListener("scroll",this.scroll.eventListener)},beforeDestroy:function(){this.scroll.resizeObserver.unobserve(this.$refs["term-cont"]),this.$refs["term-std"].removeEventListener("scroll",this.scroll.eventListener)},created:function(){this.setCursor(this.cursor),this.setPointer(this.pointer),this.setStdin(this.stdin),this.setIsInProgress(this.isInProgress),this.setIsFullscreen(this.isFullscreen);var t=At(this.history);0===t.length&&(t.push({name:"VueCommandDummyStdout",render:function(t){return t("span",{},"")}}),this.$emit("update:history",At(t))),this.setHistory(At(t))},methods:{emitInput:function(t){this.$emit("input",t)},emitExecute:function(){this.$emit("execute")},emitExecuted:function(){this.$emit("executed")},focus:function(){var t=this.$refs.stdin,e=t[this.local.history.length-1];e.focus()},setStdin:function(t){this.local.stdin=t}}},zt=Vt,Rt=(n("590b"),Object(v["a"])(zt,z,R,!1,null,null,null)),Ut=Rt.exports;function Jt(t){return Gt(t)||Xt(t)||Wt(t)||Kt()}function Kt(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function Wt(t,e){if(t){if("string"===typeof t)return Qt(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(n):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?Qt(t,e):void 0}}function Xt(t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}function Gt(t){if(Array.isArray(t))return Qt(t)}function Qt(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}var Yt="~neil@moon:#",Zt={components:{VueCommand:Ut},data:function(){return{autocompletionResolver:function(){},builtIn:{reverse:void 0},commands:{cd:void 0,clear:void 0,help:function(){return lt("Available programms:<br><br>\n        &nbsp;cd<br>\n        &nbsp;clear<br>\n        &nbsp;hello-world<br>\n        &nbsp;klieh<br>\n        &nbsp;loading [--timeout n] [--amount n]<br>\n        &nbsp;nano<br>\n        &nbsp;norris<br>\n        &nbsp;pokedex pokemon --color<br>\n        &nbsp;pwd<br>\n        &nbsp;reverse text<br>\n      ")},"hello-world":function(){return lt("Hello world")},klieh:function(){return $},loading:function(){return H},nano:function(){return V},norris:function(){return b},pokedex:function(t){var e=t.color,n=t._;return e&&"pikachu"===n[1]?lt("yellow"):ht("Usage: pokedex pokemon [option]<br><br>\n\n          Example: pokedex pikachu --color\n        ")},pwd:function(){return lt("/home/neil")}},executed:new Set,history:[],prompt:Yt,stdin:""}},created:function(){var t=this;this.commands.clear=function(){return t.history=[],pt()},this.commands.cd=function(e){var n=e._;return"home"!==n[1]&&"home/"!==n[1]||t.prompt!==Yt?"../"!==n[1]&&".."!==n[1]||t.prompt!=="".concat(Yt,"/home")?"."===n[1]||"undefined"===typeof n[1]?pt():ht("cd: ".concat(n[1],": No such file or directory")):(t.prompt=Yt,pt()):(t.prompt="".concat(Yt,"/home"),pt())},this.builtIn.reverse=function(e){e=e.trim();var n=e.split(" ")[1];t.stdin=n.split("").reverse().join("")},this.autocompletionResolver=function(){var e=t.stdin.split(" ");if(!(e.length>1)){var n=e[0],r=[],o=[].concat(Jt(Object.keys(t.commands)),Jt(Object.keys(t.builtIn))).sort();o.forEach((function(t){t.startsWith(n)&&r.push(t)})),""!==t.stdin&&r.length>1&&t.history.push({render:function(t){for(var e=r.length<5?r.length:4,n=r.length<5?1:Math.ceil(r.length/e),o=0,i=[],s=0;s<n;s++){for(var u=[],a=0;a<e;a++)u.push(t("td",r[o])),o++;i.push(t("tr",[u]))}return t("table",{style:{width:"100%"}},[i])}}),1===r.length&&(t.stdin=r[0])}}}},te=Zt,ee=(n("859e"),Object(v["a"])(te,o,i,!1,null,null,null)),ne=ee.exports;r["a"].config.productionTip=!1,new r["a"]({render:function(t){return t(ne)}}).$mount("#app")},"590b":function(t,e,n){"use strict";var r=n("e820"),o=n.n(r);o.a},"5ba4":function(t,e,n){},"836c":function(t,e,n){"use strict";var r=n("5ba4"),o=n.n(r);o.a},"839b":function(t,e,n){"use strict";var r=n("ff6f"),o=n.n(r);o.a},"859e":function(t,e,n){"use strict";var r=n("c308"),o=n.n(r);o.a},be69:function(t,e){function n(t){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}n.keys=function(){return[]},n.resolve=n,t.exports=n,n.id="be69"},c308:function(t,e,n){},e820:function(t,e,n){},ff6f:function(t,e,n){}});
//# sourceMappingURL=app.9be9eaf6.js.map