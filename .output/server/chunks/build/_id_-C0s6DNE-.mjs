import { _ as __nuxt_component_0 } from './nuxt-link-CnvsOL_4.mjs';
import { defineComponent, ref, computed, reactive, watch, mergeProps, withCtx, createVNode, unref, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import script$1 from './index-C99R0uVU.mjs';
import script$3 from './index-CCmoroUV.mjs';
import script$2 from './index-BkYZZ_ov.mjs';
import { a as useRoute, b as useToast, s as script$d } from './server.mjs';
import script from './index-CraArxmM.mjs';
import { M as MemberStatusBadge } from './MemberStatusBadge-C10dEHYb.mjs';
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
import 'pinia';
import 'vue-router';
import './index-VzJOhjML.mjs';
import './index-Bs-6gtw7.mjs';
import './index-jauc-8K8.mjs';
import './index-BKaz9u56.mjs';
import './index-BPSEycji.mjs';
import './index-CpJNGpo_.mjs';
import './index-CaCqgKFD.mjs';
import './index-TJmuWcC9.mjs';
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
    const { approveMembers } = useMembers();
    const toast = useToast();
    const profile = ref(null);
    const loading = ref(false);
    const saving = ref(false);
    ref("");
    const batches = ref([]);
    useSeoMeta({
      title: computed(() => `${profile.value?.full_name || "Member"} | Admin`),
      robots: "noindex"
    });
    const form = reactive({
      full_name: "",
      display_name: "",
      email: "",
      batch_year: null,
      department: "",
      degree: "",
      city: "",
      country: "",
      current_job_title: "",
      current_company: "",
      bio: "",
      status: "pending",
      is_verified: false
    });
    watch(profile, (p) => {
      if (p) Object.assign(form, { ...p });
    }, { immediate: true });
    async function approve() {
      const result = await approveMembers([id]);
      if (result.success) {
        profile.value.status = "active";
        form.status = "active";
        toast.add({ severity: "success", summary: "Member approved!", life: 2e3 });
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-3xl space-y-4" }, _attrs))}><div class="flex items-center gap-3">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/members",
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
      _push(`<h1 class="text-xl font-bold text-slate-900">Edit Member</h1>`);
      if (unref(profile)) {
        _push(ssrRenderComponent(MemberStatusBadge, {
          status: unref(profile).status
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(loading)) {
        _push(`<div class="bg-white border border-slate-200 rounded-xl h-64 animate-pulse"></div>`);
      } else if (unref(profile)) {
        _push(`<!--[-->`);
        if (unref(profile).status === "pending") {
          _push(ssrRenderComponent(unref(script), {
            severity: "warn",
            closable: false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` This member is awaiting approval. `);
                _push2(ssrRenderComponent(unref(script$d), {
                  label: "Approve Now",
                  size: "small",
                  severity: "success",
                  class: "ml-3",
                  onClick: approve
                }, null, _parent2, _scopeId));
              } else {
                return [
                  createTextVNode(" This member is awaiting approval. "),
                  createVNode(unref(script$d), {
                    label: "Approve Now",
                    size: "small",
                    severity: "success",
                    class: "ml-3",
                    onClick: approve
                  })
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<form class="space-y-4"><div class="bg-white border border-slate-200 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>`);
        _push(ssrRenderComponent(unref(script$1), {
          modelValue: unref(form).full_name,
          "onUpdate:modelValue": ($event) => unref(form).full_name = $event,
          class: "w-full"
        }, null, _parent));
        _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Display Name</label>`);
        _push(ssrRenderComponent(unref(script$1), {
          modelValue: unref(form).display_name,
          "onUpdate:modelValue": ($event) => unref(form).display_name = $event,
          class: "w-full"
        }, null, _parent));
        _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Email</label>`);
        _push(ssrRenderComponent(unref(script$1), {
          modelValue: unref(form).email,
          "onUpdate:modelValue": ($event) => unref(form).email = $event,
          type: "email",
          class: "w-full",
          disabled: ""
        }, null, _parent));
        _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Graduation Batch</label>`);
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
        _push(ssrRenderComponent(unref(script$1), {
          modelValue: unref(form).department,
          "onUpdate:modelValue": ($event) => unref(form).department = $event,
          class: "w-full"
        }, null, _parent));
        _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Degree</label>`);
        _push(ssrRenderComponent(unref(script$1), {
          modelValue: unref(form).degree,
          "onUpdate:modelValue": ($event) => unref(form).degree = $event,
          class: "w-full"
        }, null, _parent));
        _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Job Title</label>`);
        _push(ssrRenderComponent(unref(script$1), {
          modelValue: unref(form).current_job_title,
          "onUpdate:modelValue": ($event) => unref(form).current_job_title = $event,
          class: "w-full"
        }, null, _parent));
        _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Company</label>`);
        _push(ssrRenderComponent(unref(script$1), {
          modelValue: unref(form).current_company,
          "onUpdate:modelValue": ($event) => unref(form).current_company = $event,
          class: "w-full"
        }, null, _parent));
        _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">City</label>`);
        _push(ssrRenderComponent(unref(script$1), {
          modelValue: unref(form).city,
          "onUpdate:modelValue": ($event) => unref(form).city = $event,
          class: "w-full"
        }, null, _parent));
        _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Country</label>`);
        _push(ssrRenderComponent(unref(script$1), {
          modelValue: unref(form).country,
          "onUpdate:modelValue": ($event) => unref(form).country = $event,
          class: "w-full"
        }, null, _parent));
        _push(`</div><div class="sm:col-span-2"><label class="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>`);
        _push(ssrRenderComponent(unref(script$3), {
          modelValue: unref(form).bio,
          "onUpdate:modelValue": ($event) => unref(form).bio = $event,
          rows: 3,
          class: "w-full"
        }, null, _parent));
        _push(`</div><div><label class="block text-sm font-medium text-slate-700 mb-1.5">Status</label>`);
        _push(ssrRenderComponent(unref(script$2), {
          modelValue: unref(form).status,
          "onUpdate:modelValue": ($event) => unref(form).status = $event,
          options: [
            { label: "Pending", value: "pending" },
            { label: "Active", value: "active" },
            { label: "Suspended", value: "suspended" },
            { label: "Rejected", value: "rejected" }
          ],
          "option-label": "label",
          "option-value": "value",
          class: "w-full"
        }, null, _parent));
        _push(`</div></div><div class="flex justify-end">`);
        _push(ssrRenderComponent(unref(script$d), {
          type: "submit",
          label: "Save Changes",
          icon: "pi pi-save",
          loading: unref(saving)
        }, null, _parent));
        _push(`</div></form><!--]-->`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/members/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-C0s6DNE-.mjs.map
