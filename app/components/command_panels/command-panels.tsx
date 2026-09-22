export default function CommandPanel({
	title,
	description,
	image,
}: {
	title: string;
	description: string;
	image: string;
}) {
	return (
		<div className="window flex flex-col md:flex-row items-center gap-4 p-3 mb-4 w-full box-border">
			<img
				src={`/command_examples/${image}.png`}
				alt={title}
				className="w-full md:w-[280px] max-w-full h-auto object-contain border border-gray-400 flex-shrink-0"
			/>
			<div className="flex-1 min-w-0">
				<h2 className="text-xl font-bold text-twm-logo-bg-light mb-2">{title}</h2>
				<p className="text-base text-black leading-relaxed">{description}</p>
			</div>
		</div>
	);
}
