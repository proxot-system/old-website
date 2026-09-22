import { Backgrounds } from "../../components/database-parse-type";
import { useEffect, useState } from "react";

export default function BackgroundSelection({
	ownedBackgrounds,
	equippedBackground,
	allBackgrounds,
	onChange,
}: {
	ownedBackgrounds: string[];
	equippedBackground: string;
	allBackgrounds: Backgrounds;
	onChange: (background: string) => void;
}) {
	const [selectedBackground, setSelectedBackground] =
		useState(equippedBackground);

	useEffect(() => {
		setSelectedBackground(equippedBackground);
	}, [equippedBackground]);

	const UpdateBackground = (e: string) => {
		const selectedBackgroundID = e;

		const selectedBackground = ownedBackgrounds.find(
			(background) => background === selectedBackgroundID,
		);

		if (selectedBackground) {
			setSelectedBackground(selectedBackground);
			onChange(selectedBackground);
		}
	};

	const currentBgImage = allBackgrounds?.[selectedBackground]?.image;

	return (
		<div className="flex flex-col items-center font-main w-full min-w-0 max-w-full box-border">
			{currentBgImage ? (
				<img
					src={currentBgImage}
					alt={selectedBackground}
					width={300}
					className="mt-1 border-2 border-gray-600 h-auto max-w-full"
				/>
			) : (
				<div className="mt-1 w-full max-w-[300px] h-[140px] bg-gray-700 flex items-center justify-center text-white text-sm">
					Loading background...
				</div>
			)}

			<p className="text-black text-base font-bold mt-3 mb-2">
				Selected: {selectedBackground}
			</p>
			<div className="flex overflow-x-auto w-full min-w-0 max-w-full p-2 bg-[#808080] shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a,inset_-2px_-2px_#dfdfdf,inset_2px_2px_#808080]">
				{ownedBackgrounds.map((background) => {
					const bgItem = allBackgrounds?.[background];
					if (!bgItem) return null;
					return (
						<img
							key={background}
							className={"hover:cursor-pointer mx-1.5 h-auto w-20 flex-shrink-0 border-2 border-transparent hover:border-black"}
							onClick={() => UpdateBackground(background)}
							src={bgItem.image}
							alt={background}
							width={80}
						/>
					);
				})}
			</div>
		</div>
	);
}
