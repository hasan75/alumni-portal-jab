import{s as r}from"./Qu1Xa6KY.js";import{ah as a,bv as t,o as s,c as n,at as p,aj as c}from"./BNOIyyrF.js";var i=`
    .p-checkbox-group {
        display: inline-flex;
    }
`,u={root:"p-checkbox-group p-component"},m=a.extend({name:"checkboxgroup",style:i,classes:u}),h={name:"BaseCheckboxGroup",extends:r,style:m,provide:function(){return{$pcCheckboxGroup:this,$parentInstance:this}}},l={name:"CheckboxGroup",extends:h,inheritAttrs:!1,data:function(){return{groupName:this.name}},watch:{name:function(o){this.groupName=o||t("checkbox-group-")}},mounted:function(){this.groupName=this.groupName||t("checkbox-group-")}};function d(e,o,x,f,k,b){return s(),n("div",c({class:e.cx("root")},e.ptmi("root")),[p(e.$slots,"default")],16)}l.render=d;export{l as default};
