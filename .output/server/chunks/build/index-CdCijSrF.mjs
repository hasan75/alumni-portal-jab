import { defineComponent, ref, withAsyncContext, watch, unref, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderList } from 'vue/server-renderer';
import { J as JobCard } from './JobCard-B_N1U9oC.mjs';
import script$1 from './index-BkYZZ_ov.mjs';
import script from './index-C99R0uVU.mjs';
import { u as useSeoMeta } from './composables-CsCDbOcR.mjs';
import { u as useJobs } from './useJobs-CxDM5wuT.mjs';
import { u as useAsyncData } from './asyncData-BJuNjo7_.mjs';
import './nuxt-link-CnvsOL_4.mjs';
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
import './server.mjs';
import 'pinia';
import 'vue-router';
import './formatters-C6FNko8Q.mjs';
import './index-VzJOhjML.mjs';
import './index-Bs-6gtw7.mjs';
import './index-jauc-8K8.mjs';
import './index-BKaz9u56.mjs';
import './index-BPSEycji.mjs';
import './index-CpJNGpo_.mjs';
import './index-CaCqgKFD.mjs';
import './index-TJmuWcC9.mjs';
import './index-h2Zbisff.mjs';
import './index-Dx8U_For.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './useSupabaseClient-CkLFOMIR.mjs';
import 'perfect-debounce';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useSeoMeta({ title: "Job Board | Alumni Portal", description: "Job opportunities posted by and for alumni." });
    const { fetchJobs, fetchCategories } = useJobs();
    const search = ref("");
    const selectedCategory = ref(null);
    const selectedType = ref(null);
    const remote = ref(null);
    const categories = ref([]);
    const catList = ([__temp, __restore] = withAsyncContext(() => fetchCategories()), __temp = await __temp, __restore(), __temp);
    categories.value = [
      { label: "All Categories", value: null },
      ...catList.map((c) => ({ label: c.name, value: c.id }))
    ];
    const jobTypes = [
      { label: "All Types", value: null },
      { label: "Full Time", value: "full_time" },
      { label: "Part Time", value: "part_time" },
      { label: "Contract", value: "contract" },
      { label: "Internship", value: "internship" },
      { label: "Freelance", value: "freelance" }
    ];
    const { data: jobs, refresh, pending } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "jobs",
      () => fetchJobs({
        search: search.value || void 0,
        categoryId: selectedCategory.value || void 0,
        jobType: selectedType.value || void 0,
        isRemote: remote.value ?? void 0
      })
    )), __temp = await __temp, __restore(), __temp);
    const debounceTimeout = ref();
    function onSearch() {
      clearTimeout(debounceTimeout.value);
      debounceTimeout.value = setTimeout(refresh, 300);
    }
    watch([selectedCategory, selectedType, remote], refresh);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="bg-white border-b border-slate-200 py-8 px-4"><div class="max-w-6xl mx-auto"><h1 class="text-2xl font-bold text-slate-900">Job Board</h1><p class="text-slate-500 text-sm mt-1">Opportunities posted by alumni and partner organizations</p><div class="mt-4 flex flex-wrap gap-3">`);
      _push(ssrRenderComponent(unref(script), {
        modelValue: unref(search),
        "onUpdate:modelValue": ($event) => isRef(search) ? search.value = $event : null,
        placeholder: "Search jobs...",
        class: "flex-1 min-w-48",
        onInput: onSearch
      }, null, _parent));
      _push(ssrRenderComponent(unref(script$1), {
        modelValue: unref(selectedCategory),
        "onUpdate:modelValue": ($event) => isRef(selectedCategory) ? selectedCategory.value = $event : null,
        options: unref(categories),
        "option-label": "label",
        "option-value": "value",
        placeholder: "Category",
        class: "w-48"
      }, null, _parent));
      _push(ssrRenderComponent(unref(script$1), {
        modelValue: unref(selectedType),
        "onUpdate:modelValue": ($event) => isRef(selectedType) ? selectedType.value = $event : null,
        options: jobTypes,
        "option-label": "label",
        "option-value": "value",
        placeholder: "Job Type",
        class: "w-40"
      }, null, _parent));
      _push(`<button class="${ssrRenderClass([unref(remote) ? "bg-green-50 border-green-300 text-green-700" : "border-slate-200 text-slate-600 hover:bg-slate-50", "flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border transition-colors"])}"><i class="pi pi-globe text-xs"></i> Remote </button></div></div></div><div class="max-w-6xl mx-auto px-4 py-8">`);
      if (unref(pending)) {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(5, (i) => {
          _push(`<div class="bg-white border border-slate-200 rounded-xl h-24 animate-pulse"></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(jobs) && unref(jobs).length > 0) {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(unref(jobs), (job) => {
          _push(ssrRenderComponent(JobCard, {
            key: job.id,
            job
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="text-center py-16"><i class="pi pi-briefcase text-4xl text-slate-300 mb-3 block"></i><p class="text-slate-500">No jobs found</p></div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/jobs/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CdCijSrF.mjs.map
