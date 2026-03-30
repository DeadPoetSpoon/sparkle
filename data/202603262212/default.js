export default [
  // list of graph elements to start with
  {
    data: {
      id: "a",
      name: "费奥多尔·巴甫洛维奇·卡拉马佐夫",
    },
  },
  {
    data: {
      id: "b1",
      name: "德米特里·费奥多罗维奇·卡拉马佐夫",
      nickname: ["米特里", "米嘉", "米剑卡"],
    },
  },
  {
    data: {
      id: "b2",
      name: "伊万·费奥多罗维奇·卡拉马佐夫",
      nickname: ["伊万"],
    },
  },
  {
    data: {
      id: "b3",
      name: "阿列克塞·费奥多罗维奇·卡拉马佐夫",
      nickname: ["阿辽沙", "阿辽什卡"],
    },
  },
  {
    data: {
      source: "b1",
      target: "a",
      name: "长子",
    },
  },
  {
    data: {
      source: "b2",
      target: "a",
      name: "次子",
    },
  },
  {
    data: {
      source: "b3",
      target: "a",
      name: "幼子",
    },
  },
];
