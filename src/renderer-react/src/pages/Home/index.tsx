import React, { useEffect } from 'react';
import styles from './index.module.scss';
import HelloWorld from '../../components/HelloWorld';
import IPCRendererManager from '../../ipc/IPCRendererManager';

interface Props { }

const App: React.FunctionComponent<Props> = (props) => {
	useEffect(() => {
		IPCRendererManager.getInstance().sendRendererReady()
	}, [])
	return (
		<div className={styles.home}>
			<HelloWorld />
		</div>
	);
};

export default App;
