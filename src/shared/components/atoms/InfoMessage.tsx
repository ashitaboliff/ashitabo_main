import IconFactory from '@/svg/IconFactory'
import { ReactNode } from 'react'

type Message = {
	messageType: 'info' | 'success' | 'error' | 'warning'
	message: string | ReactNode
	IconColor: string
}

/**
 * メッセージを表示するためのコンポーネント
 * @param messageType メッセージの種類
 * @param message メッセージの内容
 * @param IconColor アイコンの色
 */
const InfoMessage = ({ messageType, message, IconColor }: Message) => {
	let className = ''
	switch (
		messageType // 冗長だけどこうしなきゃ色が反映されない
	) {
		case 'info':
			className = 'alert alert-info w-auto'
			break
		case 'success':
			className = 'alert alert-success w-auto'
			break
		case 'error':
			className = 'alert alert-error w-auto'
			break
		case 'warning':
			className = 'alert alert-warning w-auto'
			break
		default:
			className = ''
			break
	}
	return (
		<div className={`${className} flex flex-row`}>
			{IconFactory.getIcon({ color: IconColor, type: messageType })}
			<span className="text-sm text-text-light">{message}</span>
		</div>
	)
}

export default InfoMessage
