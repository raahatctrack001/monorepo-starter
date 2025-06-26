export type SignalingMessage = {
  type: string;
  payload: any;
};

export const createSignalingMessage = (type: string, payload: any) => ({
  type,
  payload
});
