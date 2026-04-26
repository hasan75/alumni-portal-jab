import { _ as __nuxt_component_0 } from './nuxt-link-CnvsOL_4.mjs';
import { defineComponent, ref, withAsyncContext, watch, unref, isRef, withCtx, createTextVNode, mergeProps, createVNode, openBlock, createBlock, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import script from './index-C99R0uVU.mjs';
import script$1 from './index-BkYZZ_ov.mjs';
import { u as useSeoMeta } from './composables-CsCDbOcR.mjs';
import { u as useMembers } from './useMembers-yop5VZJc.mjs';
import { u as useSupabaseUser } from './server.mjs';
import { u as useAsyncData } from './asyncData-BJuNjo7_.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './useSupabaseClient-CkLFOMIR.mjs';
import 'pinia';
import 'vue-router';
import 'perfect-debounce';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "MemberCard",
  __ssrInlineRender: true,
  props: {
    member: {},
    compact: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        to: `/directory/${__props.member.id}`,
        class: "bg-white border border-slate-200 rounded-xl p-4 hover:border-primary-200 hover:shadow-sm transition-all block"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-start gap-3"${_scopeId}><div class="shrink-0"${_scopeId}>`);
            if (__props.member.avatar_url) {
              _push2(`<img${ssrRenderAttr("src", __props.member.avatar_url)}${ssrRenderAttr("alt", __props.member.full_name)} class="w-12 h-12 rounded-full object-cover"${_scopeId}>`);
            } else {
              _push2(`<div class="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg"${_scopeId}>${ssrInterpolate((__props.member.display_name || __props.member.full_name).charAt(0).toUpperCase())}</div>`);
            }
            _push2(`</div><div class="flex-1 min-w-0"${_scopeId}><div class="flex items-center gap-1.5"${_scopeId}><h3 class="font-semibold text-slate-900 text-sm truncate"${_scopeId}>${ssrInterpolate(__props.member.display_name || __props.member.full_name)}</h3>`);
            if (__props.member.is_verified) {
              _push2(`<i class="pi pi-verified text-primary-500 text-xs shrink-0" title="Verified"${_scopeId}></i>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (__props.member.current_job_title) {
              _push2(`<p class="text-xs text-slate-600 mt-0.5 truncate"${_scopeId}>${ssrInterpolate(__props.member.current_job_title)} `);
              if (__props.member.current_company) {
                _push2(`<span class="text-slate-400"${_scopeId}> · ${ssrInterpolate(__props.member.current_company)}</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex items-center gap-2 mt-1.5 flex-wrap"${_scopeId}>`);
            if (__props.member.batch_year) {
              _push2(`<span class="inline-flex items-center text-[11px] text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full font-medium"${_scopeId}> Class of ${ssrInterpolate(__props.member.batch_year)}</span>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.member.city || __props.member.country) {
              _push2(`<span class="inline-flex items-center gap-0.5 text-[11px] text-slate-500"${_scopeId}><i class="pi pi-map-marker text-[9px]"${_scopeId}></i> ${ssrInterpolate([__props.member.city, __props.member.country].filter(Boolean).join(", "))}</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-start gap-3" }, [
                createVNode("div", { class: "shrink-0" }, [
                  __props.member.avatar_url ? (openBlock(), createBlock("img", {
                    key: 0,
                    src: __props.member.avatar_url,
                    alt: __props.member.full_name,
                    class: "w-12 h-12 rounded-full object-cover"
                  }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg"
                  }, toDisplayString((__props.member.display_name || __props.member.full_name).charAt(0).toUpperCase()), 1))
                ]),
                createVNode("div", { class: "flex-1 min-w-0" }, [
                  createVNode("div", { class: "flex items-center gap-1.5" }, [
                    createVNode("h3", { class: "font-semibold text-slate-900 text-sm truncate" }, toDisplayString(__props.member.display_name || __props.member.full_name), 1),
                    __props.member.is_verified ? (openBlock(), createBlock("i", {
                      key: 0,
                      class: "pi pi-verified text-primary-500 text-xs shrink-0",
                      title: "Verified"
                    })) : createCommentVNode("", true)
                  ]),
                  __props.member.current_job_title ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "text-xs text-slate-600 mt-0.5 truncate"
                  }, [
                    createTextVNode(toDisplayString(__props.member.current_job_title) + " ", 1),
                    __props.member.current_company ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "text-slate-400"
                    }, " · " + toDisplayString(__props.member.current_company), 1)) : createCommentVNode("", true)
                  ])) : createCommentVNode("", true),
                  createVNode("div", { class: "flex items-center gap-2 mt-1.5 flex-wrap" }, [
                    __props.member.batch_year ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "inline-flex items-center text-[11px] text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full font-medium"
                    }, " Class of " + toDisplayString(__props.member.batch_year), 1)) : createCommentVNode("", true),
                    __props.member.city || __props.member.country ? (openBlock(), createBlock("span", {
                      key: 1,
                      class: "inline-flex items-center gap-0.5 text-[11px] text-slate-500"
                    }, [
                      createVNode("i", { class: "pi pi-map-marker text-[9px]" }),
                      createTextVNode(" " + toDisplayString([__props.member.city, __props.member.country].filter(Boolean).join(", ")), 1)
                    ])) : createCommentVNode("", true)
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/member/MemberCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const MemberCard = Object.assign(_sfc_main$1, { __name: "MemberCard" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useSeoMeta({ title: "Alumni Directory", description: "Browse and connect with alumni." });
    const { fetchDirectory, fetchBatches } = useMembers();
    const user = useSupabaseUser();
    const search = ref("");
    const selectedBatch = ref(null);
    const currentPage = ref(1);
    const batches = ref([]);
    const { data: batchList } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("batches", fetchBatches)), __temp = await __temp, __restore(), __temp);
    if (batchList.value) {
      batches.value = [
        { label: "All Batches", value: 0 },
        ...batchList.value.map((b) => ({ label: b.label || `Class of ${b.year}`, value: b.year }))
      ];
    }
    const { data: members, refresh, pending } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "directory",
      () => fetchDirectory({
        search: search.value,
        batchYear: selectedBatch.value || void 0,
        page: currentPage.value
      })
    )), __temp = await __temp, __restore(), __temp);
    const debounceTimeout = ref();
    function onSearch() {
      clearTimeout(debounceTimeout.value);
      debounceTimeout.value = setTimeout(() => {
        currentPage.value = 1;
        refresh();
      }, 300);
    }
    watch(selectedBatch, () => {
      currentPage.value = 1;
      refresh();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="bg-white border-b border-slate-200 py-8 px-4"><div class="max-w-6xl mx-auto"><h1 class="text-2xl font-bold text-slate-900 mb-1">Alumni Directory</h1><p class="text-slate-500 text-sm">${ssrInterpolate(unref(user) ? "Browse all active alumni" : "Sign in to access full profiles and contact details")}</p><div class="mt-4 flex gap-3 flex-wrap"><div class="flex-1 min-w-64">`);
      _push(ssrRenderComponent(unref(script), {
        modelValue: unref(search),
        "onUpdate:modelValue": ($event) => isRef(search) ? search.value = $event : null,
        placeholder: "Search by name or company...",
        class: "w-full",
        onInput: onSearch
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(unref(script$1), {
        modelValue: unref(selectedBatch),
        "onUpdate:modelValue": ($event) => isRef(selectedBatch) ? selectedBatch.value = $event : null,
        options: unref(batches),
        "option-label": "label",
        "option-value": "value",
        placeholder: "All Batches",
        class: "w-48"
      }, null, _parent));
      _push(`</div></div></div><div class="max-w-6xl mx-auto px-4 py-8">`);
      if (unref(pending)) {
        _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"><!--[-->`);
        ssrRenderList(8, (i) => {
          _push(`<div class="bg-white border border-slate-200 rounded-xl p-4 animate-pulse"><div class="flex gap-3"><div class="w-12 h-12 rounded-full bg-slate-200"></div><div class="flex-1"><div class="h-4 bg-slate-200 rounded w-3/4 mb-2"></div><div class="h-3 bg-slate-200 rounded w-1/2"></div></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(members) && unref(members).length > 0) {
        _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"><!--[-->`);
        ssrRenderList(unref(members), (member) => {
          _push(ssrRenderComponent(MemberCard, {
            key: member.id,
            member
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="text-center py-16"><i class="pi pi-users text-4xl text-slate-300 mb-3 block"></i><p class="text-slate-500">No alumni found matching your search</p></div>`);
      }
      if (!unref(user)) {
        _push(`<div class="mt-8 bg-primary-50 border border-primary-200 rounded-xl p-6 text-center"><h3 class="font-semibold text-slate-900 mb-2">Want to see full profiles?</h3><p class="text-slate-600 text-sm mb-4">Sign in or register to access complete alumni profiles with contact information.</p><div class="flex gap-3 justify-center">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/login",
          class: "px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Sign In`);
            } else {
              return [
                createTextVNode("Sign In")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/register",
          class: "px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Register`);
            } else {
              return [
                createTextVNode("Register")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/directory/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-dmbQ_pT7.mjs.map
