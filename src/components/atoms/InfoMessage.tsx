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
			className = 'alert alert-info w-80'
			break
		case 'success':
			className = 'alert alert-success w-80'
			break
		case 'error':
			className = 'alert alert-error w-80'
			break
		case 'warning':
			className = 'alert alert-warning w-80'
			break
		default:
			className = ''
			break
	}
	return (
		<div className={className}>
			{IconFactory.getIcon({ color: IconColor, type: messageType })}
			<span className="text-sm text-text-light">{message}</span>
		</div>
	)
}

export default InfoMessage
