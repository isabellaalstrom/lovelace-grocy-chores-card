/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=window.ShadowRoot&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,e$2=Symbol();class s$3{constructor(t,s){if(s!==e$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t;}get styleSheet(){return t$1&&void 0===this.t&&(this.t=new CSSStyleSheet,this.t.replaceSync(this.cssText)),this.t}toString(){return this.cssText}}const n$3=new Map,o$3=t=>{let o=n$3.get(t);return void 0===o&&n$3.set(t,o=new s$3(t,e$2)),o},r$2=t=>o$3("string"==typeof t?t:t+""),S$1=(e,s)=>{t$1?e.adoptedStyleSheets=s.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):s.forEach((t=>{const s=document.createElement("style");s.textContent=t.cssText,e.appendChild(s);}));},u$1=t$1?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$2(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var s$2,e$1,h$2,r$1;const o$2={toAttribute(t,i){switch(i){case Boolean:t=t?"":null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,i){let s=t;switch(i){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t);}catch(t){s=null;}}return s}},n$2=(t,i)=>i!==t&&(i==i||t==t),l$2={attribute:!0,type:String,converter:o$2,reflect:!1,hasChanged:n$2};class a$2 extends HTMLElement{constructor(){super(),this.Πi=new Map,this.Πo=void 0,this.Πl=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this.Πh=null,this.u();}static addInitializer(t){var i;null!==(i=this.v)&&void 0!==i||(this.v=[]),this.v.push(t);}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((i,s)=>{const e=this.Πp(s,i);void 0!==e&&(this.Πm.set(e,s),t.push(e));})),t}static createProperty(t,i=l$2){if(i.state&&(i.attribute=!1),this.finalize(),this.elementProperties.set(t,i),!i.noAccessor&&!this.prototype.hasOwnProperty(t)){const s="symbol"==typeof t?Symbol():"__"+t,e=this.getPropertyDescriptor(t,s,i);void 0!==e&&Object.defineProperty(this.prototype,t,e);}}static getPropertyDescriptor(t,i,s){return {get(){return this[i]},set(e){const h=this[t];this[i]=e,this.requestUpdate(t,h,s);},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||l$2}static finalize(){if(this.hasOwnProperty("finalized"))return !1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),this.elementProperties=new Map(t.elementProperties),this.Πm=new Map,this.hasOwnProperty("properties")){const t=this.properties,i=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const s of i)this.createProperty(s,t[s]);}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(i){const s=[];if(Array.isArray(i)){const e=new Set(i.flat(1/0).reverse());for(const i of e)s.unshift(u$1(i));}else void 0!==i&&s.push(u$1(i));return s}static Πp(t,i){const s=i.attribute;return !1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}u(){var t;this.Πg=new Promise((t=>this.enableUpdating=t)),this.L=new Map,this.Π_(),this.requestUpdate(),null===(t=this.constructor.v)||void 0===t||t.forEach((t=>t(this)));}addController(t){var i,s;(null!==(i=this.ΠU)&&void 0!==i?i:this.ΠU=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(s=t.hostConnected)||void 0===s||s.call(t));}removeController(t){var i;null===(i=this.ΠU)||void 0===i||i.splice(this.ΠU.indexOf(t)>>>0,1);}Π_(){this.constructor.elementProperties.forEach(((t,i)=>{this.hasOwnProperty(i)&&(this.Πi.set(i,this[i]),delete this[i]);}));}createRenderRoot(){var t;const s=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return S$1(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this.ΠU)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostConnected)||void 0===i?void 0:i.call(t)})),this.Πl&&(this.Πl(),this.Πo=this.Πl=void 0);}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this.ΠU)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostDisconnected)||void 0===i?void 0:i.call(t)})),this.Πo=new Promise((t=>this.Πl=t));}attributeChangedCallback(t,i,s){this.K(t,s);}Πj(t,i,s=l$2){var e,h;const r=this.constructor.Πp(t,s);if(void 0!==r&&!0===s.reflect){const n=(null!==(h=null===(e=s.converter)||void 0===e?void 0:e.toAttribute)&&void 0!==h?h:o$2.toAttribute)(i,s.type);this.Πh=t,null==n?this.removeAttribute(r):this.setAttribute(r,n),this.Πh=null;}}K(t,i){var s,e,h;const r=this.constructor,n=r.Πm.get(t);if(void 0!==n&&this.Πh!==n){const t=r.getPropertyOptions(n),l=t.converter,a=null!==(h=null!==(e=null===(s=l)||void 0===s?void 0:s.fromAttribute)&&void 0!==e?e:"function"==typeof l?l:null)&&void 0!==h?h:o$2.fromAttribute;this.Πh=n,this[n]=a(i,t.type),this.Πh=null;}}requestUpdate(t,i,s){let e=!0;void 0!==t&&(((s=s||this.constructor.getPropertyOptions(t)).hasChanged||n$2)(this[t],i)?(this.L.has(t)||this.L.set(t,i),!0===s.reflect&&this.Πh!==t&&(void 0===this.Πk&&(this.Πk=new Map),this.Πk.set(t,s))):e=!1),!this.isUpdatePending&&e&&(this.Πg=this.Πq());}async Πq(){this.isUpdatePending=!0;try{for(await this.Πg;this.Πo;)await this.Πo;}catch(t){Promise.reject(t);}const t=this.performUpdate();return null!=t&&await t,!this.isUpdatePending}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this.Πi&&(this.Πi.forEach(((t,i)=>this[i]=t)),this.Πi=void 0);let i=!1;const s=this.L;try{i=this.shouldUpdate(s),i?(this.willUpdate(s),null===(t=this.ΠU)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostUpdate)||void 0===i?void 0:i.call(t)})),this.update(s)):this.Π$();}catch(t){throw i=!1,this.Π$(),t}i&&this.E(s);}willUpdate(t){}E(t){var i;null===(i=this.ΠU)||void 0===i||i.forEach((t=>{var i;return null===(i=t.hostUpdated)||void 0===i?void 0:i.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t);}Π$(){this.L=new Map,this.isUpdatePending=!1;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this.Πg}shouldUpdate(t){return !0}update(t){void 0!==this.Πk&&(this.Πk.forEach(((t,i)=>this.Πj(i,this[i],t))),this.Πk=void 0),this.Π$();}updated(t){}firstUpdated(t){}}a$2.finalized=!0,a$2.elementProperties=new Map,a$2.elementStyles=[],a$2.shadowRootOptions={mode:"open"},null===(e$1=(s$2=globalThis).reactiveElementPlatformSupport)||void 0===e$1||e$1.call(s$2,{ReactiveElement:a$2}),(null!==(h$2=(r$1=globalThis).reactiveElementVersions)&&void 0!==h$2?h$2:r$1.reactiveElementVersions=[]).push("1.0.0-rc.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t,i$1,s$1,e;const o$1=globalThis.trustedTypes,l$1=o$1?o$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,n$1=`lit$${(Math.random()+"").slice(9)}$`,h$1="?"+n$1,r=`<${h$1}>`,u=document,c=(t="")=>u.createComment(t),d=t=>null===t||"object"!=typeof t&&"function"!=typeof t,v=Array.isArray,a$1=t=>{var i;return v(t)||"function"==typeof(null===(i=t)||void 0===i?void 0:i[Symbol.iterator])},f=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=/>|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g,$=/'/g,g=/"/g,y=/^(?:script|style|textarea)$/i,b=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),T=b(1),w=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),P=new WeakMap,V=(t,i,s)=>{var e,o;const l=null!==(e=null==s?void 0:s.renderBefore)&&void 0!==e?e:i;let n=l._$litPart$;if(void 0===n){const t=null!==(o=null==s?void 0:s.renderBefore)&&void 0!==o?o:null;l._$litPart$=n=new C(i.insertBefore(c(),t),t,void 0,s);}return n.I(t),n},E=u.createTreeWalker(u,129,null,!1),M=(t,i)=>{const s=t.length-1,e=[];let o,h=2===i?"<svg>":"",u=f;for(let i=0;i<s;i++){const s=t[i];let l,c,d=-1,v=0;for(;v<s.length&&(u.lastIndex=v,c=u.exec(s),null!==c);)v=u.lastIndex,u===f?"!--"===c[1]?u=_:void 0!==c[1]?u=m:void 0!==c[2]?(y.test(c[2])&&(o=RegExp("</"+c[2],"g")),u=p):void 0!==c[3]&&(u=p):u===p?">"===c[0]?(u=null!=o?o:f,d=-1):void 0===c[1]?d=-2:(d=u.lastIndex-c[2].length,l=c[1],u=void 0===c[3]?p:'"'===c[3]?g:$):u===g||u===$?u=p:u===_||u===m?u=f:(u=p,o=void 0);const a=u===p&&t[i+1].startsWith("/>")?" ":"";h+=u===f?s+r:d>=0?(e.push(l),s.slice(0,d)+"$lit$"+s.slice(d)+n$1+a):s+n$1+(-2===d?(e.push(void 0),i):a);}const c=h+(t[s]||"<?>")+(2===i?"</svg>":"");return [void 0!==l$1?l$1.createHTML(c):c,e]};class N{constructor({strings:t,_$litType$:i},s){let e;this.parts=[];let l=0,r=0;const u=t.length-1,d=this.parts,[v,a]=M(t,i);if(this.el=N.createElement(v,s),E.currentNode=this.el.content,2===i){const t=this.el.content,i=t.firstChild;i.remove(),t.append(...i.childNodes);}for(;null!==(e=E.nextNode())&&d.length<u;){if(1===e.nodeType){if(e.hasAttributes()){const t=[];for(const i of e.getAttributeNames())if(i.endsWith("$lit$")||i.startsWith(n$1)){const s=a[r++];if(t.push(i),void 0!==s){const t=e.getAttribute(s.toLowerCase()+"$lit$").split(n$1),i=/([.?@])?(.*)/.exec(s);d.push({type:1,index:l,name:i[2],strings:t,ctor:"."===i[1]?I:"?"===i[1]?L:"@"===i[1]?R:H});}else d.push({type:6,index:l});}for(const i of t)e.removeAttribute(i);}if(y.test(e.tagName)){const t=e.textContent.split(n$1),i=t.length-1;if(i>0){e.textContent=o$1?o$1.emptyScript:"";for(let s=0;s<i;s++)e.append(t[s],c()),E.nextNode(),d.push({type:2,index:++l});e.append(t[i],c());}}}else if(8===e.nodeType)if(e.data===h$1)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=e.data.indexOf(n$1,t+1));)d.push({type:7,index:l}),t+=n$1.length-1;}l++;}}static createElement(t,i){const s=u.createElement("template");return s.innerHTML=t,s}}function S(t,i,s=t,e){var o,l,n,h;if(i===w)return i;let r=void 0!==e?null===(o=s.Σi)||void 0===o?void 0:o[e]:s.Σo;const u=d(i)?void 0:i._$litDirective$;return (null==r?void 0:r.constructor)!==u&&(null===(l=null==r?void 0:r.O)||void 0===l||l.call(r,!1),void 0===u?r=void 0:(r=new u(t),r.T(t,s,e)),void 0!==e?(null!==(n=(h=s).Σi)&&void 0!==n?n:h.Σi=[])[e]=r:s.Σo=r),void 0!==r&&(i=S(t,r.S(t,i.values),r,e)),i}class k{constructor(t,i){this.l=[],this.N=void 0,this.D=t,this.M=i;}u(t){var i;const{el:{content:s},parts:e}=this.D,o=(null!==(i=null==t?void 0:t.creationScope)&&void 0!==i?i:u).importNode(s,!0);E.currentNode=o;let l=E.nextNode(),n=0,h=0,r=e[0];for(;void 0!==r;){if(n===r.index){let i;2===r.type?i=new C(l,l.nextSibling,this,t):1===r.type?i=new r.ctor(l,r.name,r.strings,this,t):6===r.type&&(i=new z(l,this,t)),this.l.push(i),r=e[++h];}n!==(null==r?void 0:r.index)&&(l=E.nextNode(),n++);}return o}v(t){let i=0;for(const s of this.l)void 0!==s&&(void 0!==s.strings?(s.I(t,s,i),i+=s.strings.length-2):s.I(t[i])),i++;}}class C{constructor(t,i,s,e){this.type=2,this.N=void 0,this.A=t,this.B=i,this.M=s,this.options=e;}setConnected(t){var i;null===(i=this.P)||void 0===i||i.call(this,t);}get parentNode(){return this.A.parentNode}get startNode(){return this.A}get endNode(){return this.B}I(t,i=this){t=S(this,t,i),d(t)?t===A||null==t||""===t?(this.H!==A&&this.R(),this.H=A):t!==this.H&&t!==w&&this.m(t):void 0!==t._$litType$?this._(t):void 0!==t.nodeType?this.$(t):a$1(t)?this.g(t):this.m(t);}k(t,i=this.B){return this.A.parentNode.insertBefore(t,i)}$(t){this.H!==t&&(this.R(),this.H=this.k(t));}m(t){const i=this.A.nextSibling;null!==i&&3===i.nodeType&&(null===this.B?null===i.nextSibling:i===this.B.previousSibling)?i.data=t:this.$(u.createTextNode(t)),this.H=t;}_(t){var i;const{values:s,_$litType$:e}=t,o="number"==typeof e?this.C(t):(void 0===e.el&&(e.el=N.createElement(e.h,this.options)),e);if((null===(i=this.H)||void 0===i?void 0:i.D)===o)this.H.v(s);else {const t=new k(o,this),i=t.u(this.options);t.v(s),this.$(i),this.H=t;}}C(t){let i=P.get(t.strings);return void 0===i&&P.set(t.strings,i=new N(t)),i}g(t){v(this.H)||(this.H=[],this.R());const i=this.H;let s,e=0;for(const o of t)e===i.length?i.push(s=new C(this.k(c()),this.k(c()),this,this.options)):s=i[e],s.I(o),e++;e<i.length&&(this.R(s&&s.B.nextSibling,e),i.length=e);}R(t=this.A.nextSibling,i){var s;for(null===(s=this.P)||void 0===s||s.call(this,!1,!0,i);t&&t!==this.B;){const i=t.nextSibling;t.remove(),t=i;}}}class H{constructor(t,i,s,e,o){this.type=1,this.H=A,this.N=void 0,this.V=void 0,this.element=t,this.name=i,this.M=e,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this.H=Array(s.length-1).fill(A),this.strings=s):this.H=A;}get tagName(){return this.element.tagName}I(t,i=this,s,e){const o=this.strings;let l=!1;if(void 0===o)t=S(this,t,i,0),l=!d(t)||t!==this.H&&t!==w,l&&(this.H=t);else {const e=t;let n,h;for(t=o[0],n=0;n<o.length-1;n++)h=S(this,e[s+n],i,n),h===w&&(h=this.H[n]),l||(l=!d(h)||h!==this.H[n]),h===A?t=A:t!==A&&(t+=(null!=h?h:"")+o[n+1]),this.H[n]=h;}l&&!e&&this.W(t);}W(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"");}}class I extends H{constructor(){super(...arguments),this.type=3;}W(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}W(t){t&&t!==A?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name);}}class R extends H{constructor(){super(...arguments),this.type=5;}I(t,i=this){var s;if((t=null!==(s=S(this,t,i,0))&&void 0!==s?s:A)===w)return;const e=this.H,o=t===A&&e!==A||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,l=t!==A&&(e===A||o);o&&this.element.removeEventListener(this.name,this,e),l&&this.element.addEventListener(this.name,this,t),this.H=t;}handleEvent(t){var i,s;"function"==typeof this.H?this.H.call(null!==(s=null===(i=this.options)||void 0===i?void 0:i.host)&&void 0!==s?s:this.element,t):this.H.handleEvent(t);}}class z{constructor(t,i,s){this.element=t,this.type=6,this.N=void 0,this.V=void 0,this.M=i,this.options=s;}I(t){S(this,t);}}null===(i$1=(t=globalThis).litHtmlPlatformSupport)||void 0===i$1||i$1.call(t,N,C),(null!==(s$1=(e=globalThis).litHtmlVersions)&&void 0!==s$1?s$1:e.litHtmlVersions=[]).push("2.0.0-rc.3");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var i,l,o,s,n,a;(null!==(i=(a=globalThis).litElementVersions)&&void 0!==i?i:a.litElementVersions=[]).push("3.0.0-rc.2");class h extends a$2{constructor(){super(...arguments),this.renderOptions={host:this},this.Φt=void 0;}createRenderRoot(){var t,e;const r=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=r.firstChild),r}update(t){const r=this.render();super.update(t),this.Φt=V(r,this.renderRoot,this.renderOptions);}connectedCallback(){var t;super.connectedCallback(),null===(t=this.Φt)||void 0===t||t.setConnected(!0);}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this.Φt)||void 0===t||t.setConnected(!1);}render(){return w}}h.finalized=!0,h._$litElement$=!0,null===(o=(l=globalThis).litElementHydrateSupport)||void 0===o||o.call(l,{LitElement:h}),null===(n=(s=globalThis).litElementPlatformSupport)||void 0===n||n.call(s,{LitElement:h});

