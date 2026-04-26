import { _ as __nuxt_component_0 } from './nuxt-link-CnvsOL_4.mjs';
import { defineComponent, withAsyncContext, computed, mergeProps, withCtx, createVNode, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { a as useRoute, u as useSupabaseUser, c as createError } from './server.mjs';
import { u as useMembers } from './useMembers-yop5VZJc.mjs';
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

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "MemberProfileHeader",
  __ssrInlineRender: true,
  props: {
    profile: {},
    isOwnProfile: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white border border-slate-200 rounded-xl overflow-hidden" }, _attrs))}><div class="h-32 bg-gradient-to-br from-primary-600 to-primary-800 relative">`);
      if (__props.profile.cover_photo_url) {
        _push(`<img${ssrRenderAttr("src", __props.profile.cover_photo_url)} alt="Cover" class="w-full h-full object-cover">`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="px-6 pb-6"><div class="flex justify-between items-end -mt-12 mb-4"><div class="relative">`);
      if (__props.profile.avatar_url) {
        _push(`<img${ssrRenderAttr("src", __props.profile.avatar_url)}${ssrRenderAttr("alt", __props.profile.full_name)} class="w-20 h-20 rounded-full border-4 border-white object-cover">`);
      } else {
        _push(`<div class="w-20 h-20 rounded-full border-4 border-white bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-2xl">${ssrInterpolate(__props.profile.full_name.charAt(0).toUpperCase())}</div>`);
      }
      if (__props.profile.is_verified) {
        _push(`<div class="absolute bottom-0 right-0 bg-primary-500 text-white rounded-full w-6 h-6 flex items-center justify-center" title="Verified Alumni"><i class="pi pi-check text-xs"></i></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (__props.isOwnProfile) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/profile",
          class: "text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<i class="pi pi-pencil text-xs"${_scopeId}></i> Edit Profile `);
            } else {
              return [
                createVNode("i", { class: "pi pi-pencil text-xs" }),
                createTextVNode(" Edit Profile ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><h1 class="text-xl font-bold text-slate-900">${ssrInterpolate(__props.profile.display_name || __props.profile.full_name)}</h1>`);
      if (__props.profile.current_job_title) {
        _push(`<p class="text-slate-600 mt-0.5">${ssrInterpolate(__props.profile.current_job_title)} `);
        if (__props.profile.current_company) {
          _push(`<span> at ${ssrInterpolate(__props.profile.current_company)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex flex-wrap gap-3 mt-3">`);
      if (__props.profile.batch_year) {
        _push(`<span class="inline-flex items-center gap-1 text-sm text-primary-700 bg-primary-50 px-3 py-1 rounded-full font-medium"><i class="pi pi-graduation-cap text-xs"></i> Class of ${ssrInterpolate(__props.profile.batch_year)}</span>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.profile.department) {
        _push(`<span class="inline-flex items-center gap-1 text-sm text-slate-600"><i class="pi pi-book text-xs"></i> ${ssrInterpolate(__props.profile.department)}</span>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.profile.city || __props.profile.country) {
        _push(`<span class="inline-flex items-center gap-1 text-sm text-slate-600"><i class="pi pi-map-marker text-xs"></i> ${ssrInterpolate([__props.profile.city, __props.profile.country].filter(Boolean).join(", "))}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (__props.profile.bio) {
        _push(`<p class="mt-3 text-sm text-slate-600 leading-relaxed">${ssrInterpolate(__props.profile.bio)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/member/MemberProfileHeader.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const MemberProfileHeader = Object.assign(_sfc_main$1, { __name: "MemberProfileHeader" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const id = route.params.id;
    const { fetchProfileWithDetails } = useMembers();
    const user = useSupabaseUser();
    const { data, pending, error } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      `profile-${id}`,
      () => fetchProfileWithDetails(id)
    )), __temp = await __temp, __restore(), __temp);
    if (!data.value && !pending.value) {
      throw createError({ statusCode: 404, statusMessage: "Profile not found" });
    }
    useSeoMeta({
      title: computed(() => `${data.value?.profile.display_name || data.value?.profile.full_name || "Profile"} | Alumni Portal`)
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-3xl mx-auto py-6 px-4" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/directory",
        class: "inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 mb-4 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="pi pi-arrow-left text-xs"${_scopeId}></i> Back to Directory `);
          } else {
            return [
              createVNode("i", { class: "pi pi-arrow-left text-xs" }),
              createTextVNode(" Back to Directory ")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(pending)) {
        _push(`<div class="space-y-4"><div class="bg-white border border-slate-200 rounded-xl h-64 animate-pulse"></div></div>`);
      } else if (unref(data)) {
        _push(`<div class="space-y-4">`);
        _push(ssrRenderComponent(MemberProfileHeader, {
          profile: unref(data).profile,
          "is-own-profile": unref(user)?.id === unref(data).profile.id
        }, null, _parent));
        if (unref(data).profile.show_email && unref(data).profile.email || unref(data).profile.show_phone && unref(data).profile.phone) {
          _push(`<div class="bg-white border border-slate-200 rounded-xl p-4"><h2 class="font-semibold text-slate-900 mb-3">Contact</h2><div class="space-y-2">`);
          if (unref(data).profile.show_email && unref(data).profile.email) {
            _push(`<div class="flex items-center gap-2 text-sm"><i class="pi pi-envelope text-slate-400"></i><a${ssrRenderAttr("href", `mailto:${unref(data).profile.email}`)} class="text-primary-600 hover:underline">${ssrInterpolate(unref(data).profile.email)}</a></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(data).profile.show_phone && unref(data).profile.phone) {
            _push(`<div class="flex items-center gap-2 text-sm"><i class="pi pi-phone text-slate-400"></i><span class="text-slate-700">${ssrInterpolate(unref(data).profile.phone)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(data).education.length > 0) {
          _push(`<div class="bg-white border border-slate-200 rounded-xl p-4"><h2 class="font-semibold text-slate-900 mb-3">Education</h2><div class="space-y-3"><!--[-->`);
          ssrRenderList(unref(data).education, (edu) => {
            _push(`<div class="flex gap-3"><div class="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center shrink-0"><i class="pi pi-graduation-cap text-primary-600 text-sm"></i></div><div><p class="font-medium text-slate-900 text-sm">${ssrInterpolate(edu.institution)}</p>`);
            if (edu.degree) {
              _push(`<p class="text-sm text-slate-600">${ssrInterpolate(edu.degree)}`);
              if (edu.field_of_study) {
                _push(`<span> · ${ssrInterpolate(edu.field_of_study)}</span>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<p class="text-xs text-slate-400">${ssrInterpolate(edu.start_year)}`);
            if (edu.end_year) {
              _push(`<span> – ${ssrInterpolate(edu.is_current ? "Present" : edu.end_year)}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</p></div></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(data).work.length > 0) {
          _push(`<div class="bg-white border border-slate-200 rounded-xl p-4"><h2 class="font-semibold text-slate-900 mb-3">Work Experience</h2><div class="space-y-3"><!--[-->`);
          ssrRenderList(unref(data).work, (exp) => {
            _push(`<div class="flex gap-3"><div class="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center shrink-0"><i class="pi pi-briefcase text-slate-500 text-sm"></i></div><div><p class="font-medium text-slate-900 text-sm">${ssrInterpolate(exp.job_title)}</p><p class="text-sm text-slate-600">${ssrInterpolate(exp.company)}`);
            if (exp.location) {
              _push(`<span class="text-slate-400"> · ${ssrInterpolate(exp.location)}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</p>`);
            if (exp.start_date) {
              _push(`<p class="text-xs text-slate-400">${ssrInterpolate(new Date(exp.start_date).getFullYear())}`);
              if (exp.end_date || exp.is_current) {
                _push(`<span> – ${ssrInterpolate(exp.is_current ? "Present" : new Date(exp.end_date).getFullYear())}</span>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(data).profile.skills && unref(data).profile.skills.length > 0) {
          _push(`<div class="bg-white border border-slate-200 rounded-xl p-4"><h2 class="font-semibold text-slate-900 mb-3">Skills</h2><div class="flex flex-wrap gap-2"><!--[-->`);
          ssrRenderList(unref(data).profile.skills, (skill) => {
            _push(`<span class="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">${ssrInterpolate(skill)}</span>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/directory/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-BbejAR7s.mjs.map
