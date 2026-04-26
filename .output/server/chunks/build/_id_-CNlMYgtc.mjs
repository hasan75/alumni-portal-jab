import { _ as __nuxt_component_0 } from './nuxt-link-CnvsOL_4.mjs';
import { defineComponent, ref, reactive, watch, mergeProps, withCtx, createVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import script from './index-C99R0uVU.mjs';
import script$3 from './index-CCmoroUV.mjs';
import script$1 from './index-BkYZZ_ov.mjs';
import { a as useRoute, u as useSupabaseUser, b as useToast, s as script$d } from './server.mjs';
import script$2 from './index-DTn3Q4mK.mjs';
import { s as slugify } from './formatters-C6FNko8Q.mjs';
import { u as useJobs } from './useJobs-CxDM5wuT.mjs';
import { u as useSeoMeta } from './composables-CsCDbOcR.mjs';
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
import './index-Bs-6gtw7.mjs';
import './index-jauc-8K8.mjs';
import './index-BKaz9u56.mjs';
import './index-BPSEycji.mjs';
import './index-CpJNGpo_.mjs';
import './index-CaCqgKFD.mjs';
import './index-TJmuWcC9.mjs';
import 'pinia';
import 'vue-router';
import './useSupabaseClient-CkLFOMIR.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const id = route.params.id;
    const isNew = id === "new";
    useJobs();
    useSupabaseUser();
    useToast();
    useSeoMeta({ title: isNew ? "New Job | Admin" : "Edit Job | Admin", robots: "noindex" });
    const categories = ref([]);
    const saving = ref(false);
    const form = reactive({
      title: "",
      slug: "",
      company: "",
      company_logo_url: "",
      company_website: "",
      category_id: null,
      description: "",
      requirements: "",
      benefits: "",
      location: "",
      is_remote: false,
      job_type: "full_time",
      salary_min: null,
      salary_max: null,
      salary_currency: "USD",
      is_salary_visible: true,
      apply_url: "",
      apply_email: "",
      application_deadline: null,
      status: "draft",
      is_featured: false,
      alumni_posted: false
    });
    const jobTypes = ["full_time", "part_time", "contract", "internship", "freelance"].map((t) => ({
      label: t.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      value: t
    }));
    const statuses = ["draft", "published", "closed", "archived"].map((s) => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s }));
    watch(() => form.title, (title) => {
      if (isNew) form.slug = slugify(`${title}-${form.company}`);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-3xl space-y-4" }, _attrs))}><div class="flex items-center gap-3">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/jobs",
        class: "text-slate-500 hover:text-primary-600"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="pi pi-arrow-left"${_scopeId}></i>`);
          } else {
            return [
              createVNode("i", { class: "pi pi-arrow-left" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<h1 class="text-xl font-bold text-slate-900">${ssrInterpolate(isNew ? "New Job" : "Edit Job")}</h1></div><form class="space-y-4"><div class="bg-white border border-slate-200 rounded-xl p-5 space-y-4"><div class="grid grid-cols-2 gap-4"><div class="col-span-2"><label class="block text-sm font-medium text-slate-700 mb-1.5">Job Title *</label>`);
      _push(ssrRenderComponent(unref(script), {
        modelValue: unref(form).title,
        "onUpdate:modelValue": ($event) => unref(form).title = $event,
        class: "w-full"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Company *</label>`);
      _push(ssrRenderComponent(unref(script), {
        modelValue: unref(form).company,
        "onUpdate:modelValue": ($event) => unref(form).company = $event,
        class: "w-full"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Slug</label>`);
      _push(ssrRenderComponent(unref(script), {
        modelValue: unref(form).slug,
        "onUpdate:modelValue": ($event) => unref(form).slug = $event,
        class: "w-full"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Job Type</label>`);
      _push(ssrRenderComponent(unref(script$1), {
        modelValue: unref(form).job_type,
        "onUpdate:modelValue": ($event) => unref(form).job_type = $event,
        options: unref(jobTypes),
        "option-label": "label",
        "option-value": "value",
        class: "w-full"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Status</label>`);
      _push(ssrRenderComponent(unref(script$1), {
        modelValue: unref(form).status,
        "onUpdate:modelValue": ($event) => unref(form).status = $event,
        options: unref(statuses),
        "option-label": "label",
        "option-value": "value",
        class: "w-full"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Category</label>`);
      _push(ssrRenderComponent(unref(script$1), {
        modelValue: unref(form).category_id,
        "onUpdate:modelValue": ($event) => unref(form).category_id = $event,
        options: unref(categories),
        "option-label": "label",
        "option-value": "value",
        placeholder: "Select",
        class: "w-full"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Location</label>`);
      _push(ssrRenderComponent(unref(script), {
        modelValue: unref(form).location,
        "onUpdate:modelValue": ($event) => unref(form).location = $event,
        class: "w-full"
      }, null, _parent));
      _push(`</div></div><div class="flex gap-6"><label class="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">`);
      _push(ssrRenderComponent(unref(script$2), {
        modelValue: unref(form).is_remote,
        "onUpdate:modelValue": ($event) => unref(form).is_remote = $event
      }, null, _parent));
      _push(` Remote </label><label class="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">`);
      _push(ssrRenderComponent(unref(script$2), {
        modelValue: unref(form).is_featured,
        "onUpdate:modelValue": ($event) => unref(form).is_featured = $event
      }, null, _parent));
      _push(` Featured </label><label class="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">`);
      _push(ssrRenderComponent(unref(script$2), {
        modelValue: unref(form).is_salary_visible,
        "onUpdate:modelValue": ($event) => unref(form).is_salary_visible = $event
      }, null, _parent));
      _push(` Show Salary </label></div>`);
      if (unref(form).is_salary_visible) {
        _push(`<div class="grid grid-cols-3 gap-4"><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Min Salary</label>`);
        _push(ssrRenderComponent(unref(script), {
          modelValue: unref(form).salary_min,
          "onUpdate:modelValue": ($event) => unref(form).salary_min = $event,
          type: "number",
          class: "w-full"
        }, null, _parent));
        _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Max Salary</label>`);
        _push(ssrRenderComponent(unref(script), {
          modelValue: unref(form).salary_max,
          "onUpdate:modelValue": ($event) => unref(form).salary_max = $event,
          type: "number",
          class: "w-full"
        }, null, _parent));
        _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Currency</label>`);
        _push(ssrRenderComponent(unref(script), {
          modelValue: unref(form).salary_currency,
          "onUpdate:modelValue": ($event) => unref(form).salary_currency = $event,
          class: "w-full"
        }, null, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div><label class="block text-sm font-medium text-slate-700 mb-1.5">Description (HTML)</label>`);
      _push(ssrRenderComponent(unref(script$3), {
        modelValue: unref(form).description,
        "onUpdate:modelValue": ($event) => unref(form).description = $event,
        rows: 6,
        class: "w-full font-mono text-xs"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Requirements (HTML)</label>`);
      _push(ssrRenderComponent(unref(script$3), {
        modelValue: unref(form).requirements,
        "onUpdate:modelValue": ($event) => unref(form).requirements = $event,
        rows: 4,
        class: "w-full font-mono text-xs"
      }, null, _parent));
      _push(`</div><div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Apply URL</label>`);
      _push(ssrRenderComponent(unref(script), {
        modelValue: unref(form).apply_url,
        "onUpdate:modelValue": ($event) => unref(form).apply_url = $event,
        class: "w-full"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Apply Email</label>`);
      _push(ssrRenderComponent(unref(script), {
        modelValue: unref(form).apply_email,
        "onUpdate:modelValue": ($event) => unref(form).apply_email = $event,
        type: "email",
        class: "w-full"
      }, null, _parent));
      _push(`</div></div></div><div class="flex justify-end">`);
      _push(ssrRenderComponent(unref(script$d), {
        type: "submit",
        label: "Save Job",
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/jobs/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-CNlMYgtc.mjs.map
