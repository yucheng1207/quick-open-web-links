import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Home from './pages/Home/index';
import 'src/styles/app.scss';
import IPCRendererManager from './ipc/IPCRendererManager';

IPCRendererManager.getInstance().init()
IPCRendererManager.getInstance().registerMainInfoNotificationCallback('boot-client-key', (info: any) => {
	if (info) {
		const { chromeVersion, electronVersion, nodeVersion, logPath } = info
		console.log('应用日志路径:', logPath)
		console.log('Electron版本:', electronVersion)
		console.log('Node版本:', nodeVersion)
		console.log('Chrome版本:', chromeVersion)

		IPCRendererManager.getInstance().unregisterDisplayMaskNotificationCallback('boot-client-key')
	}
})

const render = () => {
	ReactDOM.render(
		<AppContainer>
			<Home />
		</AppContainer>,
		document.getElementById('react-app')
	);
};

render();
