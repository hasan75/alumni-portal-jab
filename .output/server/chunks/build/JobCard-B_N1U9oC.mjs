import { _ as __nuxt_component_0 } from './nuxt-link-CnvsOL_4.mjs';
import { defineComponent, mergeProps, withCtx, unref, createVNode, openBlock, createBlock, toDisplayString, createCommentVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { f as formatJobType, a as formatSalary } from './formatters-C6FNko8Q.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "JobCard",
  __ssrInlineRender: true,
  props: {
    job: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        to: `/jobs/${__props.job.slug}`,
        class: "bg-white border border-slate-200 rounded-xl p-4 hover:border-primary-200 hover:shadow-sm transition-all block"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex gap-3"${_scopeId}><div class="w-12 h-12 rounded-lg bg-slate-100 shrink-0 flex items-center justify-center overflow-hidden"${_scopeId}>`);
            if (__props.job.company_logo_url) {
              _push2(`<img${ssrRenderAttr("src", __props.job.company_logo_url)}${ssrRenderAttr("alt", __props.job.company)} class="w-full h-full object-contain"${_scopeId}>`);
            } else {
              _push2(`<span class="text-lg font-bold text-slate-400"${_scopeId}>${ssrInterpolate(__props.job.company.charAt(0))}</span>`);
            }
            _push2(`</div><div class="flex-1 min-w-0"${_scopeId}><div class="flex items-start justify-between gap-2"${_scopeId}><div${_scopeId}><h3 class="font-semibold text-slate-900 leading-snug"${_scopeId}>${ssrInterpolate(__props.job.title)}</h3><p class="text-sm text-slate-600 mt-0.5"${_scopeId}>${ssrInterpolate(__props.job.company)}</p></div>`);
            if (__props.job.is_featured) {
              _push2(`<span class="shrink-0 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full"${_scopeId}> Featured </span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex flex-wrap gap-2 mt-2"${_scopeId}><span class="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full"${_scopeId}><i class="pi pi-briefcase text-[10px]"${_scopeId}></i> ${ssrInterpolate(unref(formatJobType)(__props.job.job_type))}</span>`);
            if (__props.job.is_remote) {
              _push2(`<span class="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full"${_scopeId}><i class="pi pi-globe text-[10px]"${_scopeId}></i> Remote </span>`);
            } else if (__props.job.location) {
              _push2(`<span class="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full"${_scopeId}><i class="pi pi-map-marker text-[10px]"${_scopeId}></i> ${ssrInterpolate(__props.job.location)}</span>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.job.is_salary_visible && (__props.job.salary_min || __props.job.salary_max)) {
              _push2(`<span class="inline-flex items-center gap-1 text-xs text-slate-600 bg-slate-50 px-2 py-0.5 rounded-full"${_scopeId}>${ssrInterpolate(unref(formatSalary)(__props.job.salary_min, __props.job.salary_max, __props.job.salary_currency))}</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex gap-3" }, [
                createVNode("div", { class: "w-12 h-12 rounded-lg bg-slate-100 shrink-0 flex items-center justify-center overflow-hidden" }, [
                  __props.job.company_logo_url ? (openBlock(), createBlock("img", {
                    key: 0,
                    src: __props.job.company_logo_url,
                    alt: __props.job.company,
                    class: "w-full h-full object-contain"
                  }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("span", {
                    key: 1,
                    class: "text-lg font-bold text-slate-400"
                  }, toDisplayString(__props.job.company.charAt(0)), 1))
                ]),
                createVNode("div", { class: "flex-1 min-w-0" }, [
                  createVNode("div", { class: "flex items-start justify-between gap-2" }, [
                    createVNode("div", null, [
                      createVNode("h3", { class: "font-semibold text-slate-900 leading-snug" }, toDisplayString(__props.job.title), 1),
                      createVNode("p", { class: "text-sm text-slate-600 mt-0.5" }, toDisplayString(__props.job.company), 1)
                    ]),
                    __props.job.is_featured ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "shrink-0 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full"
                    }, " Featured ")) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "flex flex-wrap gap-2 mt-2" }, [
                    createVNode("span", { class: "inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full" }, [
                      createVNode("i", { class: "pi pi-briefcase text-[10px]" }),
                      createTextVNode(" " + toDisplayString(unref(formatJobType)(__props.job.job_type)), 1)
                    ]),
                    __props.job.is_remote ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full"
                    }, [
                      createVNode("i", { class: "pi pi-globe text-[10px]" }),
                      createTextVNode(" Remote ")
                    ])) : __props.job.location ? (openBlock(), createBlock("span", {
                      key: 1,
                      class: "inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full"
                    }, [
                      createVNode("i", { class: "pi pi-map-marker text-[10px]" }),
                      createTextVNode(" " + toDisplayString(__props.job.location), 1)
                    ])) : createCommentVNode("", true),
                    __props.job.is_salary_visible && (__props.job.salary_min || __props.job.salary_max) ? (openBlock(), createBlock("span", {
                      key: 2,
                      class: "inline-flex items-center gap-1 text-xs text-slate-600 bg-slate-50 px-2 py-0.5 rounded-full"
                    }, toDisplayString(unref(formatSalary)(__props.job.salary_min, __props.job.salary_max, __props.job.salary_currency)), 1)) : createCommentVNode("", true)
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/jobs/JobCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const JobCard = Object.assign(_sfc_main, { __name: "JobsJobCard" });

export { JobCard as J };
//# sourceMappingURL=JobCard-B_N1U9oC.mjs.map
