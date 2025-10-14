// pages/payment-records/payment-records.js
Page({
  data: {
    // 缴费记录列表
    paymentRecords: [
      {
        id: 1,
        plateNumber: "京F·58A583",
        parkingDuration: "1小时33分钟",
        paymentTime: "2025-10-23 20:00:00",
        paymentMethod: "微信支付",
        amount: 10.0,
        parkingLot: "奥东十八停车场",
        entryTime: "2025-10-23 18:27:00",
        exitTime: "2025-10-23 20:00:00",
        status: "已支付",
        isInvoiced: false, // 是否已开票
      },
      {
        id: 2,
        plateNumber: "京F·58A583",
        parkingDuration: "2小时15分钟",
        paymentTime: "2025-10-22 19:30:00",
        paymentMethod: "微信支付",
        amount: 15.0,
        parkingLot: "奥东十八停车场",
        entryTime: "2025-10-22 17:15:00",
        exitTime: "2025-10-22 19:30:00",
        status: "已支付",
        isInvoiced: false, // 是否已开票
      },
      {
        id: 3,
        plateNumber: "京F·58A583",
        parkingDuration: "45分钟",
        paymentTime: "2025-10-21 16:45:00",
        paymentMethod: "支付宝",
        amount: 5.0,
        parkingLot: "奥东十八停车场",
        entryTime: "2025-10-21 16:00:00",
        exitTime: "2025-10-21 16:45:00",
        status: "已支付",
        isInvoiced: true, // 已开票，不能再次选择
      },
      {
        id: 4,
        plateNumber: "京F·58A583",
        parkingDuration: "3小时20分钟",
        paymentTime: "2025-10-20 21:20:00",
        paymentMethod: "微信支付",
        amount: 20.0,
        parkingLot: "奥东十八停车场",
        entryTime: "2025-10-20 18:00:00",
        exitTime: "2025-10-20 21:20:00",
        status: "已支付",
        isInvoiced: false, // 是否已开票
      },
    ],

    // 选中的记录ID列表
    selectedRecords: [],

    // 是否全选
    isSelectAll: false,

    // 选中金额
    selectedAmount: 0,

    // 筛选条件
    filterOptions: {
      paymentMethod: "全部", // 全部、微信支付、支付宝
      dateRange: "全部", // 全部、今天、本周、本月
      amountRange: "全部", // 全部、0-10、10-20、20+
    },
  },

  onLoad() {
    // 页面加载时的初始化操作
    this.loadPaymentRecords();
  },

  onShow() {
    // 页面显示时刷新数据
    this.refreshData();
  },

  // 加载缴费记录
  loadPaymentRecords() {
    // 这里可以调用API获取数据
    // 目前使用模拟数据
    console.log("加载缴费记录数据");
  },

  // 刷新数据
  refreshData() {
    // 刷新缴费记录列表
    this.loadPaymentRecords();
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  },

  // 回到首页
  goHome() {
    wx.switchTab({
      url: "/pages/index/index",
    });
  },

  // 跳转到开票记录页面
  goToInvoiceRecords() {
    wx.navigateTo({
      url: "/pages/invoice-records/invoice-records",
    });
  },

  // 更多选项
  showMoreOptions() {
    wx.showActionSheet({
      itemList: ["筛选", "排序", "导出记录"],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            this.showFilterOptions();
            break;
          case 1:
            this.showSortOptions();
            break;
          case 2:
            this.exportRecords();
            break;
        }
      },
    });
  },

  // 显示筛选选项
  showFilterOptions() {
    wx.showActionSheet({
      itemList: ["全部", "微信支付", "支付宝", "银行卡"],
      success: (res) => {
        const methods = ["全部", "微信支付", "支付宝", "银行卡"];
        this.setData({
          "filterOptions.paymentMethod": methods[res.tapIndex],
        });
        this.applyFilter();
      },
    });
  },

  // 显示排序选项
  showSortOptions() {
    wx.showActionSheet({
      itemList: ["按时间排序", "按金额排序", "按车牌排序"],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            this.sortByTime();
            break;
          case 1:
            this.sortByAmount();
            break;
          case 2:
            this.sortByPlateNumber();
            break;
        }
      },
    });
  },

  // 按时间排序
  sortByTime() {
    const records = [...this.data.paymentRecords];
    records.sort((a, b) => new Date(b.paymentTime) - new Date(a.paymentTime));
    this.setData({
      paymentRecords: records,
    });
    wx.showToast({
      title: "已按时间排序",
      icon: "success",
    });
  },

  // 按金额排序
  sortByAmount() {
    const records = [...this.data.paymentRecords];
    records.sort((a, b) => b.amount - a.amount);
    this.setData({
      paymentRecords: records,
    });
    wx.showToast({
      title: "已按金额排序",
      icon: "success",
    });
  },

  // 按车牌排序
  sortByPlateNumber() {
    const records = [...this.data.paymentRecords];
    records.sort((a, b) => a.plateNumber.localeCompare(b.plateNumber));
    this.setData({
      paymentRecords: records,
    });
    wx.showToast({
      title: "已按车牌排序",
      icon: "success",
    });
  },

  // 应用筛选
  applyFilter() {
    // 这里可以根据筛选条件过滤数据
    wx.showToast({
      title: "筛选已应用",
      icon: "success",
    });
  },

  // 导出记录
  exportRecords() {
    wx.showToast({
      title: "导出功能开发中",
      icon: "none",
    });
  },

  // 长按记录显示详情
  onRecordLongPress(e) {
    // 确保recordId是数字类型
    const recordId = parseInt(e.currentTarget.dataset.id);
    const record = this.data.paymentRecords.find(
      (item) => item.id === recordId
    );

    if (record) {
      // 显示记录详情
      this.showRecordDetail(record);
    }
  },

  // 显示记录详情
  showRecordDetail(record) {
    wx.showModal({
      title: "缴费详情",
      content: `车牌: ${record.plateNumber}\n停车时长: ${record.parkingDuration}\n缴费时间: ${record.paymentTime}\n支付方式: ${record.paymentMethod}\n金额: ¥${record.amount}`,
      showCancel: false,
      confirmText: "确定",
    });
  },

  // 选择记录（点击整个卡片）
  onRecordSelect(e) {
    // 确保recordId是数字类型
    const recordId = parseInt(e.currentTarget.dataset.id);
    const record = this.data.paymentRecords.find(
      (item) => item.id === recordId
    );

    // 如果已开票，不能选择
    if (record && record.isInvoiced) {
      wx.showToast({
        title: "已开票的记录不能再次选择",
        icon: "none",
      });
      return;
    }

    const selectedRecords = [...this.data.selectedRecords];
    const index = selectedRecords.indexOf(recordId);

    if (index > -1) {
      selectedRecords.splice(index, 1);
    } else {
      selectedRecords.push(recordId);
    }

    this.setData({
      selectedRecords: selectedRecords,
    });

    // 更新选中金额
    this.updateSelectedAmount();
  },

  // 开票
  openInvoice() {
    if (this.data.selectedRecords.length === 0) {
      wx.showToast({
        title: "请选择要开票的记录",
        icon: "none",
      });
      return;
    }

    // 跳转到开票页面
    wx.navigateTo({
      url: `/pages/invoice-form/invoice-form?selectedRecords=${JSON.stringify(
        this.data.selectedRecords
      )}&paymentRecords=${JSON.stringify(this.data.paymentRecords)}`,
    });
  },

  // 处理开票
  processInvoice() {
    wx.showLoading({
      title: "开票中...",
    });

    // 模拟开票过程
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: "开票成功",
        icon: "success",
      });

      // 更新已开票的记录状态
      const updatedRecords = this.data.paymentRecords.map((record) => {
        if (this.data.selectedRecords.includes(record.id)) {
          return { ...record, isInvoiced: true };
        }
        return record;
      });

      // 清空选择并更新数据
      this.setData({
        selectedRecords: [],
        isSelectAll: false,
        paymentRecords: updatedRecords,
        selectedAmount: 0,
        showInvoiceForm: false,
        // 重置表单数据
        invoiceForm: {
          recipientEmail: "",
          headerType: "企业",
          enterpriseName: "",
          enterpriseTaxId: "",
          enterpriseAddress: "",
          openingBank: "",
          bankAccountNumber: "",
          companyPhone: "",
          remarks: "",
        },
      });
    }, 2000);
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.refreshData();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },

  // 上拉加载更多
  onReachBottom() {
    // 加载更多数据
    this.loadMoreRecords();
  },

  // 加载更多记录
  loadMoreRecords() {
    wx.showToast({
      title: "没有更多数据",
      icon: "none",
    });
  },

  // 更新选中金额
  updateSelectedAmount() {
    const selectedAmount = this.data.paymentRecords
      .filter((item) => this.data.selectedRecords.includes(item.id))
      .reduce((sum, item) => sum + item.amount, 0);

    this.setData({
      selectedAmount: selectedAmount.toFixed(2),
    });
  },

  // 开票成功回调
  onInvoiceSuccess(selectedRecordIds) {
    // 更新已开票的记录状态
    const updatedRecords = this.data.paymentRecords.map((record) => {
      if (selectedRecordIds.includes(record.id)) {
        return { ...record, isInvoiced: true };
      }
      return record;
    });

    // 清空选择并更新数据
    this.setData({
      selectedRecords: [],
      isSelectAll: false,
      paymentRecords: updatedRecords,
      selectedAmount: 0,
    });
  },
});
