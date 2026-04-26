import { _ as __nuxt_component_0 } from './nuxt-link-CnvsOL_4.mjs';
import { defineComponent, ref, watch, mergeProps, unref, isRef, withCtx, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import script$2 from './index-DzYuaJ0q.mjs';
import script$3 from './index-C3SBqAjS.mjs';
import { a as useRoute, b as useToast, d as useConfirm, s as script$d } from './server.mjs';
import script from './index-C99R0uVU.mjs';
import script$1 from './index-BkYZZ_ov.mjs';
import { M as MemberStatusBadge } from './MemberStatusBadge-C10dEHYb.mjs';
import { u as useSeoMeta } from './composables-CsCDbOcR.mjs';
import { u as useMembers } from './useMembers-yop5VZJc.mjs';
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
import './index-VzJOhjML.mjs';
import './index-BbMyRW4t.mjs';
import './index-OnDK_DA4.mjs';
import './index-BczhYSIl.mjs';
import './index-DNErSYKU.mjs';
import './index-DBZjLEmg.mjs';
import './index-h2Zbisff.mjs';
import './index-Dx8U_For.mjs';
import 'pinia';
import 'vue-router';
import './index-DEhFwO4y.mjs';
import './index-Bs-6gtw7.mjs';
import './index-jauc-8K8.mjs';
import './index-BKaz9u56.mjs';
import './index-BPSEycji.mjs';
import './index-CpJNGpo_.mjs';
import './index-CaCqgKFD.mjs';
import './index-TJmuWcC9.mjs';
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
import './useSupabaseClient-CkLFOMIR.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Members | Admin", robots: "noindex" });
    const route = useRoute();
    const { fetchAllForAdmin, approveMembers, rejectMember, suspendMember } = useMembers();
    const toast = useToast();
    const confirm = useConfirm();
    const search = ref("");
    const statusFilter = ref(route.query.status || "");
    const currentPage = ref(1);
    const selectedMembers = ref([]);
    const statusOptions = [
      { label: "All Status", value: "" },
      { label: "Pending", value: "pending" },
      { label: "Active", value: "active" },
      { label: "Suspended", value: "suspended" },
      { label: "Rejected", value: "rejected" }
    ];
    const members = ref([]);
    ref(0);
    const loading = ref(false);
    async function loadMembers() {
      loading.value = true;
      const result = await fetchAllForAdmin({
        search: search.value || void 0,
        status: statusFilter.value || void 0,
        page: currentPage.value,
        perPage: 20
      });
      members.value = result;
      loading.value = false;
    }
    const debounceTimeout = ref();
    function onSearch() {
      clearTimeout(debounceTimeout.value);
      debounceTimeout.value = setTimeout(() => {
        currentPage.value = 1;
        loadMembers();
      }, 300);
    }
    watch(statusFilter, () => {
      currentPage.value = 1;
      loadMembers();
    });
    async function handleApprove(ids) {
      const result = await approveMembers(ids);
      if (result.success) {
        toast.add({ severity: "success", summary: `${ids.length} member(s) approved`, life: 3e3 });
        await loadMembers();
        selectedMembers.value = [];
      }
    }
    async function handleReject(id, name) {
      confirm.require({
        message: `Reject ${name}'s application?`,
        header: "Confirm Rejection",
        icon: "pi pi-exclamation-triangle",
        rejectClass: "p-button-secondary",
        accept: async () => {
          const result = await rejectMember(id);
          if (result.success) {
            toast.add({ severity: "info", summary: "Member rejected", life: 2e3 });
            await loadMembers();
          }
        }
      });
    }
    async function handleSuspend(id, name) {
      confirm.require({
        message: `Suspend ${name}'s account?`,
        header: "Confirm Suspension",
        icon: "pi pi-exclamation-triangle",
        rejectClass: "p-button-secondary",
        accept: async () => {
          const result = await suspendMember(id);
          if (result.success) {
            toast.add({ severity: "warn", summary: "Member suspended", life: 2e3 });
            await loadMembers();
          }
        }
      });
    }
    function formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div class="flex items-center justify-between flex-wrap gap-3"><div><h1 class="text-xl font-bold text-slate-900">Members</h1><p class="text-slate-500 text-sm">Manage alumni member accounts</p></div></div><div class="flex gap-3 flex-wrap">`);
      _push(ssrRenderComponent(unref(script), {
        modelValue: unref(search),
        "onUpdate:modelValue": ($event) => isRef(search) ? search.value = $event : null,
        placeholder: "Search by name or email...",
        class: "flex-1 min-w-48",
        onInput: onSearch
      }, null, _parent));
      _push(ssrRenderComponent(unref(script$1), {
        modelValue: unref(statusFilter),
        "onUpdate:modelValue": ($event) => isRef(statusFilter) ? statusFilter.value = $event : null,
        options: statusOptions,
        "option-label": "label",
        "option-value": "value",
        class: "w-40"
      }, null, _parent));
      if (unref(selectedMembers).length > 0) {
        _push(ssrRenderComponent(unref(script$d), {
          label: `Approve Selected (${unref(selectedMembers).length})`,
          icon: "pi pi-check",
          severity: "success",
          onClick: ($event) => handleApprove(unref(selectedMembers).map((m) => m.id))
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="bg-white border border-slate-200 rounded-xl overflow-hidden">`);
      _push(ssrRenderComponent(unref(script$2), {
        selection: unref(selectedMembers),
        "onUpdate:selection": ($event) => isRef(selectedMembers) ? selectedMembers.value = $event : null,
        value: unref(members),
        loading: unref(loading),
        "data-key": "id",
        class: "text-sm"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(script$3), {
              "selection-mode": "multiple",
              "header-style": "width: 3rem"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(script$3), {
              field: "full_name",
              header: "Name"
            }, {
              body: withCtx(({ data }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_NuxtLink, {
                    to: `/admin/members/${data.id}`,
                    class: "font-medium text-slate-900 hover:text-primary-600"
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(data.full_name)}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(data.full_name), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_NuxtLink, {
                      to: `/admin/members/${data.id}`,
                      class: "font-medium text-slate-900 hover:text-primary-600"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(data.full_name), 1)
                      ]),
                      _: 2
                    }, 1032, ["to"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(script$3), {
              field: "email",
              header: "Email",
              class: "text-slate-600"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(script$3), {
              field: "batch_year",
              header: "Batch"
            }, {
              body: withCtx(({ data }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (data.batch_year) {
                    _push3(`<span class="text-sm text-slate-600"${_scopeId2}>${ssrInterpolate(data.batch_year)}</span>`);
                  } else {
                    _push3(`<span class="text-slate-400"${_scopeId2}>—</span>`);
                  }
                } else {
                  return [
                    data.batch_year ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "text-sm text-slate-600"
                    }, toDisplayString(data.batch_year), 1)) : (openBlock(), createBlock("span", {
                      key: 1,
                      class: "text-slate-400"
                    }, "—"))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(script$3), {
              field: "status",
              header: "Status"
            }, {
              body: withCtx(({ data }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(MemberStatusBadge, {
                    status: data.status
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(MemberStatusBadge, {
                      status: data.status
                    }, null, 8, ["status"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(script$3), {
              field: "created_at",
              header: "Registered"
            }, {
              body: withCtx(({ data }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="text-slate-500 text-xs"${_scopeId2}>${ssrInterpolate(formatDate(data.created_at))}</span>`);
                } else {
                  return [
                    createVNode("span", { class: "text-slate-500 text-xs" }, toDisplayString(formatDate(data.created_at)), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(script$3), { header: "Actions" }, {
              body: withCtx(({ data }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex gap-1.5"${_scopeId2}>`);
                  if (data.status === "pending") {
                    _push3(ssrRenderComponent(unref(script$d), {
                      icon: "pi pi-check",
                      size: "small",
                      severity: "success",
                      text: "",
                      title: "Approve",
                      onClick: ($event) => handleApprove([data.id])
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if (data.status === "pending") {
                    _push3(ssrRenderComponent(unref(script$d), {
                      icon: "pi pi-times",
                      size: "small",
                      severity: "danger",
                      text: "",
                      title: "Reject",
                      onClick: ($event) => handleReject(data.id, data.full_name)
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if (data.status === "active") {
                    _push3(ssrRenderComponent(unref(script$d), {
                      icon: "pi pi-ban",
                      size: "small",
                      severity: "warn",
                      text: "",
                      title: "Suspend",
                      onClick: ($event) => handleSuspend(data.id, data.full_name)
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(_component_NuxtLink, {
                    to: `/admin/members/${data.id}`
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(script$d), {
                          icon: "pi pi-pencil",
                          size: "small",
                          text: "",
                          title: "Edit"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(script$d), {
                            icon: "pi pi-pencil",
                            size: "small",
                            text: "",
                            title: "Edit"
                          })
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex gap-1.5" }, [
                      data.status === "pending" ? (openBlock(), createBlock(unref(script$d), {
                        key: 0,
                        icon: "pi pi-check",
                        size: "small",
                        severity: "success",
                        text: "",
                        title: "Approve",
                        onClick: ($event) => handleApprove([data.id])
                      }, null, 8, ["onClick"])) : createCommentVNode("", true),
                      data.status === "pending" ? (openBlock(), createBlock(unref(script$d), {
                        key: 1,
                        icon: "pi pi-times",
                        size: "small",
                        severity: "danger",
                        text: "",
                        title: "Reject",
                        onClick: ($event) => handleReject(data.id, data.full_name)
                      }, null, 8, ["onClick"])) : createCommentVNode("", true),
                      data.status === "active" ? (openBlock(), createBlock(unref(script$d), {
                        key: 2,
                        icon: "pi pi-ban",
                        size: "small",
                        severity: "warn",
                        text: "",
                        title: "Suspend",
                        onClick: ($event) => handleSuspend(data.id, data.full_name)
                      }, null, 8, ["onClick"])) : createCommentVNode("", true),
                      createVNode(_component_NuxtLink, {
                        to: `/admin/members/${data.id}`
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(script$d), {
                            icon: "pi pi-pencil",
                            size: "small",
                            text: "",
                            title: "Edit"
                          })
                        ]),
                        _: 1
                      }, 8, ["to"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(script$3), {
                "selection-mode": "multiple",
                "header-style": "width: 3rem"
              }),
              createVNode(unref(script$3), {
                field: "full_name",
                header: "Name"
              }, {
                body: withCtx(({ data }) => [
                  createVNode(_component_NuxtLink, {
                    to: `/admin/members/${data.id}`,
                    class: "font-medium text-slate-900 hover:text-primary-600"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(data.full_name), 1)
                    ]),
                    _: 2
                  }, 1032, ["to"])
                ]),
                _: 1
              }),
              createVNode(unref(script$3), {
                field: "email",
                header: "Email",
                class: "text-slate-600"
              }),
              createVNode(unref(script$3), {
                field: "batch_year",
                header: "Batch"
              }, {
                body: withCtx(({ data }) => [
                  data.batch_year ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "text-sm text-slate-600"
                  }, toDisplayString(data.batch_year), 1)) : (openBlock(), createBlock("span", {
                    key: 1,
                    class: "text-slate-400"
                  }, "—"))
                ]),
                _: 1
              }),
              createVNode(unref(script$3), {
                field: "status",
                header: "Status"
              }, {
                body: withCtx(({ data }) => [
                  createVNode(MemberStatusBadge, {
                    status: data.status
                  }, null, 8, ["status"])
                ]),
                _: 1
              }),
              createVNode(unref(script$3), {
                field: "created_at",
                header: "Registered"
              }, {
                body: withCtx(({ data }) => [
                  createVNode("span", { class: "text-slate-500 text-xs" }, toDisplayString(formatDate(data.created_at)), 1)
                ]),
                _: 1
              }),
              createVNode(unref(script$3), { header: "Actions" }, {
                body: withCtx(({ data }) => [
                  createVNode("div", { class: "flex gap-1.5" }, [
                    data.status === "pending" ? (openBlock(), createBlock(unref(script$d), {
                      key: 0,
                      icon: "pi pi-check",
                      size: "small",
                      severity: "success",
                      text: "",
                      title: "Approve",
                      onClick: ($event) => handleApprove([data.id])
                    }, null, 8, ["onClick"])) : createCommentVNode("", true),
                    data.status === "pending" ? (openBlock(), createBlock(unref(script$d), {
                      key: 1,
                      icon: "pi pi-times",
                      size: "small",
                      severity: "danger",
                      text: "",
                      title: "Reject",
                      onClick: ($event) => handleReject(data.id, data.full_name)
                    }, null, 8, ["onClick"])) : createCommentVNode("", true),
                    data.status === "active" ? (openBlock(), createBlock(unref(script$d), {
                      key: 2,
                      icon: "pi pi-ban",
                      size: "small",
                      severity: "warn",
                      text: "",
                      title: "Suspend",
                      onClick: ($event) => handleSuspend(data.id, data.full_name)
                    }, null, 8, ["onClick"])) : createCommentVNode("", true),
                    createVNode(_component_NuxtLink, {
                      to: `/admin/members/${data.id}`
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(script$d), {
                          icon: "pi pi-pencil",
                          size: "small",
                          text: "",
                          title: "Edit"
                        })
                      ]),
                      _: 1
                    }, 8, ["to"])
                  ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/members/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-AUUKB-Ok.mjs.map
