export const STAGE = {
  START: 0,
  SHOW_OFFER: 11,
  WAIT_ANSWER: 21,
  HOST_CONNECTED: 31,

  WAIT_OFFER: 12,
  SHOW_ANSWER: 22,
  GUEST_CONNECTED: 32,
} as const;

export type Stage = typeof STAGE[keyof typeof STAGE];

export const isHostStage = (stage: Stage, currentStage: number): boolean => {
  return stage >= currentStage && stage % 10 === 1;
};

export const isGuestStage = (stage: Stage, currentStage: number): boolean => {
  return stage >= currentStage && stage % 10 === 2;
};
