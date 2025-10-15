// pages/vehicle-management/vehicle-management.js
Page({
  data: {
    // 车辆列表
    vehicleList: [
      {
        id: 1,
        plateNumber: "京F・58A583",
        vehicleType: "小型汽车",
        isActive: true,
        addTime: "2025-01-15",
        lastUsed: "2025-01-20",
        translateX: 0, // 滑动距离
      },
      {
        id: 2,
        plateNumber: "京F・58A583",
        vehicleType: "小型汽车",
        isActive: true,
        addTime: "2025-01-10",
        lastUsed: "2025-01-19",
        translateX: 0,
      },
      {
        id: 3,
        plateNumber: "京F・58A583",
        vehicleType: "小型汽车",
        isActive: true,
        addTime: "2025-01-05",
        lastUsed: "2025-01-18",
        translateX: 0,
      },
    ],

    // 当前左滑的车辆ID
    currentSwipeId: null,
    // 触摸相关数据
    startX: 0,
    startY: 0,
    isSwipe: false,
  },

  onLoad() {
    // 页面加载时的初始化操作
    this.loadVehicleList();
  },

  onShow() {
    // 页面显示时刷新数据
    this.refreshData();
  },

  // 加载车辆列表
  loadVehicleList() {
    // 这里可以调用API获取数据
    // 目前使用模拟数据
    console.log("加载车辆列表数据");
  },

  // 刷新数据
  refreshData() {
    // 刷新车辆列表
    this.loadVehicleList();
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

  // 更多选项
  showMoreOptions() {
    wx.showActionSheet({
      itemList: ["添加车辆", "批量管理", "导入车辆", "导出列表"],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            this.addVehicle();
            break;
          case 1:
            this.batchManagement();
            break;
          case 2:
            this.importVehicles();
            break;
          case 3:
            this.exportList();
            break;
        }
      },
    });
  },

  // 添加车辆
  addVehicle() {
    wx.showModal({
      title: "添加车辆",
      content: "请输入车牌号码",
      editable: true,
      placeholderText: "例如：京A12345",
      success: (res) => {
        if (res.confirm && res.content) {
          this.processAddVehicle(res.content);
        }
      },
    });
  },

  // 处理添加车辆
  processAddVehicle(plateNumber) {
    // 验证车牌号格式
    if (!this.validatePlateNumber(plateNumber)) {
      wx.showToast({
        title: "车牌号格式不正确",
        icon: "none",
      });
      return;
    }

    // 检查是否已存在
    const exists = this.data.vehicleList.some(
      (vehicle) => vehicle.plateNumber === plateNumber
    );

    if (exists) {
      wx.showToast({
        title: "车辆已存在",
        icon: "none",
      });
      return;
    }

    // 添加新车辆
    const newVehicle = {
      id: Date.now(),
      plateNumber: plateNumber,
      vehicleType: "小型汽车",
      isActive: true,
      addTime: this.getCurrentDate(),
      lastUsed: "从未使用",
      translateX: 0, // 初始化滑动距离
    };

    const vehicleList = [...this.data.vehicleList, newVehicle];
    this.setData({
      vehicleList: vehicleList,
    });

    wx.showToast({
      title: "添加成功",
      icon: "success",
    });
  },

  // 验证车牌号格式
  validatePlateNumber(plateNumber) {
    const provinceRegex =
      /^[京津沪渝冀晋辽吉黑苏浙皖闽赣鲁豫鄂湘粤琼川贵云陕甘青蒙宁新藏使领警学港澳]/;
    return provinceRegex.test(plateNumber) && plateNumber.length >= 7;
  },

  // 获取当前日期
  getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  },

  // 批量管理
  batchManagement() {
    wx.showToast({
      title: "批量管理功能开发中",
      icon: "none",
    });
  },

  // 导入车辆
  importVehicles() {
    wx.showToast({
      title: "导入功能开发中",
      icon: "none",
    });
  },

  // 导出列表
  exportList() {
    wx.showToast({
      title: "导出功能开发中",
      icon: "none",
    });
  },

  // 触摸开始
  onTouchStart(e) {
    const touch = e.touches[0];
    this.setData({
      startX: touch.clientX,
      startY: touch.clientY,
      isSwipe: false,
    });
  },

  // 触摸移动
  onTouchMove(e) {
    const touch = e.touches[0];
    const deltaX = touch.clientX - this.data.startX;
    const deltaY = touch.clientY - this.data.startY;
    const vehicleId = e.currentTarget.dataset.id;

    // 判断是否为水平滑动
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 5) {
      this.setData({
        isSwipe: true,
        currentSwipeId: vehicleId,
      });

      // 限制滑动距离，最大滑动160px（两个按钮的宽度）
      // 添加阻尼效果，让滑动更自然
      let translateX = deltaX;
      if (deltaX < -160) {
        // 超过最大距离时添加阻尼
        translateX = -160 + (deltaX + 160) * 0.3;
      } else if (deltaX > 0) {
        // 向右滑动时添加阻尼
        translateX = deltaX * 0.3;
      }

      // 更新对应车辆的translateX
      const vehicleList = this.data.vehicleList.map((item) => {
        if (item.id === vehicleId) {
          return { ...item, translateX };
        }
        return item;
      });

      this.setData({ vehicleList });
    }
  },

  // 触摸结束
  onTouchEnd(e) {
    const vehicleId = e.currentTarget.dataset.id;
    const vehicle = this.data.vehicleList.find((item) => item.id === vehicleId);

    if (this.data.isSwipe && vehicle) {
      // 如果滑动距离超过一半，显示操作按钮
      if (vehicle.translateX < -80) {
        // 平滑滑动到完全展开位置
        this.smoothSwipeTo(vehicleId, -160);
        this.setData({
          currentSwipeId: vehicleId,
        });
      } else {
        // 否则回弹到原位置
        this.smoothSwipeTo(vehicleId, 0);
        this.setData({
          currentSwipeId: null,
        });
      }
    }

    this.setData({
      isSwipe: false,
    });
  },

  // 平滑滑动到指定位置
  smoothSwipeTo(vehicleId, targetX) {
    const vehicleList = this.data.vehicleList.map((item) => {
      if (item.id === vehicleId) {
        return { ...item, translateX: targetX };
      }
      return item;
    });

    this.setData({
      vehicleList,
    });
  },

  // 重置滑动状态
  resetSwipe(vehicleId) {
    this.smoothSwipeTo(vehicleId, 0);
    this.setData({
      currentSwipeId: null,
    });
  },

  // 点击车辆卡片
  onVehicleClick(e) {
    const vehicleId = e.currentTarget.dataset.id;

    // 如果当前有滑动状态，先重置
    if (this.data.currentSwipeId && this.data.currentSwipeId !== vehicleId) {
      this.resetSwipe(this.data.currentSwipeId);
    }

    // 如果当前车辆正在滑动，不执行点击事件
    if (this.data.currentSwipeId === vehicleId) {
      return;
    }

    const vehicle = this.data.vehicleList.find((item) => item.id === vehicleId);

    if (vehicle) {
      // 显示车辆详情
      this.showVehicleDetail(vehicle);
    }
  },

  // 显示车辆详情
  showVehicleDetail(vehicle) {
    wx.showModal({
      title: "车辆详情",
      content: `车牌号: ${vehicle.plateNumber}\n车辆类型: ${vehicle.vehicleType}\n添加时间: ${vehicle.addTime}\n最后使用: ${vehicle.lastUsed}`,
      showCancel: true,
      cancelText: "关闭",
      confirmText: "设为默认",
      success: (res) => {
        if (res.confirm) {
          this.setDefaultVehicle(vehicle.id);
        }
      },
    });
  },

  // 设为默认车辆
  setDefaultVehicle(vehicleId) {
    wx.showToast({
      title: "已设为默认车辆",
      icon: "success",
    });
  },

  // 左滑开始
  onSwipeStart(e) {
    const vehicleId = e.currentTarget.dataset.id;
    this.setData({
      currentSwipeId: vehicleId,
    });
  },

  // 左滑结束
  onSwipeEnd(e) {
    // 可以在这里处理滑动结束的逻辑
  },

  // 删除车辆
  deleteVehicle(e) {
    const vehicleId = e.currentTarget.dataset.id;
    const vehicle = this.data.vehicleList.find((item) => item.id === vehicleId);

    if (!vehicle) return;

    wx.showModal({
      title: "确认删除",
      content: `确定要删除车辆 ${vehicle.plateNumber} 吗？`,
      success: (res) => {
        if (res.confirm) {
          this.processDeleteVehicle(vehicleId);
        }
      },
    });
  },

  // 处理删除车辆
  processDeleteVehicle(vehicleId) {
    const vehicleList = this.data.vehicleList.filter(
      (item) => item.id !== vehicleId
    );
    this.setData({
      vehicleList: vehicleList,
      currentSwipeId: null,
    });

    wx.showToast({
      title: "删除成功",
      icon: "success",
    });
  },

  // 编辑车辆
  editVehicle(e) {
    const vehicleId = e.currentTarget.dataset.id;
    const vehicle = this.data.vehicleList.find((item) => item.id === vehicleId);

    if (!vehicle) return;

    wx.showModal({
      title: "编辑车辆",
      content: "请输入新的车牌号码",
      editable: true,
      placeholderText: vehicle.plateNumber,
      success: (res) => {
        if (res.confirm && res.content && res.content !== vehicle.plateNumber) {
          this.processEditVehicle(vehicleId, res.content);
        }
      },
    });
  },

  // 处理编辑车辆
  processEditVehicle(vehicleId, newPlateNumber) {
    // 验证车牌号格式
    if (!this.validatePlateNumber(newPlateNumber)) {
      wx.showToast({
        title: "车牌号格式不正确",
        icon: "none",
      });
      return;
    }

    // 检查是否已存在
    const exists = this.data.vehicleList.some(
      (vehicle) =>
        vehicle.plateNumber === newPlateNumber && vehicle.id !== vehicleId
    );

    if (exists) {
      wx.showToast({
        title: "车牌号已存在",
        icon: "none",
      });
      return;
    }

    // 更新车辆信息
    const vehicleList = this.data.vehicleList.map((item) => {
      if (item.id === vehicleId) {
        return {
          ...item,
          plateNumber: newPlateNumber,
          translateX: 0, // 重置滑动状态
        };
      }
      return item;
    });

    this.setData({
      vehicleList: vehicleList,
      currentSwipeId: null,
    });

    wx.showToast({
      title: "修改成功",
      icon: "success",
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.refreshData();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },
});
