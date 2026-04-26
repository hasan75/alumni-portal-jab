import { defineComponent, ref, mergeProps, unref, isRef, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import script$1 from './index-DzYuaJ0q.mjs';
import script$2 from './index-C3SBqAjS.mjs';
import { b as useToast, s as script$d } from './server.mjs';
import script from './index-C99R0uVU.mjs';
import { u as useSeoMeta } from './composables-CsCDbOcR.mjs';
import { u as useSupabaseClient } from './useSupabaseClient-CkLFOMIR.mjs';
import './index-VzJOhjML.mjs';
import './index-BbMyRW4t.mjs';
import './index-OnDK_DA4.mjs';
import './index-BkYZZ_ov.mjs';
import './index-Bs-6gtw7.mjs';
import './index-jauc-8K8.mjs';
import './index-BKaz9u56.mjs';
import './index-BPSEycji.mjs';
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
import './index-CpJNGpo_.mjs';
import './index-CaCqgKFD.mjs';
import './index-TJmuWcC9.mjs';
import './index-h2Zbisff.mjs';
import './index-Dx8U_For.mjs';
import './index-BczhYSIl.mjs';
import './index-DNErSYKU.mjs';
import './index-DBZjLEmg.mjs';
import './index-DEhFwO4y.mjs';
import './index-BAEKaTcz.mjs';
import './index-DiLREPV5.mjs';
import './index-C8llgERM.mjs';
import './index-Dry5WxFr.mjs';
import './index-DszJhKw-.mjs';
import './index-XpUCEUIm.mjs';
import './index-B1fop8bM.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Batches | Admin", robots: "noindex" });
    const supabase = useSupabaseClient();
    const toast = useToast();
    const batches = ref([]);
    const loading = ref(false);
    const newBatchYear = ref(null);
    const newBatchLabel = ref("");
    const adding = ref(false);
    async function load() {
      loading.value = true;
      const { data } = await supabase.from("batches").select("*").order("year", { ascending: false });
      batches.value = data || [];
      loading.value = false;
    }
    async function addBatch() {
      if (!newBatchYear.value) return;
      adding.value = true;
      const { error } = await supabase.from("batches").insert({
        year: newBatchYear.value,
        label: newBatchLabel.value || `Class of ${newBatchYear.value}`
      });
      if (!error) {
        toast.add({ severity: "success", summary: "Batch added", life: 2e3 });
        newBatchYear.value = null;
        newBatchLabel.value = "";
        await load();
      } else {
        toast.add({ severity: "error", summary: error.message, life: 3e3 });
      }
      adding.value = false;
    }
    async function toggleActive(id, current) {
      await supabase.from("batches").update({ is_active: !current }).eq("id", id);
      await load();
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><h1 class="text-xl font-bold text-slate-900">Batches</h1><div class="bg-white border border-slate-200 rounded-xl p-4"><h2 class="font-medium text-slate-900 mb-3">Add New Batch</h2><div class="flex gap-3 flex-wrap"><div><label class="block text-xs font-medium text-slate-600 mb-1">Year *</label>`);
      _push(ssrRenderComponent(unref(script), {
        modelValue: unref(newBatchYear),
        "onUpdate:modelValue": ($event) => isRef(newBatchYear) ? newBatchYear.value = $event : null,
        type: "number",
        placeholder: "e.g. 2025",
        class: "w-32"
      }, null, _parent));
      _push(`</div><div class="flex-1"><label class="block text-xs font-medium text-slate-600 mb-1">Label</label>`);
      _push(ssrRenderComponent(unref(script), {
        modelValue: unref(newBatchLabel),
        "onUpdate:modelValue": ($event) => isRef(newBatchLabel) ? newBatchLabel.value = $event : null,
        placeholder: "e.g. Class of 2025",
        class: "w-full max-w-sm"
      }, null, _parent));
      _push(`</div><div class="flex items-end">`);
      _push(ssrRenderComponent(unref(script$d), {
        label: "Add Batch",
        icon: "pi pi-plus",
        size: "small",
        loading: unref(adding),
        onClick: addBatch
      }, null, _parent));
      _push(`</div></div></div><div class="bg-white border border-slate-200 rounded-xl overflow-hidden">`);
      _push(ssrRenderComponent(unref(script$1), {
        value: unref(batches),
        loading: unref(loading),
        "data-key": "id",
        class: "text-sm"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(script$2), {
              field: "year",
              header: "Year"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(script$2), {
              field: "label",
              header: "Label"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(script$2), {
              field: "member_count",
              header: "Members"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(script$2), {
              field: "is_active",
              header: "Active"
            }, {
              body: withCtx(({ data }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="${ssrRenderClass([data.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600", "text-xs px-2 py-0.5 rounded-full font-medium"])}"${_scopeId2}>${ssrInterpolate(data.is_active ? "Active" : "Inactive")}</span>`);
                } else {
                  return [
                    createVNode("span", {
                      class: ["text-xs px-2 py-0.5 rounded-full font-medium", data.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"]
                    }, toDisplayString(data.is_active ? "Active" : "Inactive"), 3)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(script$2), { header: "Actions" }, {
              body: withCtx(({ data }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(script$d), {
                    label: data.is_active ? "Deactivate" : "Activate",
                    severity: data.is_active ? "warn" : "success",
                    size: "small",
                    text: "",
                    onClick: ($event) => toggleActive(data.id, data.is_active)
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(script$d), {
                      label: data.is_active ? "Deactivate" : "Activate",
                      severity: data.is_active ? "warn" : "success",
                      size: "small",
                      text: "",
                      onClick: ($event) => toggleActive(data.id, data.is_active)
                    }, null, 8, ["label", "severity", "onClick"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(script$2), {
                field: "year",
                header: "Year"
              }),
              createVNode(unref(script$2), {
                field: "label",
                header: "Label"
              }),
              createVNode(unref(script$2), {
                field: "member_count",
                header: "Members"
              }),
              createVNode(unref(script$2), {
                field: "is_active",
                header: "Active"
              }, {
                body: withCtx(({ data }) => [
                  createVNode("span", {
                    class: ["text-xs px-2 py-0.5 rounded-full font-medium", data.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"]
                  }, toDisplayString(data.is_active ? "Active" : "Inactive"), 3)
                ]),
                _: 1
              }),
              createVNode(unref(script$2), { header: "Actions" }, {
                body: withCtx(({ data }) => [
                  createVNode(unref(script$d), {
                    label: data.is_active ? "Deactivate" : "Activate",
                    severity: data.is_active ? "warn" : "success",
                    size: "small",
                    text: "",
                    onClick: ($event) => toggleActive(data.id, data.is_active)
                  }, null, 8, ["label", "severity", "onClick"])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/batches/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-q1qgTj0k.mjs.map
