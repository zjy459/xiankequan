// pages/index/Post/Post.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    fileList: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 上传图片
    afterRead(event) {
      // event.detail.file 是当前选择的文件对象
      const { file } = event.detail;
      // 支持多选时 file 可能是数组
      let newFileList = this.data.fileList.concat(file instanceof Array ? file : [file]);
      this.setData({ fileList: newFileList }, () => {
        // 选择完图片后自动上传
        this.uploadToCloud();
      });
    },

    uploadToCloud() {
      wx.cloud.init();
      const { fileList } = this.data;
      if (!fileList.length) {
        wx.showToast({ title: '请选择图片', icon: 'none' });
      } else {
        const uploadTasks = fileList.map((file, index) => this.uploadFilePromise(`my-photo${index}.png`, file));
        Promise.all(uploadTasks)
          .then(data => {
            wx.showToast({ title: '上传成功', icon: 'none' });
            const newFileList = data.map(item => ({ url: item.fileID }));
            this.setData({ cloudPath: data, fileList: newFileList });
          })
          .catch(e => {
            wx.showToast({ title: '上传失败', icon: 'none' });
            console.log(e);
          });
      }
    },

    uploadFilePromise(fileName, chooseResult) {
      return wx.cloud.uploadFile({
        cloudPath: fileName,
        filePath: chooseResult.url
      });
    }

  }
})