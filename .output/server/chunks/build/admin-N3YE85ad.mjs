import { _ as __nuxt_component_0 } from './nuxt-link-CnvsOL_4.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode, isRef, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderStyle, ssrRenderSlot } from 'vue/server-renderer';
import script$1 from './index-B_DH2s6Q.mjs';
import { u as useSupabaseUser, a as useRoute, n as navigateTo, s as script$d } from './server.mjs';
import script from './index-DPw8GK56.mjs';
import script$2 from './index-DpZ90853.mjs';
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
import './index-VzJOhjML.mjs';
import './index-CaCqgKFD.mjs';
import 'pinia';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "admin",
  __ssrInlineRender: true,
  setup(__props) {
    const user = useSupabaseUser();
    const supabase = useSupabaseClient();
    const route = useRoute();
    const { appName } = useSiteConfig();
    const mobileMenuOpen = ref(false);
    const sidebarCollapsed = ref(false);
    const pendingCount = ref(0);
    const navSections = computed(() => [
      {
        key: "members",
        label: "Members",
        items: [
          { label: "All Members", icon: "pi pi-users", to: "/admin/members" },
          {
            label: "Pending Approval",
            icon: "pi pi-clock",
            to: "/admin/members?status=pending",
            badge: pendingCount.value > 0 ? String(pendingCount.value) : void 0
          },
          { label: "Batches", icon: "pi pi-calendar", to: "/admin/batches" }
        ]
      },
      {
        key: "content",
        label: "Content",
        items: [
          { label: "Events", icon: "pi pi-calendar-plus", to: "/admin/events" },
          { label: "News", icon: "pi pi-megaphone", to: "/admin/news" },
          { label: "Jobs", icon: "pi pi-briefcase", to: "/admin/jobs" },
          { label: "Feed Moderation", icon: "pi pi-comments", to: "/admin/feed" }
        ]
      },
      {
        key: "settings",
        label: "Settings",
        items: [
          { label: "App Settings", icon: "pi pi-cog", to: "/admin/settings" }
        ]
      }
    ]);
    const userMenu = ref();
    const userMenuItems = ref([
      {
        label: user.value?.email || "Admin",
        items: [
          {
            label: "Sign Out",
            icon: "pi pi-sign-out",
            command: async () => {
              await supabase.auth.signOut();
              navigateTo("/admin/login");
            }
          }
        ]
      }
    ]);
    function toggleUserMenu(event) {
      userMenu.value.toggle(event);
    }
    function isActive(path) {
      if (route.path === path) return true;
      if (route.path.startsWith(`${path}/`)) {
        const allNavPaths = navSections.value.flatMap((s) => s.items.map((i) => i.to));
        const hasMoreSpecificMatch = allNavPaths.some((p) => p !== path && route.path.startsWith(p));
        return !hasMoreSpecificMatch;
      }
      return false;
    }
    function navigateAndClose(to) {
      navigateTo(to);
      mobileMenuOpen.value = false;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-100" }, _attrs))}><aside class="${ssrRenderClass([unref(sidebarCollapsed) ? "w-16" : "w-60", "fixed left-0 top-0 z-40 h-screen bg-white border-r border-slate-200 transition-all duration-300 hidden lg:block"])}"><div class="flex h-14 items-center justify-between px-3 border-b border-slate-100">`);
      if (!unref(sidebarCollapsed)) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/admin/dashboard",
          class: "flex items-center gap-2"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white font-bold text-sm"${_scopeId}> A </div><div${_scopeId}><p class="font-semibold text-slate-900 text-sm leading-tight"${_scopeId}>${ssrInterpolate(unref(appName))}</p><p class="text-[10px] text-slate-400"${_scopeId}>Admin Panel</p></div>`);
            } else {
              return [
                createVNode("div", { class: "flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white font-bold text-sm" }, " A "),
                createVNode("div", null, [
                  createVNode("p", { class: "font-semibold text-slate-900 text-sm leading-tight" }, toDisplayString(unref(appName)), 1),
                  createVNode("p", { class: "text-[10px] text-slate-400" }, "Admin Panel")
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<div class="w-full flex justify-center"><div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white font-bold text-sm"> A </div></div>`);
      }
      _push(`</div><nav class="flex flex-col h-[calc(100vh-3.5rem)] overflow-y-auto"><div class="flex-1 py-3 px-2">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/dashboard",
        class: ["flex items-center gap-3 rounded-lg px-3 py-2 mb-2 text-sm font-medium transition-colors", [
          isActive("/admin/dashboard") ? "bg-primary-50 text-primary-700" : "text-slate-600 hover:bg-slate-50"
        ]],
        title: unref(sidebarCollapsed) ? "Dashboard" : void 0
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="pi pi-th-large"${_scopeId}></i>`);
            if (!unref(sidebarCollapsed)) {
              _push2(`<span${_scopeId}>Dashboard</span>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("i", { class: "pi pi-th-large" }),
              !unref(sidebarCollapsed) ? (openBlock(), createBlock("span", { key: 0 }, "Dashboard")) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--[-->`);
      ssrRenderList(unref(navSections), (section) => {
        _push(`<div class="mb-4">`);
        if (!unref(sidebarCollapsed)) {
          _push(`<div class="flex items-center justify-between px-3 py-1.5"><p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">${ssrInterpolate(section.label)}</p></div>`);
        } else {
          _push(`<div class="border-t border-slate-100 my-2"></div>`);
        }
        _push(`<!--[-->`);
        ssrRenderList(section.items, (item) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: item.to,
            to: item.to,
            class: ["flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors", [
              isActive(item.to) ? "bg-primary-50 text-primary-700 font-medium" : "text-slate-600 hover:bg-slate-50"
            ]],
            title: unref(sidebarCollapsed) ? item.label : void 0
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<i class="${ssrRenderClass([item.icon, "text-base"])}"${_scopeId}></i>`);
                if (!unref(sidebarCollapsed)) {
                  _push2(`<span class="flex-1"${_scopeId}>${ssrInterpolate(item.label)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                if (!unref(sidebarCollapsed) && item.badge) {
                  _push2(`<span class="text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full"${_scopeId}>${ssrInterpolate(item.badge)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
              } else {
                return [
                  createVNode("i", {
                    class: [item.icon, "text-base"]
                  }, null, 2),
                  !unref(sidebarCollapsed) ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "flex-1"
                  }, toDisplayString(item.label), 1)) : createCommentVNode("", true),
                  !unref(sidebarCollapsed) && item.badge ? (openBlock(), createBlock("span", {
                    key: 1,
                    class: "text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full"
                  }, toDisplayString(item.badge), 1)) : createCommentVNode("", true)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      });
      _push(`<!--]--></div><div class="border-t border-slate-100 p-2">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        target: "_blank",
        class: "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 transition-colors",
        title: unref(sidebarCollapsed) ? "View Site" : void 0
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="pi pi-external-link"${_scopeId}></i>`);
            if (!unref(sidebarCollapsed)) {
              _push2(`<span${_scopeId}>View Site</span>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("i", { class: "pi pi-external-link" }),
              !unref(sidebarCollapsed) ? (openBlock(), createBlock("span", { key: 0 }, "View Site")) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button class="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 transition-colors"><i class="${ssrRenderClass(unref(sidebarCollapsed) ? "pi pi-angle-double-right" : "pi pi-angle-double-left")}"></i>`);
      if (!unref(sidebarCollapsed)) {
        _push(`<span>Collapse</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button></div></nav></aside><header class="${ssrRenderClass([unref(sidebarCollapsed) ? "lg:left-16" : "lg:left-60", "fixed top-0 right-0 z-30 h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 transition-all duration-300"])}" style="${ssrRenderStyle({ "left": "0" })}"><div class="flex items-center gap-3">`);
      _push(ssrRenderComponent(unref(script$d), {
        icon: "pi pi-bars",
        text: "",
        rounded: "",
        class: "lg:hidden text-slate-600",
        onClick: ($event) => mobileMenuOpen.value = true
      }, null, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/dashboard",
        class: "lg:hidden flex items-center gap-2"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-600 text-white font-bold text-xs"${_scopeId}> A </div>`);
          } else {
            return [
              createVNode("div", { class: "flex h-7 w-7 items-center justify-center rounded-lg bg-primary-600 text-white font-bold text-xs" }, " A ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="flex items-center gap-3"><span class="text-sm text-slate-500 hidden sm:inline">${ssrInterpolate(unref(user)?.email)}</span>`);
      _push(ssrRenderComponent(unref(script$d), {
        text: "",
        rounded: "",
        class: "p-0",
        onClick: toggleUserMenu
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(script), {
              label: unref(user)?.email?.charAt(0).toUpperCase() || "A",
              shape: "circle",
              class: "bg-primary-100 text-primary-700",
              style: { "width": "32px", "height": "32px" }
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(script), {
                label: unref(user)?.email?.charAt(0).toUpperCase() || "A",
                shape: "circle",
                class: "bg-primary-100 text-primary-700",
                style: { "width": "32px", "height": "32px" }
              }, null, 8, ["label"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(script$1), {
        ref_key: "userMenu",
        ref: userMenu,
        model: unref(userMenuItems),
        popup: ""
      }, null, _parent));
      _push(`</div></header>`);
      _push(ssrRenderComponent(unref(script$2), {
        visible: unref(mobileMenuOpen),
        "onUpdate:visible": ($event) => isRef(mobileMenuOpen) ? mobileMenuOpen.value = $event : null,
        position: "left",
        class: "w-72",
        "show-close-icon": true
      }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center gap-2"${_scopeId}><div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white font-bold text-sm"${_scopeId}> A </div><div${_scopeId}><p class="font-semibold text-slate-900"${_scopeId}>${ssrInterpolate(unref(appName))}</p><p class="text-xs text-slate-500"${_scopeId}>Admin Panel</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center gap-2" }, [
                createVNode("div", { class: "flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white font-bold text-sm" }, " A "),
                createVNode("div", null, [
                  createVNode("p", { class: "font-semibold text-slate-900" }, toDisplayString(unref(appName)), 1),
                  createVNode("p", { class: "text-xs text-slate-500" }, "Admin Panel")
                ])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<nav class="py-2"${_scopeId}><button class="${ssrRenderClass([[
              isActive("/admin/dashboard") ? "bg-primary-50 text-primary-700 font-medium" : "text-slate-700 hover:bg-slate-50"
            ], "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"])}"${_scopeId}><i class="pi pi-th-large"${_scopeId}></i><span${_scopeId}>Dashboard</span></button><!--[-->`);
            ssrRenderList(unref(navSections), (section) => {
              _push2(`<div class="mt-4"${_scopeId}><div class="flex items-center justify-between px-4 py-1.5"${_scopeId}><p class="text-xs font-semibold uppercase tracking-wider text-slate-400"${_scopeId}>${ssrInterpolate(section.label)}</p></div><!--[-->`);
              ssrRenderList(section.items, (item) => {
                _push2(`<button class="${ssrRenderClass([[
                  isActive(item.to) ? "bg-primary-50 text-primary-700 font-medium" : "text-slate-700 hover:bg-slate-50"
                ], "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"])}"${_scopeId}><i class="${ssrRenderClass(item.icon)}"${_scopeId}></i><span class="flex-1"${_scopeId}>${ssrInterpolate(item.label)}</span>`);
                if (item.badge) {
                  _push2(`<span class="text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full"${_scopeId}>${ssrInterpolate(item.badge)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</button>`);
              });
              _push2(`<!--]--></div>`);
            });
            _push2(`<!--]--><div class="mt-6 pt-4 border-t border-slate-100"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/",
              target: "_blank",
              class: "flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<i class="pi pi-external-link"${_scopeId2}></i><span${_scopeId2}>View Site</span>`);
                } else {
                  return [
                    createVNode("i", { class: "pi pi-external-link" }),
                    createVNode("span", null, "View Site")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></nav>`);
          } else {
            return [
              createVNode("nav", { class: "py-2" }, [
                createVNode("button", {
                  class: ["w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors", [
                    isActive("/admin/dashboard") ? "bg-primary-50 text-primary-700 font-medium" : "text-slate-700 hover:bg-slate-50"
                  ]],
                  onClick: ($event) => navigateAndClose("/admin/dashboard")
                }, [
                  createVNode("i", { class: "pi pi-th-large" }),
                  createVNode("span", null, "Dashboard")
                ], 10, ["onClick"]),
                (openBlock(true), createBlock(Fragment, null, renderList(unref(navSections), (section) => {
                  return openBlock(), createBlock("div", {
                    key: section.key,
                    class: "mt-4"
                  }, [
                    createVNode("div", { class: "flex items-center justify-between px-4 py-1.5" }, [
                      createVNode("p", { class: "text-xs font-semibold uppercase tracking-wider text-slate-400" }, toDisplayString(section.label), 1)
                    ]),
                    (openBlock(true), createBlock(Fragment, null, renderList(section.items, (item) => {
                      return openBlock(), createBlock("button", {
                        key: item.to,
                        class: ["w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors", [
                          isActive(item.to) ? "bg-primary-50 text-primary-700 font-medium" : "text-slate-700 hover:bg-slate-50"
                        ]],
                        onClick: ($event) => navigateAndClose(item.to)
                      }, [
                        createVNode("i", {
                          class: item.icon
                        }, null, 2),
                        createVNode("span", { class: "flex-1" }, toDisplayString(item.label), 1),
                        item.badge ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: "text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full"
                        }, toDisplayString(item.badge), 1)) : createCommentVNode("", true)
                      ], 10, ["onClick"]);
                    }), 128))
                  ]);
                }), 128)),
                createVNode("div", { class: "mt-6 pt-4 border-t border-slate-100" }, [
                  createVNode(_component_NuxtLink, {
                    to: "/",
                    target: "_blank",
                    class: "flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50"
                  }, {
                    default: withCtx(() => [
                      createVNode("i", { class: "pi pi-external-link" }),
                      createVNode("span", null, "View Site")
                    ]),
                    _: 1
                  })
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<main class="${ssrRenderClass([unref(sidebarCollapsed) ? "lg:ml-16" : "lg:ml-60", "pt-14 min-h-screen transition-all duration-300"])}"><div class="p-4 lg:p-6">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></main></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/admin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=admin-N3YE85ad.mjs.map
