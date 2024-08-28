import { reactive, computed } from 'vue';

const touchState = reactive({
  start: {
    clientX: 0,
    clientY: 0,
  },
  move: {
    clientX: 0,
    clientY: 0,
  },
  end: {
    clientX: 0,
    clientY: 0,
  },
});

const slideState = computed(() => ({
  x: touchState.move.clientX - touchState.start.clientX,
  y: touchState.move.clientY - touchState.start.clientY,
}));

const useTouch = () => {
  const touchstart = (event: any) => {
    const { clientX, clientY } = event.changedTouches[0];
    Object.assign(touchState.start, { clientX, clientY });
  };
  const touchmove = (event: any) => {
    const { clientX, clientY } = event.changedTouches[0];
    Object.assign(touchState.move, { clientX, clientY });
  };
  const touchend = (event: any) => {
    const { clientX, clientY } = event.changedTouches[0];
    Object.assign(touchState.end, { clientX, clientY });
  };
  return { touchState, slideState, touchstart, touchmove, touchend };
};

export default useTouch;
