import { defineComponent, reactive, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr } from 'vue/server-renderer';
import script from './index-C99R0uVU.mjs';
import { b as useToast, s as script$d } from './server.mjs';
import { u as useSeoMeta } from './composables-CsCDbOcR.mjs';
import { u as useSiteConfig } from './useSiteConfig-2EOf2j81.mjs';
import './index-h2Zbisff.mjs';
import './index-Dx8U_For.mjs';
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
import 'pinia';
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './useSupabaseClient-CkLFOMIR.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "App Settings | Admin", robots: "noindex" });
    useSiteConfig();
    useToast();
    const form = reactive({
      app_name: "",
      institution_name: "",
      primary_color: "#2563EB",
      logo_url: "",
      tagline: "",
      contact_email: "",
      website_url: "",
      founded_year: ""
    });
    const saving = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-2xl space-y-4" }, _attrs))}><div><h1 class="text-xl font-bold text-slate-900">App Settings</h1><p class="text-slate-500 text-sm">Configure your alumni portal branding and contact information</p></div><form class="space-y-4"><div class="bg-white border border-slate-200 rounded-xl p-5 space-y-4"><h2 class="font-semibold text-slate-900">Branding</h2><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Portal Name</label>`);
      _push(ssrRenderComponent(unref(script), {
        modelValue: unref(form).app_name,
        "onUpdate:modelValue": ($event) => unref(form).app_name = $event,
        class: "w-full",
        placeholder: "Alumni Portal"
      }, null, _parent));
      _push(`<p class="text-xs text-slate-500 mt-1">Shown in the header and browser title</p></div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Institution Name</label>`);
      _push(ssrRenderComponent(unref(script), {
        modelValue: unref(form).institution_name,
        "onUpdate:modelValue": ($event) => unref(form).institution_name = $event,
        class: "w-full",
        placeholder: "Your University Name"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Tagline</label>`);
      _push(ssrRenderComponent(unref(script), {
        modelValue: unref(form).tagline,
        "onUpdate:modelValue": ($event) => unref(form).tagline = $event,
        class: "w-full",
        placeholder: "Connecting alumni across generations"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Primary Color</label><div class="flex items-center gap-3"><input${ssrRenderAttr("value", unref(form).primary_color)} type="color" class="w-12 h-10 rounded border border-slate-200 cursor-pointer">`);
      _push(ssrRenderComponent(unref(script), {
        modelValue: unref(form).primary_color,
        "onUpdate:modelValue": ($event) => unref(form).primary_color = $event,
        class: "flex-1",
        placeholder: "#2563EB"
      }, null, _parent));
      _push(`</div><p class="text-xs text-slate-500 mt-1">Used for buttons, links, and accents throughout the site</p></div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Logo URL</label>`);
      _push(ssrRenderComponent(unref(script), {
        modelValue: unref(form).logo_url,
        "onUpdate:modelValue": ($event) => unref(form).logo_url = $event,
        class: "w-full",
        placeholder: "https://..."
      }, null, _parent));
      _push(`</div></div><div class="bg-white border border-slate-200 rounded-xl p-5 space-y-4"><h2 class="font-semibold text-slate-900">Contact &amp; Details</h2><div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Contact Email</label>`);
      _push(ssrRenderComponent(unref(script), {
        modelValue: unref(form).contact_email,
        "onUpdate:modelValue": ($event) => unref(form).contact_email = $event,
        type: "email",
        class: "w-full"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Website URL</label>`);
      _push(ssrRenderComponent(unref(script), {
        modelValue: unref(form).website_url,
        "onUpdate:modelValue": ($event) => unref(form).website_url = $event,
        class: "w-full",
        placeholder: "https://..."
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Founded Year</label>`);
      _push(ssrRenderComponent(unref(script), {
        modelValue: unref(form).founded_year,
        "onUpdate:modelValue": ($event) => unref(form).founded_year = $event,
        type: "number",
        class: "w-full",
        placeholder: "2000"
      }, null, _parent));
      _push(`</div></div></div><div class="flex justify-end">`);
      _push(ssrRenderComponent(unref(script$d), {
        type: "submit",
        label: "Save Settings",
        icon: "pi pi-save",
        loading: unref(saving)
      }, null, _parent));
      _push(`</div></form></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/settings/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Bs_6wxCv.mjs.map
