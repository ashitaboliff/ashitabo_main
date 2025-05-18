import React, { ReactNode, useState } from 'react'

interface TabProps {
	label: ReactNode
	children: ReactNode
}

interface TabsProps {
	children: ReactNode
}

export const Tabs = ({ children }: TabsProps) => {
	const [activeIndex, setActiveIndex] = useState(0)

	const handleTabClick = (index: number) => {
		setActiveIndex(index)
	}

	return (
		<div className="mt-2">
			<div className="flex justify-center space-x-4 border-b border-neutral-200">
				{Array.isArray(children) &&
					children.map((child, index) => {
						if (!React.isValidElement<TabProps>(child)) return null
						const isActive = index === activeIndex
						return (
							<button
								key={index}
								className={`py-2 px-4 text-lg ${
									isActive
										? 'border-b-2 text-accent'
										: 'text-base-content hover:text-accent'
								}`}
								onClick={() => handleTabClick(index)}
							>
								{child.props.label}
							</button>
						)
					})}
			</div>
			<div className="p-4">
				{Array.isArray(children) && children[activeIndex]}
			</div>
		</div>
	)
}

export const Tab = ({ children }: TabProps) => {
	return <>{children}</>
}
