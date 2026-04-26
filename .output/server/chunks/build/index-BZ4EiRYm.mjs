import { _ as __nuxt_component_0 } from './nuxt-link-CnvsOL_4.mjs';
import { defineComponent, withAsyncContext, unref, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { A as ArticleCard } from './ArticleCard-DApcQYyr.mjs';
import { E as EventCard } from './EventCard-hRPrtdsD.mjs';
import { J as JobCard } from './JobCard-B_N1U9oC.mjs';
import { u as useSeoMeta } from './composables-CsCDbOcR.mjs';
import { u as useNews } from './useNews-DRldL6Pu.mjs';
import { u as useEvents } from './useEvents-CAlFHVlx.mjs';
import { u as useJobs } from './useJobs-CxDM5wuT.mjs';
import { u as useSiteConfig } from './useSiteConfig-2EOf2j81.mjs';
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
import './server.mjs';
import 'pinia';
import 'vue-router';
import './formatters-C6FNko8Q.mjs';
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
    useSeoMeta({
      title: "Alumni Portal — Stay Connected",
      description: "The official alumni network. Connect with batchmates, discover events, news, and opportunities."
    });
    const { fetchArticles } = useNews();
    const { fetchEvents } = useEvents();
    const { fetchJobs } = useJobs();
    const { appName, institutionName, tagline } = useSiteConfig();
    const { data: articles } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "home-articles",
      () => fetchArticles({ perPage: 3, featured: true })
    )), __temp = await __temp, __restore(), __temp);
    const { data: events } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "home-events",
      () => fetchEvents({ upcoming: true, perPage: 3 })
    )), __temp = await __temp, __restore(), __temp);
    const { data: jobs } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "home-jobs",
      () => fetchJobs({ perPage: 4, featured: true })
    )), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><section class="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white py-20 px-4"><div class="max-w-4xl mx-auto text-center"><h1 class="text-4xl md:text-5xl font-bold mb-4 leading-tight"> Welcome to ${ssrInterpolate(unref(appName))}</h1><p class="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">${ssrInterpolate(unref(tagline))}</p><div class="flex flex-col sm:flex-row gap-3 justify-center">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/register",
        class: "px-6 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Join the Network `);
          } else {
            return [
              createTextVNode(" Join the Network ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/directory",
        class: "px-6 py-3 border border-primary-300 text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Browse Alumni `);
          } else {
            return [
              createTextVNode(" Browse Alumni ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></section><section class="bg-white border-b border-slate-200 py-10 px-4"><div class="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center"><div><p class="text-3xl font-bold text-primary-600">500+</p><p class="text-slate-500 text-sm mt-1">Active Alumni</p></div><div><p class="text-3xl font-bold text-primary-600">20+</p><p class="text-slate-500 text-sm mt-1">Batches</p></div><div><p class="text-3xl font-bold text-primary-600">50+</p><p class="text-slate-500 text-sm mt-1">Countries</p></div><div><p class="text-3xl font-bold text-primary-600">100+</p><p class="text-slate-500 text-sm mt-1">Events Hosted</p></div></div></section><div class="max-w-6xl mx-auto px-4 py-12 space-y-16">`);
      if (unref(events) && unref(events).length > 0) {
        _push(`<section><div class="flex items-center justify-between mb-6"><h2 class="text-2xl font-bold text-slate-900">Upcoming Events</h2>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/events",
          class: "text-primary-600 hover:underline text-sm font-medium"
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
        _push(`</div><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"><!--[-->`);
        ssrRenderList(unref(events), (event) => {
          _push(ssrRenderComponent(EventCard, {
            key: event.id,
            event
          }, null, _parent));
        });
        _push(`<!--]--></div></section>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(articles) && unref(articles).length > 0) {
        _push(`<section><div class="flex items-center justify-between mb-6"><h2 class="text-2xl font-bold text-slate-900">Latest News</h2>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/news",
          class: "text-primary-600 hover:underline text-sm font-medium"
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
        _push(`</div><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"><!--[-->`);
        ssrRenderList(unref(articles), (article) => {
          _push(ssrRenderComponent(ArticleCard, {
            key: article.id,
            article
          }, null, _parent));
        });
        _push(`<!--]--></div></section>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(jobs) && unref(jobs).length > 0) {
        _push(`<section><div class="flex items-center justify-between mb-6"><h2 class="text-2xl font-bold text-slate-900">Job Opportunities</h2>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/jobs",
          class: "text-primary-600 hover:underline text-sm font-medium"
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
        _push(`</div><div class="grid grid-cols-1 md:grid-cols-2 gap-3"><!--[-->`);
        ssrRenderList(unref(jobs), (job) => {
          _push(ssrRenderComponent(JobCard, {
            key: job.id,
            job
          }, null, _parent));
        });
        _push(`<!--]--></div></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<section class="bg-primary-50 rounded-2xl p-8 text-center"><h2 class="text-2xl font-bold text-slate-900 mb-2">Are you an alumnus of ${ssrInterpolate(unref(institutionName))}?</h2><p class="text-slate-600 mb-6">Join the community to connect with your batchmates, RSVP to events, and more.</p>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/register",
        class: "inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="pi pi-user-plus"${_scopeId}></i> Register Now `);
          } else {
            return [
              createVNode("i", { class: "pi pi-user-plus" }),
              createTextVNode(" Register Now ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</section></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BZ4EiRYm.mjs.map
