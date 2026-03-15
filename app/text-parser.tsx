import React from "react";

/*
    Wow! You might be wondering why im making my own markup language, and the answer is that i cba dealing with markup libraries so
    im making my own
*/

export function Header({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<br />
			<div className="text-lg">{children}</div>
		</div>
	);
}

export function Image({ children }: { children: React.ReactNode }) {
	const imageData = children?.toString().split("|");

	if (imageData == undefined) {
		return <>...</>;
	}

	const src = imageData[0];
	const alt = imageData[1];

	return (
		<div className="text-center">
			<br />
			<img className="mx-auto" src={src} alt={alt} />
			<p className="text-sm text-gray-500">{alt}</p>
			<br />
		</div>
	);
}

export function Command({ children }: { children: React.ReactNode }) {
	return (
		<div className="bg-black bg-clip-content py-1">
			<Text className="text-twm-sun p-2">{`> ${children}`}</Text>
		</div>
	);
}

export function Bullet({ children }: { children: React.ReactNode }) {
	// Convert children to string and split by '#'
	const bullets = children?.toString().split("#");

	// If bullets is undefined or empty, return a placeholder
	if (!bullets || bullets.length === 0) {
		return <>...</>;
	}

	// Remove leading empty strings caused by leading '#' characters
	const validBullets = bullets.filter((bullet) => bullet.trim() !== "");

	return (
		<ul className="list-disc pl-5">
			{validBullets.map((bullet, index) => (
				<li key={index} className="mb-2">
					{bullet.trim()}
				</li>
			))}
		</ul>
	);
}

export function StyledText({
	children,
	className,
}: {
	children: React.ReactNode;
	className: string;
}) {
	// Function to parse the text and return styled components
	const parseText = (text: string) => {
		// Regular expressions for bold and italic
		const boldRegex = /\*\*(.*?)\*\*/g; // Matches **text**
		const italicRegex = /\*(.*?)\*/g; // Matches *text*

		// Split the text by bold and italic markers
		const parts = text.split(boldRegex).flatMap((part, index) => {
			// For each part, check if it contains italic markers
			return part.split(italicRegex).map((subPart, subIndex) => {
				// Check if the part is bold
				if (index % 2 === 1) {
					return (
						<span key={`bold-${index}-${subIndex}`} className="font-bold">
							{subPart}
						</span>
					);
				}
				// Check if the part is italic
				if (subIndex % 2 === 1) {
					return (
						<span key={`italic-${index}-${subIndex}`} className="italic">
							{subPart}
						</span>
					);
				}
				// Return the plain text
				return subPart;
			});
		});

		return parts;
	};

	return <Text className={className}>{parseText(String(children))}</Text>;
}

export function Text({
	children,
	className,
}: {
	children: React.ReactNode;
	className: string;
}) {
	return (
		<div className={className}>
			{children}
			<br />
		</div>
	);
}

export function ParseText({ children }: { children: React.ReactNode }) {
	const parts: React.ReactNode[] = [];
	const lines = children?.toString().split("\n") || [];

	function RemovePrefix(s: string) {
		return s.substring(1).trim(); // Remove the first character and trim whitespace
	}

	for (let index = 0; index < lines.length; index++) {
		const line = lines[index];

		if (line === undefined) {
			continue; // Skip undefined lines
		}

		if (line.startsWith(">")) {
			parts.push(<Header key={index}>{RemovePrefix(line)}</Header>); // Use h1 for headers
			continue; // Skip to the next iteration after processing a header
		}

		if (line.startsWith("!")) {
			parts.push(<Image key={index}>{RemovePrefix(line)}</Image>); // Use h1 for headers
			continue; // Skip to the next iteration after processing a header
		}

		if (line.startsWith("~")) {
			parts.push(<Command key={index}>{RemovePrefix(line)}</Command>); // Use h1 for headers
			continue; // Skip to the next iteration after processing a header
		}

		if (line.startsWith("#")) {
			parts.push(<Bullet key={index}>{line}</Bullet>); // Use h1 for headers
			continue; // Skip to the next iteration after processing a header
		}

		// If it's not a header, process it as regular text
		parts.push(
			<StyledText key={index} className="">
				{line}
			</StyledText>,
		);
	}

	return <div>{parts}</div>; // Return the parsed parts wrapped in a div
}
