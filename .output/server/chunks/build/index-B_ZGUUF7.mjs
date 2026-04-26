import { defineComponent, ref, reactive, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import script from './index-C99R0uVU.mjs';
import script$1 from './index-CCmoroUV.mjs';
import script$2 from './index-BkYZZ_ov.mjs';
import { b as useToast, s as script$d } from './server.mjs';
import script$3 from './index-DTn3Q4mK.mjs';
import { u as useAuthStore } from './auth-Dh-LrX0c.mjs';
import { u as useSeoMeta } from './composables-CsCDbOcR.mjs';
import { u as useSupabaseClient } from './useSupabaseClient-CkLFOMIR.mjs';
import { u as useMembers } from './useMembers-yop5VZJc.mjs';
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
    useSeoMeta({ title: "My Profile | Alumni Portal", robots: "noindex" });
    const authStore = useAuthStore();
    useSupabaseClient();
    useToast();
    useMembers();
    const batches = ref([]);
    const form = reactive({
      full_name: "",
      display_name: "",
      bio: "",
      batch_year: null,
      department: "",
      degree: "",
      graduation_year: null,
      city: "",
      country: "",
      phone: "",
      current_job_title: "",
      current_company: "",
      industry: "",
      show_email: false,
      show_phone: false,
      show_dob: false
    });
    watch(() => authStore.profile, (profile) => {
      if (profile) {
        Object.assign(form, {
          full_name: profile.full_name || "",
          display_name: profile.display_name || "",
          bio: profile.bio || "",
          batch_year: profile.batch_year,
          department: profile.department || "",
          degree: profile.degree || "",
          graduation_year: profile.graduation_year,
          city: profile.city || "",
          country: profile.country || "",
          phone: profile.phone || "",
          current_job_title: profile.current_job_title || "",
          current_company: profile.current_company || "",
          industry: profile.industry || "",
          show_email: profile.show_email,
          show_phone: profile.show_phone,
          show_dob: profile.show_dob
        });
      }
    }, { immediate: true });
    const saving = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-2xl mx-auto space-y-6" }, _attrs))}><div><h1 class="text-2xl font-bold text-slate-900">My Profile</h1><p class="text-slate-500 text-sm mt-1">Update your alumni profile information</p></div><form class="space-y-6"><div class="bg-white border border-slate-200 rounded-xl p-5 space-y-4"><h2 class="font-semibold text-slate-900">Basic Information</h2><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>`);
      _push(ssrRenderComponent(unref(script), {
        modelValue: unref(form).full_name,
        "onUpdate:modelValue": ($event) => unref(form).full_name = $event,
        class: "w-full",
        placeholder: "Your full name"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Display Name</label>`);
      _push(ssrRenderComponent(unref(script), {
        modelValue: unref(form).display_name,
        "onUpdate:modelValue": ($event) => unref(form).display_name = $event,
        class: "w-full",
        placeholder: "Shown publicly"
      }, null, _parent));
      _push(`</div></div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>`);
      _push(ssrRenderComponent(unref(script$1), {
        modelValue: unref(form).bio,
        "onUpdate:modelValue": ($event) => unref(form).bio = $event,
        rows: 3,
        class: "w-full",
        placeholder: "Tell your alumni community about yourself"
      }, null, _parent));
      _push(`</div></div><div class="bg-white border border-slate-200 rounded-xl p-5 space-y-4"><h2 class="font-semibold text-slate-900">Academic Information</h2><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Graduation Year</label>`);
      _push(ssrRenderComponent(unref(script$2), {
        modelValue: unref(form).batch_year,
        "onUpdate:modelValue": ($event) => unref(form).batch_year = $event,
        options: unref(batches),
        "option-label": "label",
        "option-value": "value",
        placeholder: "Select batch",
        class: "w-full"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Department</label>`);
      _push(ssrRenderComponent(unref(script), {
        modelValue: unref(form).department,
        "onUpdate:modelValue": ($event) => unref(form).department = $event,
        class: "w-full",
        placeholder: "e.g. Computer Science"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Degree</label>`);
      _push(ssrRenderComponent(unref(script), {
        modelValue: unref(form).degree,
        "onUpdate:modelValue": ($event) => unref(form).degree = $event,
        class: "w-full",
        placeholder: "e.g. BSc, MSc"
      }, null, _parent));
      _push(`</div></div></div><div class="bg-white border border-slate-200 rounded-xl p-5 space-y-4"><h2 class="font-semibold text-slate-900">Professional Information</h2><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Job Title</label>`);
      _push(ssrRenderComponent(unref(script), {
        modelValue: unref(form).current_job_title,
        "onUpdate:modelValue": ($event) => unref(form).current_job_title = $event,
        class: "w-full",
        placeholder: "e.g. Software Engineer"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Company</label>`);
      _push(ssrRenderComponent(unref(script), {
        modelValue: unref(form).current_company,
        "onUpdate:modelValue": ($event) => unref(form).current_company = $event,
        class: "w-full",
        placeholder: "Current employer"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Industry</label>`);
      _push(ssrRenderComponent(unref(script), {
        modelValue: unref(form).industry,
        "onUpdate:modelValue": ($event) => unref(form).industry = $event,
        class: "w-full",
        placeholder: "e.g. Technology"
      }, null, _parent));
      _push(`</div></div></div><div class="bg-white border border-slate-200 rounded-xl p-5 space-y-4"><h2 class="font-semibold text-slate-900">Location &amp; Contact</h2><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-slate-700 mb-1.5">City</label>`);
      _push(ssrRenderComponent(unref(script), {
        modelValue: unref(form).city,
        "onUpdate:modelValue": ($event) => unref(form).city = $event,
        class: "w-full",
        placeholder: "Your city"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Country</label>`);
      _push(ssrRenderComponent(unref(script), {
        modelValue: unref(form).country,
        "onUpdate:modelValue": ($event) => unref(form).country = $event,
        class: "w-full",
        placeholder: "Your country"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>`);
      _push(ssrRenderComponent(unref(script), {
        modelValue: unref(form).phone,
        "onUpdate:modelValue": ($event) => unref(form).phone = $event,
        class: "w-full",
        placeholder: "Phone number"
      }, null, _parent));
      _push(`</div></div></div><div class="bg-white border border-slate-200 rounded-xl p-5 space-y-3"><h2 class="font-semibold text-slate-900">Privacy Settings</h2><p class="text-sm text-slate-500">Control what other alumni can see on your profile</p><!--[-->`);
      ssrRenderList([
        { field: "show_email", label: "Show email address to other alumni" },
        { field: "show_phone", label: "Show phone number to other alumni" },
        { field: "show_dob", label: "Show date of birth to other alumni" }
      ], (item) => {
        _push(`<div class="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"><span class="text-sm text-slate-700">${ssrInterpolate(item.label)}</span>`);
        _push(ssrRenderComponent(unref(script$3), {
          modelValue: unref(form)[item.field],
          "onUpdate:modelValue": ($event) => unref(form)[item.field] = $event
        }, null, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div><div class="flex justify-end">`);
      _push(ssrRenderComponent(unref(script$d), {
        type: "submit",
        label: "Save Profile",
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-B_ZGUUF7.mjs.map
