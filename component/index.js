// component/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(wx.getSystemInfoSync())
        console.log(wx.getMenuButtonBoundingClientRect())
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },
    
    onPullDownRefresh() {

    },

    onMenuTap() {
        wx.showToast({
            title: 'menu tap',
            icon: 'none'
        })
    }
})