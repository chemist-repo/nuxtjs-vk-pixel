export interface IBasePayload {
  id: string
}

export interface IPushPayload extends IBasePayload {
  type: 'reachGoal' | 'pageView' | 'onready'
  goal?: string
  start?: number
  url?: string
  category?: string
  action?: string
  label?: string
  params?: Record<string, unknown>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback?: (...args: any[]) => void
}

export interface IPageViewPayload extends IBasePayload {
  url: string
  referrer: string
}

export interface IVkPixelTmr {
  pageView: (payload: IPageViewPayload) => void
  push: (payload: IPushPayload) => void
}

export interface IVkPixel {
  tmr?: IVkPixelTmr
}