class GrocyChoresCard extends h {
    static getConfigElement() {
      return document.createElement("content-card-editor");
    }
  
    static getStubConfig() {
      return { entity: "sensor.grocy_chores", title: null, show_quantity: null, show_days: null, show_assigned: true, show_last_tracked: true, show_last_tracked_by: true, show_track_button: true }
    }

    setConfig(config) {
      if (!config.entity) {
        throw new Error('Please define entity');
      }
      this.config = config;
    }
    
    calculateDueDate(dueDate){
      var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
      var today = new Date();
      today.setHours(0,0,0,0);

      var splitDate = dueDate.split(/[- :T]/);
      var parsedDueDate = new Date(splitDate[0], splitDate[1]-1, splitDate[2]);
      parsedDueDate.setHours(0,0,0,0);
      
      var dueInDays;
      if(today > parsedDueDate) {
        dueInDays = -1;
      }
      else
        dueInDays = Math.round(Math.abs((today.getTime() - parsedDueDate.getTime())/(oneDay)));

      return dueInDays;
    }

    checkDueClass(dueInDays) {
      if (dueInDays == 0)
        return "due-today";
      else if (dueInDays < 0)
        return "overdue";
      else
        return "not-due";
    }

    formatDueDate(dueDate, dueInDays) {
      if (dueInDays < 0)
        return this.translate("Overdue");
      else if (dueInDays == 0)
        return this.translate("Today");
      else
        return dueDate.substr(0, 10);
    }

