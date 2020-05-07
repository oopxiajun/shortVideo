// components/video-button-bar.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    video: Object,
    index: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    video: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLoad: function (params) {
      console.log(this);
    },
    toolBarButton: function (e) {
      const {
        buttontype,
        buttonname,
        itemid,
        index
      } = e.currentTarget.dataset;
      this.triggerEvent('buttonhandle', {
        buttontype,
        buttonname,
        itemid,
        index
      });
    }
  }
})