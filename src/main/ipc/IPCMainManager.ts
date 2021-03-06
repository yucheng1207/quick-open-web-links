import { ipcMain, Event, BrowserWindow, shell } from "electron";
import { IPCRendererToMainChannelName, IPCMainToRenderChannelName } from "./IPCChannelName";
import * as path from 'path';
import { Globals } from '../config/globals';
import DialogManager from '../managers/DialogManager/index';
import WebLinksManager from '../managers/WebLinksManager/index';
import { Logger } from '../managers/LoggerManager/index';
import WindowManager from '../managers/WindowManager/index';

const logPath = path.join(Globals.LOG_PATH, Globals.LOG_NAME)

export default class IPCMainManager {

	private static _instance: IPCMainManager;

	private mainWindow: BrowserWindow = null;

	public static getInstance(): IPCMainManager {
		if (!this._instance) {
			this._instance = new IPCMainManager();
		}

		return this._instance;
	}

	public init(win?: BrowserWindow): void {
		// register all IPC Main Channel
		for (const channel of Object.keys(IPCRendererToMainChannelName)) {
			ipcMain.on(channel, this.handleChannelEvent.bind(this, channel));
		}

		this.mainWindow = win;
	}

	public sendMessageToRenderer(channel: IPCMainToRenderChannelName, args: any): void {
		console.log('SendMessageToRenderer:', channel, args)
		this.mainWindow && this.mainWindow.webContents.send(channel, args);
	}

	private async handleChannelEvent(channel: IPCRendererToMainChannelName, event: Event, ...args: any[]) {
		console.log('HandleChannelEventFromRenderer:', channel, args)
		switch (channel) {
			// hotUpdateDialogWindow专用的ipc
			case (IPCRendererToMainChannelName.HOT_UPDATE_DIALOG_CALLBACK):
				this.handleHotUpdateDialogCallback(event, args);
				break;
			// alertDialogWindow专用的ipc
			case (IPCRendererToMainChannelName.MAIN_ALERT_DIALOG_CALLBACK):
				this.handleAlertDialogCallback(event, args);
				break;
			// 渲染进程ipc
			case (IPCRendererToMainChannelName.RENDERER_READY):
				this.sendMessageToRenderer(IPCMainToRenderChannelName.MAIN_INFO, { logPath, chromeVersion: process.versions["chrome"], electronVersion: process.versions["electron"], nodeVersion: process.versions["node"] })
				event.returnValue = true
				break;
			case (IPCRendererToMainChannelName.OPEN_DEV_TOOL):
				this.handleOpenDevTool();
				break;
			case (IPCRendererToMainChannelName.OPEN_URL):
				this.handleOpenUrl(event, args);
				break;
			case (IPCRendererToMainChannelName.GET_WEB_LINKS):
				await this.handleGetWebLinks(event, args);
				break;
			case (IPCRendererToMainChannelName.SAVE_WEB_LINK):
				await this.handleSaveWebLink(event, args);
				break;
			case (IPCRendererToMainChannelName.DELETE_WEB_LINK):
				await this.handleDeleteWebLink(event, args);
				break;
			case (IPCRendererToMainChannelName.GET_CURRENT_LINK):
				await this.handleGetCurrentLink(event, args);
				break;
			case (IPCRendererToMainChannelName.SET_CURRENT_LINK):
				await this.handleSetCurrentLink(event, args);
				break;
			case (IPCRendererToMainChannelName.LOAD_CURRENT_LINK):
				await this.handleLoadCurrentLink(event, args);
				break;
			default:
				break;
		}
	}

	private handleHotUpdateDialogCallback(event: any, args: any[]) {
		const opts = args[0]
		DialogManager.getInstance().hotUpdateDialogCallback(opts);
	}

	private handleAlertDialogCallback(event: any, args: any[]) {
		const type = args[0]
		const opts = args[1]
		DialogManager.getInstance().alertDialogCallback(type, opts);
	}

	private handleOpenDevTool() {
		this.mainWindow && this.mainWindow.webContents.openDevTools();
	}

	private handleOpenUrl(event: any, args: any[]) {
		const url = args[0] as string;
		shell.openExternal(url);
	}

	private async handleGetWebLinks(event: any, args: any[]) {
		let result = null
		try {
			result = await WebLinksManager.getInstance().getLinks();
		}
		catch (err) {
			console.error(err);
			Logger.info(err);
		}
		event.returnValue = result
	}

	private async handleSaveWebLink(event: any, args: any[]) {
		const data = args[0]
		let result = null
		try {
			result = await WebLinksManager.getInstance().saveLink(data);
		}
		catch (err) {
			console.error(err);
			Logger.info(err);
		}
		event.returnValue = result
	}

	private async handleDeleteWebLink(event: any, args: any[]) {
		const data = args[0]
		let result = null
		try {
			result = await WebLinksManager.getInstance().deleteWebLink(data);
		}
		catch (err) {
			console.error(err);
			Logger.info(err);
		}
		event.returnValue = result
	}


	private async handleGetCurrentLink(event: any, args: any[]) {
		let result = null
		try {
			result = await WebLinksManager.getInstance().getCurrentLink();
		}
		catch (err) {
			console.error(err);
			Logger.info(err);
		}
		event.returnValue = result
	}

	private async handleSetCurrentLink(event: any, args: any[]) {
		const data = args[0]
		let success = false
		try {
			await WebLinksManager.getInstance().setCurrentLink(data);
			success = true
		}
		catch (err) {
			console.error(err);
			Logger.info(err);
		}
		event.returnValue = success
	}

	private async handleLoadCurrentLink(event: any, args: any[]) {
		let success = false
		try {
			const currentLink = await WebLinksManager.getInstance().getCurrentLink();
			currentLink && WindowManager.getInstance().reloadMainWindow(currentLink.url)
			success = true
		}
		catch (err) {
			console.error(err);
			Logger.info(err);
		}
		event.returnValue = success
	}
}