    translate(string) {
      if((this.config.custom_translation != null) &&
          (this.config.custom_translation[string] != null))
          {
             return this.config.custom_translation[string];
          }
      return string;
    }
  
    render(){
      if (!this.entities)
      {
        return T`
        <hui-warning>
          ${this._hass.localize("ui.panel.lovelace.warning.entity_not_found",
            "entity",
            this.config.entity
          )}
        </hui-warning>
        `
      }

      if(this.items == undefined)
      {
        this.items = [];
        this.notShowing = [];
      }

      if(this.items.length < 1 && this.show_empty == false)
      {
        return "";
      }

      return T
      `
        ${this._renderStyle()}
        ${T
          `<ha-card>
            <h1 class="card-header flex">
              <div class="name">
                ${this.header}
              </div>
              ${this.show_create_task ? T
                `<mwc-button class="hide-button" @click=${ev => this._toggleAddTask()}><ha-icon icon="mdi:chevron-down"></ha-icon> Add task</mwc-button>`
              : ""}
            </h1>
            ${this.show_create_task ? T
              `
                <div style="display: none;" id="add-task-row" class="add-row">
                  <mwc-button @click=${ev => this._addTask()}><ha-icon class="add-icon" icon="mdi:plus"></ha-icon></mwc-button>
                  <paper-input
                    id="add-task"
                    class="add-input"
                    no-label-float
                    placeholder=${this.translate("Add task")}>
                  </paper-input>
                  <paper-input
                    id="add-date"
                    class="add-input"
                    no-label-float
                    placeholder=${this.translate("Optional due date/time")}
                    value="${this._formatDate()}">
                  </paper-input>
                </div>
              `
            : ""}
            <div class="card-content">
              ${this.items.length > 0 ? T`
                ${this.items.map(item =>
                  T`
                  <div class="info flex">
                    <div>
                      ${item._filtered_name != null ? item._filtered_name : item.name}
                      <div class="secondary">
                        ${this.translate("Due")}: <span class="${item.next_estimated_execution_time != null ? this.checkDueClass(item.dueInDays) : ""}">${item.next_estimated_execution_time != null ? this.formatDueDate(item.next_estimated_execution_time, item.dueInDays) : "-"}</span>
                      </div>
                      ${this.show_assigned == true && item.next_execution_assigned_user != null ? T
                        `
                        <div class="secondary">
                            ${this.translate("Assigned to")}: ${item.next_execution_assigned_user.display_name}
                        </div>
                        `
                      : ""}
                      ${this.show_last_tracked == true ? T
                      `
                        ${item.type == "chore" ? T
                        `
                          <div class="secondary">
                          ${this.translate("Last tracked")}: ${item.last_tracked_time != null ? item.last_tracked_time.substr(0, 10) : "-"}
                          ${this.show_last_tracked_by == true && item.last_done_by != null ? this.translate("by") + " " + item.last_done_by.display_name : ""}
                          </div>
                        `
                        : ""
                        }

                      `
                      : ""}
                    </div>
                    ${this.show_track_button == true ? T
                    `
                      ${item.type == "chore" ? T
                      `
                      <div>
                        <mwc-button @click=${ev => this._trackChore(item.id)}>${this.translate("Track")}</mwc-button>
                      </div>     
                      `
                      : T
                      `
                      <div>
                        <mwc-button @click=${ev => this._trackTask(item.id)}>${this.translate("Track")}</mwc-button>
                      </div>
                      `}
                    `
                    : ""}

                  </div>`
              )}` : T`<div class="info flex">${this.translate("No todos")}!</div>`}
            </div>
            ${this.notShowing.length > 0 && this.notShowing.length != null ? T
              `
              <div class="secondary not-showing">
              ${this.translate("Look in Grocy for {number} more items").replace("{number}", this.notShowing.length)}
              </div>
              `
              : ""}
          </ha-card>`}
      `;
    } 

