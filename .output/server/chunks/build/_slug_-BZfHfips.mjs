import { _ as __nuxt_component_0 } from './nuxt-link-CnvsOL_4.mjs';
import { defineComponent, withAsyncContext, ref, computed, mergeProps, withCtx, createVNode, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useEvents } from './useEvents-CAlFHVlx.mjs';
import { a as useRoute, u as useSupabaseUser, c as createError, b as useToast } from './server.mjs';
import { d as formatDateTime } from './formatters-C6FNko8Q.mjs';
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
import './useSupabaseClient-CkLFOMIR.mjs';
import 'pinia';
import 'vue-router';
import 'perfect-debounce';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "RsvpButton",
  __ssrInlineRender: true,
  props: {
    eventId: {},
    currentRsvp: {},
    rsvpEnabled: { type: Boolean },
    rsvpDeadline: {}
  },
  emits: ["change"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    useEvents();
    useToast();
    const loading = ref(false);
    const isExpired = computed(() => {
      if (!props.rsvpDeadline) return false;
      return new Date(props.rsvpDeadline) < /* @__PURE__ */ new Date();
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.rsvpEnabled && !unref(isExpired)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex gap-2" }, _attrs))}><!--[-->`);
        ssrRenderList([
          { status: "going", label: "Going", icon: "pi pi-check" },
          { status: "maybe", label: "Maybe", icon: "pi pi-question" },
          { status: "not_going", label: "Can't Go", icon: "pi pi-times" }
        ], (option) => {
          _push(`<button class="${ssrRenderClass([[
            __props.currentRsvp?.status === option.status ? "bg-primary-600 text-white border-primary-600" : "bg-white text-slate-600 border-slate-200 hover:border-primary-300"
          ], "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border"])}"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""}><i class="${ssrRenderClass([option.icon, "text-xs"])}"></i> ${ssrInterpolate(option.label)}</button>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(isExpired)) {
        _push(`<p${ssrRenderAttrs(mergeProps({ class: "text-sm text-slate-500" }, _attrs))}> RSVP deadline has passed </p>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/events/RsvpButton.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const RsvpButton = Object.assign(_sfc_main$1, { __name: "EventsRsvpButton" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[slug]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const slug = route.params.slug;
    const { fetchBySlug, fetchMyRsvpForEvent } = useEvents();
    const user = useSupabaseUser();
    const { data: event, pending } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(`event-${slug}`, () => fetchBySlug(slug))), __temp = await __temp, __restore(), __temp);
    if (!event.value && !pending.value) {
      throw createError({ statusCode: 404, statusMessage: "Event not found" });
    }
    const myRsvp = ref(null);
    if (user.value && event.value) {
      myRsvp.value = ([__temp, __restore] = withAsyncContext(() => fetchMyRsvpForEvent(event.value.id)), __temp = await __temp, __restore(), __temp);
    }
    useSeoMeta({
      title: computed(() => `${event.value?.title || "Event"} | Alumni Portal`),
      description: computed(() => event.value?.description || "")
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-3xl mx-auto px-4 py-8" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/events",
        class: "inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 mb-4"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="pi pi-arrow-left text-xs"${_scopeId}></i> Back to Events `);
          } else {
            return [
              createVNode("i", { class: "pi pi-arrow-left text-xs" }),
              createTextVNode(" Back to Events ")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(pending)) {
        _push(`<div class="bg-white border border-slate-200 rounded-xl h-96 animate-pulse"></div>`);
      } else if (unref(event)) {
        _push(`<div class="space-y-4"><div class="bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl h-48 overflow-hidden">`);
        if (unref(event).cover_image_url) {
          _push(`<img${ssrRenderAttr("src", unref(event).cover_image_url)}${ssrRenderAttr("alt", unref(event).title)} class="w-full h-full object-cover">`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="bg-white border border-slate-200 rounded-xl p-6"><div class="flex items-start justify-between gap-4 flex-wrap"><div><span class="text-xs font-medium text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full">${ssrInterpolate(unref(event).event_type)}</span><h1 class="text-2xl font-bold text-slate-900 mt-2">${ssrInterpolate(unref(event).title)}</h1></div>`);
        if (unref(user)) {
          _push(ssrRenderComponent(RsvpButton, {
            "event-id": unref(event).id,
            "current-rsvp": unref(myRsvp),
            "rsvp-enabled": unref(event).rsvp_enabled,
            "rsvp-deadline": unref(event).rsvp_deadline,
            onChange: (s) => myRsvp.value = s ? { id: 0, event_id: unref(event).id, alumni_id: unref(user).id, status: s, created_at: "" } : null
          }, null, _parent));
        } else {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/login",
            class: "px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Sign in to RSVP `);
              } else {
                return [
                  createTextVNode(" Sign in to RSVP ")
                ];
              }
            }),
            _: 1
          }, _parent));
        }
        _push(`</div><div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3"><div class="flex items-center gap-2 text-sm text-slate-600"><i class="pi pi-calendar text-primary-500"></i><span>${ssrInterpolate(unref(formatDateTime)(unref(event).start_datetime))}</span></div>`);
        if (unref(event).end_datetime) {
          _push(`<div class="flex items-center gap-2 text-sm text-slate-600"><i class="pi pi-clock text-primary-500"></i><span>Ends: ${ssrInterpolate(unref(formatDateTime)(unref(event).end_datetime))}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(event).location_name || unref(event).is_online) {
          _push(`<div class="flex items-center gap-2 text-sm text-slate-600"><i class="${ssrRenderClass([unref(event).is_online ? "pi pi-video" : "pi pi-map-marker", "text-primary-500"])}"></i><span>${ssrInterpolate(unref(event).is_online ? "Online" : unref(event).location_name)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(event).rsvp_count > 0) {
          _push(`<div class="flex items-center gap-2 text-sm text-slate-600"><i class="pi pi-users text-primary-500"></i><span>${ssrInterpolate(unref(event).rsvp_count)} attending</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(event).description) {
          _push(`<div class="mt-4 pt-4 border-t border-slate-100"><p class="text-slate-700 leading-relaxed">${ssrInterpolate(unref(event).description)}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(event).content) {
          _push(`<div class="mt-4 prose max-w-none text-sm text-slate-700">${unref(event).content ?? ""}</div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/events/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-BZfHfips.mjs.map
