import { _ as __nuxt_component_0 } from './nuxt-link-CnvsOL_4.mjs';
import { defineComponent, withAsyncContext, computed, mergeProps, withCtx, createVNode, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { c as formatDate } from './formatters-C6FNko8Q.mjs';
import { a as useRoute, c as createError } from './server.mjs';
import { u as useNews } from './useNews-DRldL6Pu.mjs';
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
    const { fetchBySlug } = useNews();
    const { data: article, pending } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(`article-${slug}`, () => fetchBySlug(slug))), __temp = await __temp, __restore(), __temp);
    if (!article.value && !pending.value) {
      throw createError({ statusCode: 404, statusMessage: "Article not found" });
    }
    useSeoMeta({
      title: computed(() => article.value?.meta_title || article.value?.title || "Article"),
      description: computed(() => article.value?.meta_description || article.value?.excerpt || ""),
      ogImage: computed(() => article.value?.og_image_url || article.value?.featured_image_url || "")
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-3xl mx-auto px-4 py-8" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/news",
        class: "inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 mb-4"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="pi pi-arrow-left text-xs"${_scopeId}></i> Back to News `);
          } else {
            return [
              createVNode("i", { class: "pi pi-arrow-left text-xs" }),
              createTextVNode(" Back to News ")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(pending)) {
        _push(`<div class="space-y-4"><div class="bg-slate-200 rounded-xl h-64 animate-pulse"></div><div class="h-8 bg-slate-200 rounded w-3/4 animate-pulse"></div></div>`);
      } else if (unref(article)) {
        _push(`<article>`);
        if (unref(article).featured_image_url) {
          _push(`<img${ssrRenderAttr("src", unref(article).featured_image_url)}${ssrRenderAttr("alt", unref(article).title)} class="w-full rounded-xl h-64 object-cover mb-6">`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex items-center gap-2 mb-3">`);
        if (unref(article).category) {
          _push(`<span class="text-xs font-medium px-2 py-0.5 rounded-full bg-primary-50 text-primary-700">${ssrInterpolate(unref(article).category.name)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span class="text-sm text-slate-400">${ssrInterpolate(unref(formatDate)(unref(article).published_at))}</span>`);
        if (unref(article).reading_time_minutes) {
          _push(`<span class="text-sm text-slate-400">· ${ssrInterpolate(unref(article).reading_time_minutes)} min read</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><h1 class="text-3xl font-bold text-slate-900 leading-tight mb-2">${ssrInterpolate(unref(article).title)}</h1>`);
        if (unref(article).subtitle) {
          _push(`<p class="text-xl text-slate-600 mb-4">${ssrInterpolate(unref(article).subtitle)}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(article).author_name) {
          _push(`<div class="flex items-center gap-2 mb-6 pb-6 border-b border-slate-200">`);
          if (unref(article).author_avatar_url) {
            _push(`<img${ssrRenderAttr("src", unref(article).author_avatar_url)} class="w-8 h-8 rounded-full" alt="Author">`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div><p class="text-sm font-medium text-slate-800">${ssrInterpolate(unref(article).author_name)}</p>`);
          if (unref(article).author_bio) {
            _push(`<p class="text-xs text-slate-500">${ssrInterpolate(unref(article).author_bio)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(article).content) {
          _push(`<div class="prose prose-slate max-w-none text-slate-700 leading-relaxed">${unref(article).content ?? ""}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</article>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/news/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-CLnOJp3a.mjs.map
