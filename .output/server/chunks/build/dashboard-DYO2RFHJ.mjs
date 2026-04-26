import { _ as __nuxt_component_0 } from './nuxt-link-CnvsOL_4.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createVNode, toDisplayString, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent, ssrRenderClass } from 'vue/server-renderer';
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
import './server.mjs';
import 'pinia';
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Dashboard | Admin", robots: "noindex" });
    useSupabaseClient();
    const { appName } = useSiteConfig();
    const stats = ref({
      pendingMembers: 0,
      activeMembers: 0,
      upcomingEvents: 0,
      publishedArticles: 0,
      openJobs: 0,
      recentPosts: 0
    });
    const recentPendingMembers = ref([]);
    const statCards = computed(() => [
      { label: "Pending Approvals", value: stats.value.pendingMembers, icon: "pi pi-clock", color: "text-amber-600 bg-amber-50", to: "/admin/members?status=pending", urgent: stats.value.pendingMembers > 0 },
      { label: "Active Members", value: stats.value.activeMembers, icon: "pi pi-users", color: "text-green-600 bg-green-50", to: "/admin/members" },
      { label: "Upcoming Events", value: stats.value.upcomingEvents, icon: "pi pi-calendar", color: "text-blue-600 bg-blue-50", to: "/admin/events" },
      { label: "Published Articles", value: stats.value.publishedArticles, icon: "pi pi-megaphone", color: "text-purple-600 bg-purple-50", to: "/admin/news" },
      { label: "Open Jobs", value: stats.value.openJobs, icon: "pi pi-briefcase", color: "text-orange-600 bg-orange-50", to: "/admin/jobs" },
      { label: "Posts This Week", value: stats.value.recentPosts, icon: "pi pi-comments", color: "text-sky-600 bg-sky-50", to: "/admin/feed" }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div><h1 class="text-2xl font-bold text-slate-900">Dashboard</h1><p class="text-slate-500 text-sm">Welcome to ${ssrInterpolate(unref(appName))} Admin Panel</p></div><div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"><!--[-->`);
      ssrRenderList(unref(statCards), (card) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: card.label,
          to: card.to,
          class: ["bg-white border rounded-xl p-4 hover:shadow-sm transition-all", card.urgent ? "border-amber-200" : "border-slate-200"]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center gap-2 mb-2"${_scopeId}><div class="${ssrRenderClass([card.color, "w-8 h-8 rounded-lg flex items-center justify-center"])}"${_scopeId}><i class="${ssrRenderClass([card.icon, "text-sm"])}"${_scopeId}></i></div></div><p class="text-2xl font-bold text-slate-900"${_scopeId}>${ssrInterpolate(card.value)}</p><p class="text-xs text-slate-500 mt-0.5"${_scopeId}>${ssrInterpolate(card.label)}</p>`);
            } else {
              return [
                createVNode("div", { class: "flex items-center gap-2 mb-2" }, [
                  createVNode("div", {
                    class: ["w-8 h-8 rounded-lg flex items-center justify-center", card.color]
                  }, [
                    createVNode("i", {
                      class: [card.icon, "text-sm"]
                    }, null, 2)
                  ], 2)
                ]),
                createVNode("p", { class: "text-2xl font-bold text-slate-900" }, toDisplayString(card.value), 1),
                createVNode("p", { class: "text-xs text-slate-500 mt-0.5" }, toDisplayString(card.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div>`);
      if (unref(recentPendingMembers).length > 0) {
        _push(`<div class="bg-white border border-amber-200 rounded-xl p-5"><div class="flex items-center justify-between mb-4"><h2 class="font-semibold text-slate-900 flex items-center gap-2"><i class="pi pi-clock text-amber-500"></i> Pending Approvals </h2>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/admin/members?status=pending",
          class: "text-sm text-primary-600 hover:underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` View all → `);
            } else {
              return [
                createTextVNode(" View all → ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="space-y-2"><!--[-->`);
        ssrRenderList(unref(recentPendingMembers), (member) => {
          _push(`<div class="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"><div><p class="text-sm font-medium text-slate-800">${ssrInterpolate(member.full_name)}</p><p class="text-xs text-slate-500">${ssrInterpolate(member.email)}`);
          if (member.batch_year) {
            _push(`<span> · Class of ${ssrInterpolate(member.batch_year)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</p></div>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/admin/members/${member.id}`,
            class: "text-xs text-primary-600 hover:underline"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Review `);
              } else {
                return [
                  createTextVNode(" Review ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"><!--[-->`);
      ssrRenderList([
        { label: "Add Event", icon: "pi pi-calendar-plus", to: "/admin/events/new", color: "bg-blue-50 text-blue-700" },
        { label: "Write Article", icon: "pi pi-file-edit", to: "/admin/news/new", color: "bg-purple-50 text-purple-700" },
        { label: "Post Job", icon: "pi pi-briefcase", to: "/admin/jobs/new", color: "bg-orange-50 text-orange-700" },
        { label: "App Settings", icon: "pi pi-cog", to: "/admin/settings", color: "bg-slate-50 text-slate-700" }
      ], (link) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: link.to,
          to: link.to,
          class: ["flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:shadow-sm transition-all", link.color.replace("text-", "hover:border-").replace("700", "300")]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="${ssrRenderClass([link.color, "w-9 h-9 rounded-lg flex items-center justify-center"])}"${_scopeId}><i class="${ssrRenderClass(link.icon)}"${_scopeId}></i></div><span class="font-medium text-slate-800"${_scopeId}>${ssrInterpolate(link.label)}</span>`);
            } else {
              return [
                createVNode("div", {
                  class: ["w-9 h-9 rounded-lg flex items-center justify-center", link.color]
                }, [
                  createVNode("i", {
                    class: link.icon
                  }, null, 2)
                ], 2),
                createVNode("span", { class: "font-medium text-slate-800" }, toDisplayString(link.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=dashboard-DYO2RFHJ.mjs.map
