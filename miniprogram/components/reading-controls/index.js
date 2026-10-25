const {saveReaderPreferences} = require('../../services/knowledge-platform/reading-ui');
Component({
  properties:{preferences:{type:Object,value:{}},visible:{type:Boolean,value:false},panelOnly:{type:Boolean,value:false}},
  data:{error:''},
  methods:{
    handleOpen(){this.triggerEvent('open');},
    handleClose(){this.setData({error:''});this.triggerEvent('close');},
    handleSheet(){},
    handleSelect(event){
      const {field,value}=event.currentTarget.dataset;
      const result=saveReaderPreferences(field,value);
      if(!result.ok)return this.setData({error:'显示设置未保存，请重试。'});
      this.setData({error:''});
      this.triggerEvent('preferenceschange',{preferences:result.preferences});
    }
  }
});
