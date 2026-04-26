import { _ as __nuxt_component_0 } from './nuxt-link-CnvsOL_4.mjs';
import { defineComponent, watch, ref, mergeProps, withCtx, unref, createVNode, toDisplayString, createTextVNode, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import script$1 from './index-C99R0uVU.mjs';
import script$2 from './index-DdvNWG8M.mjs';
import { u as useSupabaseUser, n as navigateTo, s as script$d } from './server.mjs';
import script from './index-CraArxmM.mjs';
import { u as useSeoMeta } from './composables-CsCDbOcR.mjs';
import { u as useSupabaseClient } from './useSupabaseClient-CkLFOMIR.mjs';
import { u as useSiteConfig } from './useSiteConfig-2EOf2j81.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@primevue/core/base/style';
import '@primevue/core/basecomponent/style';
import '@primeuix/styles/autocomplete';
import '@primeuix/utils/object';
import '@primeuix/styles/cascadeselect';
import '@primeuix/styles/checkbox';
import '@primeuix/styles/checkboxgroup';
import '@primeuix/styles/colorpicker';
import '@primeuix/styles/datepicker';
import '@primeuix/styles/floatlabel';
import '@primeuix/styles/iconfield';
import '@primeuix/styles/iftalabel';
import '@primeuix/styles/inputchips';
import '@primeuix/styles/inputgroup';
import '@primeuix/styles/inputnumber';
import '@primeuix/styles/inputotp';
import '@primeuix/styles/inputtext';
import '@primeuix/styles/knob';
import '@primeuix/styles/listbox';
import '@primeuix/styles/multiselect';
import '@primeuix/styles/password';
import '@primeuix/styles/radiobutton';
import '@primeuix/styles/radiobuttongroup';
import '@primeuix/styles/rating';
import '@primeuix/styles/select';
import '@primeuix/styles/selectbutton';
import '@primeuix/styles/slider';
import '@primeuix/styles/textarea';
import '@primeuix/styles/togglebutton';
import '@primeuix/styles/toggleswitch';
import '@primeuix/styles/treeselect';
import '@primeuix/styles/button';
import '@primeuix/styles/buttongroup';
import '@primeuix/styles/speeddial';
import '@primeuix/styles/splitbutton';
import '@primeuix/styles/datatable';
import '@primeuix/styles/dataview';
import '@primeuix/styles/orderlist';
import '@primeuix/styles/organizationchart';
import '@primeuix/styles/paginator';
import '@primeuix/styles/picklist';
import '@primeuix/styles/tree';
import '@primeuix/styles/treetable';
import '@primeuix/styles/timeline';
import '@primeuix/styles/virtualscroller';
import '@primeuix/styles/accordion';
import '@primeuix/styles/card';
import '@primeuix/styles/divider';
import '@primeuix/styles/fieldset';
import '@primeuix/styles/panel';
import '@primeuix/styles/scrollpanel';
import '@primeuix/styles/splitter';
import '@primeuix/styles/stepper';
import '@primeuix/styles/tabview';
import '@primeuix/styles/tabs';
import '@primeuix/styles/toolbar';
import '@primeuix/styles/confirmdialog';
import '@primeuix/styles/confirmpopup';
import '@primeuix/styles/dialog';
import '@primeuix/styles/drawer';
import '@primeuix/styles/popover';
import '@primeuix/styles/fileupload';
import '@primeuix/styles/breadcrumb';
import '@primeuix/styles/contextmenu';
import '@primeuix/styles/dock';
import '@primeuix/styles/menu';
import '@primeuix/styles/menubar';
import '@primeuix/styles/megamenu';
import '@primeuix/styles/panelmenu';
import '@primeuix/styles/steps';
import '@primeuix/styles/tabmenu';
import '@primeuix/styles/tieredmenu';
import '@primeuix/styles/message';
import '@primeuix/styles/inlinemessage';
import '@primeuix/styles/toast';
import '@primeuix/styles/carousel';
import '@primeuix/styles/galleria';
import '@primeuix/styles/image';
import '@primeuix/styles/imagecompare';
import '@primeuix/styles/avatar';
import '@primeuix/styles/badge';
import '@primeuix/styles/blockui';
import '@primeuix/styles/chip';
import '@primeuix/styles/inplace';
import '@primeuix/styles/metergroup';
import '@primeuix/styles/overlaybadge';
import '@primeuix/styles/scrolltop';
import '@primeuix/styles/skeleton';
import '@primeuix/styles/progressbar';
import '@primeuix/styles/progressspinner';
import '@primeuix/styles/tag';
import '@primeuix/styles/terminal';
import '@primevue/forms/form/style';
import '@primevue/forms/formfield/style';
import '@primeuix/styles/tooltip';
import '@primeuix/styles/ripple';
import '@primeuix/styled';
import 'node:url';
import '@iconify/utils';
import 'consola';
import 'ipx';
import './index-h2Zbisff.mjs';
import './index-Dx8U_For.mjs';
import './index-VzJOhjML.mjs';
import './index-FOpLFH1M.mjs';
import './index-CaCqgKFD.mjs';
import 'pinia';
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Admin Login | Alumni Portal", robots: "noindex, nofollow" });
    useSupabaseClient();
    const user = useSupabaseUser();
    const { appName } = useSiteConfig();
    watch(user, (newUser) => {
      if (newUser) navigateTo("/admin/dashboard");
    }, { immediate: true });
    const email = ref("");
    const password = ref("");
    const loading = ref(false);
    const error = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-primary-900 p-4" }, _attrs))}><div class="w-full max-w-md"><div class="text-center mb-8">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "inline-flex items-center gap-3"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500 text-white text-xl font-bold shadow-lg"${_scopeId}> A </div><div class="text-left"${_scopeId}><h1 class="text-xl font-bold text-white"${_scopeId}>${ssrInterpolate(unref(appName))}</h1><p class="text-sm text-slate-400"${_scopeId}>Admin Panel</p></div>`);
          } else {
            return [
              createVNode("div", { class: "flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500 text-white text-xl font-bold shadow-lg" }, " A "),
              createVNode("div", { class: "text-left" }, [
                createVNode("h1", { class: "text-xl font-bold text-white" }, toDisplayString(unref(appName)), 1),
                createVNode("p", { class: "text-sm text-slate-400" }, "Admin Panel")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="bg-white rounded-2xl shadow-2xl p-8"><h2 class="text-2xl font-bold text-slate-900 text-center mb-2">Admin Login</h2><p class="text-slate-500 text-center mb-6">Sign in to manage the alumni portal</p>`);
      if (unref(error)) {
        _push(ssrRenderComponent(unref(script), {
          severity: "error",
          class: "mb-4",
          closable: false
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(error))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(error)), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<form class="space-y-5"><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Email</label>`);
      _push(ssrRenderComponent(unref(script$1), {
        modelValue: unref(email),
        "onUpdate:modelValue": ($event) => isRef(email) ? email.value = $event : null,
        type: "email",
        placeholder: "admin@example.com",
        class: "w-full",
        disabled: unref(loading)
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Password</label>`);
      _push(ssrRenderComponent(unref(script$2), {
        modelValue: unref(password),
        "onUpdate:modelValue": ($event) => isRef(password) ? password.value = $event : null,
        placeholder: "Password",
        feedback: false,
        "toggle-mask": "",
        class: "w-full",
        "input-class": "w-full",
        disabled: unref(loading)
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(unref(script$d), {
        type: "submit",
        label: "Sign In",
        icon: "pi pi-sign-in",
        class: "w-full",
        loading: unref(loading)
      }, null, _parent));
      _push(`</form><div class="mt-6 text-center">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "text-sm text-slate-400 hover:text-primary-600 transition-colors inline-flex items-center gap-1"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="pi pi-arrow-left text-xs"${_scopeId}></i> Back to site `);
          } else {
            return [
              createVNode("i", { class: "pi pi-arrow-left text-xs" }),
              createTextVNode(" Back to site ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-zkOnFAIf.mjs.map