    _formatDate(){
      var currentdate = new Date();
      var year = currentdate.getFullYear();
      var month = ("0" + (currentdate.getMonth() + 1)).slice(-2);
      var date = ("0" + (currentdate.getDate() + 1)).slice(-2);
      var hour = ("0" + (currentdate.getHours() + 1)).slice(-2);
      if(hour == "24")
        hour = "00";
      var minutes = ("0" + (currentdate.getMinutes() + 1)).slice(-2);

      var datetime = year + "-" + month + "-" + date + " "
                + hour + ":" + minutes;
      return datetime;
    }

    _trackChore(choreId){
      this._hass.callService("grocy", "execute_chore", {
        chore_id: choreId,
        done_by: this.userId
      });
    }

    _trackTask(taskId){
      this._hass.callService("grocy", "complete_task", {
        task_id: taskId
      });
    }

    _toggleAddTask(){
      console.log("toggling");
      var x = this.shadowRoot.getElementById("add-task-row");
      if (x.style.display === "none") {
        x.style.display = "flex";
      } else {
        x.style.display = "none";
      }
    }

    _addTask(){
      var taskName = this.shadowRoot.getElementById('add-task').value;
      var taskDueDate = this.shadowRoot.getElementById('add-date').value;
      if(taskName == null || taskName == "")
      {
        alert(this.translate("'Name' can't be empty"));
      }
      else if(taskDueDate == null) {
        this._hass.callService("grocy", "add_generic", {
          entity_type: "tasks",
          data: { "name": taskName }
        });
        console.log("Adding task: " + taskName);
      }
      else {
        this._hass.callService("grocy", "add_generic", {
          entity_type: "tasks",
          data: { "name": taskName, "due_date": taskDueDate }
        });
        console.log("Adding task: " + taskName + ", due: " + taskDueDate);
      }
    }

