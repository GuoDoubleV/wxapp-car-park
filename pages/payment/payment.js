// pages/payment/payment.js
Page({
  data: {
    // 页面状态：input-plate（输入车牌）或 payment（缴费）
    pageMode: "input-plate", // 默认显示输入车牌页面

    // 调试信息
    debugInfo: "页面数据已初始化",

    // 停车场信息
    parkingLot: {
      name: "奥东十八",
      address: "朝阳惠新西街安苑路18号",
    },

    // 车辆信息
    vehicle: {
      plateNumber: "",
      parkingLot: "奥东十八停车场",
      entryTime: "2025-10-23 20:00:00",
    },

    // 停车时长
    parkingDuration: {
      hours: 1,
      minutes: 30,
      seconds: 29,
    },

    // 费用信息
    fee: 10.0,

    // 支付倒计时
    paymentCountdown: {
      minutes: 4,
      seconds: 59,
    },

    // 车牌输入相关数据
    plateNumber: ["", "", "", "", "", "", "", ""], // 8个输入框
    currentInputIndex: 0, // 当前输入位置
    isNewEnergy: false, // 是否为新能源车牌

    // 中国省份简称
    provinces: [
      "京",
      "津",
      "沪",
      "渝",
      "冀",
      "晋",
      "辽",
      "吉",
      "黑",
      "苏",
      "浙",
      "皖",
      "闽",
      "赣",
      "鲁",
      "豫",
      "鄂",
      "湘",
      "粤",
      "琼",
      "川",
      "贵",
      "云",
      "陕",
      "甘",
      "青",
      "蒙",
      "宁",
      "新",
      "藏",
      "使",
      "领",
      "警",
      "学",
      "港",
      "澳",
    ],

    // 数字和字母
    numbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    letters: [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "J",
      "K",
      "L",
      "M",
      "N",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ],

    // 当前键盘类型: province, number, letter
    keyboardType: "province",

    // 是否显示键盘
    showKeyboard: false,
  },

  onLoad(options) {
    console.log("页面加载，参数:", options);

    // 接收从其他页面传递的参数
    if (options.plateNumber) {
      // 如果有车牌号，直接显示缴费页面
      console.log("显示缴费页面，车牌号:", options.plateNumber);
      this.setData({
        "vehicle.plateNumber": options.plateNumber,
        pageMode: "payment",
      });

      // 启动停车时长计时器
      this.startParkingTimer();
      // 启动支付倒计时
      this.startPaymentCountdown();
    } else {
      // 没有车牌号，显示输入车牌页面
      console.log("显示输入车牌页面");
      this.setData({
        pageMode: "input-plate",
      });
      this.initPlateInput();
    }

    console.log("当前页面模式:", this.data.pageMode);
  },

  onUnload() {
    // 清理定时器
    if (this.parkingTimer) {
      clearInterval(this.parkingTimer);
    }
    if (this.paymentTimer) {
      clearInterval(this.paymentTimer);
    }
  },

  // 停车时长计时器
  startParkingTimer() {
    this.parkingTimer = setInterval(() => {
      let { hours, minutes, seconds } = this.data.parkingDuration;

      seconds++;
      if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
          minutes = 0;
          hours++;
        }
      }

      this.setData({
        parkingDuration: { hours, minutes, seconds },
      });
    }, 1000);
  },

  // 支付倒计时
  startPaymentCountdown() {
    this.paymentTimer = setInterval(() => {
      let { minutes, seconds } = this.data.paymentCountdown;

      if (seconds > 0) {
        seconds--;
      } else if (minutes > 0) {
        minutes--;
        seconds = 59;
      } else {
        // 倒计时结束，可以在这里处理超时逻辑
        clearInterval(this.paymentTimer);
        wx.showToast({
          title: "支付时间已过期",
          icon: "none",
        });
        return;
      }

      this.setData({
        paymentCountdown: { minutes, seconds },
      });
    }, 1000);
  },

  // 切换车辆
  switchVehicle() {
    wx.showToast({
      title: "切换车辆功能",
      icon: "none",
    });
  },

  // 立即支付
  payNow() {
    wx.showModal({
      title: "确认支付",
      content: `确认支付停车费 ¥${this.data.fee}？`,
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: "支付成功",
            icon: "success",
          });
          // 这里可以跳转到支付成功页面
        }
      },
    });
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

  // 车辆管理
  vehicleManagement() {
    wx.navigateTo({
      url: "/pages/vehicle-management/vehicle-management",
    });
  },

  // 缴费记录
  paymentRecords() {
    wx.navigateTo({
      url: "/pages/payment-records/payment-records",
    });
  },

  // 缴费说明
  paymentInstructions() {
    wx.showToast({
      title: "缴费说明",
      icon: "none",
    });
  },

  // ==================== 车牌输入相关方法 ====================

  // 初始化车牌输入
  initPlateInput() {
    this.setData({
      plateNumber: ["", "", "", "", "", "", "", ""],
      currentInputIndex: 0,
      keyboardType: "province",
      isNewEnergy: false,
      showKeyboard: false,
    });
  },

  // 点击车牌输入框
  onPlateInputClick(e) {
    const index = e.currentTarget.dataset.index;
    console.log("点击输入框，索引:", index);
    console.log("设置前 showKeyboard:", this.data.showKeyboard);

    this.setData({
      currentInputIndex: index,
      showKeyboard: true,
    });

    console.log("设置后 showKeyboard:", this.data.showKeyboard);
    this.updateKeyboardType(index);
  },

  // 更新键盘类型
  updateKeyboardType(index) {
    console.log("更新键盘类型，索引:", index);
    let keyboardType = "province";

    if (index === 0) {
      keyboardType = "province"; // 第一位是省份
    } else if (index == 1) {
      console.log("第二位是字母");
      keyboardType = "letter"; // 第二位是字母
    } else if (index >= 2 && index <= 5) {
      keyboardType = "number"; // 第3-6位是数字
    } else if (index == 6) {
      keyboardType = "letter"; // 第7位是字母
    } else if (index == 7) {
      keyboardType = "letter"; // 第8位是字母（新能源）
    }

    console.log("更新后的键盘类型:", keyboardType);

    this.setData({
      keyboardType: keyboardType,
    });
  },

  // 点击键盘字符
  onKeyboardClick(e) {
    const char = e.currentTarget.dataset.char;

    if (char === "delete") {
      // 删除字符
      this.deleteChar();
    } else if (char === "新能源") {
      // 切换新能源车牌
      this.toggleNewEnergy();
    } else {
      // 输入字符
      this.inputChar(char);
    }
  },

  // 输入字符
  inputChar(char) {
    const { currentInputIndex, plateNumber } = this.data;
    const newPlateNumber = [...plateNumber];

    newPlateNumber[currentInputIndex] = char;

    // 自动跳到下一个输入框
    let nextIndex = currentInputIndex + 1;

    // 如果是新能源车牌，最多8位；普通车牌最多7位
    const maxLength = this.data.isNewEnergy ? 8 : 7;
    if (nextIndex >= maxLength) {
      nextIndex = maxLength - 1;
    }

    this.setData({
      plateNumber: newPlateNumber,
      currentInputIndex: nextIndex,
    });

    // 更新键盘类型
    this.updateKeyboardType(nextIndex);
  },

  // 删除字符
  deleteChar() {
    const { currentInputIndex, plateNumber } = this.data;
    const newPlateNumber = [...plateNumber];

    if (currentInputIndex > 0) {
      // 删除当前字符并前移
      newPlateNumber[currentInputIndex] = "";
      const prevIndex = currentInputIndex - 1;

      this.setData({
        plateNumber: newPlateNumber,
        currentInputIndex: prevIndex,
      });

      // 更新键盘类型
      this.updateKeyboardType(prevIndex);
    } else {
      // 删除第一个字符
      newPlateNumber[0] = "";
      this.setData({
        plateNumber: newPlateNumber,
        currentInputIndex: 0,
        keyboardType: "province",
      });
    }
  },

  // 切换新能源车牌
  toggleNewEnergy() {
    const isNewEnergy = !this.data.isNewEnergy;
    const plateNumber = [...this.data.plateNumber];

    // 如果是切换为新能源，清空第8位；如果切换为普通，清空第8位
    plateNumber[7] = "";

    this.setData({
      isNewEnergy: isNewEnergy,
      plateNumber: plateNumber,
      currentInputIndex: isNewEnergy ? 7 : 6,
    });

    this.updateKeyboardType(this.data.currentInputIndex);
  },

  // 获取完整的车牌号
  getFullPlateNumber() {
    const { plateNumber, isNewEnergy } = this.data;
    const maxLength = isNewEnergy ? 8 : 7;
    return plateNumber.slice(0, maxLength).join("");
  },

  // 验证车牌号格式
  validatePlateNumber() {
    const plateNumber = this.getFullPlateNumber();

    if (plateNumber.length < 7) {
      wx.showToast({
        title: "请输入完整车牌号",
        icon: "none",
      });
      return false;
    }

    // 简单的车牌号格式验证
    const provinceRegex =
      /^[京津沪渝冀晋辽吉黑苏浙皖闽赣鲁豫鄂湘粤琼川贵云陕甘青蒙宁新藏使领警学港澳]/;
    if (!provinceRegex.test(plateNumber)) {
      wx.showToast({
        title: "车牌号格式不正确",
        icon: "none",
      });
      return false;
    }

    return true;
  },

  // 去缴费（从输入车牌页面）
  goToPaymentFromInput() {
    if (!this.validatePlateNumber()) {
      return;
    }

    const plateNumber = this.getFullPlateNumber();

    // 切换到缴费页面
    this.setData({
      "vehicle.plateNumber": plateNumber,
      pageMode: "payment",
    });

    // 启动停车时长计时器
    this.startParkingTimer();
    // 启动支付倒计时
    this.startPaymentCountdown();
  },

  // 隐藏键盘
  hideKeyboard(e) {
    console.log("隐藏键盘被调用");
    console.log("e", e);

    if (
      e &&
      e.target &&
      e.target.dataset &&
      e.target.dataset.index !== undefined
    ) {
      console.log("e.target.dataset.index", e.target.dataset.index);
      // 如果点击的是输入框，不隐藏键盘
      console.log("点击的是输入框，不隐藏键盘");
      return;
    }
    // 检查是否点击了键盘区域
    if (
      e &&
      e.target &&
      e.target.className &&
      (e.target.className.includes("keyboard-key") ||
        e.target.className.includes("keyboard-row") ||
        e.target.className.includes("virtual-keyboard"))
    ) {
      console.log("点击的是键盘区域，不隐藏键盘");
      return;
    }
    this.setData({
      showKeyboard: false,
    });
  },

  // 阻止事件冒泡
  stopPropagation() {
    // 这个方法用于阻止事件冒泡，不需要执行任何操作
  },
});
