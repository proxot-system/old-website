import Image from "next/image";

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
		<div className="window grid place-content-center grid_cols-[120px_1fr] lg:flex lg:max-w-[800px] mx-auto h-max mb-5">
			<img
				src={`/command_examples/${image}.png`}
				alt={title}
				className="m-auto place-content-stretch w-[1000px] lg:w-[350px] lg:mx-5"
			/>

			<div className="mx-10 mb-10">
				<h1 className="text-3xl text-twm-logo-bg-light mt-10">{title}</h1>
				<p className="text-lg mt-5 text-black">{description}</p>
			</div>
		</div>
	);
}
