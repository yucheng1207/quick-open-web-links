import React, { useEffect } from 'react';
import styles from './index.module.scss';
import LinkList from '../../components/LinkList';
import IPCRendererManager from '../../ipc/IPCRendererManager';

interface Props { }

const App: React.FunctionComponent<Props> = (props) => {
	useEffect(() => {
		IPCRendererManager.getInstance().sendRendererReady()
	}, [])
	return (
		<div className={styles.home}>
			<LinkList />
		</div>
	);
};

export default App;
