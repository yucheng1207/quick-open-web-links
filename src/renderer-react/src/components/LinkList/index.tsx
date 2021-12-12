import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { Radio, Space, Button, Modal, Form, Input, Popconfirm } from 'antd';
import { SelectOutlined } from '@ant-design/icons'
import { RadioChangeEvent, Typography } from 'antd/lib'
import { Rule } from 'antd/lib/form';
import styles from './index.module.scss'
import IPCRendererManager, { IWebLink } from '../../ipc/IPCRendererManager';

interface Props {

}

const LinkList: React.FunctionComponent<Props> = (props) => {
	const [data, setData] = useState<IWebLink[]>([]);
	const [selected, setSelected] = useState<string>()

	useEffect(() => {
		updateInfo()
	}, [])

	/**
	 * 从数据库获取最新数据
	 */
	const updateInfo = useCallback(() => {
		const webLinks = IPCRendererManager.getInstance().getWebLinks()
		const currentLink = IPCRendererManager.getInstance().getCurrentLink()
		console.log('webLinks', webLinks)
		console.log('currentLink', currentLink)
		setData(webLinks)
		currentLink && setSelected(currentLink.id)
	}, [])

	const onChange = useCallback(async (e: RadioChangeEvent) => {
		const current = data.find(item => item.id === e.target.value)
		if (current) {
			const success = IPCRendererManager.getInstance().setCurrentLink(current)
			if (success) {
				setSelected(e.target.value)
			} else {
				console.warn('select failed')
			}
		}
	}, [data])

	const onLinkIconClick = useCallback((e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, url: string) => {
		e.preventDefault()
		IPCRendererManager.getInstance().openUrl(url)
	}, [])

	const [form] = Form.useForm<IWebLink>()
	const [initialValues, setInitialValues] = useState<IWebLink>()
	useEffect(() => {
		form.resetFields()
	}, [initialValues])
	const rules = useMemo<{ [key: string]: Rule[] }>(() =>
	({
		name: [{ required: true, message: '请输入名称!' }],
		url: [{ required: true, message: '请输入链接!' }]
	}), [])

	const onFinish = useCallback(async (values: { name: string, url: string }) => {
		if (initialValues) {
			const data = { ...initialValues, ...values }
			IPCRendererManager.getInstance().saveWebLink(data)
			IPCRendererManager.getInstance().setCurrentLink(data)
			updateInfo()
			setConfirmLoading(false)
			setVisible(false)
		}
	}, [updateInfo, initialValues])

	const onFinishFailed = useCallback((errorInfo: any) => {
		setConfirmLoading(false);
	}, []);

	const [visible, setVisible] = React.useState(false);
	const [confirmLoading, setConfirmLoading] = React.useState(false);
	const [modalTitle, setModalTitle] = React.useState('新增');
	const handleOk = useCallback(() => {
		setConfirmLoading(true);
		form.submit()
	}, [form]);

	const handleCancel = useCallback(() => {
		setVisible(false);
	}, []);

	const onAddClick = useCallback((e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
		e.preventDefault()
		setInitialValues({
			id: new Date().getTime().toString(),
			name: '',
			url: '',
			enable: true
		})
		setModalTitle('新增')
		setVisible(true)
	}, [])

	const onEditClick = useCallback((e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, item: IWebLink) => {
		e.preventDefault()
		setInitialValues(item)
		setModalTitle('编辑')
		setVisible(true)
	}, [])

	const onDeleteClick = useCallback((item: IWebLink) => {
		IPCRendererManager.getInstance().deleteWebLink(item)
		updateInfo()
	}, [updateInfo])

	return <div className={styles.container}>
		<div className={styles.buttonContainer}>
			<Button onClick={onAddClick}>添加</Button>
		</div>
		<Radio.Group onChange={onChange} value={selected}>
			<Space direction="vertical">
				{
					data.map(item => {
						return <Radio value={item.id} key={item.id}>
							<Space>
								<Typography.Text>{item.name}</Typography.Text>
								<Typography.Link onClick={(e) => onLinkIconClick(e, item.url)}>
									<SelectOutlined />
								</Typography.Link>
								<Typography.Link onClick={(e) => onEditClick(e, item)}>
									编辑
								</Typography.Link>
								<Popconfirm title="确定删除吗？" okText="确定" cancelText="取消" onConfirm={(e) => onDeleteClick(item)}>
									<Typography.Link>
										删除
									</Typography.Link>
								</Popconfirm>
							</Space>
						</Radio>
					})
				}
			</Space>
		</Radio.Group>
		<Modal
			title={modalTitle}
			visible={visible}
			forceRender={true}
			onOk={handleOk}
			confirmLoading={confirmLoading}
			onCancel={handleCancel}
		>
			<Form
				form={form}
				name="basic"
				layout="vertical"
				initialValues={initialValues}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				autoComplete="off"
			>
				<Form.Item
					label="名称"
					name="name"
					rules={rules.name}
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="链接"
					name="url"
					rules={rules.url}
				>
					<Input />
				</Form.Item>
			</Form>
		</Modal>
	</div>
}

export default LinkList;
