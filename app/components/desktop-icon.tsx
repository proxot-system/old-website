export default function Icon({
	filename,
	icon_name,
	redirect,
}: {
	filename: string;
	icon_name: string;
	redirect: string;
}) {
	return (
		<div
			onClick={() => (window.location.href = redirect)}
			className="hover:cursor-pointer flex flex-col justify-center font-main w-[30px] scale-125 sm:scale-150 mb-10 mr-5 sm:mr-10"
		>
			<p className="text-center text-[10px] mb-5 mx-auto">
				<img
					src={`/desktop-icons/${filename}.png`}
					alt={icon_name}
					width={30}
					height={30}
					className="mx-auto"
				/>
				{icon_name}
			</p>
		</div>
	);
}
