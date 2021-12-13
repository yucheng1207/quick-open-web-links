import NeDBManager from '../../store/NeDBManager';
import StoreNames from '../../store/StoreName';
import { Logger } from '../LoggerManager/index';

export interface IWebLink {
	id: string;
	name: string;
	url: string;
	enable: boolean;
}

const defaultWebLinks: IWebLink[] = [{
	id: 'google-translate',
	name: '谷歌翻译',
	url: 'https://translate.google.cn/',
	enable: true,
},
{
	id: 'baidu-translate',
	name: '百度翻译',
	url: 'https://fanyi.baidu.com/',
	enable: true,
}]

export class WebLinksManager {
	private static _manager: WebLinksManager;

	public static getInstance(): WebLinksManager {
		if (!this._manager) {
			this._manager = new WebLinksManager();
		}

		return this._manager;
	}

	public async init(): Promise<void> {
		const result = await this.getLinks()
		Logger.info('weblinks:', result)
		if (!result || !result.length) {
			Logger.info('没有找到有效的weblinks，插入默认的weblinks')
			for (const link of defaultWebLinks) {
				await this.saveLink(link)
			}
			this.setCurrentLink(defaultWebLinks[0])
		}
	}

	public async getLinks(): Promise<IWebLink[]> {
		return await NeDBManager.getInstance().find(StoreNames.WEB_LINKS_RECORD_STORE, { enable: true });
	}

	public async saveLink(data: IWebLink): Promise<void> {
		await this.save(StoreNames.WEB_LINKS_RECORD_STORE, { id: data.id }, data)
	}

	public async getCurrentLink(): Promise<IWebLink | null> {
		const result: IWebLink[] = await NeDBManager.getInstance().find(StoreNames.WEB_LINK_SELECTED_RECORD_STORE, { enable: true });
		return result && result[0] || null
	}

	public async setCurrentLink(data: IWebLink): Promise<void> {
		await this.save(StoreNames.WEB_LINK_SELECTED_RECORD_STORE, { enable: true }, data)
	}

	public async save(key: string, matchQuery: object, data: IWebLink): Promise<void> {
		delete (data as any)._id
		const find = await NeDBManager.getInstance().find(key, matchQuery);
		if (find && find.length) {
			// 已存在，执行更新操作
			await NeDBManager.getInstance().update(
				key,
				matchQuery,
				{
					$set: data
				},
				{
					multi: true
				}
			)
		} else {
			// 不存在，执行插入操作
			await NeDBManager.getInstance().insert(key, data)
		}
	}

	public async deleteWebLink(data: IWebLink): Promise<void> {
		const find = await NeDBManager.getInstance().find(StoreNames.WEB_LINKS_RECORD_STORE, { id: data.id });
		if (find && find.length) {
			await NeDBManager.getInstance().remove(StoreNames.WEB_LINKS_RECORD_STORE, { id: data.id }, { multi: true })
			const currentLink = await this.getCurrentLink()
			const weblinks = await this.getLinks()
			if (currentLink && data.id === currentLink.id) {
				this.setCurrentLink(weblinks[0])
			}
		}
	}
}

export default WebLinksManager