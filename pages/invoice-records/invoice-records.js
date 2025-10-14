// pages/invoice-records/invoice-records.js
Page({
  data: {
    // 开票记录列表
    invoiceRecords: [
      {
        id: 1,
        buyerName: "北京xxx有限责任公司",
        invoiceTime: "2025-10-23 20:00:00",
        amount: 10.0,
        status: "active", // active: 正常, cancelled: 已撤销
        originalPaymentId: 1, // 关联的缴费记录ID
        invoiceNumber: "INV20251023001",
        taxAmount: 1.3,
        totalAmount: 11.3,
      },
      {
        id: 2,
        buyerName: "北京xxx有限责任公司",
        invoiceTime: "2025-10-23 20:00:00",
        amount: 10.0,
        status: "cancelled", // 已撤销
        originalPaymentId: 2,
        invoiceNumber: "INV20251023002",
        taxAmount: 1.3,
        totalAmount: 11.3,
      },
      {
        id: 3,
        buyerName: "张三",
        invoiceTime: "2025-10-22 19:30:00",
        amount: 15.0,
        status: "active",
        originalPaymentId: 3,
        invoiceNumber: "INV20251022001",
        taxAmount: 1.95,
        totalAmount: 16.95,
      },
      {
        id: 4,
        buyerName: "李四",
        invoiceTime: "2025-10-21 16:45:00",
        amount: 5.0,
        status: "active",
        originalPaymentId: 4,
        invoiceNumber: "INV20251021001",
        taxAmount: 0.65,
        totalAmount: 5.65,
      },
    ],

    // 筛选条件
    filterOptions: {
      status: "全部", // 全部、正常、已撤销
      dateRange: "全部", // 全部、今天、本周、本月
      amountRange: "全部", // 全部、0-10、10-20、20+
    },
  },

  onLoad() {
    // 页面加载时的初始化操作
    this.loadInvoiceRecords();
  },

  onShow() {
    // 页面显示时刷新数据
    this.refreshData();
  },

  // 加载开票记录
  loadInvoiceRecords() {
    // 这里可以调用API获取数据
    // 目前使用模拟数据
    console.log("加载开票记录数据");
  },

  // 刷新数据
  refreshData() {
    // 刷新开票记录列表
    this.loadInvoiceRecords();
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
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
      itemList: ["全部", "正常", "已撤销"],
      success: (res) => {
        const statuses = ["全部", "正常", "已撤销"];
        this.setData({
          "filterOptions.status": statuses[res.tapIndex],
        });
        this.applyFilter();
      },
    });
  },

  // 显示排序选项
  showSortOptions() {
    wx.showActionSheet({
      itemList: ["按时间排序", "按金额排序", "按状态排序"],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            this.sortByTime();
            break;
          case 1:
            this.sortByAmount();
            break;
          case 2:
            this.sortByStatus();
            break;
        }
      },
    });
  },

  // 按时间排序
  sortByTime() {
    const records = [...this.data.invoiceRecords];
    records.sort((a, b) => new Date(b.invoiceTime) - new Date(a.invoiceTime));
    this.setData({
      invoiceRecords: records,
    });
    wx.showToast({
      title: "已按时间排序",
      icon: "success",
    });
  },

  // 按金额排序
  sortByAmount() {
    const records = [...this.data.invoiceRecords];
    records.sort((a, b) => b.amount - a.amount);
    this.setData({
      invoiceRecords: records,
    });
    wx.showToast({
      title: "已按金额排序",
      icon: "success",
    });
  },

  // 按状态排序
  sortByStatus() {
    const records = [...this.data.invoiceRecords];
    records.sort((a, b) => {
      if (a.status === b.status) return 0;
      return a.status === "active" ? -1 : 1;
    });
    this.setData({
      invoiceRecords: records,
    });
    wx.showToast({
      title: "已按状态排序",
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

  // 点击记录显示详情
  onRecordTap(e) {
    const recordId = parseInt(e.currentTarget.dataset.id);
    const record = this.data.invoiceRecords.find(
      (item) => item.id === recordId
    );

    if (record) {
      // 显示记录详情
      this.showRecordDetail(record);
    }
  },

  // 显示记录详情
  showRecordDetail(record) {
    const statusText = record.status === "cancelled" ? "已撤销" : "正常";
    wx.showModal({
      title: "开票详情",
      content: `购方名称: ${record.buyerName}\n开票时间: ${record.invoiceTime}\n发票金额: ¥${record.amount}\n发票号码: ${record.invoiceNumber}\n状态: ${statusText}`,
      showCancel: false,
      confirmText: "确定",
    });
  },

  // 撤销开票
  cancelInvoice(e) {
    const recordId = parseInt(e.currentTarget.dataset.id);
    const record = this.data.invoiceRecords.find(
      (item) => item.id === recordId
    );

    if (!record) return;

    wx.showModal({
      title: "确认撤销",
      content: `确定要撤销发票 ${record.invoiceNumber} 吗？撤销后无法恢复。`,
      success: (res) => {
        if (res.confirm) {
          this.processCancelInvoice(recordId);
        }
      },
    });
  },

  // 处理撤销开票
  processCancelInvoice(recordId) {
    wx.showLoading({
      title: "撤销中...",
    });

    // 模拟撤销过程
    setTimeout(() => {
      wx.hideLoading();

      // 更新记录状态
      const updatedRecords = this.data.invoiceRecords.map((record) => {
        if (record.id === recordId) {
          return { ...record, status: "cancelled" };
        }
        return record;
      });

      this.setData({
        invoiceRecords: updatedRecords,
      });

      wx.showToast({
        title: "撤销成功",
        icon: "success",
      });
    }, 2000);
  },

  // 下载发票
  downloadInvoice(e) {
    const recordId = parseInt(e.currentTarget.dataset.id);
    const record = this.data.invoiceRecords.find(
      (item) => item.id === recordId
    );

    if (!record) return;

    wx.showLoading({
      title: "下载中...",
    });

    // 模拟下载过程
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: "下载成功",
        icon: "success",
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
});
