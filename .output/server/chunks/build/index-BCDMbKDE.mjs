import { p as script$h, B as BaseStyle } from './server.mjs';
import { openBlock, createElementBlock, mergeProps, renderSlot } from 'vue';
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
import 'vue/server-renderer';

var style = "\n    .p-inputgroup,\n    .p-inputgroup .p-iconfield,\n    .p-inputgroup .p-floatlabel,\n    .p-inputgroup .p-iftalabel {\n        display: flex;\n        align-items: stretch;\n        width: 100%;\n    }\n\n    .p-inputgroup .p-floatlabel .p-inputwrapper,\n    .p-inputgroup .p-iftalabel .p-inputwrapper {\n        display: inline-flex;\n    }\n\n    .p-inputgroup .p-inputtext,\n    .p-inputgroup .p-inputwrapper {\n        flex: 1 1 auto;\n        width: 1%;\n    }\n\n    .p-inputgroupaddon {\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        padding: dt('inputgroup.addon.padding');\n        background: dt('inputgroup.addon.background');\n        color: dt('inputgroup.addon.color');\n        border-block-start: 1px solid dt('inputgroup.addon.border.color');\n        border-block-end: 1px solid dt('inputgroup.addon.border.color');\n        min-width: dt('inputgroup.addon.min.width');\n    }\n\n    .p-inputgroupaddon:first-child,\n    .p-inputgroupaddon + .p-inputgroupaddon {\n        border-inline-start: 1px solid dt('inputgroup.addon.border.color');\n    }\n\n    .p-inputgroupaddon:last-child {\n        border-inline-end: 1px solid dt('inputgroup.addon.border.color');\n    }\n\n    .p-inputgroupaddon:has(.p-button) {\n        padding: 0;\n        overflow: hidden;\n    }\n\n    .p-inputgroupaddon .p-button {\n        border-radius: 0;\n    }\n\n    .p-inputgroup > .p-component,\n    .p-inputgroup > .p-inputwrapper > .p-component,\n    .p-inputgroup > .p-iconfield > .p-component,\n    .p-inputgroup > .p-floatlabel > .p-component,\n    .p-inputgroup > .p-floatlabel > .p-inputwrapper > .p-component,\n    .p-inputgroup > .p-iftalabel > .p-component,\n    .p-inputgroup > .p-iftalabel > .p-inputwrapper > .p-component {\n        border-radius: 0;\n        margin: 0;\n    }\n\n    .p-inputgroupaddon:first-child,\n    .p-inputgroup > .p-component:first-child,\n    .p-inputgroup > .p-inputwrapper:first-child > .p-component,\n    .p-inputgroup > .p-iconfield:first-child > .p-component,\n    .p-inputgroup > .p-floatlabel:first-child > .p-component,\n    .p-inputgroup > .p-floatlabel:first-child > .p-inputwrapper > .p-component,\n    .p-inputgroup > .p-iftalabel:first-child > .p-component,\n    .p-inputgroup > .p-iftalabel:first-child > .p-inputwrapper > .p-component {\n        border-start-start-radius: dt('inputgroup.addon.border.radius');\n        border-end-start-radius: dt('inputgroup.addon.border.radius');\n    }\n\n    .p-inputgroupaddon:last-child,\n    .p-inputgroup > .p-component:last-child,\n    .p-inputgroup > .p-inputwrapper:last-child > .p-component,\n    .p-inputgroup > .p-iconfield:last-child > .p-component,\n    .p-inputgroup > .p-floatlabel:last-child > .p-component,\n    .p-inputgroup > .p-floatlabel:last-child > .p-inputwrapper > .p-component,\n    .p-inputgroup > .p-iftalabel:last-child > .p-component,\n    .p-inputgroup > .p-iftalabel:last-child > .p-inputwrapper > .p-component {\n        border-start-end-radius: dt('inputgroup.addon.border.radius');\n        border-end-end-radius: dt('inputgroup.addon.border.radius');\n    }\n\n    .p-inputgroup .p-component:focus,\n    .p-inputgroup .p-component.p-focus,\n    .p-inputgroup .p-inputwrapper-focus,\n    .p-inputgroup .p-component:focus ~ label,\n    .p-inputgroup .p-component.p-focus ~ label,\n    .p-inputgroup .p-inputwrapper-focus ~ label,\n    .p-inputgroup .p-floatlabel .p-inputwrapper ~ label,\n    .p-inputgroup .p-iftalabel .p-inputwrapper ~ label {\n        z-index: 1;\n    }\n\n    .p-inputgroup > .p-button:not(.p-button-icon-only) {\n        width: auto;\n    }\n\n    .p-inputgroup .p-iconfield + .p-iconfield .p-inputtext {\n        border-inline-start: 0;\n    }\n";
var classes = {
  root: "p-inputgroup"
};
var InputGroupStyle = BaseStyle.extend({
  name: "inputgroup",
  style,
  classes
});
var script$1 = {
  name: "BaseInputGroup",
  "extends": script$h,
  style: InputGroupStyle,
  provide: function provide() {
    return {
      $pcInputGroup: this,
      $parentInstance: this
    };
  }
};
var script = {
  name: "InputGroup",
  "extends": script$1,
  inheritAttrs: false
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", mergeProps({
    "class": _ctx.cx("root")
  }, _ctx.ptmi("root")), [renderSlot(_ctx.$slots, "default")], 16);
}
script.render = render;

export { script as default };
//# sourceMappingURL=index-BCDMbKDE.mjs.map
