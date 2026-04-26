import { _ as __nuxt_component_0 } from './nuxt-link-CnvsOL_4.mjs';
import { defineComponent, ref, reactive, watch, mergeProps, withCtx, createVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import script from './index-C99R0uVU.mjs';
import script$1 from './index-CCmoroUV.mjs';
import script$3 from './index-BkYZZ_ov.mjs';
import { a as useRoute, u as useSupabaseUser, b as useToast, s as script$d } from './server.mjs';
import script$2 from './index-DZ6eYqDQ.mjs';
import script$4 from './index-DTn3Q4mK.mjs';
import { s as slugify } from './formatters-C6FNko8Q.mjs';
import { u as useEvents } from './useEvents-CAlFHVlx.mjs';
import { u as useMembers } from './useMembers-yop5VZJc.mjs';
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
import 'pinia';
import 'vue-router';
import './index-Cg8Tg0lO.mjs';
import './index-BAEKaTcz.mjs';
import './index-DAocwqNe.mjs';
import './useSupabaseClient-CkLFOMIR.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const id = route.params.id;
    const isNew = id === "new";
    useEvents();
    useMembers();
    useSupabaseUser();
    useToast();
    useSeoMeta({ title: isNew ? "New Event | Admin" : "Edit Event | Admin", robots: "noindex" });
    const batches = ref([]);
    const saving = ref(false);
    const form = reactive({
      title: "",
      slug: "",
      description: "",
      content: "",
      start_datetime: null,
      end_datetime: null,
      location_name: "",
      location_address: "",
      is_online: false,
      online_meeting_url: "",
      event_type: "general",
      batch_year: null,
      max_attendees: null,
      cover_image_url: "",
      status: "draft",
      rsvp_enabled: true,
      rsvp_deadline: null
    });
    const eventTypes = ["reunion", "seminar", "networking", "workshop", "sports", "cultural", "general"].map((t) => ({ label: t.charAt(0).toUpperCase() + t.slice(1), value: t }));
    const statuses = ["draft", "published", "cancelled", "completed"].map((s) => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s }));
    watch(() => form.title, (title) => {
      if (isNew) form.slug = slugify(title);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-3xl space-y-4" }, _attrs))}><div class="flex items-center gap-3">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/events",
        class: "text-slate-500 hover:text-primary-600"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="pi pi-arrow-left"${_scopeId}></i>`);
          } else {
            return [
              createVNode("i", { class: "pi pi-arrow-left" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<h1 class="text-xl font-bold text-slate-900">${ssrInterpolate(isNew ? "New Event" : "Edit Event")}</h1></div><form class="space-y-4"><div class="bg-white border border-slate-200 rounded-xl p-5 space-y-4"><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Title *</label>`);
      _push(ssrRenderComponent(unref(script), {
        modelValue: unref(form).title,
        "onUpdate:modelValue": ($event) => unref(form).title = $event,
        class: "w-full"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Slug *</label>`);
      _push(ssrRenderComponent(unref(script), {
        modelValue: unref(form).slug,
        "onUpdate:modelValue": ($event) => unref(form).slug = $event,
        class: "w-full"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Description</label>`);
      _push(ssrRenderComponent(unref(script$1), {
        modelValue: unref(form).description,
        "onUpdate:modelValue": ($event) => unref(form).description = $event,
        rows: 3,
        class: "w-full"
      }, null, _parent));
      _push(`</div><div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Start Date/Time *</label>`);
      _push(ssrRenderComponent(unref(script$2), {
        modelValue: unref(form).start_datetime,
        "onUpdate:modelValue": ($event) => unref(form).start_datetime = $event,
        "show-time": "",
        "hour-format": "12",
        class: "w-full"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">End Date/Time</label>`);
      _push(ssrRenderComponent(unref(script$2), {
        modelValue: unref(form).end_datetime,
        "onUpdate:modelValue": ($event) => unref(form).end_datetime = $event,
        "show-time": "",
        "hour-format": "12",
        class: "w-full"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Event Type</label>`);
      _push(ssrRenderComponent(unref(script$3), {
        modelValue: unref(form).event_type,
        "onUpdate:modelValue": ($event) => unref(form).event_type = $event,
        options: unref(eventTypes),
        "option-label": "label",
        "option-value": "value",
        class: "w-full"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Status</label>`);
      _push(ssrRenderComponent(unref(script$3), {
        modelValue: unref(form).status,
        "onUpdate:modelValue": ($event) => unref(form).status = $event,
        options: unref(statuses),
        "option-label": "label",
        "option-value": "value",
        class: "w-full"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Batch (optional)</label>`);
      _push(ssrRenderComponent(unref(script$3), {
        modelValue: unref(form).batch_year,
        "onUpdate:modelValue": ($event) => unref(form).batch_year = $event,
        options: unref(batches),
        "option-label": "label",
        "option-value": "value",
        class: "w-full"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Max Attendees</label>`);
      _push(ssrRenderComponent(unref(script), {
        modelValue: unref(form).max_attendees,
        "onUpdate:modelValue": ($event) => unref(form).max_attendees = $event,
        type: "number",
        class: "w-full"
      }, null, _parent));
      _push(`</div></div><div class="flex items-center gap-3">`);
      _push(ssrRenderComponent(unref(script$4), {
        modelValue: unref(form).is_online,
        "onUpdate:modelValue": ($event) => unref(form).is_online = $event
      }, null, _parent));
      _push(`<label class="text-sm text-slate-700">Online Event</label></div>`);
      if (!unref(form).is_online) {
        _push(`<div><label class="block text-sm font-medium text-slate-700 mb-1.5">Location Name</label>`);
        _push(ssrRenderComponent(unref(script), {
          modelValue: unref(form).location_name,
          "onUpdate:modelValue": ($event) => unref(form).location_name = $event,
          class: "w-full"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div><label class="block text-sm font-medium text-slate-700 mb-1.5">Meeting URL</label>`);
        _push(ssrRenderComponent(unref(script), {
          modelValue: unref(form).online_meeting_url,
          "onUpdate:modelValue": ($event) => unref(form).online_meeting_url = $event,
          class: "w-full"
        }, null, _parent));
        _push(`</div>`);
      }
      _push(`<div><label class="block text-sm font-medium text-slate-700 mb-1.5">Cover Image URL</label>`);
      _push(ssrRenderComponent(unref(script), {
        modelValue: unref(form).cover_image_url,
        "onUpdate:modelValue": ($event) => unref(form).cover_image_url = $event,
        class: "w-full"
      }, null, _parent));
      _push(`</div><div class="flex items-center gap-3">`);
      _push(ssrRenderComponent(unref(script$4), {
        modelValue: unref(form).rsvp_enabled,
        "onUpdate:modelValue": ($event) => unref(form).rsvp_enabled = $event
      }, null, _parent));
      _push(`<label class="text-sm text-slate-700">Enable RSVP</label></div></div><div class="flex justify-end">`);
      _push(ssrRenderComponent(unref(script$d), {
        type: "submit",
        label: "Save Event",
        icon: "pi pi-save",
        loading: unref(saving)
      }, null, _parent));
      _push(`</div></form></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/events/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-DWlFU-qw.mjs.map
