import{s as a}from"./Qu1Xa6KY.js";import{ah as r,bv as e,o as n,c as s,at as i,aj as p}from"./BNOIyyrF.js";var u=`
    .p-radiobutton-group {
        display: inline-flex;
    }
`,d={root:"p-radiobutton-group p-component"},c=r.extend({name:"radiobuttongroup",style:u,classes:d}),m={name:"BaseRadioButtonGroup",extends:a,style:c,provide:function(){return{$pcRadioButtonGroup:this,$parentInstance:this}}},l={name:"RadioButtonGroup",extends:m,inheritAttrs:!1,data:function(){return{groupName:this.name}},watch:{name:function(o){this.groupName=o||e("radiobutton-group-")}},mounted:function(){this.groupName=this.groupName||e("radiobutton-group-")}};function f(t,o,g,h,v,$){return n(),s("div",p({class:t.cx("root")},t.ptmi("root")),[i(t.$slots,"default")],16)}l.render=f;export{l as default};
