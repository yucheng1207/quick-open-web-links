import { IPCRendererToMainChannelName, IPCMainToRenderChannelName } from "../../../main/ipc/IPCChannelName";
const { ipcRenderer } = window.require("electron");

export default class IPCRendererManager {
	private static _manager: IPCRendererManager;

	public init() {
		this.mainInfoNotificationInit()
		this.displayMaskNotificationInit();
	}

	public static getInstance() {
		if (!this._manager) {
			this._manager = new IPCRendererManager();
		}

		return this._manager;
	}

	/**
	 * DISPLAY_MASK_NOTIFICATION
	 */
	private displayMaskNotificationCallbacks: { [key: string]: Function } = {};
	private displayMaskNotificationInit() {
		ipcRenderer.on(IPCMainToRenderChannelName.DISPLAY_MASK_NOTIFICATION, async (event: Event, ...args) => {
			const show: string = args[0];
			for (const key of Object.keys(this.displayMaskNotificationCallbacks)) {
				const f = this.displayMaskNotificationCallbacks[key];

				f(show);
			}
		})
	}
	public registerDisplayMaskNotificationCallback(key: string, c: Function) {
		this.displayMaskNotificationCallbacks[key] = c;
	}
	public unregisterDisplayMaskNotificationCallback(key: string) {
		delete this.displayMaskNotificationCallbacks[key];
	}

	/**
	 * MAIN_INFO
	 */
	private mainInfoNotificationCallbacks: { [key: string]: Function } = {};
	private mainInfoNotificationInit() {
		ipcRenderer.on(IPCMainToRenderChannelName.MAIN_INFO, async (event: Event, ...args) => {
			const data: any = args[0];
			for (const key of Object.keys(this.mainInfoNotificationCallbacks)) {
				const f = this.mainInfoNotificationCallbacks[key];

				f(data);
			}
		})
	}
	public registerMainInfoNotificationCallback(key: string, c: Function) {
		this.mainInfoNotificationCallbacks[key] = c;
	}
	public unregisterMainInfoNotificationCallback(key: string) {
		delete this.mainInfoNotificationCallbacks[key];
	}

	/**
	 * 渲染进程onReady通知
	 */
	public sendRendererReady() {
		ipcRenderer.send(IPCRendererToMainChannelName.RENDERER_READY);
	}

	/**
	 * 打开浏览器url
	 * @param url 链接
	 */
	public openUrl(url: string) {
		ipcRenderer.send(IPCRendererToMainChannelName.OPEN_URL, url);
	}

	/**
	 * 打开主进程mainWindow的调试工具
	 */
	public openDevTool() {
		ipcRenderer.send(IPCRendererToMainChannelName.OPEN_DEV_TOOL);
	}
}