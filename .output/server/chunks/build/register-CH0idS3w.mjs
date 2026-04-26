import { _ as __nuxt_component_0 } from './nuxt-link-CnvsOL_4.mjs';
import { defineComponent, ref, reactive, mergeProps, withCtx, unref, createVNode, toDisplayString, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import script$1 from './index-C99R0uVU.mjs';
import script$2 from './index-DdvNWG8M.mjs';
import { s as script$d } from './server.mjs';
import script from './index-CraArxmM.mjs';
import script$3 from './index-BkYZZ_ov.mjs';
import { u as useSeoMeta } from './composables-CsCDbOcR.mjs';
import { u as useMembers } from './useMembers-yop5VZJc.mjs';
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
import './index-Bs-6gtw7.mjs';
import './index-jauc-8K8.mjs';
import './index-BKaz9u56.mjs';
import './index-BPSEycji.mjs';
import './index-CpJNGpo_.mjs';
import './index-TJmuWcC9.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './useSupabaseClient-CkLFOMIR.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "register",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "Register | Alumni Portal"
    });
    useMembers();
    const { appName, institutionName } = useSiteConfig();
    const batches = ref([]);
    const form = reactive({
      full_name: "",
      email: "",
      password: "",
      confirm_password: "",
      batch_year: null,
      student_id: "",
      phone: ""
    });
    const loading = ref(false);
    const error = ref("");
    const submitted = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-primary-900 flex items-center justify-center p-4 py-12" }, _attrs))}><div class="w-full max-w-lg"><div class="text-center mb-8">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "inline-flex items-center gap-3"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500 text-white text-xl font-bold shadow-lg"${_scopeId}> A </div><div class="text-left"${_scopeId}><h1 class="text-xl font-bold text-white"${_scopeId}>${ssrInterpolate(unref(appName))}</h1><p class="text-sm text-slate-400"${_scopeId}>${ssrInterpolate(unref(institutionName))}</p></div>`);
          } else {
            return [
              createVNode("div", { class: "flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500 text-white text-xl font-bold shadow-lg" }, " A "),
              createVNode("div", { class: "text-left" }, [
                createVNode("h1", { class: "text-xl font-bold text-white" }, toDisplayString(unref(appName)), 1),
                createVNode("p", { class: "text-sm text-slate-400" }, toDisplayString(unref(institutionName)), 1)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(submitted)) {
        _push(`<div class="bg-white rounded-2xl shadow-2xl p-8 text-center"><div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><i class="pi pi-check text-green-600 text-2xl"></i></div><h2 class="text-2xl font-bold text-slate-900 mb-2">Application Submitted!</h2><p class="text-slate-500 mb-6"> Your registration is pending admin approval. You will be notified once your account is activated. </p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "text-primary-600 hover:underline text-sm"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Return to Homepage `);
            } else {
              return [
                createTextVNode(" Return to Homepage ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="bg-white rounded-2xl shadow-2xl p-8"><h2 class="text-2xl font-bold text-slate-900 text-center mb-2">Create Account</h2><p class="text-slate-500 text-center mb-6">Join the alumni network</p>`);
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
        _push(`<form class="space-y-4"><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>`);
        _push(ssrRenderComponent(unref(script$1), {
          modelValue: unref(form).full_name,
          "onUpdate:modelValue": ($event) => unref(form).full_name = $event,
          placeholder: "Your full name",
          class: "w-full",
          disabled: unref(loading)
        }, null, _parent));
        _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>`);
        _push(ssrRenderComponent(unref(script$1), {
          modelValue: unref(form).email,
          "onUpdate:modelValue": ($event) => unref(form).email = $event,
          type: "email",
          placeholder: "you@example.com",
          class: "w-full",
          disabled: unref(loading)
        }, null, _parent));
        _push(`</div><div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Password *</label>`);
        _push(ssrRenderComponent(unref(script$2), {
          modelValue: unref(form).password,
          "onUpdate:modelValue": ($event) => unref(form).password = $event,
          placeholder: "Min 8 characters",
          feedback: false,
          "toggle-mask": "",
          class: "w-full",
          "input-class": "w-full",
          disabled: unref(loading)
        }, null, _parent));
        _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password *</label>`);
        _push(ssrRenderComponent(unref(script$2), {
          modelValue: unref(form).confirm_password,
          "onUpdate:modelValue": ($event) => unref(form).confirm_password = $event,
          placeholder: "Repeat password",
          feedback: false,
          "toggle-mask": "",
          class: "w-full",
          "input-class": "w-full",
          disabled: unref(loading)
        }, null, _parent));
        _push(`</div></div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Graduation Year</label>`);
        _push(ssrRenderComponent(unref(script$3), {
          modelValue: unref(form).batch_year,
          "onUpdate:modelValue": ($event) => unref(form).batch_year = $event,
          options: unref(batches),
          "option-label": "label",
          "option-value": "value",
          placeholder: "Select your batch",
          class: "w-full",
          disabled: unref(loading)
        }, null, _parent));
        _push(`</div><div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Student ID</label>`);
        _push(ssrRenderComponent(unref(script$1), {
          modelValue: unref(form).student_id,
          "onUpdate:modelValue": ($event) => unref(form).student_id = $event,
          placeholder: "Optional",
          class: "w-full",
          disabled: unref(loading)
        }, null, _parent));
        _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>`);
        _push(ssrRenderComponent(unref(script$1), {
          modelValue: unref(form).phone,
          "onUpdate:modelValue": ($event) => unref(form).phone = $event,
          placeholder: "Optional",
          class: "w-full",
          disabled: unref(loading)
        }, null, _parent));
        _push(`</div></div>`);
        _push(ssrRenderComponent(unref(script$d), {
          type: "submit",
          label: "Submit Application",
          icon: "pi pi-user-plus",
          class: "w-full",
          loading: unref(loading)
        }, null, _parent));
        _push(`</form><div class="mt-5 text-center text-sm text-slate-500"> Already have an account? `);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/login",
          class: "text-primary-600 font-medium hover:underline ml-1"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Sign in `);
            } else {
              return [
                createTextVNode(" Sign in ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=register-CH0idS3w.mjs.map
