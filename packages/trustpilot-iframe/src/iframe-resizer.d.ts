declare module 'iframe-resizer/js/iframeResizer' {
  interface IframeResizerOptions {
    log?: boolean;
    checkOrigin?: boolean;
    resizedCallback?: (data: { width: number; height: number }) => void;
    messageCallback?: (data: { message?: { type: string; message?: string } }) => void;
  }

  interface IframeResizerInstance {
    close: () => void;
  }

  function iframeResize(
    options: IframeResizerOptions,
    target: HTMLIFrameElement
  ): IframeResizerInstance[];

  export = iframeResize;
}