    _renderStyle() {
        return T
        `
          <style>
            .info {
              padding-bottom: 1em;
            }
            .flex {
              display: flex;
              justify-content: space-between;
            }
            .overdue {
              color: red !important;
            }
            .due-today {
              color: orange !important;
            }
            .not-showing {
              margin-top: -16px;
              margin-left: 16px;
              padding-bottom: 16px;
            }
            .secondary {
              display: block;
              color: #8c96a5;
            }
            .add-row {
              margin-top: -16px;
              padding-bottom: 16px;
              display: flex;
              flex-direction: row;
              align-items: center;
              width: 100%;
            }
            .add-input {
              padding-right: 16px;
              width: 100%;
            }
            .hide-button {
              padding: 0 0 16px 16px;
            }
          </style>
        `;
      }

      _configSetup(){
        this.userId = this.config.user_id == null ? 1 : this.config.user_id;
        this.filter = this.config.filter == null ? null : this.config.filter;
        this.filter_user = this.config.filter_user == null ? null : this.config.filter_user;
        this.remove_filter = this.config.remove_filter == null ? false : this.config.remove_filter;
        this.show_quantity = this.config.show_quantity == null || this.config.show_quantity == 0 || this.config.show_quantity == '' ? null : this.config.show_quantity;
        this.show_days = this.config.show_days === null || this.config.show_days === '' ? null : this.config.show_days;
        this.show_assigned = this.config.show_assigned == null ? true : this.config.show_assigned;
        this.show_track_button = this.config.show_track_button == null ? true : this.config.show_track_button;
        this.show_last_tracked = this.config.show_last_tracked == null ? true : this.config.show_last_tracked;
        this.show_last_tracked_by = this.config.show_last_tracked_by == null ? true : this.config.show_last_tracked_by;
        this.filter_category = this.config.filter_category == null ? null : this.config.filter_category;
        this.show_category = this.config.show_category == null ? true : this.config.show_category;
        this.show_description = this.config.show_description == null ? true : this.config.show_description;
        this.show_empty = this.config.show_empty == null ? true : this.config.show_empty;
        this.show_create_task = this.config.show_create_task == null ? false : this.config.show_create_task;
      }

