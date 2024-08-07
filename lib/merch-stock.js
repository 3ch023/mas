// branch: MWPW-153962 commit: 599a9d43ff77a943a7051ccf9dc91d0a99272e4e Mon, 08 Jul 2024 12:53:33 GMT
import{LitElement as a,css as h,html as i}from"/libs/deps/lit-all.min.js";var o="merch-stock:change";var t=class{constructor(e,r){this.key=Symbol("match-media-key"),this.matches=!1,this.host=e,this.host.addController(this),this.media=window.matchMedia(r),this.matches=this.media.matches,this.onChange=this.onChange.bind(this),e.addController(this)}hostConnected(){var e;(e=this.media)==null||e.addEventListener("change",this.onChange)}hostDisconnected(){var e;(e=this.media)==null||e.removeEventListener("change",this.onChange)}onChange(e){this.matches!==e.matches&&(this.matches=e.matches,this.host.requestUpdate(this.key,!this.matches))}};var n="(max-width: 767px)";var s=class extends a{static styles=[h`
            ::slotted(div) {
                display: none;
            }

            :host(:not([plan-type])) {
                display: none;
            }

            :host([plan-type='ABM']) ::slotted([data-plan-type='ABM']),
            :host([plan-type='M2M']) ::slotted([data-plan-type='M2M']),
            :host([plan-type='PUF']) ::slotted([data-plan-type='PUF']) {
                display: block;
            }

            sp-checkbox {
                margin: 0;
                font-size: 12px;
                line-height: 15px;
            }
        `];static properties={checked:{type:Boolean,attribute:"checked",reflect:!0},planType:{type:String,attribute:"plan-type",reflect:!0}};checked=!1;#e=new t(this,n);constructor(){super()}handleChange(e){this.checked=e.target.checked,this.dispatchEvent(new CustomEvent(o,{detail:{checked:e.target.checked,planType:this.planType},bubbles:!0}))}connectedCallback(){this.style.setProperty("--mod-checkbox-font-size","12px"),super.connectedCallback(),this.updateComplete.then(()=>{this.querySelectorAll('[is="inline-price"]').forEach(async e=>{await e.onceSettled(),e.parentElement.setAttribute("data-plan-type",e.value[0].planType)})})}render(){if(this.planType&&!this.#e.matches)return i`
            <sp-checkbox
                size="s"
                @change=${this.handleChange}
                ?checked=${this.checked}
            >
                <slot></slot>
            </sp-checkbox>
        `}get osi(){if(this.checked)return this.querySelector(`div[data-plan-type="${this.planType}"] [is="inline-price"]`)?.value?.[0].offerSelectorIds[0]}};window.customElements.define("merch-stock",s);export{s as MerchStock};
//# sourceMappingURL=merch-stock.js.map
