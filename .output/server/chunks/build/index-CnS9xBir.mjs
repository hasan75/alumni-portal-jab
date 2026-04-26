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

var style = "\n    .p-iftalabel {\n        display: block;\n        position: relative;\n    }\n\n    .p-iftalabel label {\n        position: absolute;\n        pointer-events: none;\n        top: dt('iftalabel.top');\n        transition-property: all;\n        transition-timing-function: ease;\n        line-height: 1;\n        font-size: dt('iftalabel.font.size');\n        font-weight: dt('iftalabel.font.weight');\n        inset-inline-start: dt('iftalabel.position.x');\n        color: dt('iftalabel.color');\n        transition-duration: dt('iftalabel.transition.duration');\n    }\n\n    .p-iftalabel .p-inputtext,\n    .p-iftalabel .p-textarea,\n    .p-iftalabel .p-select-label,\n    .p-iftalabel .p-multiselect-label,\n    .p-iftalabel .p-multiselect-label:has(.p-chip),\n    .p-iftalabel .p-autocomplete-input-multiple,\n    .p-iftalabel .p-cascadeselect-label,\n    .p-iftalabel .p-treeselect-label {\n        padding-block-start: dt('iftalabel.input.padding.top');\n        padding-block-end: dt('iftalabel.input.padding.bottom');\n    }\n\n    .p-iftalabel:has(.p-invalid) label {\n        color: dt('iftalabel.invalid.color');\n    }\n\n    .p-iftalabel:has(input:focus) label,\n    .p-iftalabel:has(input:-webkit-autofill) label,\n    .p-iftalabel:has(textarea:focus) label,\n    .p-iftalabel:has(.p-inputwrapper-focus) label {\n        color: dt('iftalabel.focus.color');\n    }\n\n    .p-iftalabel .p-inputicon {\n        top: dt('iftalabel.input.padding.top');\n        transform: translateY(25%);\n        margin-top: 0;\n    }\n";
var classes = {
  root: "p-iftalabel"
};
var IftaLabelStyle = BaseStyle.extend({
  name: "iftalabel",
  style,
  classes
});
var script$1 = {
  name: "BaseIftaLabel",
  "extends": script$h,
  style: IftaLabelStyle,
  provide: function provide() {
    return {
      $pcIftaLabel: this,
      $parentInstance: this
    };
  }
};
var script = {
  name: "IftaLabel",
  "extends": script$1,
  inheritAttrs: false
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", mergeProps({
    "class": _ctx.cx("root")
  }, _ctx.ptmi("root")), [renderSlot(_ctx.$slots, "default")], 16);
}
script.render = render;

export { script as default };
//# sourceMappingURL=index-CnS9xBir.mjs.map
