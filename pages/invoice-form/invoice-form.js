// pages/invoice-form/invoice-form.js
Page({
  data: {
    // 开票信息表单数据
    invoiceForm: {
      recipientEmail: "", // 接收邮箱
      headerType: "企业", // 抬头类型：企业/个人
      enterpriseName: "", // 企业名称
      enterpriseTaxId: "", // 企业税号
      enterpriseAddress: "", // 企业地址
      openingBank: "", // 开户行
      bankAccountNumber: "", // 开户行账号
      companyPhone: "", // 公司电话
      remarks: "", // 备注
    },

    // 选中的记录ID列表
    selectedRecords: [],

    // 缴费记录数据
    paymentRecords: [],
  },

  onLoad(options) {
    // 从上一页传递的数据
    if (options.selectedRecords) {
      const selectedRecords = JSON.parse(options.selectedRecords);
      this.setData({
        selectedRecords: selectedRecords,
      });
    }

    if (options.paymentRecords) {
      const paymentRecords = JSON.parse(options.paymentRecords);
      this.setData({
        paymentRecords: paymentRecords,
      });
    }
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  },

  // 表单输入处理
  onFormInput(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;

    this.setData({
      [`invoiceForm.${field}`]: value,
    });
  },

  // 抬头类型选择
  onHeaderTypeChange(e) {
    const headerType = e.detail.value === 0 ? "企业" : "个人";
    this.setData({
      "invoiceForm.headerType": headerType,
    });
  },

  // 确认开票
  confirmInvoice() {
    const { invoiceForm } = this.data;

    // 表单验证
    if (!invoiceForm.recipientEmail) {
      wx.showToast({
        title: "请输入接收邮箱",
        icon: "none",
      });
      return;
    }

    if (invoiceForm.headerType === "企业") {
      if (!invoiceForm.enterpriseName) {
        wx.showToast({
          title: "请输入企业名称",
          icon: "none",
        });
        return;
      }
      if (!invoiceForm.enterpriseTaxId) {
        wx.showToast({
          title: "请输入企业税号",
          icon: "none",
        });
        return;
      }
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(invoiceForm.recipientEmail)) {
      wx.showToast({
        title: "请输入正确的邮箱格式",
        icon: "none",
      });
      return;
    }

    // 执行开票
    this.processInvoice();
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

      // 返回上一页并传递开票成功的信息
      setTimeout(() => {
        wx.navigateBack({
          delta: 1,
          success: () => {
            // 通知上一页开票成功
            const pages = getCurrentPages();
            const prevPage = pages[pages.length - 1];
            if (prevPage && prevPage.onInvoiceSuccess) {
              prevPage.onInvoiceSuccess(this.data.selectedRecords);
            }
          },
        });
      }, 1500);
    }, 2000);
  },
});
