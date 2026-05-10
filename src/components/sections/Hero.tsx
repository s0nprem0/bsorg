import { Heading } from "../ui/Heading";
import { Text } from "../ui/Text";

export default function Hero() {
	return (
		<div className="bg-linear-to-r from-primary-900 to-gray-900 text-white py-12 md:py-24">
			<div className="container mx-auto px-4">
				<Heading level={1}>Welcome to Cavite State University</Heading>
				<Text className="text-lg">
					Here's your guide to CvSU Main programs and recognized student organizations. Explore, connect, and get involved!
				</Text>
			</div>
		</div>
	);
}