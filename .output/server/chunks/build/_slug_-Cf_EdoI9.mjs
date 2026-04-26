import { _ as __nuxt_component_0 } from './nuxt-link-CnvsOL_4.mjs';
import { defineComponent, withAsyncContext, computed, mergeProps, withCtx, createVNode, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { f as formatJobType, a as formatSalary, c as formatDate } from './formatters-C6FNko8Q.mjs';
import { a as useRoute, c as createError } from './server.mjs';
import { u as useJobs } from './useJobs-CxDM5wuT.mjs';
import { u as useAsyncData } from './asyncData-BJuNjo7_.mjs';
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
import 'pinia';
import 'vue-router';
import './useSupabaseClient-CkLFOMIR.mjs';
import 'perfect-debounce';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[slug]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const slug = route.params.slug;
    const { fetchBySlug } = useJobs();
    const { data: job, pending } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(`job-${slug}`, () => fetchBySlug(slug))), __temp = await __temp, __restore(), __temp);
    if (!job.value && !pending.value) {
      throw createError({ statusCode: 404, statusMessage: "Job not found" });
    }
    useSeoMeta({
      title: computed(() => `${job.value?.title || "Job"} at ${job.value?.company || ""} | Alumni Portal`),
      description: computed(() => job.value?.description?.substring(0, 160) || "")
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-3xl mx-auto px-4 py-8" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/jobs",
        class: "inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 mb-4"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="pi pi-arrow-left text-xs"${_scopeId}></i> Back to Jobs `);
          } else {
            return [
              createVNode("i", { class: "pi pi-arrow-left text-xs" }),
              createTextVNode(" Back to Jobs ")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(pending)) {
        _push(`<div class="bg-white border border-slate-200 rounded-xl h-96 animate-pulse"></div>`);
      } else if (unref(job)) {
        _push(`<div class="bg-white border border-slate-200 rounded-xl overflow-hidden"><div class="p-6 border-b border-slate-100"><div class="flex items-start gap-4"><div class="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">`);
        if (unref(job).company_logo_url) {
          _push(`<img${ssrRenderAttr("src", unref(job).company_logo_url)}${ssrRenderAttr("alt", unref(job).company)} class="w-full h-full object-contain">`);
        } else {
          _push(`<span class="text-2xl font-bold text-slate-400">${ssrInterpolate(unref(job).company.charAt(0))}</span>`);
        }
        _push(`</div><div class="flex-1"><h1 class="text-2xl font-bold text-slate-900">${ssrInterpolate(unref(job).title)}</h1><p class="text-slate-600 mt-1">`);
        if (unref(job).company_website) {
          _push(`<a${ssrRenderAttr("href", unref(job).company_website)} target="_blank" class="hover:text-primary-600">${ssrInterpolate(unref(job).company)}</a>`);
        } else {
          _push(`<span>${ssrInterpolate(unref(job).company)}</span>`);
        }
        _push(`</p><div class="flex flex-wrap gap-2 mt-3"><span class="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">${ssrInterpolate(unref(formatJobType)(unref(job).job_type))}</span>`);
        if (unref(job).is_remote) {
          _push(`<span class="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">Remote</span>`);
        } else if (unref(job).location) {
          _push(`<span class="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">${ssrInterpolate(unref(job).location)}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(job).is_salary_visible && (unref(job).salary_min || unref(job).salary_max)) {
          _push(`<span class="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">${ssrInterpolate(unref(formatSalary)(unref(job).salary_min, unref(job).salary_max, unref(job).salary_currency))}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div><div class="mt-4 flex gap-3">`);
        if (unref(job).apply_url) {
          _push(`<a${ssrRenderAttr("href", unref(job).apply_url)} target="_blank" class="px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"> Apply Now </a>`);
        } else if (unref(job).apply_email) {
          _push(`<a${ssrRenderAttr("href", `mailto:${unref(job).apply_email}`)} class="px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"> Apply via Email </a>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="p-6 space-y-5">`);
        if (unref(job).description) {
          _push(`<div><h2 class="font-semibold text-slate-900 mb-2">Description</h2><div class="prose prose-sm max-w-none text-slate-600">${unref(job).description ?? ""}</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(job).requirements) {
          _push(`<div><h2 class="font-semibold text-slate-900 mb-2">Requirements</h2><div class="prose prose-sm max-w-none text-slate-600">${unref(job).requirements ?? ""}</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(job).benefits) {
          _push(`<div><h2 class="font-semibold text-slate-900 mb-2">Benefits</h2><div class="prose prose-sm max-w-none text-slate-600">${unref(job).benefits ?? ""}</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(job).application_deadline) {
          _push(`<div class="text-sm text-slate-500"><i class="pi pi-clock mr-1"></i> Application deadline: ${ssrInterpolate(unref(formatDate)(unref(job).application_deadline))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/jobs/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-Cf_EdoI9.mjs.map
