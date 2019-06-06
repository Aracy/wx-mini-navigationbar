// component/toolbar.js
const SysInfo = wx.getSystemInfoSync()
const IsCustom = SysInfo.version >= '7.0.0'
const IsIOS = SysInfo.system.indexOf('iOS') != -1
const MenuRect = wx.getMenuButtonBoundingClientRect()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        //是否重写返回按钮
        backProxy: {
            type: Boolean,
            value: false,
        },
        //按钮的路径
        menuSrc: {
            type: String
        },
        //背景图片的路径
        bgImgSrc: {
            type: String
        },
        //背景图片显示的类型
        bgImgMode: {
            type: String,
            value: 'aspectFill'
        },
        //标题
        title: {
            type: String
        },
        //标题是否居中
        titleCenter: {
            type: String,
            value: false
        },
        //字体颜色
        titleTextColor: {
            type: String
        },
        //标题栏背景色
        backgroundColor: {
            type: String
        },
        //是否是加载状态
        loading: {
            type: Boolean,
            value: false
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        _androidStyle: '',
        isCustom: IsCustom
    },

    /**
     * 数据监视
     */
    observers: {
        "title" (value) {
            if (IsCustom) {
                return
            }
            wx.setNavigationBarTitle({
                title: value,
            })
        },
        "backgroundColor" (value) {
            if (IsCustom) {
                return
            }
            wx.setNavigationBarColor({
                frontColor: this.data.titleTextColor == 'white' ? '#ffffff' : this.data.titleTextColor == 'black' ? '#000000' : this.data.titleTextColor,
                backgroundColor: value,
            })
        },
        "titleTextColor" (value) {
            if (IsCustom) {
                return
            }
            if (value == 'white' || value == '#fff' || value == '#ffffff' || value == 'black' || value == '#000' || value == '#000000') {
                wx.setNavigationBarColor({
                    frontColor: value == 'white' ? '#ffffff' : value == 'black' ? '#000000' : value,
                    backgroundColor: this.data.backgroundColor,
                })
            }
        },
        "backEnable,menuSrc" (backEnable, menuSrc) {
            if (IsIOS || this.data.titleCenter) {
                return
            }
            let paddingLeft = SysInfo.windowWidth - MenuRect.right
            if (backEnable) {
                paddingLeft += MenuRect.height
            }
            if (menuSrc) {
                paddingLeft += MenuRect.height
            }
            this.setData({
                _androidStyle: `text-align: left;padding-left:${paddingLeft+12}px;`
            })
        },
        "loading" (value) {
            if (IsCustom) {
                return
            }
            if (value) {
                wx.showNavigationBarLoading()
                return
            }
            wx.hideNavigationBarLoading()
        }

    },

    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 初始化布局
         */
        initLayout() {
            const statusBarHeight = SysInfo.statusBarHeight;
            const height = (MenuRect.top - statusBarHeight) * 2 + MenuRect.height
            this.setData({
                _navBarStyle: `padding:${statusBarHeight}px ${SysInfo.windowWidth - MenuRect.left + 10}px ${MenuRect.top - statusBarHeight}px;height:${height}px;line-height:${height}px;font-size:${SysInfo.fontSizeSetting - 2}pt;`,
                _opContainerStyle: `height:${height}px;left:${SysInfo.windowWidth - MenuRect.right}px`,
                _iconStyle: `width:${MenuRect.height}px;height:${MenuRect.height}px`
            })
        },

        /**
         * 初始化数据
         */
        initData() {
            const pages = getCurrentPages();
            const win = Object.assign(__wxConfig.global.window, __wxAppCode__[`${pages[pages.length - 1].route}.json`])
            this.setData({
                backgroundColor: win.navigationBarBackgroundColor ? win.navigationBarBackgroundColor : '#000000',
                titleTextColor: win.navigationBarTextStyle ? win.navigationBarTextStyle : 'white',
                title: win.navigationBarTitleText,
                backEnable: pages.length > 1
            })
        },

        /**
         * 返回的点击事件
         */
        _onBackTap() {
            if (!this.data.backProxy) {
                wx.navigateBack()
                return
            }
            this.triggerEvent('NaviBack')
        },

        /**
         * 菜单按钮的点击事件
         */
        _onMenuTap() {
            this.triggerEvent('MenuTap')
        }
    },

    lifetimes: {

        /**
         * 在组件实例进入页面节点树时执行
         */
        attached() {
            this.initLayout();
            this.initData();
        },

        /**
         *  在组件实例被从页面节点树移除时执行
         */
        detached() {},
    },
})