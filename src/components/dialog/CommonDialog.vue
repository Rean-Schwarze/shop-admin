<script setup>
import { computed, ref, useAttrs, useSlots } from "vue";
import { FullScreen, Close } from "@element-plus/icons-vue";
const attrs = useAttrs();
const slots = useSlots();
const props=defineProps({
  title:{
    type:String
  },
  isDraggable:{
    type:Boolean,
    default:false
  },
  modelValue:{
    type:Boolean,
    default:false
  },
  hiddenFullBtn:{
    type:Boolean,
    default:false
  },
  loading:{
    type:Boolean,
    default:false
  },
  confirmText:{
    type:String,
    default:"确认"
  },
  cancelText:{
    type:String,
    default:"关闭"
  },
})

const isFullscreen = ref(false);
// 是否显示全屏效果图标
const isFullScreenBtn = computed(() => {
  if (props.hiddenFullBtn) return false;
  return !attrs?.fullscreen;

});

const emits=defineEmits(["update:modelValue","confirm","close"])

// 开启、关闭全屏效果
const handleFullscreen = () => {
  if (attrs?.fullscreen) return;
  isFullscreen.value = !isFullscreen.value;
};
// 关闭弹窗时向外部发送close事件
const handleClose = () => {
  // 获取attrs.['before-close']属性，如果类型是函数函数，先执行它
  if (
      Reflect.has(attrs, "before-close") &&
      typeof attrs["before-close"] === "function"
  ) {
    attrs["before-close"]();
  }
  emits("close");
};
const handleConfirm = () => {
  emits("confirm");
};
</script>

<template>
  <div class="">
    <el-dialog
        v-bind="attrs"
        :model-value="props.modelValue"
        :show-close="false"
        :fullscreen="attrs?.fullscreen ?? isFullscreen"
        :before-close="handleClose"
    >
      <template #header>
        <div>
          <span class="dialog-title">{{ props.title }}</span>
        </div>
        <div class="btns">
          <el-icon v-if="isFullScreenBtn" @click="handleFullscreen"
          ><FullScreen
          /></el-icon>
          <el-icon @click="handleClose"><Close /></el-icon>
        </div>
      </template>


      <div class="content" v-loading="props.loading">
        <slot></slot>
      </div>

      <template #footer>
        <!-- 如果没有提供其他footer插槽，就使用默认的 -->
        <span v-if="!slots.footer" class="dialog-footer">
          <el-button @click="handleClose">{{ props.cancelText }}</el-button>
          <el-button type="primary" @click="handleConfirm">{{ props.confirmText }}</el-button>
        </span>
        <!-- 使用传入进来的插槽 -->
        <slot v-else name="footer"></slot>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
:deep(.el-dialog__header) {
  border-bottom: 1px solid #eee;
  display: flex;
  padding: 12px 16px;
  align-items: center;
  justify-content: space-between;
  margin: 0;
}
.dialog-title {
  padding-left: 10px;
  line-height: 28px;
  font-size: 18px;
  color: #303133;
}
.btns {
  display: flex;
  align-items: center;
  i {
    margin-right: 8px;

    font-size: 16px;
    cursor: pointer;
  }
  i:last-child {
    margin-right: 0;
  }
}
</style>
