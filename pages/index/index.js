// index.js
Page({
  data: {},

  // 跳转到车牌输入页面（默认状态）
  goToInputPlate() {
    wx.navigateTo({
      url: "/pages/payment/payment",
    });
  },

  // 跳转到支付页面（带车牌号）
  goToPayment() {
    wx.navigateTo({
      url: "/pages/payment/payment?plateNumber=京F·58A583",
    });
  },

  // 跳转到访客登记页面
  goToVisitorRegistration() {
    wx.navigateTo({
      url: "/pages/visitor-registration/visitor-registration",
    });
  },

  // 跳转到车辆管理页面
  goToVehicleManagement() {
    wx.navigateTo({
      url: "/pages/vehicle-management/vehicle-management",
    });
  },
});