    set hass(hass) {
      this._hass = hass;
      this.entities = new Array();
      if(Array.isArray(this.config.entity))
      {      
        for (var i = 0; i < this.config.entity.length; ++i) {
          this.entities[i] = this.config.entity[i] in hass.states ? hass.states[this.config.entity[i]] : null;
        }
      }
      else {
        this.entities[0] = this.config.entity in hass.states ? hass.states[this.config.entity] : null;
      }

      this.header = this.config.title == null ? "Todo" : this.config.title;
      
      this._configSetup();

      if (this.entities) {
        var allItems = [];
        var finalItemsList = [];

        for (var i = 0; i < this.entities.length; ++i) {
          var items;
          if (this.entities[i].state == 'unknown')
          {
            console.warn("The Grocy sensor " + this.entities[i].entity_id + " is unknown.");
          }
          else {
            if (this.entities[i].attributes.chores != undefined || this.entities[i].attributes.chores != null) {
              items = this.entities[i].attributes.chores;
              if(items != undefined)
                items.map(item =>{
                  item.type = "chore";
                });
            }
            else {
              items = this.entities[i].attributes.tasks;
              if(items != undefined)
              {
                items.map(item =>{
                  item.type = "task";
                });
              }
            }
            if (items != null){
              if (this.filter != null) {
                var filteredItems = [];
                for (let i = 0; i < items.length; i++) {
                  if (items[i].name.includes(this.filter)) {
                    if (this.remove_filter) {
                      items[i]._filtered_name = items[i].name.replace(this.filter, '');
                    }
                    filteredItems.push(items[i]);
                  }
                }
                items = filteredItems;
              }
      
              if (this.filter_user != null) {
                var filteredItems = [];
                for (let i = 0; i < items.length; i++) {
                  if (items[i].next_execution_assigned_user != null && items[i].next_execution_assigned_user.id == this.filter_user) {
                    filteredItems.push(items[i]);
                  }
                }
                items = filteredItems;
              }

              allItems.push(items);
            }
          }
        }
        if(allItems.length > 0)
        {
          allItems = allItems[0].concat(allItems[1]);
          allItems = allItems.filter(function(x) {
            return x !== undefined;
          });
          allItems.map(item =>{
            if(item.next_estimated_execution_time == null && item.due_date != null)
            {
              item.next_estimated_execution_time = item.due_date;
            }
          });

          allItems.sort(function(a,b){
            if (a.next_estimated_execution_time == null || a.next_estimated_execution_time == undefined || a.next_estimated_execution_time == "-")
            {
              return -1;
            }
            if (b.next_estimated_execution_time == null || b.next_estimated_execution_time == undefined || b.next_estimated_execution_time == "-")
            {
              return 1;
            }
            if (a.next_estimated_execution_time != null && b.next_estimated_execution_time != null) {
              var aSplitDate = a.next_estimated_execution_time.split(/[- :T]/);
              var bSplitDate = b.next_estimated_execution_time.split(/[- :T]/);
    
              var aParsedDueDate = new Date(aSplitDate[0], aSplitDate[1]-1, aSplitDate[2]);
              var bParsedDueDate = new Date(bSplitDate[0], bSplitDate[1]-1, bSplitDate[2]);
    
              return aParsedDueDate - bParsedDueDate;
            }
            return 0;
          });
          
          allItems.map(item =>{
            var dueInDays = item.next_estimated_execution_time ? this.calculateDueDate(item.next_estimated_execution_time) : 10000;
            item.dueInDays = dueInDays;
            if(this.show_days != null) {
              if(dueInDays <= this.show_days){
                finalItemsList.push(item);
              }
              else if(item.next_estimated_execution_time != null && item.next_estimated_execution_time.slice(0,4) == "2999") {
                item.next_estimated_execution_time = "-";
                finalItemsList.unshift(item);
              }
            }
            else {
              if(item.next_estimated_execution_time == null || dueInDays == 10000 || item.next_estimated_execution_time.slice(0,4) == "2999"){
                item.next_estimated_execution_time = "-";
                finalItemsList.unshift(item);
              }
              else
              finalItemsList.push(item);
            }
          });
          
          if(this.show_quantity != null) {
            this.items = finalItemsList.slice(0, this.show_quantity);
            this.notShowing = finalItemsList.slice(this.show_quantity);
          }
          else {
            this.items = finalItemsList;
            this.notShowing = 0;
          }
        }
      }
      this.requestUpdate();
    }
    
    // @TODO: This requires more intelligent logic
    getCardSize() {
      return 3;
    }
  }
      
  // Configure the preview in the Lovelace card picker
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: 'grocy-chores-card',
    name: 'Grocy Chores and Tasks Card',
    preview: false,
    description: 'A card used to display chores and/or tasks from the Grocy custom component.',
  });
  
  customElements.define('grocy-chores-card', GrocyChoresCard);
