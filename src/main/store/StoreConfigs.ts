import { DataStoreOptions } from "nedb";
import { autoupdateConfig } from '../updater/AutoUpdater';
import StoreNames from './StoreName';
import { Globals } from '../config/globals';

const StoreConfigs: { name: string, options?: DataStoreOptions }[] = [
	{
		name: StoreNames.HOT_UPDATE_RECORD_STORE,
		options: {
			filename: autoupdateConfig.hotUpdateDatastorePath,
		}
	},
	{
		name: StoreNames.WEB_LINKS_RECORD_STORE,
		options: {
			filename: Globals.WEB_LINKS_DATASTORE_PATH,
		}
	},
	{
		name: StoreNames.WEB_LINK_SELECTED_RECORD_STORE,
		options: {
			filename: Globals.WEB_LINK_SELECTED_DATASTORE_PATH,
		},
	},
];

export default StoreConfigs;