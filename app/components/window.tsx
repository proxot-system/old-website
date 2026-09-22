import { useRef, useState, useEffect, useCallback } from "react";
import Draggable from "react-draggable";
import { useRouter } from "next/navigation";

interface WindowProps {
	title: string;
	children: React.ReactNode;
	className?: string;
}

export default function Window({ title, children, className = "" }: WindowProps) {
	const nodeRef = useRef<HTMLDivElement>(null);
	const posRef = useRef({ x: 0, y: 0 });
	const [bounds, setBounds] = useState<{ left: number; top: number; right: number; bottom: number } | undefined>();
	const router = useRouter();

	const updateBounds = useCallback(() => {
		if (!nodeRef.current) return;
		const rect = nodeRef.current.getBoundingClientRect();
		const origLeft = rect.left - posRef.current.x;
		const origTop = rect.top - posRef.current.y;
		const taskbarHeight = 48;
		const margin = 20;

		setBounds({
			left: margin - rect.width - origLeft,
			right: window.innerWidth - margin - origLeft,
			top: margin - rect.height - origTop,
			bottom: window.innerHeight - taskbarHeight - margin - origTop,
		});
	}, []);

	useEffect(() => {
		updateBounds();
		window.addEventListener("resize", updateBounds);
		return () => window.removeEventListener("resize", updateBounds);
	}, [updateBounds]);

	return (
		<Draggable
			nodeRef={nodeRef}
			handle=".title-bar, .window-drag-bottom"
			bounds={bounds}
			onStart={updateBounds}
			onDrag={(_e, data) => {
				posRef.current = { x: data.x, y: data.y };
			}}
		>
			<div
				ref={nodeRef}
				className={`window absolute top-2 left-2 right-2 sm:right-auto sm:top-5 sm:left-32 z-10 w-auto max-w-[calc(100vw-16px)] sm:max-w-[calc(100vw-160px)] max-h-[calc(100dvh-60px)] flex flex-col box-border select-none ${className}`}
			>
				<div className="title-bar flex-shrink-0 cursor-move">
					<div className="title-bar-text text-base select-none">{title}</div>
					<div className="title-bar-controls">
						<button
							onClick={() => router.push("/")}
							aria-label="Close"
						>
							X
						</button>
					</div>
				</div>
				<div
					className="window-body flex-1 overflow-y-auto overflow-x-hidden min-h-0 min-w-0 box-border p-2"
				>
					{children}
				</div>
				<div className="window-drag-bottom h-2 w-full flex-shrink-0 cursor-move" />
			</div>
		</Draggable>
	);
}
