import { useRef } from "react";
import Draggable from "react-draggable";

interface WindowProps {
	title: string;
	children: React.ReactNode;
	className: string;
}

export default function Window({ title, children, className }: WindowProps) {
	const nodeRef = useRef(null);

	return (
		<Draggable nodeRef={nodeRef} handle=".title-bar" bounds=".desktop">
			<div 
				ref={nodeRef} 
				className="window absolute top-2 left-1 z-10 sm:top-5 sm:left-1/4 sm:-translate-x-1/2"
			>
				<div className="title-bar">
					<div className="title-bar-text">{title}</div>
					<div className="title-bar-controls">
						<button
							onClick={() => (window.location.href = "/")}
							aria-label="Close"
						>
							X
						</button>
					</div>
				</div>
				<div
					className={`window-body max-h-[500px] sm:max-h-[700px] overflow-auto ${className}`}
				>
					{children}
				</div>
			</div>
		</Draggable>
	);
}