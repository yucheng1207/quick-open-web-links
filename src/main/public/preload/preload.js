// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// Refrence: https://www.electronjs.org/zh/docs/latest/api/context-bridge
const { contextBridge, ipcRenderer } = require("electron")
contextBridge.exposeInMainWorld("electron", {
	send: (channel, data) => {
		return ipcRenderer.send(channel, data)
	},
	sendSync: (channel, data) => {
		return ipcRenderer.sendSync(channel, data)
	},
	sendAsync: (channel, data) => {
		return ipcRenderer.invoke(channel, data)
	},
	handle: (channel, callback) => {
		ipcRenderer.on(channel, callback)
	},
})

/**
 * 暴露 Node Global Symbols
 * Refrence: https://www.electronjs.org/zh/docs/latest/api/context-bridge
 */
// const crypto = require("crypto")
// contextBridge.exposeInMainWorld("nodeCrypto", {
// 	sha256sum(data) {
// 		const hash = crypto.createHash("sha256")
// 		hash.update(data)
// 		return hash.digest("hex")
// 	},
// })

// window.addEventListener('DOMContentLoaded', () => {
// 	console.log('预加载脚本');
// });
