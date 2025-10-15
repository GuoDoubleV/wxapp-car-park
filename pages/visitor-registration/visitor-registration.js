// pages/visitor-registration/visitor-registration.js
Page({
  data: {
    // 车牌号输入框数据
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

    // 来访日期
    visitDate: "2025-05-09",

    // 停车信息
    parkingInfo: {
      plateNumber: "京F・58A583",
      parkingDuration: "1小时33分钟",
      visitDate: "2025-05-09",
    },
  },

  onLoad() {
    // 初始化车牌输入
    this.initPlateInput();
    // 设置默认日期为今天
    this.setDefaultDate();
  },

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

  // 设置默认日期
  setDefaultDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    this.setData({
      visitDate: dateString,
      "parkingInfo.visitDate": dateString,
    });
  },

  // 点击车牌输入框
  onPlateInputClick(e) {
    const index = e.currentTarget.dataset.index;

    this.setData({
      currentInputIndex: index,
      showKeyboard: true,
    });

    this.updateKeyboardType(index);
  },

  // 隐藏键盘
  hideKeyboard(e) {
    if (
      e &&
      e.target &&
      e.target.dataset &&
      e.target.dataset.index !== undefined
    ) {
      // 如果点击的是输入框，不隐藏键盘
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
      // 点击的是键盘区域，不隐藏键盘
      return;
    }
    this.setData({
      showKeyboard: false,
    });
  },

  // 测试显示键盘
  testShowKeyboard() {
    this.setData({
      showKeyboard: true,
      currentInputIndex: 0,
      keyboardType: "province",
    });
  },

  // 更新键盘类型
  updateKeyboardType(index) {
    let keyboardType = "province";

    if (index === 0) {
      keyboardType = "province"; // 第一位是省份
    } else if (index == 1) {
      keyboardType = "letter"; // 第二位是字母
    } else if (index >= 2 && index <= 5) {
      keyboardType = "number"; // 第3-6位是数字
    } else if (index == 6) {
      keyboardType = "letter"; // 第7位是字母
    } else if (index == 7) {
      keyboardType = "letter"; // 第8位是字母（新能源）
    }

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

  // 日期选择
  onDateChange(e) {
    const date = e.detail.value;
    this.setData({
      visitDate: date,
      "parkingInfo.visitDate": date,
    });
  },

  // 确认登记
  confirmRegistration() {
    if (!this.validatePlateNumber()) {
      return;
    }

    const plateNumber = this.getFullPlateNumber();
    const visitDate = this.data.visitDate;

    // 显示确认信息
    wx.showModal({
      title: "确认登记",
      content: `车牌号: ${plateNumber}\n来访日期: ${visitDate}\n确认登记该访客？`,
      success: (res) => {
        if (res.confirm) {
          this.processRegistration(plateNumber, visitDate);
        }
      },
    });
  },

  // 处理登记
  processRegistration(plateNumber, visitDate) {
    wx.showLoading({
      title: "登记中...",
    });

    // 模拟登记过程
    setTimeout(() => {
      wx.hideLoading();

      // 更新停车信息
      this.setData({
        "parkingInfo.plateNumber": plateNumber,
        "parkingInfo.visitDate": visitDate,
        "parkingInfo.parkingDuration": "0分钟", // 重新开始计时
      });

      wx.showToast({
        title: "登记成功",
        icon: "success",
      });

      // 清空输入框
      this.initPlateInput();
    }, 2000);
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
      itemList: ["清空输入", "历史记录", "帮助"],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            this.clearInput();
            break;
          case 1:
            this.showHistory();
            break;
          case 2:
            this.showHelp();
            break;
        }
      },
    });
  },

  // 清空输入
  clearInput() {
    wx.showModal({
      title: "确认清空",
      content: "确定要清空所有输入内容吗？",
      success: (res) => {
        if (res.confirm) {
          this.initPlateInput();
          wx.showToast({
            title: "已清空",
            icon: "success",
          });
        }
      },
    });
  },

  // 显示历史记录
  showHistory() {
    wx.showToast({
      title: "历史记录功能开发中",
      icon: "none",
    });
  },

  // 显示帮助
  showHelp() {
    wx.showModal({
      title: "使用帮助",
      content:
        "1. 输入完整的车牌号码\n2. 选择来访日期\n3. 点击确认登记\n4. 支持新能源车牌（8位）",
      showCancel: false,
      confirmText: "知道了",
    });
  },
});
